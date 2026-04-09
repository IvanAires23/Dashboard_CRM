import ModulePage from '../../../components/ui/ModulePage.jsx'

function AccessDeniedPage() {
  return (
    <ModulePage
      eyebrow="Authorization"
      title="Access denied"
      description="You do not have permission to access this CRM module with your current role."
      summaryCards={[
        { label: 'Status', value: '403', note: 'Permission denied for requested module' },
        { label: 'What to do', value: 'Request access', note: 'Ask an admin or manager for role update' },
      ]}
      nextSteps={[
        'Return to an allowed module from the sidebar navigation',
        'Contact your workspace administrator for access changes',
        'Sign out and sign in with another authorized account if available',
      ]}
    />
  )
}

export default AccessDeniedPage
