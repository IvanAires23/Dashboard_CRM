import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

const iconByType = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

function ToastContainer({
  toasts = [],
  onDismiss = () => {},
}) {
  if (!toasts.length) {
    return null
  }

  return (
    <div className="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => {
        const Icon = iconByType[toast.type] ?? Info

        return (
          <article
            key={toast.id}
            className={`toast toast--${toast.type}`}
            role={toast.type === 'error' ? 'alert' : 'status'}
          >
            <span className="toast__icon">
              <Icon size={16} strokeWidth={2.2} />
            </span>

            <div className="toast__content">
              {toast.title ? <strong>{toast.title}</strong> : null}
              <p>{toast.message}</p>
            </div>

            <button
              type="button"
              className="toast__close"
              aria-label="Dismiss notification"
              onClick={() => onDismiss(toast.id)}
            >
              <X size={14} strokeWidth={2.2} />
            </button>
          </article>
        )
      })}
    </div>
  )
}

export default ToastContainer
