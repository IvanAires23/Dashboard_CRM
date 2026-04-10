function titleCase(value) {
  return String(value)
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function FilterSelect({
  id,
  label,
  value = 'all',
  onChange = () => {},
  options = [],
  allLabel = 'All',
  formatOptionLabel = titleCase,
}) {
  return (
    <div className="filter-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOptionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterSelect
