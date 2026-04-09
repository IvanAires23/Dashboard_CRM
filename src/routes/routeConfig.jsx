import AccountDetailPage from '../features/accounts/pages/AccountDetailPage.jsx'
import AccountFormPage from '../features/accounts/pages/AccountFormPage.jsx'
import AccountsListPage from '../features/accounts/pages/AccountsListPage.jsx'
import LoginPage from '../features/auth/pages/LoginPage.jsx'
import CalendarPage from '../features/calendar/pages/CalendarPage.jsx'
import ContactDetailPage from '../features/contacts/pages/ContactDetailPage.jsx'
import ContactFormPage from '../features/contacts/pages/ContactFormPage.jsx'
import ContactsListPage from '../features/contacts/pages/ContactsListPage.jsx'
import DashboardPage from '../features/dashboard/pages/DashboardPage.jsx'
import DealDetailPage from '../features/deals/pages/DealDetailPage.jsx'
import DealFormPage from '../features/deals/pages/DealFormPage.jsx'
import DealsListPage from '../features/deals/pages/DealsListPage.jsx'
import PipelinePage from '../features/deals/pages/PipelinePage.jsx'
import LeadDetailPage from '../features/leads/pages/LeadDetailPage.jsx'
import LeadFormPage from '../features/leads/pages/LeadFormPage.jsx'
import LeadsListPage from '../features/leads/pages/LeadsListPage.jsx'
import SettingsPage from '../features/settings/pages/SettingsPage.jsx'
import TaskDetailPage from '../features/tasks/pages/TaskDetailPage.jsx'
import TaskFormPage from '../features/tasks/pages/TaskFormPage.jsx'
import TasksListPage from '../features/tasks/pages/TasksListPage.jsx'

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
    element: <DealsListPage />,
  },
  {
    path: '/deals/new',
    moduleKey: 'deals',
    title: 'Create deal',
    subtitle: 'Add a new opportunity with stage, value and close date.',
    element: <DealFormPage />,
    showInNav: false,
  },
  {
    path: '/deals/pipeline',
    moduleKey: 'deals',
    title: 'Pipeline board',
    subtitle: 'Visualize opportunities grouped by stage.',
    element: <PipelinePage />,
    showInNav: false,
  },
  {
    path: '/deals/:dealId',
    moduleKey: 'deals',
    title: 'Deal details',
    subtitle: 'Review opportunity information and activity context.',
    element: <DealDetailPage />,
    showInNav: false,
  },
  {
    path: '/deals/:dealId/edit',
    moduleKey: 'deals',
    title: 'Edit deal',
    subtitle: 'Update opportunity details and pipeline stage.',
    element: <DealFormPage />,
    showInNav: false,
  },
  {
    path: '/leads',
    moduleKey: 'deals',
    label: 'Leads',
    title: 'Leads',
    subtitle: 'Manage lead lifecycle, qualification and attribution.',
    element: <LeadsListPage />,
    end: true,
  },
  {
    path: '/leads/new',
    moduleKey: 'deals',
    title: 'Create lead',
    subtitle: 'Add a new lead to the pipeline.',
    element: <LeadFormPage />,
    showInNav: false,
  },
  {
    path: '/leads/:leadId',
    moduleKey: 'deals',
    title: 'Lead details',
    subtitle: 'Review lead profile and qualification context.',
    element: <LeadDetailPage />,
    showInNav: false,
  },
  {
    path: '/leads/:leadId/edit',
    moduleKey: 'deals',
    title: 'Edit lead',
    subtitle: 'Update lead profile, status and source.',
    element: <LeadFormPage />,
    showInNav: false,
  },
  {
    path: '/accounts',
    moduleKey: 'accounts',
    label: 'Accounts',
    title: 'Accounts',
    subtitle: 'Track portfolio health, owners and renewals.',
    element: <AccountsListPage />,
  },
  {
    path: '/accounts/new',
    moduleKey: 'accounts',
    title: 'Create account',
    subtitle: 'Add a new organization profile for relationship tracking.',
    element: <AccountFormPage />,
    showInNav: false,
  },
  {
    path: '/accounts/:accountId',
    moduleKey: 'accounts',
    title: 'Account details',
    subtitle: 'Review organization profile information.',
    element: <AccountDetailPage />,
    showInNav: false,
  },
  {
    path: '/accounts/:accountId/edit',
    moduleKey: 'accounts',
    title: 'Edit account',
    subtitle: 'Update organization profile and account details.',
    element: <AccountFormPage />,
    showInNav: false,
  },
  {
    path: '/contacts',
    moduleKey: 'contacts',
    label: 'Contacts',
    title: 'Contacts',
    subtitle: 'Maintain stakeholder context and relationship history.',
    element: <ContactsListPage />,
  },
  {
    path: '/contacts/new',
    moduleKey: 'contacts',
    title: 'Create contact',
    subtitle: 'Add a stakeholder and link them to an account.',
    element: <ContactFormPage />,
    showInNav: false,
  },
  {
    path: '/contacts/:contactId',
    moduleKey: 'contacts',
    title: 'Contact details',
    subtitle: 'Review stakeholder information and account relation.',
    element: <ContactDetailPage />,
    showInNav: false,
  },
  {
    path: '/contacts/:contactId/edit',
    moduleKey: 'contacts',
    title: 'Edit contact',
    subtitle: 'Update stakeholder profile and account relation.',
    element: <ContactFormPage />,
    showInNav: false,
  },
  {
    path: '/tasks',
    moduleKey: 'tasks',
    label: 'Tasks',
    title: 'Tasks',
    subtitle: 'Organize follow-ups and execution queues.',
    element: <TasksListPage />,
  },
  {
    path: '/tasks/new',
    moduleKey: 'tasks',
    title: 'Create task',
    subtitle: 'Create work items and assign ownership.',
    element: <TaskFormPage />,
    showInNav: false,
  },
  {
    path: '/tasks/:taskId',
    moduleKey: 'tasks',
    title: 'Task details',
    subtitle: 'Review assignment, schedule and progress context.',
    element: <TaskDetailPage />,
    showInNav: false,
  },
  {
    path: '/tasks/:taskId/edit',
    moduleKey: 'tasks',
    title: 'Edit task',
    subtitle: 'Update progress, due dates and assignment.',
    element: <TaskFormPage />,
    showInNav: false,
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

export const appNavigation = privateRoutes
  .filter((route) => route.showInNav !== false)
  .map(({ path, label, end }) => ({
    to: path,
    label,
    end,
  }))
