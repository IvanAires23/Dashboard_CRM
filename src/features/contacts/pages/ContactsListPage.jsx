import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import Pagination from '../../../components/ui/Pagination.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteContact, getContacts } from '../../../services/contacts.js'
import {
  extractCollection,
  getPageRows,
  getTotalPages,
  matchesAnySearch,
  resolveEntityId,
} from '../../../lib/crm/entityUtils.js'
import '../../../components/crud/crud.css'

const PAGE_SIZE = 8

function ContactsListPage() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [accountFilter, setAccountFilter] = useState('all')

  const contactsQuery = useQuery({
    queryKey: ['contacts'],
    queryFn: () => getContacts(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })

  const rows = useMemo(() => extractCollection(contactsQuery.data), [contactsQuery.data])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesTerm = matchesAnySearch(row, search, [
        (entry) => entry?.name ?? entry?.fullName,
        (entry) => entry?.email,
        (entry) => entry?.phone ?? entry?.mobile,
      ])
      const accountName = String(
        row?.account?.name ?? row?.company?.name ?? row?.accountId ?? row?.company ?? '',
      ).toLowerCase()
      const matchesAccount = accountFilter === 'all' || accountName === accountFilter
      return matchesTerm && matchesAccount
    })
  }, [rows, search, accountFilter])

  const accountOptions = useMemo(() => {
    const values = new Set()
    rows.forEach((row) => {
      const value = row?.account?.name ?? row?.company?.name ?? row?.accountId ?? row?.company
      if (value) {
        values.add(String(value).toLowerCase())
      }
    })
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [rows])

  const totalPages = getTotalPages(filteredRows.length, PAGE_SIZE)
  const effectiveCurrentPage = Math.min(currentPage, totalPages)
  const pageRows = getPageRows(filteredRows, effectiveCurrentPage, PAGE_SIZE)
  const startRow = filteredRows.length ? (effectiveCurrentPage - 1) * PAGE_SIZE + 1 : 0
  const endRow = Math.min(effectiveCurrentPage * PAGE_SIZE, filteredRows.length)

  const handleDelete = async (contactId) => {
    if (!contactId || deleteMutation.isPending) {
      return
    }

    const shouldDelete = window.confirm('Delete this contact? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteMutation.mutateAsync(contactId)
  }

  if (contactsQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState eyebrow="Contacts" title="Loading contacts" description="Fetching contact records." />
      </PageContainer>
    )
  }

  if (contactsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Contacts"
          title="Unable to load contacts"
          description={contactsQuery.error?.message || 'Please try again in a few seconds.'}
          onRetry={contactsQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer eyebrow="Contacts" title="Relationship contacts" meta={`${filteredRows.length} records`}>
        <div className="crud-toolbar">
          <div className="crud-toolbar__filters">
            <div className="crud-toolbar__field">
              <label htmlFor="contact-search">Search</label>
              <input
                id="contact-search"
                type="search"
                placeholder="Name, email, phone..."
                value={search}
                onChange={(event) => {
                  setCurrentPage(1)
                  setSearch(event.target.value)
                }}
              />
            </div>

            <div className="crud-toolbar__field">
              <label htmlFor="contact-account-filter">Account</label>
              <select
                id="contact-account-filter"
                value={accountFilter}
                onChange={(event) => {
                  setCurrentPage(1)
                  setAccountFilter(event.target.value)
                }}
              >
                <option value="all">All accounts</option>
                {accountOptions.map((account) => (
                  <option key={account} value={account}>
                    {account}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="crud-toolbar__actions">
            <Link className="state-action" to="/contacts/new">
              Create contact
            </Link>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Account</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length ? (
                pageRows.map((row) => {
                  const contactId = resolveEntityId(row)
                  const accountName = row?.account?.name ?? row?.company?.name ?? row?.accountId ?? row?.company ?? '—'
                  return (
                    <tr key={contactId || `${row?.email || 'contact'}-${row?.name || ''}`}>
                      <td>{row?.name ?? row?.fullName ?? '—'}</td>
                      <td>{row?.email || '—'}</td>
                      <td>{row?.phone ?? row?.mobile ?? '—'}</td>
                      <td>{accountName}</td>
                      <td>
                        <div className="crud-table__actions">
                          {contactId ? <Link to={`/contacts/${contactId}`}>View</Link> : null}
                          {contactId ? <Link to={`/contacts/${contactId}/edit`}>Edit</Link> : null}
                          <button
                            type="button"
                            onClick={() => handleDelete(contactId)}
                            disabled={!contactId || deleteMutation.isPending}
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
                  <td colSpan={5}>No contacts found for current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            Showing {startRow}-{endRow} of {filteredRows.length} contacts
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

export default ContactsListPage
