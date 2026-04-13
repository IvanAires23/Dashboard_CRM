function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function json(route, payload, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(payload),
  })
}

function readJsonBody(request) {
  try {
    return request.postDataJSON() ?? {}
  } catch {
    const raw = request.postData()
    if (!raw) {
      return {}
    }

    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }
}

const defaultFixtures = {
  leads: [
    {
      id: 'lead-seed-1',
      name: 'Morgan Lee',
      email: 'morgan@northwind.com',
      phone: '+1 555 100 2000',
      company: 'Northwind',
      status: 'qualified',
      source: 'website',
    },
  ],
  deals: [
    {
      id: 'deal-seed-1',
      title: 'Northwind Expansion',
      value: 18000,
      stage: 'qualified',
      account: 'Northwind',
      contact: 'Morgan Lee',
      owner: 'Demo CRM User',
      expectedCloseDate: '2026-05-10',
    },
    {
      id: 'deal-seed-2',
      title: 'Apex Renewal',
      value: 9200,
      stage: 'proposal',
      account: 'Apex Labs',
      contact: 'Jordan Miles',
      owner: 'Demo CRM User',
      expectedCloseDate: '2026-05-26',
    },
  ],
  accounts: [],
  contacts: [],
  tasks: [],
}

export async function mockCrmApi(page, fixtures = {}) {
  const state = {
    leads: clone(fixtures.leads ?? defaultFixtures.leads),
    deals: clone(fixtures.deals ?? defaultFixtures.deals),
    accounts: clone(fixtures.accounts ?? defaultFixtures.accounts),
    contacts: clone(fixtures.contacts ?? defaultFixtures.contacts),
    tasks: clone(fixtures.tasks ?? defaultFixtures.tasks),
  }
  let nextLeadId = state.leads.length + 1

  await page.route('**/api/**', async (route) => {
    const request = route.request()
    const url = new globalThis.URL(request.url())
    const { pathname } = url
    const method = request.method().toUpperCase()

    if (pathname === '/api/leads' && method === 'GET') {
      return json(route, { data: state.leads })
    }

    if (pathname === '/api/leads' && method === 'POST') {
      const payload = readJsonBody(request)
      const newLead = {
        id: `lead-${nextLeadId}`,
        ...payload,
      }
      nextLeadId += 1
      state.leads.unshift(newLead)
      return json(route, newLead, 201)
    }

    const leadMatch = pathname.match(/^\/api\/leads\/([^/]+)$/)
    if (leadMatch) {
      const leadId = decodeURIComponent(leadMatch[1])
      const index = state.leads.findIndex((lead) => String(lead.id) === leadId)

      if (method === 'GET') {
        if (index === -1) {
          return json(route, { message: 'Lead not found.' }, 404)
        }
        return json(route, state.leads[index])
      }

      if (method === 'PATCH') {
        if (index === -1) {
          return json(route, { message: 'Lead not found.' }, 404)
        }
        const payload = readJsonBody(request)
        state.leads[index] = {
          ...state.leads[index],
          ...payload,
        }
        return json(route, state.leads[index])
      }

      if (method === 'DELETE') {
        if (index !== -1) {
          state.leads.splice(index, 1)
        }
        return json(route, { success: true })
      }
    }

    if (pathname === '/api/deals' && method === 'GET') {
      return json(route, { data: state.deals })
    }

    const dealStageMatch = pathname.match(/^\/api\/deals\/([^/]+)\/stage$/)
    if (dealStageMatch && method === 'PATCH') {
      const dealId = decodeURIComponent(dealStageMatch[1])
      const payload = readJsonBody(request)
      const index = state.deals.findIndex((deal) => String(deal.id) === dealId)

      if (index === -1) {
        return json(route, { message: 'Deal not found.' }, 404)
      }

      state.deals[index] = {
        ...state.deals[index],
        stage: payload.stageId ?? state.deals[index].stage,
      }

      return json(route, state.deals[index])
    }

    if (pathname === '/api/accounts' && method === 'GET') {
      return json(route, { data: state.accounts })
    }

    if (pathname === '/api/contacts' && method === 'GET') {
      return json(route, { data: state.contacts })
    }

    if (pathname === '/api/tasks' && method === 'GET') {
      return json(route, { data: state.tasks })
    }

    if (pathname.startsWith('/api/')) {
      return json(route, { message: `No mock handler for ${method} ${pathname}` }, 404)
    }

    return route.fallback()
  })

  return {
    getState() {
      return clone(state)
    },
  }
}
