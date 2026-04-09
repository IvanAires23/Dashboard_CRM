export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  MANAGER: 'manager',
  SALES: 'sales',
  SUPPORT: 'support',
})

export const USER_ROLE_LIST = Object.freeze(Object.values(USER_ROLES))

export function isValidUserRole(role) {
  return USER_ROLE_LIST.includes(role)
}
