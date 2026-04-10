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
import { deleteTask, getTasks } from '../../../services/tasks.js'
import { extractCollection, resolveEntityId } from '../../../lib/crm/entityUtils.js'
import { useTaskFilters } from '../hooks/useTaskFilters.js'
import '../../../components/crud/crud.css'

const PAGE_SIZE = 8

function TasksListPage() {
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
  } = useTaskFilters()

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task deleted successfully.')
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to delete task right now. Please try again.')
    },
  })

  const rows = useMemo(() => extractCollection(tasksQuery.data), [tasksQuery.data])

  const filteredRows = useMemo(() => {
    return applyFilters(rows, {
      searchTerm: filters.q,
      searchSelectors: [
        (entry) => entry?.title ?? entry?.name,
        (entry) => entry?.description ?? entry?.details,
        (entry) =>
          entry?.assignedUser?.name ??
          entry?.assignedUserId ??
          entry?.ownerId,
      ],
      equalFilters: [
        {
          value: filters.status,
          selector: (entry) => entry?.status,
          emptyValue: 'all',
        },
        {
          value: filters.priority,
          selector: (entry) => entry?.priority,
          emptyValue: 'all',
        },
        {
          value: filters.owner,
          selector: (entry) =>
            entry?.assignedUser?.name ??
            entry?.assignedUserId ??
            entry?.ownerId,
          emptyValue: 'all',
        },
      ],
      dateRangeFilters: [
        {
          from: filters.dueFrom,
          to: filters.dueTo,
          selector: (entry) => entry?.dueDate ?? entry?.due_at ?? entry?.deadline,
        },
      ],
    })
  }, [rows, filters])

  const statusOptions = useMemo(() => {
    return collectFilterOptions(rows, (row) => row?.status)
  }, [rows])

  const priorityOptions = useMemo(() => {
    return collectFilterOptions(rows, (row) => row?.priority)
  }, [rows])

  const ownerOptions = useMemo(() => {
    return collectFilterOptions(
      rows,
      (row) => row?.assignedUser?.name ?? row?.assignedUserId ?? row?.ownerId,
    )
  }, [rows])

  const hasActiveFilters =
    Boolean(filters.q) ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.owner !== 'all' ||
    Boolean(filters.dueFrom) ||
    Boolean(filters.dueTo)

  const handleDelete = async (taskId) => {
    if (!taskId || deleteMutation.isPending) {
      return
    }

    const isConfirmed = await confirm({
      title: 'Delete task?',
      description: 'This action permanently removes the task and cannot be undone.',
      confirmLabel: 'Delete task',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!isConfirmed) {
      return
    }

    await deleteMutation.mutateAsync(taskId)
  }

  const columns = [
    {
      id: 'title',
      header: 'Title',
      accessor: (row) => row?.title ?? row?.name ?? 'â€”',
      sortAccessor: (row) => row?.title ?? row?.name ?? '',
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => row?.status ?? 'â€”',
      sortAccessor: (row) => row?.status ?? '',
    },
    {
      id: 'priority',
      header: 'Priority',
      accessor: (row) => row?.priority ?? 'â€”',
      sortAccessor: (row) => row?.priority ?? '',
    },
    {
      id: 'dueDate',
      header: 'Due date',
      accessor: (row) => row?.dueDate ?? row?.due_at ?? row?.deadline ?? 'â€”',
      sortAccessor: (row) => row?.dueDate ?? row?.due_at ?? row?.deadline ?? '',
      sortType: 'date',
    },
    {
      id: 'owner',
      header: 'Assigned user',
      accessor: (row) => row?.assignedUser?.name ?? row?.assignedUserId ?? row?.ownerId ?? 'â€”',
      sortAccessor: (row) => row?.assignedUser?.name ?? row?.assignedUserId ?? row?.ownerId ?? '',
    },
    {
      id: 'actions',
      header: 'Actions',
      sortable: false,
      cell: (row) => {
        const taskId = resolveEntityId(row)

        return (
          <div className="crud-table__actions">
            {taskId ? <Link to={`/tasks/${taskId}`}>View</Link> : null}
            {taskId ? <Link to={`/tasks/${taskId}/edit`}>Edit</Link> : null}
            <button
              type="button"
              onClick={() => handleDelete(taskId)}
              disabled={!taskId || deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        )
      },
    },
  ]

  if (tasksQuery.isPending) {
    return (
      <PageContainer>
        <WidgetContainer eyebrow="Tasks" title="Task board" meta="Loading records">
          <TableSkeleton columns={6} rows={8} />
        </WidgetContainer>
      </PageContainer>
    )
  }

  if (tasksQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Tasks"
          title="Unable to load tasks"
          error={tasksQuery.error}
          description="Please try again in a few seconds."
          onRetry={tasksQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer eyebrow="Tasks" title="Task board" meta={`${filteredRows.length} records`}>
        <FilterBar
          canClear={hasActiveFilters}
          onClear={resetFilters}
          actions={(
            <Link className="state-action" to="/tasks/new">
              Create task
            </Link>
          )}
        >
          <FilterTextInput
            id="task-search"
            label="Search"
            placeholder="Title, description, assignee..."
            value={filters.q}
            onChange={(value) => setFilter('q', value)}
          />

          <FilterSelect
            id="task-status-filter"
            label="Status"
            allLabel="All statuses"
            value={filters.status}
            options={statusOptions}
            onChange={(value) => setFilter('status', value)}
          />

          <FilterSelect
            id="task-priority-filter"
            label="Priority"
            allLabel="All priorities"
            value={filters.priority}
            options={priorityOptions}
            onChange={(value) => setFilter('priority', value)}
          />

          <FilterSelect
            id="task-owner-filter"
            label="Owner"
            allLabel="All owners"
            value={filters.owner}
            options={ownerOptions}
            onChange={(value) => setFilter('owner', value)}
          />

          <DateRangeFilter
            fromId="task-due-from"
            toId="task-due-to"
            label="Due date"
            fromValue={filters.dueFrom}
            toValue={filters.dueTo}
            onFromChange={(value) => setFilters({ dueFrom: value })}
            onToChange={(value) => setFilters({ dueTo: value })}
          />
        </FilterBar>

        <DataTable
          columns={columns}
          rows={filteredRows}
          rowKey={(row) => {
            const taskId = resolveEntityId(row)
            const assignee = row?.assignedUser?.name ?? row?.assignedUserId ?? row?.ownerId ?? ''
            return taskId || `${row?.title || row?.name || 'task'}-${assignee}`
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
          entityLabel="tasks"
          emptyMessage="No tasks found for current filters."
          emptyState={(
            <EntityEmptyState
              entityLabel="tasks"
              hasFilters={hasActiveFilters}
              onClearFilters={resetFilters}
              createHref="/tasks/new"
              createLabel="Create task"
              eyebrow="Tasks"
            />
          )}
        />
      </WidgetContainer>
    </PageContainer>
  )
}

export default TasksListPage
