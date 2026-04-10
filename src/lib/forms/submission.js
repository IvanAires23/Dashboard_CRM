import { useCallback, useRef, useState } from 'react'
import { normalizeError } from '../errors/normalizeError.js'

export function useAsyncFormSubmission({
  successMessage = '',
  defaultErrorMessage = 'Unable to submit right now. Please try again.',
  onSuccess,
  onError,
} = {}) {
  const isInFlightRef = useRef(false)
  const [isSubmittingAsync, setIsSubmittingAsync] = useState(false)
  const [currentSuccessMessage, setCurrentSuccessMessage] = useState('')
  const [currentErrorMessage, setCurrentErrorMessage] = useState('')

  const clearFeedback = useCallback(() => {
    setCurrentSuccessMessage('')
    setCurrentErrorMessage('')
  }, [])

  const setErrorMessage = useCallback((message) => {
    setCurrentSuccessMessage('')
    const resolvedMessage = message || defaultErrorMessage
    setCurrentErrorMessage(resolvedMessage)
    if (typeof onError === 'function') {
      onError({
        message: resolvedMessage,
        error: null,
      })
    }
  }, [defaultErrorMessage, onError])

  const executeSubmission = useCallback(
    async (submitter) => {
      if (isInFlightRef.current) {
        return false
      }

      isInFlightRef.current = true
      setIsSubmittingAsync(true)
      clearFeedback()

      try {
        const result = await submitter()
        if (successMessage) {
          setCurrentSuccessMessage(successMessage)
        }
        if (typeof onSuccess === 'function') {
          onSuccess({
            message: successMessage,
            result,
          })
        }
        return true
      } catch (error) {
        const normalizedError = normalizeError(error, {
          fallbackMessage: defaultErrorMessage,
        })
        const resolvedMessage = normalizedError.userMessage
        setCurrentErrorMessage(resolvedMessage)
        if (typeof onError === 'function') {
          onError({
            message: resolvedMessage,
            error: normalizedError.originalError,
            normalizedError,
          })
        }
        return false
      } finally {
        isInFlightRef.current = false
        setIsSubmittingAsync(false)
      }
    },
    [clearFeedback, defaultErrorMessage, onError, onSuccess, successMessage],
  )

  return {
    isSubmittingAsync,
    successMessage: currentSuccessMessage,
    errorMessage: currentErrorMessage,
    executeSubmission,
    clearFeedback,
    setErrorMessage,
  }
}

export default useAsyncFormSubmission
