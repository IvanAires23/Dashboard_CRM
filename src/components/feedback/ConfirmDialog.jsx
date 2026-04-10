import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

function ConfirmDialog({
  open = false,
  title = 'Confirm action',
  description = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const confirmButtonRef = useRef(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    confirmButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onCancel])

  if (!open) {
    return null
  }

  return (
    <div className="confirm-dialog" role="presentation">
      <div className="confirm-dialog__backdrop" onClick={onCancel} />

      <section className="confirm-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <header className="confirm-dialog__header">
          <span className={`confirm-dialog__icon confirm-dialog__icon--${tone}`}>
            <AlertTriangle size={16} strokeWidth={2.2} />
          </span>

          <div>
            <h2 id="confirm-dialog-title">{title}</h2>
            <p>{description}</p>
          </div>
        </header>

        <footer className="confirm-dialog__actions">
          <button type="button" className="confirm-dialog__button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={`confirm-dialog__button confirm-dialog__button--${tone}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  )
}

export default ConfirmDialog
