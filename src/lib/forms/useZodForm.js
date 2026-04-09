import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

function getErrorByPath(errors, path) {
  if (!errors || !path) {
    return null
  }

  return path.split('.').reduce((currentValue, segment) => currentValue?.[segment], errors) ?? null
}

export function useZodForm({ schema, defaultValues = {}, ...formOptions }) {
  if (!schema) {
    throw new Error('useZodForm requires a zod schema.')
  }

  const form = useForm({
    ...formOptions,
    defaultValues,
    resolver: zodResolver(schema),
  })

  const getFieldError = useCallback(
    (fieldName) => {
      const fieldError = getErrorByPath(form.formState.errors, fieldName)
      return typeof fieldError?.message === 'string' ? fieldError.message : ''
    },
    [form.formState.errors],
  )

  const setFormError = useCallback(
    (message, type = 'manual') => {
      if (!message) {
        return
      }

      form.setError('root', {
        type,
        message,
      })
    },
    [form],
  )

  const clearFormError = useCallback(() => {
    form.clearErrors('root')
  }, [form])

  return {
    ...form,
    getFieldError,
    setFormError,
    clearFormError,
  }
}

export default useZodForm
