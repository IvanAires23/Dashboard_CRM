import AccountsPage from '../features/accounts/pages/AccountsPage.jsx'
import LoginPage from '../features/auth/pages/LoginPage.jsx'
import CalendarPage from '../features/calendar/pages/CalendarPage.jsx'
import ContactsPage from '../features/contacts/pages/ContactsPage.jsx'
import DashboardPage from '../features/dashboard/pages/DashboardPage.jsx'
import DealsPage from '../features/deals/pages/DealsPage.jsx'
import SettingsPage from '../features/settings/pages/SettingsPage.jsx'
import TasksPage from '../features/tasks/pages/TasksPage.jsx'

export const publicRoutes = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]

export const privateRoutes = [
  {
    path: '/dashboard',
    moduleKey: 'dashboard',
    label: 'Overview',
    title: 'Dashboard',
    subtitle: "Welcome back. Here's your sales overview.",
    element: <DashboardPage />,
    end: true,
  },
  {
    path: '/deals',
    moduleKey: 'deals',
    label: 'Deals',
    title: 'Deals',
    subtitle: 'Manage pipeline, stages and revenue movement.',
    element: <DealsPage />,
  },
  {
    path: '/accounts',
    moduleKey: 'accounts',
    label: 'Accounts',
    title: 'Accounts',
    subtitle: 'Track portfolio health, owners and renewals.',
    element: <AccountsPage />,
  },
  {
    path: '/contacts',
    moduleKey: 'contacts',
    label: 'Contacts',
    title: 'Contacts',
    subtitle: 'Maintain stakeholder context and relationship history.',
    element: <ContactsPage />,
  },
  {
    path: '/tasks',
    moduleKey: 'tasks',
    label: 'Tasks',
    title: 'Tasks',
    subtitle: 'Organize follow-ups and execution queues.',
    element: <TasksPage />,
  },
  {
    path: '/calendar',
    moduleKey: 'calendar',
    label: 'Calendar',
    title: 'Calendar',
    subtitle: 'Coordinate meetings, follow-ups and team schedules.',
    element: <CalendarPage />,
  },
  {
    path: '/settings',
    moduleKey: 'settings',
    label: 'Settings',
    title: 'Settings',
    subtitle: 'Configure workspace preferences and operations.',
    element: <SettingsPage />,
  },
]

export const appNavigation = privateRoutes.map(({ path, label, end }) => ({
  to: path,
  label,
  end,
}))
