import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import ErrorState from '../../../components/ui/ErrorState.jsx'
import LoadingState from '../../../components/ui/LoadingState.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import Pagination from '../../../components/ui/Pagination.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { deleteTask, getTasks } from '../../../services/tasks.js'
import {
  extractCollection,
  getPageRows,
  getTotalPages,
  matchesAnySearch,
  resolveEntityId,
} from '../../../lib/crm/entityUtils.js'
import '../../../components/crud/crud.css'

const PAGE_SIZE = 8

function TasksListPage() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const rows = useMemo(() => extractCollection(tasksQuery.data), [tasksQuery.data])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesTerm = matchesAnySearch(row, search, [
        (entry) => entry?.title ?? entry?.name,
        (entry) => entry?.description ?? entry?.details,
        (entry) => entry?.assignedUser?.name ?? entry?.assignedUserId ?? entry?.ownerId,
      ])
      const rowStatus = String(row?.status ?? '').toLowerCase()
      const rowPriority = String(row?.priority ?? '').toLowerCase()
      const matchesStatus = statusFilter === 'all' || rowStatus === statusFilter
      const matchesPriority = priorityFilter === 'all' || rowPriority === priorityFilter
      return matchesTerm && matchesStatus && matchesPriority
    })
  }, [rows, search, statusFilter, priorityFilter])

  const statusOptions = useMemo(() => {
    const values = new Set()
    rows.forEach((row) => {
      if (row?.status) {
        values.add(String(row.status).toLowerCase())
      }
    })
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [rows])

  const priorityOptions = useMemo(() => {
    const values = new Set()
    rows.forEach((row) => {
      if (row?.priority) {
        values.add(String(row.priority).toLowerCase())
      }
    })
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [rows])

  const totalPages = getTotalPages(filteredRows.length, PAGE_SIZE)
  const effectiveCurrentPage = Math.min(currentPage, totalPages)
  const pageRows = getPageRows(filteredRows, effectiveCurrentPage, PAGE_SIZE)
  const startRow = filteredRows.length ? (effectiveCurrentPage - 1) * PAGE_SIZE + 1 : 0
  const endRow = Math.min(effectiveCurrentPage * PAGE_SIZE, filteredRows.length)

  const handleDelete = async (taskId) => {
    if (!taskId || deleteMutation.isPending) {
      return
    }

    const shouldDelete = window.confirm('Delete this task? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    await deleteMutation.mutateAsync(taskId)
  }

  if (tasksQuery.isPending) {
    return (
      <PageContainer>
        <LoadingState eyebrow="Tasks" title="Loading tasks" description="Fetching task records." />
      </PageContainer>
    )
  }

  if (tasksQuery.isError) {
    return (
      <PageContainer>
        <ErrorState
          eyebrow="Tasks"
          title="Unable to load tasks"
          description={tasksQuery.error?.message || 'Please try again in a few seconds.'}
          onRetry={tasksQuery.refetch}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <WidgetContainer eyebrow="Tasks" title="Task board" meta={`${filteredRows.length} records`}>
        <div className="crud-toolbar">
          <div className="crud-toolbar__filters">
            <div className="crud-toolbar__field">
              <label htmlFor="task-search">Search</label>
              <input
                id="task-search"
                type="search"
                placeholder="Title, description, assignee..."
                value={search}
                onChange={(event) => {
                  setCurrentPage(1)
                  setSearch(event.target.value)
                }}
              />
            </div>

            <div className="crud-toolbar__field">
              <label htmlFor="task-status-filter">Status</label>
              <select
                id="task-status-filter"
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
              <label htmlFor="task-priority-filter">Priority</label>
              <select
                id="task-priority-filter"
                value={priorityFilter}
                onChange={(event) => {
                  setCurrentPage(1)
                  setPriorityFilter(event.target.value)
                }}
              >
                <option value="all">All priorities</option>
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="crud-toolbar__actions">
            <Link className="state-action" to="/tasks/new">
              Create task
            </Link>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due date</th>
                <th>Assigned user</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length ? (
                pageRows.map((row) => {
                  const taskId = resolveEntityId(row)
                  const assignee = row?.assignedUser?.name ?? row?.assignedUserId ?? row?.ownerId ?? '—'
                  return (
                    <tr key={taskId || `${row?.title || row?.name || 'task'}-${assignee}`}>
                      <td>{row?.title ?? row?.name ?? '—'}</td>
                      <td>{row?.status ?? '—'}</td>
                      <td>{row?.priority ?? '—'}</td>
                      <td>{row?.dueDate ?? row?.due_at ?? row?.deadline ?? '—'}</td>
                      <td>{assignee}</td>
                      <td>
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
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6}>No tasks found for current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            Showing {startRow}-{endRow} of {filteredRows.length} tasks
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

export default TasksListPage
