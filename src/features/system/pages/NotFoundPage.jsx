import ModulePage from '../../../components/ui/ModulePage.jsx'

function NotFoundPage() {
  return (
    <ModulePage
      eyebrow="Navigation"
      title="Page not found"
      description="The page you tried to access does not exist or is not available in this CRM workspace yet."
      summaryCards={[
        { label: 'Status', value: '404', note: 'Invalid route or unavailable module' },
        { label: 'Suggested route', value: '/dashboard', note: 'Use the main workspace to continue' },
      ]}
      nextSteps={[
        'Return to the dashboard from the sidebar navigation',
        'Verify the URL if you came from a shared link',
        'Use a valid CRM module from the current workspace',
      ]}
    />
  )
}

export default NotFoundPage
