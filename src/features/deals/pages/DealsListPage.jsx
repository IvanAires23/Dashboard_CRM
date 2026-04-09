import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import Pagination from '../../../components/ui/Pagination.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteDeal, getDeals } from '../../../services/deals.js'
import {
  extractCollection,
  getPageRows,
  getTotalPages,
  matchesAnySearch,
  resolveEntityId,
} from '../../../lib/crm/entityUtils.js'
import '../../../components/crud/crud.css'

const PAGE_SIZE = 8

function DealsListPage() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')

  const dealsQuery = useQuery({
    queryKey: ['deals'],
    queryFn: () => getDeals(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })

  const rows = useMemo(() => extractCollection(dealsQuery.data), [dealsQuery.data])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesTerm = matchesAnySearch(row, search, [
        (entry) => entry?.title ?? entry?.name,
        (entry) => entry?.account?.name ?? entry?.account,
        (entry) => entry?.contact?.name ?? entry?.contact,
      ])
      const normalizedStage = String(
        row?.stage ?? row?.stageId ?? row?.pipelineStage ?? '',
      ).toLowerCase()
      const matchesStage = stageFilter === 'all' || normalizedStage === stageFilter
      return matchesTerm && matchesStage
    })
  }, [rows, search, stageFilter])

  const stageOptions = useMemo(() => {
    const values = new Set()
    rows.forEach((row) => {
      const nextValue = row?.stage ?? row?.stageId ?? row?.pipelineStage
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

  const handleDelete = async (dealId) => {
    if (!dealId || deleteMutation.isPending) {
      return
    }

    const shouldDelete = window.confirm('Delete this deal? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteMutation.mutateAsync(dealId)
  }

  if (dealsQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState eyebrow="Deals" title="Loading deals" description="Fetching deal records." />
      </PageContainer>
    )
  }

  if (dealsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Deals"
          title="Unable to load deals"
          description={dealsQuery.error?.message || 'Please try again in a few seconds.'}
          onRetry={dealsQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer eyebrow="Deals" title="Pipeline deals" meta={`${filteredRows.length} records`}>
        <div className="crud-toolbar">
          <div className="crud-toolbar__filters">
            <div className="crud-toolbar__field">
              <label htmlFor="deal-search">Search</label>
              <input
                id="deal-search"
                type="search"
                placeholder="Title, account, contact..."
                value={search}
                onChange={(event) => {
                  setCurrentPage(1)
                  setSearch(event.target.value)
                }}
              />
            </div>

            <div className="crud-toolbar__field">
              <label htmlFor="deal-stage-filter">Stage</label>
              <select
                id="deal-stage-filter"
                value={stageFilter}
                onChange={(event) => {
                  setCurrentPage(1)
                  setStageFilter(event.target.value)
                }}
              >
                <option value="all">All stages</option>
                {stageOptions.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="crud-toolbar__actions">
            <Link className="state-action" to="/deals/pipeline">
              Pipeline board
            </Link>
            <Link className="state-action" to="/deals/new">
              Create deal
            </Link>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Account</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length ? (
                pageRows.map((row) => {
                  const dealId = resolveEntityId(row)
                  const accountName = row?.account?.name ?? row?.account ?? row?.accountId ?? '—'
                  const contactName = row?.contact?.name ?? row?.contact ?? row?.contactId ?? '—'
                  return (
                    <tr key={dealId || `${row?.title || row?.name || 'deal'}-${accountName}`}>
                      <td>{row?.title ?? row?.name ?? '—'}</td>
                      <td>{row?.value ?? row?.amount ?? '—'}</td>
                      <td>{row?.stage ?? row?.stageId ?? row?.pipelineStage ?? '—'}</td>
                      <td>{accountName}</td>
                      <td>{contactName}</td>
                      <td>
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
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6}>No deals found for current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            Showing {startRow}-{endRow} of {filteredRows.length} deals
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

export default DealsListPage
