import ModulePage from '../../../components/ui/ModulePage.jsx'

function DealsPage() {
  return (
    <ModulePage
      eyebrow="Deals"
      title="Deals"
      description="The deals module will cover pipeline management, forecasting, stage movement, and revenue tracking."
      summaryCards={[
        { label: 'Open opportunities', value: '42', note: 'Across inbound and expansion deals' },
        { label: 'Forecast confidence', value: '81%', note: 'Based on stage and owner activity' },
        { label: 'Avg. cycle', value: '29 days', note: 'Tracked against current quarter goals' },
      ]}
      nextSteps={[
        'Create kanban pipeline views with drag-and-drop stage movement',
        'Add deal detail pages with notes, contacts and history',
        'Connect forecasting widgets and conversion reporting',
      ]}
    />
  )
}

export default DealsPage
