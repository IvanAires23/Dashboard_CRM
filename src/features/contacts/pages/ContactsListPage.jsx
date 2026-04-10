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
import { deleteContact, getContacts } from '../../../services/contacts.js'
import { extractCollection, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import { useContactFilters } from '../hooks/useContactFilters.js'
import '../../../components/crud/crud.css'

const PAGE_SIZE = 8

function ContactsListPage() {
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
  } = useContactFilters()

  const contactsQuery = useQuery({
    queryKey: ['contacts'],
    queryFn: () => getContacts(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      toast.success('Contact deleted successfully.')
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to delete contact right now. Please try again.')
    },
  })

  const rows = useMemo(() => extractCollection(contactsQuery.data), [contactsQuery.data])

  const filteredRows = useMemo(() => {
    return applyFilters(rows, {
      searchTerm: filters.q,
      searchSelectors: [
        (entry) => entry?.name ?? entry?.fullName,
        (entry) => entry?.email,
        (entry) => entry?.phone ?? entry?.mobile,
      ],
      equalFilters: [
        {
          value: filters.account,
          selector: (entry) =>
            entry?.account?.name ??
            entry?.company?.name ??
            entry?.accountId ??
            entry?.company,
          emptyValue: 'all',
        },
      ],
    })
  }, [rows, filters])

  const accountOptions = useMemo(() => {
    return collectFilterOptions(
      rows,
      (row) => row?.account?.name ?? row?.company?.name ?? row?.accountId ?? row?.company,
    )
  }, [rows])

  const hasActiveFilters = Boolean(filters.q) || filters.account !== 'all'

  const handleDelete = async (contactId) => {
    if (!contactId || deleteMutation.isPending) {
      return
    }

    const isConfirmed = await confirm({
      title: 'Delete contact?',
      description: 'This action permanently removes the contact and cannot be undone.',
      confirmLabel: 'Delete contact',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!isConfirmed) {
      return
    }

    await deleteMutation.mutateAsync(contactId)
  }

  const columns = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => row?.name ?? row?.fullName ?? 'â€”',
      sortAccessor: (row) => row?.name ?? row?.fullName ?? '',
    },
    {
      id: 'email',
      header: 'Email',
      accessor: (row) => row?.email || 'â€”',
      sortAccessor: (row) => row?.email ?? '',
    },
    {
      id: 'phone',
      header: 'Phone',
      accessor: (row) => row?.phone ?? row?.mobile ?? 'â€”',
      sortAccessor: (row) => row?.phone ?? row?.mobile ?? '',
    },
    {
      id: 'account',
      header: 'Account',
      accessor: (row) => row?.account?.name ?? row?.company?.name ?? row?.accountId ?? row?.company ?? 'â€”',
      sortAccessor: (row) => row?.account?.name ?? row?.company?.name ?? row?.accountId ?? row?.company ?? '',
    },
    {
      id: 'actions',
      header: 'Actions',
      sortable: false,
      cell: (row) => {
        const contactId = resolveEntityId(row)

        return (
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
        )
      },
    },
  ]

  if (contactsQuery.isPending) {
    return (
      <PageContainer>
        <WidgetContainer eyebrow="Contacts" title="Relationship contacts" meta="Loading records">
          <TableSkeleton columns={5} rows={8} />
        </WidgetContainer>
      </PageContainer>
    )
  }

  if (contactsQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Contacts"
          title="Unable to load contacts"
          error={contactsQuery.error}
          description="Please try again in a few seconds."
          onRetry={contactsQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer eyebrow="Contacts" title="Relationship contacts" meta={`${filteredRows.length} records`}>
        <FilterBar
          canClear={hasActiveFilters}
          onClear={resetFilters}
          actions={(
            <Link className="state-action" to="/contacts/new">
              Create contact
            </Link>
          )}
        >
          <FilterTextInput
            id="contact-search"
            label="Search"
            placeholder="Name, email, phone..."
            value={filters.q}
            onChange={(value) => setFilter('q', value)}
          />

          <FilterSelect
            id="contact-account-filter"
            label="Account"
            allLabel="All accounts"
            value={filters.account}
            options={accountOptions}
            onChange={(value) => setFilter('account', value)}
          />
        </FilterBar>

        <DataTable
          columns={columns}
          rows={filteredRows}
          rowKey={(row) => {
            const contactId = resolveEntityId(row)
            return contactId || `${row?.email || 'contact'}-${row?.name || row?.fullName || ''}`
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
          entityLabel="contacts"
          emptyMessage="No contacts found for current filters."
          emptyState={(
            <EntityEmptyState
              entityLabel="contacts"
              hasFilters={hasActiveFilters}
              onClearFilters={resetFilters}
              createHref="/contacts/new"
              createLabel="Create contact"
              eyebrow="Contacts"
            />
          )}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default ContactsListPage
