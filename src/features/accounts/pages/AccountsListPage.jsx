import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import Pagination from '../../../components/ui/Pagination.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteAccount, getAccounts } from '../../../services/accounts.js'
import {
  extractCollection,
  getPageRows,
  getTotalPages,
  matchesAnySearch,
  resolveEntityId,
} from '../../../lib/crm/entityUtils.js'
import '../../../components/crud/crud.css'

const PAGE_SIZE = 8

function AccountsListPage() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })

  const rows = useMemo(() => extractCollection(accountsQuery.data), [accountsQuery.data])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesTerm = matchesAnySearch(row, search, [
        (entry) => entry?.name,
        (entry) => entry?.industry ?? entry?.segment,
        (entry) => entry?.website ?? entry?.url,
      ])
      const rowIndustry = String(row?.industry ?? row?.segment ?? '').toLowerCase()
      const matchesIndustry = industryFilter === 'all' || rowIndustry === industryFilter
      return matchesTerm && matchesIndustry
    })
  }, [rows, search, industryFilter])

  const industryOptions = useMemo(() => {
    const values = new Set()
    rows.forEach((row) => {
      const nextValue = row?.industry ?? row?.segment
      if (nextValue) {
        values.add(String(nextValue).toLowerCase())
      }
    })
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [rows])

  const totalPages = getTotalPages(filteredRows.length, PAGE_SIZE)
  const effectiveCurrentPage = Math.min(currentPage, totalPages)
  const pageRows = getPageRows(filteredRows, effectiveCurrentPage, PAGE_SIZE)
  const startRow = filteredRows.length ? (effectiveCurrentPage - 1) * PAGE_SIZE + 1 : 0
  const endRow = Math.min(effectiveCurrentPage * PAGE_SIZE, filteredRows.length)

  const handleDelete = async (accountId) => {
    if (!accountId || deleteMutation.isPending) {
      return
    }

    const shouldDelete = window.confirm('Delete this account? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteMutation.mutateAsync(accountId)
  }

  if (accountsQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState eyebrow="Accounts" title="Loading accounts" description="Fetching account records." />
      </PageContainer>
    )
  }

  if (accountsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Accounts"
          title="Unable to load accounts"
          description={accountsQuery.error?.message || 'Please try again in a few seconds.'}
          onRetry={accountsQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer eyebrow="Accounts" title="Account directory" meta={`${filteredRows.length} records`}>
        <div className="crud-toolbar">
          <div className="crud-toolbar__filters">
            <div className="crud-toolbar__field">
              <label htmlFor="account-search">Search</label>
              <input
                id="account-search"
                type="search"
                placeholder="Name, industry, website..."
                value={search}
                onChange={(event) => {
                  setCurrentPage(1)
                  setSearch(event.target.value)
                }}
              />
            </div>

            <div className="crud-toolbar__field">
              <label htmlFor="account-industry-filter">Industry</label>
              <select
                id="account-industry-filter"
                value={industryFilter}
                onChange={(event) => {
                  setCurrentPage(1)
                  setIndustryFilter(event.target.value)
                }}
              >
                <option value="all">All industries</option>
                {industryOptions.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="crud-toolbar__actions">
            <Link className="state-action" to="/accounts/new">
              Create account
            </Link>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Industry</th>
                <th>Size</th>
                <th>Website</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length ? (
                pageRows.map((row) => {
                  const accountId = resolveEntityId(row)
                  return (
                    <tr key={accountId || `${row?.name || 'account'}-${row?.website || ''}`}>
                      <td>{row?.name || '—'}</td>
                      <td>{row?.industry ?? row?.segment ?? '—'}</td>
                      <td>{row?.size ?? row?.employeeCount ?? row?.employees ?? '—'}</td>
                      <td>{row?.website ?? row?.url ?? '—'}</td>
                      <td>
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
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5}>No accounts found for current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            Showing {startRow}-{endRow} of {filteredRows.length} accounts
          </p>
          <Pagination
            currentPage={effectiveCurrentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </WidgetContainer>
    </PageContainer>
  )
}

export default AccountsListPage
