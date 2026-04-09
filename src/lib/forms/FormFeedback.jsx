import './formFeedback.css'

function FormFeedback({
  isLoading = false,
  loadingText = 'Submitting...',
  successMessage = '',
  errorMessage = '',
  warningMessage = '',
}) {
  return (
    <>
      {isLoading ? (
        <p className="form-feedback form-feedback--loading" role="status">
          <span className="form-feedback__spinner" aria-hidden="true" />
          <span>{loadingText}</span>
        </p>
      ) : null}
      {warningMessage ? <p className="form-feedback form-feedback--warning">{warningMessage}</p> : null}
      {successMessage ? <p className="form-feedback form-feedback--success">{successMessage}</p> : null}
      {errorMessage ? <p className="form-feedback form-feedback--error">{errorMessage}</p> : null}
    </>
  )
}

export default FormFeedback
