import clsx from 'clsx'
import FormField from './FormField.jsx'

function TextInput({
  id,
  name,
  type = 'text',
  label,
  error,
  helperText,
  registration = {},
  fieldClassName,
  labelClassName,
  helperClassName,
  errorClassName,
  inputClassName,
  ...inputProps
}) {
  const inputId = id ?? name ?? registration?.name
  const helperId = helperText && inputId ? `${inputId}-helper` : undefined
  const errorId = error && inputId ? `${inputId}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <FormField
      id={inputId}
      label={label}
      error={error}
      helperText={helperText}
      className={fieldClassName}
      labelClassName={labelClassName}
      helperClassName={helperClassName}
      errorClassName={errorClassName}
      helperId={helperId}
      errorId={errorId}
    >
      <input
        id={inputId}
        name={name}
        type={type}
        className={clsx('crm-field__control', inputClassName)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        {...inputProps}
        {...registration}
      />
    </FormField>
  )
}

export default TextInput
