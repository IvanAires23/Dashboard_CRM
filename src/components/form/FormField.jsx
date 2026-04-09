import clsx from 'clsx'
import './form.css'

function FormField({
  id,
  label,
  error,
  helperText,
  children,
  className,
  labelClassName,
  helperClassName,
  errorClassName,
  helperId,
  errorId,
}) {
  return (
    <div className={clsx('crm-field', className)}>
      {label ? (
        <label className={clsx('crm-field__label', labelClassName)} htmlFor={id}>
          {label}
        </label>
      ) : null}

      {children}

      {helperText ? (
        <p className={clsx('crm-field__helper', helperClassName)} id={helperId}>
          {helperText}
        </p>
      ) : null}

      {error ? (
        <p className={clsx('crm-field__error', errorClassName)} id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default FormField
