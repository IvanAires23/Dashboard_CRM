export const PAGE_PERMISSIONS = Object.freeze({
  DASHBOARD_VIEW: 'page:dashboard:view',
  DEALS_VIEW: 'page:deals:view',
  ACCOUNTS_VIEW: 'page:accounts:view',
  CONTACTS_VIEW: 'page:contacts:view',
  TASKS_VIEW: 'page:tasks:view',
  CALENDAR_VIEW: 'page:calendar:view',
  SETTINGS_VIEW: 'page:settings:view',
})

export const ACTION_PERMISSIONS = Object.freeze({
  DEALS_CREATE: 'action:deals:create',
  DEALS_UPDATE: 'action:deals:update',
  ACCOUNTS_UPDATE: 'action:accounts:update',
  CONTACTS_UPDATE: 'action:contacts:update',
  TASKS_MANAGE: 'action:tasks:manage',
  SETTINGS_MANAGE: 'action:settings:manage',
  USERS_MANAGE: 'action:users:manage',
})

export const FEATURE_PERMISSIONS = Object.freeze({
  ADVANCED_REPORTS: 'feature:advanced-reports',
  PIPELINE_AUTOMATIONS: 'feature:pipeline-automations',
  BULK_TASK_OPERATIONS: 'feature:bulk-task-operations',
})

export const MODULE_PAGE_PERMISSIONS = Object.freeze({
  dashboard: PAGE_PERMISSIONS.DASHBOARD_VIEW,
  deals: PAGE_PERMISSIONS.DEALS_VIEW,
  accounts: PAGE_PERMISSIONS.ACCOUNTS_VIEW,
  contacts: PAGE_PERMISSIONS.CONTACTS_VIEW,
  tasks: PAGE_PERMISSIONS.TASKS_VIEW,
  calendar: PAGE_PERMISSIONS.CALENDAR_VIEW,
  settings: PAGE_PERMISSIONS.SETTINGS_VIEW,
})

export const ALL_PERMISSIONS = Object.freeze([
  ...Object.values(PAGE_PERMISSIONS),
  ...Object.values(ACTION_PERMISSIONS),
  ...Object.values(FEATURE_PERMISSIONS),
])
