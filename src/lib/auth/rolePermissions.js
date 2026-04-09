import { USER_ROLES, isValidUserRole } from '../constants/userRoles.js'
import {
  ACTION_PERMISSIONS,
  ALL_PERMISSIONS,
  FEATURE_PERMISSIONS,
  MODULE_PAGE_PERMISSIONS,
  PAGE_PERMISSIONS,
} from './permissions.js'

const rolePermissions = {
  [USER_ROLES.ADMIN]: [...ALL_PERMISSIONS],

  [USER_ROLES.MANAGER]: [
    PAGE_PERMISSIONS.DASHBOARD_VIEW,
    PAGE_PERMISSIONS.DEALS_VIEW,
    PAGE_PERMISSIONS.ACCOUNTS_VIEW,
    PAGE_PERMISSIONS.CONTACTS_VIEW,
    PAGE_PERMISSIONS.TASKS_VIEW,
    PAGE_PERMISSIONS.CALENDAR_VIEW,
    PAGE_PERMISSIONS.SETTINGS_VIEW,
    ACTION_PERMISSIONS.DEALS_CREATE,
    ACTION_PERMISSIONS.DEALS_UPDATE,
    ACTION_PERMISSIONS.ACCOUNTS_UPDATE,
    ACTION_PERMISSIONS.CONTACTS_UPDATE,
    ACTION_PERMISSIONS.TASKS_MANAGE,
    FEATURE_PERMISSIONS.ADVANCED_REPORTS,
    FEATURE_PERMISSIONS.PIPELINE_AUTOMATIONS,
    FEATURE_PERMISSIONS.BULK_TASK_OPERATIONS,
  ],

  [USER_ROLES.SALES]: [
    PAGE_PERMISSIONS.DASHBOARD_VIEW,
    PAGE_PERMISSIONS.DEALS_VIEW,
    PAGE_PERMISSIONS.ACCOUNTS_VIEW,
    PAGE_PERMISSIONS.CONTACTS_VIEW,
    PAGE_PERMISSIONS.TASKS_VIEW,
    PAGE_PERMISSIONS.CALENDAR_VIEW,
    ACTION_PERMISSIONS.DEALS_CREATE,
    ACTION_PERMISSIONS.DEALS_UPDATE,
    ACTION_PERMISSIONS.CONTACTS_UPDATE,
    ACTION_PERMISSIONS.TASKS_MANAGE,
  ],

  [USER_ROLES.SUPPORT]: [
    PAGE_PERMISSIONS.DASHBOARD_VIEW,
    PAGE_PERMISSIONS.ACCOUNTS_VIEW,
    PAGE_PERMISSIONS.CONTACTS_VIEW,
    PAGE_PERMISSIONS.TASKS_VIEW,
    PAGE_PERMISSIONS.CALENDAR_VIEW,
    ACTION_PERMISSIONS.CONTACTS_UPDATE,
    ACTION_PERMISSIONS.TASKS_MANAGE,
    FEATURE_PERMISSIONS.BULK_TASK_OPERATIONS,
  ],
}

export const ROLE_PERMISSIONS = Object.freeze(
  Object.fromEntries(
    Object.entries(rolePermissions).map(([role, permissions]) => [
      role,
      Object.freeze([...new Set(permissions)]),
    ]),
  ),
)

function extractRole(roleOrUser) {
  if (!roleOrUser) {
    return null
  }

  if (typeof roleOrUser === 'string') {
    return roleOrUser
  }

  return roleOrUser.role ?? null
}

export function getRolePermissions(roleOrUser) {
  const role = extractRole(roleOrUser)
  if (!isValidUserRole(role)) {
    return []
  }

  return ROLE_PERMISSIONS[role] ?? []
}

export function hasPermission(roleOrUser, permission) {
  return getRolePermissions(roleOrUser).includes(permission)
}

export function canAccessModule(roleOrUser, moduleKey) {
  const requiredPermission = MODULE_PAGE_PERMISSIONS[moduleKey]
  if (!requiredPermission) {
    return false
  }

  return hasPermission(roleOrUser, requiredPermission)
}

export function canAccessAnyModule(roleOrUser, moduleKeys = []) {
  return moduleKeys.some((moduleKey) => canAccessModule(roleOrUser, moduleKey))
}
