import { createAppError } from '../lib/errors/normalizeError.js'

const STORAGE_KEY = 'crm-demo-store-v1'
const LATENCY_MS = 90

const INITIAL_STATE = Object.freeze({
  users: [
    { id: 'u-camila', name: 'Camila Souza', email: 'camila.souza@crm.local' },
    { id: 'u-rafael', name: 'Rafael Lima', email: 'rafael.lima@crm.local' },
    { id: 'u-juliana', name: 'Juliana Duarte', email: 'juliana.duarte@crm.local' },
    { id: 'u-felipe', name: 'Felipe Assis', email: 'felipe.assis@crm.local' },
    { id: 'u-bianca', name: 'Bianca Teixeira', email: 'bianca.teixeira@crm.local' },
  ],
  accounts: [
    {
      id: 'acc-1',
      name: 'Helix Commerce',
      industry: 'Retail',
      size: 240,
      website: 'https://helixcommerce.com',
      createdAt: '2026-02-12T09:00:00.000Z',
      updatedAt: '2026-03-20T09:00:00.000Z',
    },
    {
      id: 'acc-2',
      name: 'NorthBridge',
      industry: 'Fintech',
      size: 180,
      website: 'https://northbridge.io',
      createdAt: '2026-01-21T13:00:00.000Z',
      updatedAt: '2026-03-24T13:00:00.000Z',
    },
    {
      id: 'acc-3',
      name: 'Solara AI',
      industry: 'Technology',
      size: 90,
      website: 'https://solara.ai',
      createdAt: '2026-03-01T11:00:00.000Z',
      updatedAt: '2026-04-03T11:00:00.000Z',
    },
  ],
  contacts: [
    {
      id: 'con-1',
      name: 'Marina Duarte',
      email: 'marina@helix.com',
      phone: '+55 85 90000-1111',
      accountId: 'acc-1',
      createdAt: '2026-02-14T10:00:00.000Z',
      updatedAt: '2026-03-14T10:00:00.000Z',
    },
    {
      id: 'con-2',
      name: 'Paulo Nunes',
      email: 'paulo@northbridge.io',
      phone: '+55 11 90000-2222',
      accountId: 'acc-2',
      createdAt: '2026-01-28T10:00:00.000Z',
      updatedAt: '2026-03-18T10:00:00.000Z',
    },
    {
      id: 'con-3',
      name: 'Renata Alves',
      email: 'renata@solara.ai',
      phone: '+55 21 90000-3333',
      accountId: 'acc-3',
      createdAt: '2026-03-02T10:00:00.000Z',
      updatedAt: '2026-04-04T10:00:00.000Z',
    },
  ],
  leads: [
    {
      id: 'lead-1',
      name: 'Ana Souza',
      email: 'ana.souza@helix.com',
      phone: '+55 85 98888-1001',
      company: 'Helix Commerce',
      status: 'qualified',
      source: 'website',
      createdAt: '2026-03-10T10:00:00.000Z',
      updatedAt: '2026-03-15T14:20:00.000Z',
    },
    {
      id: 'lead-2',
      name: 'Bruno Costa',
      email: 'bruno.costa@northbridge.io',
      phone: '+55 11 97777-2002',
      company: 'NorthBridge',
      status: 'contacted',
      source: 'referral',
      createdAt: '2026-03-18T09:30:00.000Z',
      updatedAt: '2026-03-21T11:15:00.000Z',
    },
    {
      id: 'lead-3',
      name: 'Carla Mota',
      email: 'carla.mota@solara.ai',
      phone: '+55 21 96666-3003',
      company: 'Solara AI',
      status: 'new',
      source: 'event',
      createdAt: '2026-04-01T08:10:00.000Z',
      updatedAt: '2026-04-01T08:10:00.000Z',
    },
  ],
  deals: [
    {
      id: 'deal-1',
      title: 'Helix Expansion',
      value: 45000,
      stage: 'proposal',
      accountId: 'acc-1',
      contactId: 'con-1',
      owner: 'Camila Souza',
      expectedCloseDate: '2026-05-10',
      createdAt: '2026-02-20T09:00:00.000Z',
      updatedAt: '2026-04-01T10:00:00.000Z',
    },
    {
      id: 'deal-2',
      title: 'NorthBridge Onboarding',
      value: 78000,
      stage: 'negotiation',
      accountId: 'acc-2',
      contactId: 'con-2',
      owner: 'Rafael Lima',
      expectedCloseDate: '2026-04-28',
      createdAt: '2026-02-05T09:00:00.000Z',
      updatedAt: '2026-03-30T12:00:00.000Z',
    },
    {
      id: 'deal-3',
      title: 'Solara Annual Contract',
      value: 120000,
      stage: 'closed-won',
      accountId: 'acc-3',
      contactId: 'con-3',
      owner: 'Juliana Duarte',
      expectedCloseDate: '2026-03-15',
      createdAt: '2026-01-18T09:00:00.000Z',
      updatedAt: '2026-03-15T17:30:00.000Z',
    },
    {
      id: 'deal-4',
      title: 'Helix Renewal',
      value: 32000,
      stage: 'qualified',
      accountId: 'acc-1',
      contactId: 'con-1',
      owner: 'Camila Souza',
      expectedCloseDate: '2026-06-05',
      createdAt: '2026-03-12T09:00:00.000Z',
      updatedAt: '2026-04-05T09:00:00.000Z',
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Prepare proposal for Helix',
      description: 'Finalize pricing and send commercial proposal.',
      dueDate: '2026-04-12',
      priority: 'high',
      status: 'in-progress',
      assignedUserId: 'u-camila',
      createdAt: '2026-04-03T08:00:00.000Z',
      updatedAt: '2026-04-07T09:20:00.000Z',
    },
    {
      id: 'task-2',
      title: 'Follow-up NorthBridge legal review',
      description: 'Collect feedback from legal and align contract changes.',
      dueDate: '2026-04-18',
      priority: 'medium',
      status: 'todo',
      assignedUserId: 'u-rafael',
      createdAt: '2026-04-01T08:00:00.000Z',
      updatedAt: '2026-04-06T10:15:00.000Z',
    },
    {
      id: 'task-3',
      title: 'Schedule Q2 check-in with Solara',
      description: 'Coordinate agenda and stakeholder availability.',
      dueDate: '2026-04-24',
      priority: 'low',
      status: 'done',
      assignedUserId: 'u-juliana',
      createdAt: '2026-03-28T08:00:00.000Z',
      updatedAt: '2026-04-04T16:40:00.000Z',
    },
  ],
  leadActivities: {},
  contactInteractions: {},
  dealTimeline: {},
})

let memoryState = null

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function delay(ms = LATENCY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function readStoredState() {
  if (!canUseStorage()) {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function writeStoredState(state) {
  if (!canUseStorage()) {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // no-op
  }
}

function getState() {
  if (memoryState) {
    return memoryState
  }

  const storedState = readStoredState()
  memoryState = storedState ? storedState : clone(INITIAL_STATE)
  if (!storedState) {
    writeStoredState(memoryState)
  }

  return memoryState
}

function saveState(nextState) {
  memoryState = nextState
  writeStoredState(nextState)
}

function resetState() {
  const nextState = clone(INITIAL_STATE)
  saveState(nextState)
  return clone(nextState)
}

function toId(value) {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

function createNotFoundError(entityLabel, entityId) {
  return createAppError({
    name: 'HttpError',
    code: 'HTTP_ERROR',
    status: 404,
    message: `${entityLabel} ${entityId} was not found.`,
  })
}

function buildId(prefix, items) {
  const max = items.reduce((highest, item) => {
    const value = toId(item?.id)
    const numericToken = Number.parseInt(value.replace(`${prefix}-`, ''), 10)
    if (!Number.isFinite(numericToken)) {
      return highest
    }

    return Math.max(highest, numericToken)
  }, 0)

  return `${prefix}-${max + 1}`
}

function nowIso() {
  return new Date().toISOString()
}

function getAccountIndex(state) {
  return new Map(state.accounts.map((account) => [toId(account.id), account]))
}

function getContactIndex(state) {
  return new Map(state.contacts.map((contact) => [toId(contact.id), contact]))
}

function getUserIndex(state) {
  return new Map(state.users.map((user) => [toId(user.id), user]))
}

function withAccountDetails(contact, accountIndex) {
  const accountId = toId(contact?.accountId)
  const account = accountIndex.get(accountId)

  return {
    ...contact,
    accountId,
    account: account
      ? {
          id: account.id,
          name: account.name,
        }
      : null,
    company: account?.name ?? '',
  }
}

function withDealDetails(deal, accountIndex, contactIndex) {
  const accountId = toId(deal?.accountId)
  const contactId = toId(deal?.contactId)
  const account = accountIndex.get(accountId)
  const contact = contactIndex.get(contactId)

  return {
    ...deal,
    accountId,
    contactId,
    account: account
      ? {
          id: account.id,
          name: account.name,
        }
      : deal.account ?? '',
    contact: contact?.name ?? deal.contact ?? '',
  }
}

function withTaskDetails(task, userIndex) {
  const assignedUserId = toId(task?.assignedUserId ?? task?.ownerId ?? task?.assigneeId)
  const assignedUser = userIndex.get(assignedUserId) ?? null

  return {
    ...task,
    assignedUserId,
    ownerId: assignedUserId,
    assigneeId: assignedUserId,
    assignedUser,
    owner: assignedUser?.name ?? task?.owner ?? '',
  }
}

function normalizeList(items = []) {
  return [...items].sort((left, right) => {
    const leftDate = new Date(left?.updatedAt ?? left?.createdAt ?? 0).getTime()
    const rightDate = new Date(right?.updatedAt ?? right?.createdAt ?? 0).getTime()
    return rightDate - leftDate
  })
}

function resolveEntity(items, entityId, entityLabel) {
  const normalizedEntityId = toId(entityId)
  const entity = items.find((item) => toId(item.id) === normalizedEntityId)

  if (!entity) {
    throw createNotFoundError(entityLabel, normalizedEntityId)
  }

  return entity
}

async function listLeads() {
  await delay()
  const state = getState()
  return clone(normalizeList(state.leads))
}

async function getLead(leadId) {
  await delay()
  const state = getState()
  return clone(resolveEntity(state.leads, leadId, 'Lead'))
}

async function createLeadRecord(payload = {}) {
  await delay()
  const state = getState()
  const createdAt = nowIso()
  const lead = {
    id: buildId('lead', state.leads),
    ...payload,
    createdAt,
    updatedAt: createdAt,
  }

  const nextState = {
    ...state,
    leads: [lead, ...state.leads],
  }
  saveState(nextState)
  return clone(lead)
}

async function updateLeadRecord(leadId, payload = {}) {
  await delay()
  const state = getState()
  const normalizedEntityId = toId(leadId)
  const current = resolveEntity(state.leads, normalizedEntityId, 'Lead')
  const updated = {
    ...current,
    ...payload,
    id: current.id,
    updatedAt: nowIso(),
  }

  const nextState = {
    ...state,
    leads: state.leads.map((lead) => (toId(lead.id) === normalizedEntityId ? updated : lead)),
  }
  saveState(nextState)
  return clone(updated)
}

async function deleteLeadRecord(leadId) {
  await delay()
  const state = getState()
  const normalizedEntityId = toId(leadId)
  const nextState = {
    ...state,
    leads: state.leads.filter((lead) => toId(lead.id) !== normalizedEntityId),
  }
  saveState(nextState)
  return { success: true }
}

async function convertLeadRecord(leadId, payload = {}) {
  await delay()
  const lead = await getLead(leadId)
  const state = getState()
  const createdAt = nowIso()
  const newDeal = {
    id: buildId('deal', state.deals),
    title: payload.title ?? `${lead.company} opportunity`,
    value: Number(payload.value ?? 10000),
    stage: payload.stage ?? 'new-lead',
    accountId: payload.accountId ?? '',
    contactId: payload.contactId ?? '',
    owner: payload.owner ?? 'CRM User',
    expectedCloseDate: payload.expectedCloseDate ?? new Date().toISOString().slice(0, 10),
    createdAt,
    updatedAt: createdAt,
  }

  const nextState = {
    ...state,
    leads: state.leads.map((entry) =>
      toId(entry.id) === toId(leadId)
        ? {
            ...entry,
            status: 'qualified',
            updatedAt: nowIso(),
          }
        : entry,
    ),
    deals: [newDeal, ...state.deals],
  }
  saveState(nextState)

  return clone({
    lead: nextState.leads.find((entry) => toId(entry.id) === toId(leadId)),
    deal: newDeal,
  })
}

async function listAccounts() {
  await delay()
  const state = getState()
  return clone(normalizeList(state.accounts))
}

async function getAccount(accountId) {
  await delay()
  const state = getState()
  return clone(resolveEntity(state.accounts, accountId, 'Account'))
}

async function createAccountRecord(payload = {}) {
  await delay()
  const state = getState()
  const createdAt = nowIso()
  const account = {
    id: buildId('acc', state.accounts),
    ...payload,
    createdAt,
    updatedAt: createdAt,
  }

  const nextState = {
    ...state,
    accounts: [account, ...state.accounts],
  }
  saveState(nextState)
  return clone(account)
}

async function updateAccountRecord(accountId, payload = {}) {
  await delay()
  const state = getState()
  const normalizedEntityId = toId(accountId)
  const current = resolveEntity(state.accounts, normalizedEntityId, 'Account')
  const updated = {
    ...current,
    ...payload,
    id: current.id,
    updatedAt: nowIso(),
  }

  const nextState = {
    ...state,
    accounts: state.accounts.map((account) => (toId(account.id) === normalizedEntityId ? updated : account)),
  }
  saveState(nextState)
  return clone(updated)
}

async function deleteAccountRecord(accountId) {
  await delay()
  const state = getState()
  const normalizedEntityId = toId(accountId)
  const nextState = {
    ...state,
    accounts: state.accounts.filter((account) => toId(account.id) !== normalizedEntityId),
  }
  saveState(nextState)
  return { success: true }
}

async function listContacts() {
  await delay()
  const state = getState()
  const accountIndex = getAccountIndex(state)
  const contacts = normalizeList(state.contacts).map((entry) => withAccountDetails(entry, accountIndex))
  return clone(contacts)
}

async function getContact(contactId) {
  await delay()
  const state = getState()
  const accountIndex = getAccountIndex(state)
  const contact = resolveEntity(state.contacts, contactId, 'Contact')
  return clone(withAccountDetails(contact, accountIndex))
}

async function createContactRecord(payload = {}) {
  await delay()
  const state = getState()
  const createdAt = nowIso()
  const contact = {
    id: buildId('con', state.contacts),
    ...payload,
    createdAt,
    updatedAt: createdAt,
  }

  const nextState = {
    ...state,
    contacts: [contact, ...state.contacts],
  }
  saveState(nextState)
  return getContact(contact.id)
}

async function updateContactRecord(contactId, payload = {}) {
  await delay()
  const state = getState()
  const normalizedEntityId = toId(contactId)
  const current = resolveEntity(state.contacts, normalizedEntityId, 'Contact')
  const updated = {
    ...current,
    ...payload,
    id: current.id,
    updatedAt: nowIso(),
  }

  const nextState = {
    ...state,
    contacts: state.contacts.map((contact) => (toId(contact.id) === normalizedEntityId ? updated : contact)),
  }
  saveState(nextState)
  return getContact(updated.id)
}

async function deleteContactRecord(contactId) {
  await delay()
  const state = getState()
  const normalizedEntityId = toId(contactId)
  const nextState = {
    ...state,
    contacts: state.contacts.filter((contact) => toId(contact.id) !== normalizedEntityId),
  }
  saveState(nextState)
  return { success: true }
}

async function listDeals() {
  await delay()
  const state = getState()
  const accountIndex = getAccountIndex(state)
  const contactIndex = getContactIndex(state)
  const deals = normalizeList(state.deals).map((entry) =>
    withDealDetails(entry, accountIndex, contactIndex),
  )
  return clone(deals)
}

async function getDeal(dealId) {
  await delay()
  const state = getState()
  const accountIndex = getAccountIndex(state)
  const contactIndex = getContactIndex(state)
  const deal = resolveEntity(state.deals, dealId, 'Deal')
  return clone(withDealDetails(deal, accountIndex, contactIndex))
}

async function createDealRecord(payload = {}) {
  await delay()
  const state = getState()
  const createdAt = nowIso()
  const deal = {
    id: buildId('deal', state.deals),
    ...payload,
    value: Number(payload.value ?? payload.amount ?? 0),
    createdAt,
    updatedAt: createdAt,
  }

  const nextState = {
    ...state,
    deals: [deal, ...state.deals],
  }
  saveState(nextState)
  return getDeal(deal.id)
}

async function updateDealRecord(dealId, payload = {}) {
  await delay()
  const state = getState()
  const normalizedEntityId = toId(dealId)
  const current = resolveEntity(state.deals, normalizedEntityId, 'Deal')
  const updated = {
    ...current,
    ...payload,
    id: current.id,
    value: Number(payload.value ?? payload.amount ?? current.value ?? 0),
    updatedAt: nowIso(),
  }

  const nextState = {
    ...state,
    deals: state.deals.map((deal) => (toId(deal.id) === normalizedEntityId ? updated : deal)),
  }
  saveState(nextState)
  return getDeal(updated.id)
}

async function deleteDealRecord(dealId) {
  await delay()
  const state = getState()
  const normalizedEntityId = toId(dealId)
  const nextState = {
    ...state,
    deals: state.deals.filter((deal) => toId(deal.id) !== normalizedEntityId),
  }
  saveState(nextState)
  return { success: true }
}

async function moveDealStageRecord(dealId, stageId) {
  return updateDealRecord(dealId, {
    stage: stageId,
    stageId,
  })
}

async function listTasks() {
  await delay()
  const state = getState()
  const userIndex = getUserIndex(state)
  const tasks = normalizeList(state.tasks).map((task) => withTaskDetails(task, userIndex))
  return clone(tasks)
}

async function getTask(taskId) {
  await delay()
  const state = getState()
  const userIndex = getUserIndex(state)
  const task = resolveEntity(state.tasks, taskId, 'Task')
  return clone(withTaskDetails(task, userIndex))
}

async function createTaskRecord(payload = {}) {
  await delay()
  const state = getState()
  const createdAt = nowIso()
  const task = {
    id: buildId('task', state.tasks),
    ...payload,
    createdAt,
    updatedAt: createdAt,
  }

  const nextState = {
    ...state,
    tasks: [task, ...state.tasks],
  }
  saveState(nextState)
  return getTask(task.id)
}

async function updateTaskRecord(taskId, payload = {}) {
  await delay()
  const state = getState()
  const normalizedEntityId = toId(taskId)
  const current = resolveEntity(state.tasks, normalizedEntityId, 'Task')
  const updated = {
    ...current,
    ...payload,
    id: current.id,
    updatedAt: nowIso(),
  }

  const nextState = {
    ...state,
    tasks: state.tasks.map((task) => (toId(task.id) === normalizedEntityId ? updated : task)),
  }
  saveState(nextState)
  return getTask(updated.id)
}

async function deleteTaskRecord(taskId) {
  await delay()
  const state = getState()
  const normalizedEntityId = toId(taskId)
  const nextState = {
    ...state,
    tasks: state.tasks.filter((task) => toId(task.id) !== normalizedEntityId),
  }
  saveState(nextState)
  return { success: true }
}

async function assignTaskRecord(taskId, ownerId) {
  return updateTaskRecord(taskId, {
    assignedUserId: ownerId,
    ownerId,
    assigneeId: ownerId,
  })
}

async function completeTaskRecord(taskId) {
  return updateTaskRecord(taskId, {
    status: 'done',
  })
}

async function reopenTaskRecord(taskId) {
  return updateTaskRecord(taskId, {
    status: 'todo',
  })
}

async function getAccountContactsRecord(accountId) {
  const contacts = await listContacts()
  const filtered = contacts.filter((contact) => toId(contact.accountId) === toId(accountId))
  return clone(filtered)
}

async function getAccountMetricsRecord(accountId) {
  await delay()
  const state = getState()
  const normalizedAccountId = toId(accountId)
  const dealCount = state.deals.filter((deal) => toId(deal.accountId) === normalizedAccountId).length
  const contactCount = state.contacts.filter((contact) => toId(contact.accountId) === normalizedAccountId).length
  const pipelineValue = state.deals
    .filter((deal) => toId(deal.accountId) === normalizedAccountId)
    .reduce((total, deal) => total + Number(deal.value ?? 0), 0)

  return {
    dealCount,
    contactCount,
    pipelineValue,
  }
}

async function getLeadActivitiesRecord(leadId) {
  await delay()
  const state = getState()
  return clone(state.leadActivities[toId(leadId)] ?? [])
}

async function getContactInteractionsRecord(contactId) {
  await delay()
  const state = getState()
  return clone(state.contactInteractions[toId(contactId)] ?? [])
}

async function addContactInteractionRecord(contactId, payload = {}) {
  await delay()
  const state = getState()
  const normalizedContactId = toId(contactId)
  const currentInteractions = state.contactInteractions[normalizedContactId] ?? []
  const interaction = {
    id: `interaction-${currentInteractions.length + 1}`,
    ...payload,
    createdAt: nowIso(),
  }

  const nextState = {
    ...state,
    contactInteractions: {
      ...state.contactInteractions,
      [normalizedContactId]: [interaction, ...currentInteractions],
    },
  }
  saveState(nextState)

  return clone(interaction)
}

async function getDealTimelineRecord(dealId) {
  await delay()
  const state = getState()
  return clone(state.dealTimeline[toId(dealId)] ?? [])
}

export const mockCrmStore = {
  getLeads: listLeads,
  getLeadById: getLead,
  createLead: createLeadRecord,
  updateLead: updateLeadRecord,
  deleteLead: deleteLeadRecord,
  convertLead: convertLeadRecord,
  getLeadActivities: getLeadActivitiesRecord,

  getAccounts: listAccounts,
  getAccountById: getAccount,
  createAccount: createAccountRecord,
  updateAccount: updateAccountRecord,
  deleteAccount: deleteAccountRecord,
  getAccountContacts: getAccountContactsRecord,
  getAccountMetrics: getAccountMetricsRecord,

  getContacts: listContacts,
  getContactById: getContact,
  createContact: createContactRecord,
  updateContact: updateContactRecord,
  deleteContact: deleteContactRecord,
  getContactInteractions: getContactInteractionsRecord,
  addContactInteraction: addContactInteractionRecord,

  getDeals: listDeals,
  getDealById: getDeal,
  createDeal: createDealRecord,
  updateDeal: updateDealRecord,
  deleteDeal: deleteDealRecord,
  moveDealStage: moveDealStageRecord,
  getDealTimeline: getDealTimelineRecord,

  getTasks: listTasks,
  getTaskById: getTask,
  createTask: createTaskRecord,
  updateTask: updateTaskRecord,
  deleteTask: deleteTaskRecord,
  completeTask: completeTaskRecord,
  reopenTask: reopenTaskRecord,
  assignTask: assignTaskRecord,

  reset: async () => {
    await delay()
    return resetState()
  },
}

export default mockCrmStore
