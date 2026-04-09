import clsx from 'clsx'
import FormField from './FormField.jsx'

function SelectInput({
  id,
  name,
  label,
  error,
  helperText,
  options = [],
  placeholder,
  registration = {},
  fieldClassName,
  labelClassName,
  helperClassName,
  errorClassName,
  selectClassName,
  children,
  ...selectProps
}) {
  const selectId = id ?? name ?? registration?.name
  const helperId = helperText && selectId ? `${selectId}-helper` : undefined
  const errorId = error && selectId ? `${selectId}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <FormField
      id={selectId}
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
      <select
        id={selectId}
        name={name}
        className={clsx('crm-field__control', selectClassName)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        {...selectProps}
        {...registration}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={Boolean(option.disabled)}
          >
            {option.label}
          </option>
        ))}
        {children}
      </select>
    </FormField>
  )
}

export default SelectInput
