import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FilterBar, FilterSelect, FilterTextInput } from '../../../components/filters/index.js'
import { DataTable, TableSkeleton } from '../../../components/table/index.js'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import EntityEmptyState from '../../../components/ui/EntityEmptyState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { applyFilters, collectFilterOptions } from '../../../lib/filters/applyFilters.js'
import { useConfirm } from '../../../lib/confirm/useConfirm.js'
import { useToast } from '../../../lib/toast/useToast.js'
import { deleteLead, getLeads } from '../../../services/leads.js'
import { extractCollection, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import { useLeadFilters } from '../hooks/useLeadFilters.js'
import '../../../components/crud/crud.css'

const PAGE_SIZE = 8

function LeadsListPage() {
  const queryClient = useQueryClient()
  const confirm = useConfirm()
  const toast = useToast()
  const {
    filters,
    currentPage,
    setCurrentPage,
    setFilter,
    setFilters,
    resetFilters,
  } = useLeadFilters()

  const leadsQuery = useQuery({
    queryKey: ['leads'],
    queryFn: () => getLeads(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Lead deleted successfully.')
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to delete lead right now. Please try again.')
    },
  })

  const rows = useMemo(() => extractCollection(leadsQuery.data), [leadsQuery.data])

  const filteredRows = useMemo(() => {
    return applyFilters(rows, {
      searchTerm: filters.q,
      searchSelectors: [
        (entry) => entry?.name,
        (entry) => entry?.email,
        (entry) => entry?.company,
        (entry) => entry?.phone,
      ],
      equalFilters: [
        {
          value: filters.status,
          selector: (entry) => entry?.status,
          emptyValue: 'all',
        },
        {
          value: filters.source,
          selector: (entry) => entry?.source,
          emptyValue: 'all',
        },
      ],
    })
  }, [rows, filters])

  const statusOptions = useMemo(() => {
    return collectFilterOptions(rows, (row) => row?.status)
  }, [rows])

  const sourceOptions = useMemo(() => {
    return collectFilterOptions(rows, (row) => row?.source)
  }, [rows])

  const hasActiveFilters =
    Boolean(filters.q) ||
    filters.status !== 'all' ||
    filters.source !== 'all'

  const handleDelete = async (leadId) => {
    if (!leadId || deleteMutation.isPending) {
      return
    }

    const isConfirmed = await confirm({
      title: 'Delete lead?',
      description: 'This action permanently removes the lead and cannot be undone.',
      confirmLabel: 'Delete lead',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!isConfirmed) {
      return
    }

    await deleteMutation.mutateAsync(leadId)
  }

  const columns = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => row?.name || 'â€”',
      sortAccessor: (row) => row?.name ?? '',
    },
    {
      id: 'email',
      header: 'Email',
      accessor: (row) => row?.email || 'â€”',
      sortAccessor: (row) => row?.email ?? '',
    },
    {
      id: 'company',
      header: 'Company',
      accessor: (row) => row?.company || 'â€”',
      sortAccessor: (row) => row?.company ?? '',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => row?.status || 'â€”',
      sortAccessor: (row) => row?.status ?? '',
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row) => row?.source || 'â€”',
      sortAccessor: (row) => row?.source ?? '',
    },
    {
      id: 'actions',
      header: 'Actions',
      sortable: false,
      cell: (row) => {
        const leadId = resolveEntityId(row)

        return (
          <div className="crud-table__actions">
            {leadId ? <Link to={`/leads/${leadId}`}>View</Link> : null}
            {leadId ? <Link to={`/leads/${leadId}/edit`}>Edit</Link> : null}
            <button
              type="button"
              onClick={() => handleDelete(leadId)}
              disabled={!leadId || deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        )
      },
    },
  ]

  if (leadsQuery.isPending) {
    return (
      <PageContainer>
        <WidgetContainer eyebrow="Leads" title="Lead pipeline" meta="Loading records">
          <TableSkeleton columns={6} rows={8} />
        </WidgetContainer>
      </PageContainer>
    )
  }

  if (leadsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Leads"
          title="Unable to load leads"
          error={leadsQuery.error}
          description="Please try again in a few seconds."
          onRetry={leadsQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer eyebrow="Leads" title="Lead pipeline" meta={`${filteredRows.length} records`}>
        <FilterBar
          canClear={hasActiveFilters}
          onClear={resetFilters}
          actions={(
            <Link className="state-action" to="/leads/new">
              Create lead
            </Link>
          )}
        >
          <FilterTextInput
            id="lead-search"
            label="Search"
            placeholder="Name, email, company..."
            value={filters.q}
            onChange={(value) => setFilter('q', value)}
          />

          <FilterSelect
            id="lead-status-filter"
            label="Status"
            allLabel="All statuses"
            value={filters.status}
            options={statusOptions}
            onChange={(value) => setFilter('status', value)}
          />

          <FilterSelect
            id="lead-source-filter"
            label="Source"
            allLabel="All sources"
            value={filters.source}
            options={sourceOptions}
            onChange={(value) => setFilter('source', value)}
          />
        </FilterBar>

        <DataTable
          columns={columns}
          rows={filteredRows}
          rowKey={(row) => {
            const leadId = resolveEntityId(row)
            return leadId || `${row?.email || 'lead'}-${row?.name || ''}`
          }}
          sortConfig={{
            columnId: filters.sortBy,
            direction: filters.sortDir,
          }}
          onSortChange={(columnId, direction) => setFilters({ sortBy: columnId, sortDir: direction })}
          pagination={{
            currentPage,
            pageSize: PAGE_SIZE,
            onPageChange: setCurrentPage,
          }}
          entityLabel="leads"
          emptyMessage="No leads found for current filters."
          emptyState={(
            <EntityEmptyState
              entityLabel="leads"
              hasFilters={hasActiveFilters}
              onClearFilters={resetFilters}
              createHref="/leads/new"
              createLabel="Create lead"
              eyebrow="Leads"
            />
          )}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default LeadsListPage
