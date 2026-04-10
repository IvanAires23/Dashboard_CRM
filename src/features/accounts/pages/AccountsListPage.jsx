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
import { deleteAccount, getAccounts } from '../../../services/accounts.js'
import { extractCollection, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import { useAccountFilters } from '../hooks/useAccountFilters.js'
import '../../../components/crud/crud.css'

const PAGE_SIZE = 8

function AccountsListPage() {
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
  } = useAccountFilters()

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Account deleted successfully.')
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to delete account right now. Please try again.')
    },
  })

  const rows = useMemo(() => extractCollection(accountsQuery.data), [accountsQuery.data])

  const filteredRows = useMemo(() => {
    return applyFilters(rows, {
      searchTerm: filters.q,
      searchSelectors: [
        (entry) => entry?.name,
        (entry) => entry?.industry ?? entry?.segment,
        (entry) => entry?.website ?? entry?.url,
      ],
      equalFilters: [
        {
          value: filters.industry,
          selector: (entry) => entry?.industry ?? entry?.segment,
          emptyValue: 'all',
        },
      ],
    })
  }, [rows, filters])

  const industryOptions = useMemo(() => {
    return collectFilterOptions(rows, (row) => row?.industry ?? row?.segment)
  }, [rows])

  const hasActiveFilters = Boolean(filters.q) || filters.industry !== 'all'

  const handleDelete = async (accountId) => {
    if (!accountId || deleteMutation.isPending) {
      return
    }

    const isConfirmed = await confirm({
      title: 'Delete account?',
      description: 'This action permanently removes the account and cannot be undone.',
      confirmLabel: 'Delete account',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!isConfirmed) {
      return
    }

    await deleteMutation.mutateAsync(accountId)
  }

  const columns = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => row?.name || 'â€”',
      sortAccessor: (row) => row?.name ?? '',
    },
    {
      id: 'industry',
      header: 'Industry',
      accessor: (row) => row?.industry ?? row?.segment ?? 'â€”',
      sortAccessor: (row) => row?.industry ?? row?.segment ?? '',
    },
    {
      id: 'size',
      header: 'Size',
      accessor: (row) => row?.size ?? row?.employeeCount ?? row?.employees ?? 'â€”',
      sortAccessor: (row) => row?.size ?? row?.employeeCount ?? row?.employees ?? '',
    },
    {
      id: 'website',
      header: 'Website',
      accessor: (row) => row?.website ?? row?.url ?? 'â€”',
      sortAccessor: (row) => row?.website ?? row?.url ?? '',
    },
    {
      id: 'actions',
      header: 'Actions',
      sortable: false,
      cell: (row) => {
        const accountId = resolveEntityId(row)

        return (
          <div className="crud-table__actions">
            {accountId ? <Link to={`/accounts/${accountId}`}>View</Link> : null}
            {accountId ? <Link to={`/accounts/${accountId}/edit`}>Edit</Link> : null}
            <button
              type="button"
              onClick={() => handleDelete(accountId)}
              disabled={!accountId || deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        )
      },
    },
  ]

  if (accountsQuery.isPending) {
    return (
      <PageContainer>
        <WidgetContainer eyebrow="Accounts" title="Account directory" meta="Loading records">
          <TableSkeleton columns={5} rows={8} />
        </WidgetContainer>
      </PageContainer>
    )
  }

  if (accountsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Accounts"
          title="Unable to load accounts"
          error={accountsQuery.error}
          description="Please try again in a few seconds."
          onRetry={accountsQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer eyebrow="Accounts" title="Account directory" meta={`${filteredRows.length} records`}>
        <FilterBar
          canClear={hasActiveFilters}
          onClear={resetFilters}
          actions={(
            <Link className="state-action" to="/accounts/new">
              Create account
            </Link>
          )}
        >
          <FilterTextInput
            id="account-search"
            label="Search"
            placeholder="Name, industry, website..."
            value={filters.q}
            onChange={(value) => setFilter('q', value)}
          />

          <FilterSelect
            id="account-industry-filter"
            label="Industry"
            allLabel="All industries"
            value={filters.industry}
            options={industryOptions}
            onChange={(value) => setFilter('industry', value)}
          />
        </FilterBar>

        <DataTable
          columns={columns}
          rows={filteredRows}
          rowKey={(row) => {
            const accountId = resolveEntityId(row)
            return accountId || `${row?.name || 'account'}-${row?.website || ''}`
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
          entityLabel="accounts"
          emptyMessage="No accounts found for current filters."
          emptyState={(
            <EntityEmptyState
              entityLabel="accounts"
              hasFilters={hasActiveFilters}
              onClearFilters={resetFilters}
              createHref="/accounts/new"
              createLabel="Create account"
              eyebrow="Accounts"
            />
          )}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default AccountsListPage
