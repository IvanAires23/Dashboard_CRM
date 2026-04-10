import { useCallback, useMemo, useRef, useState } from 'react'
import ConfirmDialog from './ConfirmDialog.jsx'
import { ConfirmContext } from '../../lib/confirm/confirmContext.js'
import './confirm.css'

function normalizeOptions(options = {}) {
  return {
    title: options.title || 'Confirm action',
    description: options.description || 'Are you sure you want to continue?',
    confirmLabel: options.confirmLabel || 'Confirm',
    cancelLabel: options.cancelLabel || 'Cancel',
    tone: options.tone || 'danger',
  }
}

function ConfirmProvider({ children }) {
  const resolverRef = useRef(null)
  const [dialogState, setDialogState] = useState({
    open: false,
    options: normalizeOptions(),
  })

  const closeDialog = useCallback((confirmed) => {
    if (resolverRef.current) {
      resolverRef.current(Boolean(confirmed))
      resolverRef.current = null
    }

    setDialogState((currentState) => ({
      ...currentState,
      open: false,
    }))
  }, [])

  const confirm = useCallback((options = {}) => {
    if (resolverRef.current) {
      resolverRef.current(false)
      resolverRef.current = null
    }

    setDialogState({
      open: true,
      options: normalizeOptions(options),
    })

    return new Promise((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const contextValue = useMemo(() => ({
    confirm,
  }), [confirm])

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        open={dialogState.open}
        title={dialogState.options.title}
        description={dialogState.options.description}
        confirmLabel={dialogState.options.confirmLabel}
        cancelLabel={dialogState.options.cancelLabel}
        tone={dialogState.options.tone}
        onCancel={() => closeDialog(false)}
        onConfirm={() => closeDialog(true)}
      />
    </ConfirmContext.Provider>
  )
}

export default ConfirmProvider
