import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ToastContainer from './ToastContainer.jsx'
import { ToastContext } from '../../lib/toast/toastContext.js'
import './toast.css'

const DEFAULT_DURATION = 4200
const MAX_TOASTS = 5

function resolvePayload(input, fallbackType = 'info') {
  if (typeof input === 'string') {
    return {
      type: fallbackType,
      title: '',
      message: input,
      duration: DEFAULT_DURATION,
    }
  }

  return {
    type: input?.type ?? fallbackType,
    title: input?.title ?? '',
    message: input?.message ?? input?.description ?? '',
    duration: Number.isFinite(input?.duration) ? input.duration : DEFAULT_DURATION,
  }
}

function ToastProvider({ children }) {
  const toastIdRef = useRef(0)
  const timeoutMapRef = useRef(new Map())
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((toastId) => {
    const normalizedId = String(toastId)
    const timeoutId = timeoutMapRef.current.get(normalizedId)

    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutMapRef.current.delete(normalizedId)
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== normalizedId))
  }, [])

  const pushToast = useCallback((input, fallbackType) => {
    const payload = resolvePayload(input, fallbackType)

    if (!payload.message) {
      return ''
    }

    toastIdRef.current += 1
    const toastId = String(toastIdRef.current)
    const nextToast = {
      id: toastId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      duration: Math.max(1400, payload.duration),
    }

    setToasts((currentToasts) => [nextToast, ...currentToasts].slice(0, MAX_TOASTS))

    const timeoutId = window.setTimeout(() => {
      dismiss(toastId)
    }, nextToast.duration)
    timeoutMapRef.current.set(toastId, timeoutId)

    return toastId
  }, [dismiss])

  useEffect(() => {
    const timeoutMap = timeoutMapRef.current

    return () => {
      timeoutMap.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      timeoutMap.clear()
    }
  }, [])

  const toastApi = useMemo(() => ({
    toast: (input) => pushToast(input, 'info'),
    success: (input) => pushToast(input, 'success'),
    error: (input) => pushToast(input, 'error'),
    warning: (input) => pushToast(input, 'warning'),
    info: (input) => pushToast(input, 'info'),
    dismiss,
    clear: () => {
      timeoutMapRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      timeoutMapRef.current.clear()
      setToasts([])
    },
  }), [dismiss, pushToast])

  return (
    <ToastContext.Provider value={toastApi}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export default ToastProvider
