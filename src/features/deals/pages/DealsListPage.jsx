import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  DateRangeFilter,
  FilterBar,
  FilterSelect,
  FilterTextInput,
} from '../../../components/filters/index.js'
import { DataTable, TableSkeleton } from '../../../components/table/index.js'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import EntityEmptyState from '../../../components/ui/EntityEmptyState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { applyFilters, collectFilterOptions } from '../../../lib/filters/applyFilters.js'
import { useConfirm } from '../../../lib/confirm/useConfirm.js'
import { useToast } from '../../../lib/toast/useToast.js'
import { deleteDeal, getDeals } from '../../../services/deals.js'
import { extractCollection, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import { useDealFilters } from '../hooks/useDealFilters.js'
import '../../../components/crud/crud.css'

const PAGE_SIZE = 8

function DealsListPage() {
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
  } = useDealFilters()

  const dealsQuery = useQuery({
    queryKey: ['deals'],
    queryFn: () => getDeals(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      toast.success('Deal deleted successfully.')
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to delete deal right now. Please try again.')
    },
  })

  const rows = useMemo(() => extractCollection(dealsQuery.data), [dealsQuery.data])

  const filteredRows = useMemo(() => {
    return applyFilters(rows, {
      searchTerm: filters.q,
      searchSelectors: [
        (entry) => entry?.title ?? entry?.name,
        (entry) => entry?.account?.name ?? entry?.account,
        (entry) => entry?.contact?.name ?? entry?.contact,
      ],
      equalFilters: [
        {
          value: filters.stage,
          selector: (entry) => entry?.stage ?? entry?.stageId ?? entry?.pipelineStage,
          emptyValue: 'all',
        },
        {
          value: filters.owner,
          selector: (entry) =>
            entry?.owner?.name ??
            entry?.assignedUser?.name ??
            entry?.user?.name ??
            entry?.ownerName,
          emptyValue: 'all',
        },
      ],
      dateRangeFilters: [
        {
          from: filters.closeFrom,
          to: filters.closeTo,
          selector: (entry) =>
            entry?.expectedCloseDate ??
            entry?.closeDate ??
            entry?.expected_close_date,
        },
      ],
    })
  }, [rows, filters])

  const stageOptions = useMemo(() => {
    return collectFilterOptions(rows, (row) => row?.stage ?? row?.stageId ?? row?.pipelineStage)
  }, [rows])

  const ownerOptions = useMemo(() => {
    return collectFilterOptions(
      rows,
      (row) =>
        row?.owner?.name ??
        row?.assignedUser?.name ??
        row?.user?.name ??
        row?.ownerName,
    )
  }, [rows])

  const hasActiveFilters =
    Boolean(filters.q) ||
    filters.stage !== 'all' ||
    filters.owner !== 'all' ||
    Boolean(filters.closeFrom) ||
    Boolean(filters.closeTo)

  const handleDelete = async (dealId) => {
    if (!dealId || deleteMutation.isPending) {
      return
    }

    const isConfirmed = await confirm({
      title: 'Delete deal?',
      description: 'This action permanently removes the deal and cannot be undone.',
      confirmLabel: 'Delete deal',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!isConfirmed) {
      return
    }

    await deleteMutation.mutateAsync(dealId)
  }

  const columns = [
    {
      id: 'title',
      header: 'Title',
      accessor: (row) => row?.title ?? row?.name ?? 'â€”',
      sortAccessor: (row) => row?.title ?? row?.name ?? '',
    },
    {
      id: 'value',
      header: 'Value',
      accessor: (row) => row?.value ?? row?.amount ?? 'â€”',
      sortAccessor: (row) => row?.value ?? row?.amount ?? 0,
      sortType: 'number',
    },
    {
      id: 'stage',
      header: 'Stage',
      accessor: (row) => row?.stage ?? row?.stageId ?? row?.pipelineStage ?? 'â€”',
      sortAccessor: (row) => row?.stage ?? row?.stageId ?? row?.pipelineStage ?? '',
    },
    {
      id: 'account',
      header: 'Account',
      accessor: (row) => row?.account?.name ?? row?.account ?? row?.accountId ?? 'â€”',
      sortAccessor: (row) => row?.account?.name ?? row?.account ?? row?.accountId ?? '',
    },
    {
      id: 'contact',
      header: 'Contact',
      accessor: (row) => row?.contact?.name ?? row?.contact ?? row?.contactId ?? 'â€”',
      sortAccessor: (row) => row?.contact?.name ?? row?.contact ?? row?.contactId ?? '',
    },
    {
      id: 'actions',
      header: 'Actions',
      sortable: false,
      cell: (row) => {
        const dealId = resolveEntityId(row)

        return (
          <div className="crud-table__actions">
            {dealId ? <Link to={`/deals/${dealId}`}>View</Link> : null}
            {dealId ? <Link to={`/deals/${dealId}/edit`}>Edit</Link> : null}
            <button
              type="button"
              onClick={() => handleDelete(dealId)}
              disabled={!dealId || deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        )
      },
    },
  ]

  if (dealsQuery.isPending) {
    return (
      <PageContainer>
        <WidgetContainer eyebrow="Deals" title="Pipeline deals" meta="Loading records">
          <TableSkeleton columns={6} rows={8} />
        </WidgetContainer>
      </PageContainer>
    )
  }

  if (dealsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Deals"
          title="Unable to load deals"
          error={dealsQuery.error}
          description="Please try again in a few seconds."
          onRetry={dealsQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer eyebrow="Deals" title="Pipeline deals" meta={`${filteredRows.length} records`}>
        <FilterBar
          canClear={hasActiveFilters}
          onClear={resetFilters}
          actions={(
            <>
              <Link className="state-action" to="/deals/pipeline">
                Pipeline board
              </Link>
              <Link className="state-action" to="/deals/new">
                Create deal
              </Link>
            </>
          )}
        >
          <FilterTextInput
            id="deal-search"
            label="Search"
            placeholder="Title, account, contact..."
            value={filters.q}
            onChange={(value) => setFilter('q', value)}
          />

          <FilterSelect
            id="deal-stage-filter"
            label="Stage"
            allLabel="All stages"
            value={filters.stage}
            options={stageOptions}
            onChange={(value) => setFilter('stage', value)}
          />

          <FilterSelect
            id="deal-owner-filter"
            label="Owner"
            allLabel="All owners"
            value={filters.owner}
            options={ownerOptions}
            onChange={(value) => setFilter('owner', value)}
          />

          <DateRangeFilter
            fromId="deal-close-from"
            toId="deal-close-to"
            label="Expected close date"
            fromValue={filters.closeFrom}
            toValue={filters.closeTo}
            onFromChange={(value) => setFilters({ closeFrom: value })}
            onToChange={(value) => setFilters({ closeTo: value })}
          />
        </FilterBar>

        <DataTable
          columns={columns}
          rows={filteredRows}
          rowKey={(row) => {
            const dealId = resolveEntityId(row)
            const accountName = row?.account?.name ?? row?.account ?? row?.accountId ?? ''
            return dealId || `${row?.title || row?.name || 'deal'}-${accountName}`
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
          entityLabel="deals"
          emptyMessage="No deals found for current filters."
          emptyState={(
            <EntityEmptyState
              entityLabel="deals"
              hasFilters={hasActiveFilters}
              onClearFilters={resetFilters}
              createHref="/deals/new"
              createLabel="Create deal"
              eyebrow="Deals"
            />
          )}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default DealsListPage
