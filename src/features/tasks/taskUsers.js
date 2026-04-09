export const TASK_MOCK_USERS = Object.freeze([
  { id: 'u-camila', name: 'Camila Souza', email: 'camila.souza@crm.local' },
  { id: 'u-rafael', name: 'Rafael Lima', email: 'rafael.lima@crm.local' },
  { id: 'u-juliana', name: 'Juliana Duarte', email: 'juliana.duarte@crm.local' },
  { id: 'u-felipe', name: 'Felipe Assis', email: 'felipe.assis@crm.local' },
  { id: 'u-bianca', name: 'Bianca Teixeira', email: 'bianca.teixeira@crm.local' },
])

function normalizeUser(user) {
  if (!user) {
    return null
  }

  const id = user.id ?? user.userId ?? null
  const email = user.email ?? ''
  const name = user.name ?? user.fullName ?? (email ? email.split('@')[0] : 'CRM User')

  if (!id && !email) {
    return null
  }

  return {
    id: id ? String(id) : email,
    name: String(name),
    email: String(email || ''),
  }
}

export function getTaskAssigneeUsers(currentUser) {
  const users = []

  const normalizedCurrentUser = normalizeUser(currentUser)
  if (normalizedCurrentUser) {
    users.push(normalizedCurrentUser)
  }

  TASK_MOCK_USERS.forEach((mockUser) => {
    const normalizedMockUser = normalizeUser(mockUser)
    if (!normalizedMockUser) {
      return
    }

    if (users.some((user) => user.id === normalizedMockUser.id)) {
      return
    }

    users.push(normalizedMockUser)
  })

  return users
}

export function getTaskAssigneeOptions(currentUser) {
  return getTaskAssigneeUsers(currentUser).map((user) => ({
    value: user.id,
    label: user.name,
    description: user.email,
  }))
}

export default TASK_MOCK_USERS
