import { Menu, Plus } from 'lucide-react'
import { GlobalSearch } from '../search/index.js'
import './Header.css'

function Header({
  title,
  subtitle,
  actionLabel,
  onAction,
  headingId,
  onMenuToggle,
  showMenuButton = false,
}) {
  return (
    <header className="topbar">
      <div className="topbar-main">
        {showMenuButton ? (
          <button
            type="button"
            className="topbar-menu-toggle"
            onClick={onMenuToggle}
            aria-label="Toggle navigation menu"
          >
            <Menu size={17} strokeWidth={2.2} />
          </button>
        ) : null}

        <div className="topbar-title">
          <h1 id={headingId}>{title}</h1>
          {subtitle ? <p className="topbar-subtitle">{subtitle}</p> : null}
        </div>
      </div>

      <div className="topbar-actions">
        <GlobalSearch />

        {actionLabel && typeof onAction === 'function' ? (
          <button className="toolbar-primary" type="button" onClick={onAction}>
            <Plus size={16} strokeWidth={2.2} />
            <span>{actionLabel}</span>
          </button>
        ) : null}
      </div>
    </header>
  )
}

export default Header
