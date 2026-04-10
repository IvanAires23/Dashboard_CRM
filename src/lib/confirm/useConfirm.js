import { useContext } from 'react'
import { ConfirmContext } from './confirmContext.js'

export function useConfirm() {
  const context = useContext(ConfirmContext)

  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider.')
  }

  return context.confirm
}

export default useConfirm
