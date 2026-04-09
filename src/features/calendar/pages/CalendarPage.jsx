import ModulePage from '../../../components/ui/ModulePage.jsx'

function CalendarPage() {
  return (
    <ModulePage
      eyebrow="Calendar"
      title="Calendar"
      description="The calendar module will support scheduling, follow-ups, and time-based CRM workflows."
      summaryCards={[
        { label: 'Meetings this week', value: '23', note: 'Renewals, demos and executive reviews' },
        { label: 'Conflicts', value: '3', note: 'Need rescheduling before Friday' },
        { label: 'Follow-up slots', value: '18', note: 'Reserved for proactive outreach' },
      ]}
      nextSteps={[
        'Render agenda and timeline views for teams',
        'Link meetings with accounts, contacts and deals',
        'Add scheduling and availability logic',
      ]}
    />
  )
}

export default CalendarPage
