import { useState } from 'react'
import {
  Building2,
  CalendarRange,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Settings2,
  UserPlus,
  UsersRound,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth.js'

const navIcons = {
  Overview: LayoutDashboard,
  Deals: CircleDollarSign,
  Leads: UserPlus,
  Accounts: Building2,
  Contacts: UsersRound,
  Tasks: CheckCheck,
  Calendar: CalendarRange,
  Settings: Settings2,
}

function Sidebar({ isCollapsed, navigationItems, onToggle }) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const navigate = useNavigate()
  const { signOut, user } = useAuth()

  const userInitials = (user?.name || user?.email || 'IA')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase())
    .join('') || 'IA'

  const handleSignOut = async () => {
    if (isSigningOut) {
      return
    }

    setIsSigningOut(true)

    try {
      await signOut()
      navigate('/login', { replace: true })
    } finally {
      setIsSigningOut(false)
    }
  }

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
        <div className="sidebar-user">
          <span className="sidebar-user__avatar">{userInitials}</span>
          {!isCollapsed ? (
            <div className="sidebar-user__meta">
              <strong>{user?.name ?? 'CRM User'}</strong>
              <span>{user?.email ?? 'Active session'}</span>
            </div>
          ) : null}
        </div>

        <button
          aria-label="Sign out"
          className="sidebar-logout"
          disabled={isSigningOut}
          onClick={handleSignOut}
          title="Sign out"
          type="button"
        >
          <LogOut size={16} strokeWidth={2.1} />
          {!isCollapsed ? <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span> : null}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
