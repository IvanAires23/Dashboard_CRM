import { useCallback, useRef, useState } from 'react'

function getErrorMessage(error, fallbackMessage) {
  if (!error) {
    return fallbackMessage
  }

  if (typeof error === 'string' && error.trim()) {
    return error
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message
  }

  if (typeof error?.details === 'string' && error.details.trim()) {
    return error.details
  }

  if (typeof error?.details?.message === 'string' && error.details.message.trim()) {
    return error.details.message
  }

  if (typeof error?.details?.error === 'string' && error.details.error.trim()) {
    return error.details.error
  }

  return fallbackMessage
}

export function useAsyncFormSubmission({
  successMessage = '',
  defaultErrorMessage = 'Unable to submit right now. Please try again.',
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
    setCurrentErrorMessage(message || defaultErrorMessage)
  }, [defaultErrorMessage])

  const executeSubmission = useCallback(
    async (submitter) => {
      if (isInFlightRef.current) {
        return false
      }

      isInFlightRef.current = true
      setIsSubmittingAsync(true)
      clearFeedback()

      try {
        await submitter()
        if (successMessage) {
          setCurrentSuccessMessage(successMessage)
        }
        return true
      } catch (error) {
        setCurrentErrorMessage(getErrorMessage(error, defaultErrorMessage))
        return false
      } finally {
        isInFlightRef.current = false
        setIsSubmittingAsync(false)
      }
    },
    [clearFeedback, defaultErrorMessage, successMessage],
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
