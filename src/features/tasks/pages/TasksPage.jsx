import ModulePage from '../../../components/ui/ModulePage.jsx'
import { Link } from 'react-router-dom'

function TasksPage() {
  return (
    <>
      <ModulePage
        eyebrow="Tasks"
        title="Tasks"
        description="The tasks module will manage follow-ups, ownership, due dates, and execution queues for teams."
        summaryCards={[
          { label: 'Open tasks', value: '74', note: 'Sales and CS follow-ups in progress' },
          { label: 'Due today', value: '11', note: 'High-priority execution window' },
          { label: 'Overdue', value: '4', note: 'Needs reassignment or immediate review' },
        ]}
        nextSteps={[
          'Create task boards by owner, urgency and account',
          'Support quick actions directly from the header',
          'Add reminders, due-date rules and recurring tasks',
        ]}
      />

      <section className="page-container">
        <Link className="state-action" to="/tasks/new">
          Create task
        </Link>
      </section>
    </>
  )
}

export default TasksPage
