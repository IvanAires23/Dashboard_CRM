import { expect, test } from '@playwright/test'
import { gotoApp, login } from './helpers/auth.js'
import { mockCrmApi } from './helpers/mockCrmApi.js'

test.describe('Main navigation', () => {
  test('navigates through core CRM modules and renders pipeline board', async ({ page }) => {
    await mockCrmApi(page)
    await login(page)

    const modules = [
      { name: 'Overview', url: /#\/dashboard$/, heading: /^dashboard$/i },
      { name: 'Deals', url: /#\/deals$/, heading: /^deals$/i },
      { name: 'Leads', url: /#\/leads$/, heading: /^leads$/i },
      { name: 'Accounts', url: /#\/accounts$/, heading: /^accounts$/i },
      { name: 'Contacts', url: /#\/contacts$/, heading: /^contacts$/i },
      { name: 'Tasks', url: /#\/tasks$/, heading: /^tasks$/i },
    ]

    for (const module of modules) {
      await page.getByRole('link', { name: module.name }).click()
      await expect(page).toHaveURL(module.url)
      await expect(page.getByRole('heading', { name: module.heading })).toBeVisible()
    }

    await gotoApp(page, '/deals/pipeline')
    await expect(page).toHaveURL(/#\/deals\/pipeline$/)
    await expect(page.getByRole('heading', { name: /sales pipeline board/i })).toBeVisible()
    await expect(page.getByText(/northwind expansion/i)).toBeVisible()
  })
})

