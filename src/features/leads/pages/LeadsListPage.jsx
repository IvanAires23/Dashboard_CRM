import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import Pagination from '../../../components/ui/Pagination.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteLead, getLeads } from '../../../services/leads.js'
import {
  extractCollection,
  getPageRows,
  getTotalPages,
  matchesAnySearch,
  resolveEntityId,
} from '../../../lib/crm/entityUtils.js'
import '../../../components/crud/crud.css'

const PAGE_SIZE = 8

function LeadsListPage() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')

  const leadsQuery = useQuery({
    queryKey: ['leads'],
    queryFn: () => getLeads(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })

  const rows = useMemo(() => extractCollection(leadsQuery.data), [leadsQuery.data])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesTerm = matchesAnySearch(row, search, [
        (entry) => entry?.name,
        (entry) => entry?.email,
        (entry) => entry?.company,
        (entry) => entry?.phone,
      ])
      const matchesStatus = statusFilter === 'all' || String(row?.status || '').toLowerCase() === statusFilter
      const matchesSource = sourceFilter === 'all' || String(row?.source || '').toLowerCase() === sourceFilter
      return matchesTerm && matchesStatus && matchesSource
    })
  }, [rows, search, statusFilter, sourceFilter])

  const statusOptions = useMemo(() => {
    const values = new Set()
    rows.forEach((row) => {
      if (row?.status) {
        values.add(String(row.status).toLowerCase())
      }
    })
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [rows])

  const sourceOptions = useMemo(() => {
    const values = new Set()
    rows.forEach((row) => {
      if (row?.source) {
        values.add(String(row.source).toLowerCase())
      }
    })
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [rows])

  const totalPages = getTotalPages(filteredRows.length, PAGE_SIZE)
  const effectiveCurrentPage = Math.min(currentPage, totalPages)
  const pageRows = getPageRows(filteredRows, effectiveCurrentPage, PAGE_SIZE)
  const startRow = filteredRows.length ? (effectiveCurrentPage - 1) * PAGE_SIZE + 1 : 0
  const endRow = Math.min(effectiveCurrentPage * PAGE_SIZE, filteredRows.length)

  const handleDelete = async (leadId) => {
    if (!leadId || deleteMutation.isPending) {
      return
    }

    const shouldDelete = window.confirm('Delete this lead? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteMutation.mutateAsync(leadId)
  }

  if (leadsQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState eyebrow="Leads" title="Loading leads" description="Fetching lead records." />
      </PageContainer>
    )
  }

  if (leadsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Leads"
          title="Unable to load leads"
          description={leadsQuery.error?.message || 'Please try again in a few seconds.'}
          onRetry={leadsQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer eyebrow="Leads" title="Lead pipeline" meta={`${filteredRows.length} records`}>
        <div className="crud-toolbar">
          <div className="crud-toolbar__filters">
            <div className="crud-toolbar__field">
              <label htmlFor="lead-search">Search</label>
              <input
                id="lead-search"
                type="search"
                placeholder="Name, email, company..."
                value={search}
                onChange={(event) => {
                  setCurrentPage(1)
                  setSearch(event.target.value)
                }}
              />
            </div>

            <div className="crud-toolbar__field">
              <label htmlFor="lead-status-filter">Status</label>
              <select
                id="lead-status-filter"
                value={statusFilter}
                onChange={(event) => {
                  setCurrentPage(1)
                  setStatusFilter(event.target.value)
                }}
              >
                <option value="all">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="crud-toolbar__field">
              <label htmlFor="lead-source-filter">Source</label>
              <select
                id="lead-source-filter"
                value={sourceFilter}
                onChange={(event) => {
                  setCurrentPage(1)
                  setSourceFilter(event.target.value)
                }}
              >
                <option value="all">All sources</option>
                {sourceOptions.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="crud-toolbar__actions">
            <Link className="state-action" to="/leads/new">
              Create lead
            </Link>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Status</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length ? (
                pageRows.map((row) => {
                  const leadId = resolveEntityId(row)
                  return (
                    <tr key={leadId || `${row?.email || 'lead'}-${row?.name || ''}`}>
                      <td>{row?.name || '—'}</td>
                      <td>{row?.email || '—'}</td>
                      <td>{row?.company || '—'}</td>
                      <td>{row?.status || '—'}</td>
                      <td>{row?.source || '—'}</td>
                      <td>
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
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6}>No leads found for current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            Showing {startRow}-{endRow} of {filteredRows.length} leads
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

export default LeadsListPage
