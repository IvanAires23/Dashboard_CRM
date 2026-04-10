import { extractCollection, resolveEntityId } from '../crm/entityUtils.js'
import { getAccounts } from '../../services/accounts.js'
import { getContacts } from '../../services/contacts.js'
import { getDeals } from '../../services/deals.js'
import { getLeads } from '../../services/leads.js'
import { getTasks } from '../../services/tasks.js'

function compact(values = []) {
  return values.filter((value) => value !== null && value !== undefined && String(value).trim() !== '')
}

function formatMoney(value) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return String(value ?? '').trim()
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(parsed)
}

function createEntity({
  moduleKey,
  moduleLabel,
  row,
  title,
  subtitle = '',
  meta = '',
  hrefBase,
  searchValues = [],
}) {
  const entityId = resolveEntityId(row)
  const normalizedTitle = String(title ?? '').trim()

  if (!normalizedTitle) {
    return null
  }

  return {
    id: `${moduleKey}:${entityId || normalizedTitle.toLowerCase().replace(/\s+/g, '-')}`,
    entityId,
    moduleKey,
    moduleLabel,
    title: normalizedTitle,
    subtitle: String(subtitle ?? '').trim(),
    meta: String(meta ?? '').trim(),
    href: entityId ? `${hrefBase}/${entityId}` : hrefBase,
    searchValues: compact(searchValues),
  }
}

function mapLeadEntity(row) {
  const title = row?.name ?? row?.email
  const subtitle = compact([row?.email, row?.company]).join(' - ')
  const meta = compact([row?.status, row?.source]).join(' - ')

  return createEntity({
    moduleKey: 'leads',
    moduleLabel: 'Leads',
    row,
    title,
    subtitle,
    meta,
    hrefBase: '/leads',
    searchValues: [
      title,
      row?.email,
      row?.phone,
      row?.company,
      row?.status,
      row?.source,
    ],
  })
}

function mapDealEntity(row) {
  const title = row?.title ?? row?.name
  const accountName = row?.account?.name ?? row?.account ?? row?.accountId
  const contactName = row?.contact?.name ?? row?.contact ?? row?.contactId
  const valueLabel = formatMoney(row?.value ?? row?.amount)
  const subtitle = compact([accountName, contactName]).join(' - ')
  const meta = compact([row?.stage ?? row?.pipelineStage, valueLabel]).join(' - ')

  return createEntity({
    moduleKey: 'deals',
    moduleLabel: 'Deals',
    row,
    title,
    subtitle,
    meta,
    hrefBase: '/deals',
    searchValues: [
      title,
      accountName,
      contactName,
      row?.stage,
      row?.pipelineStage,
      row?.owner?.name,
      valueLabel,
      row?.expectedCloseDate ?? row?.closeDate,
    ],
  })
}

function mapAccountEntity(row) {
  const title = row?.name
  const subtitle = compact([row?.industry ?? row?.segment, row?.website ?? row?.url]).join(' - ')
  const meta = compact([row?.size ?? row?.employeeCount ?? row?.employees]).join(' - ')

  return createEntity({
    moduleKey: 'accounts',
    moduleLabel: 'Accounts',
    row,
    title,
    subtitle,
    meta,
    hrefBase: '/accounts',
    searchValues: [
      title,
      row?.industry,
      row?.segment,
      row?.website,
      row?.url,
      row?.size,
    ],
  })
}

function mapContactEntity(row) {
  const title = row?.name ?? row?.fullName ?? row?.email
  const accountName = row?.account?.name ?? row?.company?.name ?? row?.accountId ?? row?.company
  const subtitle = compact([row?.email, row?.phone ?? row?.mobile]).join(' - ')
  const meta = compact([accountName]).join(' - ')

  return createEntity({
    moduleKey: 'contacts',
    moduleLabel: 'Contacts',
    row,
    title,
    subtitle,
    meta,
    hrefBase: '/contacts',
    searchValues: [
      title,
      row?.email,
      row?.phone,
      row?.mobile,
      accountName,
    ],
  })
}

function mapTaskEntity(row) {
  const title = row?.title ?? row?.name
  const assignee = row?.assignedUser?.name ?? row?.assignedUserId ?? row?.ownerId
  const subtitle = compact([row?.status, row?.priority, assignee]).join(' - ')
  const meta = compact([row?.dueDate ?? row?.due_at ?? row?.deadline]).join(' - ')

  return createEntity({
    moduleKey: 'tasks',
    moduleLabel: 'Tasks',
    row,
    title,
    subtitle,
    meta,
    hrefBase: '/tasks',
    searchValues: [
      title,
      row?.description,
      row?.details,
      row?.status,
      row?.priority,
      assignee,
      row?.dueDate,
      row?.due_at,
      row?.deadline,
    ],
  })
}

export const CRM_SEARCH_SOURCES = Object.freeze([
  {
    moduleKey: 'leads',
    moduleLabel: 'Leads',
    queryKey: ['leads'],
    queryFn: () => getLeads(),
    mapRow: mapLeadEntity,
  },
  {
    moduleKey: 'deals',
    moduleLabel: 'Deals',
    queryKey: ['deals'],
    queryFn: () => getDeals(),
    mapRow: mapDealEntity,
  },
  {
    moduleKey: 'accounts',
    moduleLabel: 'Accounts',
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
    mapRow: mapAccountEntity,
  },
  {
    moduleKey: 'contacts',
    moduleLabel: 'Contacts',
    queryKey: ['contacts'],
    queryFn: () => getContacts(),
    mapRow: mapContactEntity,
  },
  {
    moduleKey: 'tasks',
    moduleLabel: 'Tasks',
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
    mapRow: mapTaskEntity,
  },
])

export function mapPayloadToSearchEntities(source, payload) {
  const rows = extractCollection(payload)
  return rows
    .map((row, rowIndex) => {
      const entity = source.mapRow(row)

      if (!entity) {
        return null
      }

      if (entity.entityId) {
        return entity
      }

      return {
        ...entity,
        id: `${entity.id}-${rowIndex}`,
      }
    })
    .filter(Boolean)
}

export default {
  CRM_SEARCH_SOURCES,
  mapPayloadToSearchEntities,
}
