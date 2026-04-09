import ModulePage from '../../../components/ui/ModulePage.jsx'

function SettingsPage() {
  return (
    <ModulePage
      eyebrow="Settings"
      title="Settings"
      description="The settings module will host user preferences, workspace configuration, and administrative controls."
      summaryCards={[
        { label: 'Workspace role', value: 'Owner', note: 'Full access to configuration and data' },
        { label: 'Active automations', value: '6', note: 'Alerts, routing and reminders enabled' },
        { label: 'Pending invites', value: '2', note: 'Waiting for team confirmation' },
      ]}
      nextSteps={[
        'Add workspace preferences and member management',
        'Create alert, notification and automation controls',
        'Support billing, permissions and audit settings',
      ]}
    />
  )
}

export default SettingsPage
