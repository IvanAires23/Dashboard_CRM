import Card from '../../../components/ui/Card.jsx'
import PageContainer from '../../../components/ui/PageContainer.jsx'
import { getErrorDiagnosticSummary, normalizeError } from '../../../lib/errors/normalizeError.js'
import './AppErrorPage.css'

function AppErrorPage({ error, onRetry }) {
  const normalizedError = normalizeError(error, {
    fallbackMessage: 'Unexpected rendering error.',
  })
  const shouldShowDetails = import.meta.env.DEV

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <PageContainer className="app-error-page" role="alert">
      <Card className="app-error-page__card">
        <p className="eyebrow">System</p>
        <h1>Unexpected error</h1>
        <p className="app-error-page__description">
          We hit a rendering issue in this screen. Try again or reload the application.
        </p>

        <div className="app-error-page__actions">
          <button type="button" className="state-action" onClick={onRetry}>
            Try again
          </button>
          <button type="button" className="state-action state-action--secondary" onClick={handleReload}>
            Reload app
          </button>
        </div>

        {shouldShowDetails ? (
          <pre className="app-error-page__details" aria-label="error details">
            {getErrorDiagnosticSummary(normalizedError)}
          </pre>
        ) : null}
      </Card>
    </PageContainer>
  )
}

export default AppErrorPage
