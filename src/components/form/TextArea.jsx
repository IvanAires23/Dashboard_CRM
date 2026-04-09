import clsx from 'clsx'
import FormField from './FormField.jsx'

function TextArea({
  id,
  name,
  label,
  error,
  helperText,
  registration = {},
  fieldClassName,
  labelClassName,
  helperClassName,
  errorClassName,
  textAreaClassName,
  ...textAreaProps
}) {
  const textAreaId = id ?? name ?? registration?.name
  const helperId = helperText && textAreaId ? `${textAreaId}-helper` : undefined
  const errorId = error && textAreaId ? `${textAreaId}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <FormField
      id={textAreaId}
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
      <textarea
        id={textAreaId}
        name={name}
        className={clsx('crm-field__control crm-field__control--textarea', textAreaClassName)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        {...textAreaProps}
        {...registration}
      />
    </FormField>
  )
}

export default TextArea
