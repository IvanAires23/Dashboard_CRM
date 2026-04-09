import { Plus, Search } from 'lucide-react'
import './Header.css'

function Header({ title, subtitle, actionLabel }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{title}</h2>
        {subtitle ? <p className="topbar-subtitle">{subtitle}</p> : null}
      </div>

      <div className="topbar-actions">
        <label className="toolbar-search">
          <Search size={16} strokeWidth={2} />
          <input
            aria-label="Search CRM"
            placeholder="Search"
            type="search"
          />
        </label>

        <button className="toolbar-primary" type="button">
          <Plus size={16} strokeWidth={2.2} />
          <span>{actionLabel}</span>
        </button>
      </div>
    </header>
  )
}

export default Header
