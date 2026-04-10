function FilterTextInput({
  id,
  label,
  value = '',
  placeholder = '',
  onChange = () => {},
}) {
  return (
    <div className="filter-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

export default FilterTextInput
