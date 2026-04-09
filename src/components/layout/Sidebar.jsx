import {
  Building2,
  CalendarRange,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Settings2,
  UsersRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navIcons = {
  Overview: LayoutDashboard,
  Deals: CircleDollarSign,
  Accounts: Building2,
  Contacts: UsersRound,
  Tasks: CheckCheck,
  Calendar: CalendarRange,
  Settings: Settings2,
}

function Sidebar({ isCollapsed, navigationItems, onToggle }) {
  return (
    <aside className={`sidebar${isCollapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark">C</div>
        {!isCollapsed ? <span className="brand-name">Customer Room</span> : null}
      </div>

      <button
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="sidebar-toggle"
        onClick={onToggle}
        type="button"
      >
        {isCollapsed ? <ChevronRight size={16} strokeWidth={2.2} /> : <ChevronLeft size={16} strokeWidth={2.2} />}
      </button>

      <nav className="sidebar-nav" aria-label="Primary">
        {navigationItems.map((item) => {
          const Icon = navIcons[item.label] ?? LayoutDashboard

          return (
            <NavLink
              key={item.label}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              to={item.to}
              end={item.end}
              title={item.label}
              aria-label={item.label}
            >
              <span className="nav-item__icon">
                <Icon size={18} strokeWidth={2.1} />
              </span>
              {!isCollapsed ? <span className="nav-item__label">{item.label}</span> : null}
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-user__avatar">IA</span>
      </div>
    </aside>
  )
}

export default Sidebar
