import { useMutation, useQueryClient } from '@tanstack/react-query'
import Card from '../../../components/ui/Card.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import WidgetContainer from '../../../components/ui/WidgetContainer.jsx'
import { useConfirm } from '../../../lib/confirm/useConfirm.js'
import { getErrorMessage } from '../../../lib/errors/normalizeError.js'
import { useToast } from '../../../lib/toast/useToast.js'
import { isDemoModeEnabled, resetCrmDemoData } from '../../../services/demo.js'
import './SettingsPage.css'

function SettingsPage() {
  const queryClient = useQueryClient()
  const confirm = useConfirm()
  const toast = useToast()
  const demoModeEnabled = isDemoModeEnabled()

  const resetDemoMutation = useMutation({
    mutationFn: resetCrmDemoData,
    onSuccess: async () => {
      await queryClient.invalidateQueries()
      toast.success('Demo data reset successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Unable to reset demo data right now.'))
    },
  })

  const handleResetDemoData = async () => {
    if (!demoModeEnabled || resetDemoMutation.isPending) {
      return
    }

    const isConfirmed = await confirm({
      title: 'Reset demo data?',
      description: 'This will replace all current CRM records with the initial demo dataset.',
      confirmLabel: 'Reset data',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })

    if (!isConfirmed) {
      return
    }

    await resetDemoMutation.mutateAsync()
  }

  return (
    <PageContainer className="settings-page">
      <Card className="settings-page__header">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Workspace settings</h1>
          <p>
            Manage operational workspace controls and demo data tools.
          </p>
        </div>
      </Card>

      <section className="settings-page__stats">
        <Card className="settings-page__stat-card">
          <span>Workspace role</span>
          <strong>Owner</strong>
          <p>Full access to configuration and data</p>
        </Card>
        <Card className="settings-page__stat-card">
          <span>Active automations</span>
          <strong>6</strong>
          <p>Alerts, routing and reminders enabled</p>
        </Card>
        <Card className="settings-page__stat-card">
          <span>Pending invites</span>
          <strong>2</strong>
          <p>Waiting for team confirmation</p>
        </Card>
      </section>

      <WidgetContainer
        eyebrow="Demo"
        title="Demo data controls"
        meta={demoModeEnabled ? 'Enabled' : 'Disabled'}
      >
        <div className="settings-demo-reset">
          <p>
            Restore the original demo dataset used for leads, deals, accounts, contacts, and tasks.
            This helps quickly reset the workspace before presentations.
          </p>

          <button
            type="button"
            className="state-action settings-demo-reset__button"
            onClick={handleResetDemoData}
            disabled={!demoModeEnabled || resetDemoMutation.isPending}
          >
            {resetDemoMutation.isPending ? 'Resetting...' : 'Reset demo data'}
          </button>

          {!demoModeEnabled ? (
            <p className="settings-demo-reset__hint">
              Enable <code>VITE_CRM_MOCK=true</code> to use demo reset controls.
            </p>
          ) : null}
        </div>
      </WidgetContainer>

      <WidgetContainer eyebrow="Roadmap" title="What comes next">
        <ul className="settings-page__checklist">
          <li>Add workspace preferences and member management</li>
          <li>Create alert, notification and automation controls</li>
          <li>Support billing, permissions and audit settings</li>
        </ul>
      </WidgetContainer>
    </PageContainer>
  )
}

export default SettingsPage
