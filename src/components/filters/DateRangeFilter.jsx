function DateRangeFilter({
  fromId,
  toId,
  label = 'Date range',
  fromValue = '',
  toValue = '',
  onFromChange = () => {},
  onToChange = () => {},
}) {
  return (
    <fieldset className="filter-field">
      <legend>{label}</legend>
      <div className="filter-date-range">
        <input
          id={fromId}
          type="date"
          value={fromValue}
          onChange={(event) => onFromChange(event.target.value)}
          aria-label={`${label} from`}
        />
        <input
          id={toId}
          type="date"
          value={toValue}
          onChange={(event) => onToChange(event.target.value)}
          aria-label={`${label} to`}
        />
      </div>
    </fieldset>
  )
}

export default DateRangeFilter
