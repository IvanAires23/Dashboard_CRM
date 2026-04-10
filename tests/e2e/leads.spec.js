import { expect, test } from '@playwright/test'
import { login } from './helpers/auth.js'
import { mockCrmApi } from './helpers/mockCrmApi.js'

test.describe('Lead flows', () => {
  test('creates a lead and opens edit mode with saved values', async ({ page }) => {
    const api = await mockCrmApi(page)
    await login(page)

    await page.getByRole('link', { name: /^leads$/i }).click()
    await expect(page).toHaveURL(/#\/leads$/)

    await page.getByRole('link', { name: /^create lead$/i }).click()
    await expect(page).toHaveURL(/#\/leads\/new$/)

    await page.locator('#lead-name').fill('Taylor Brooks')
    await page.locator('#lead-email').fill('taylor@acme.com')
    await page.locator('#lead-phone').fill('+1 555 300 4400')
    await page.locator('#lead-company').fill('Acme Corp')
    await page.locator('#lead-status').selectOption('qualified')
    await page.locator('#lead-source').selectOption('referral')

    await page.getByRole('button', { name: /^create lead$/i }).click()

    await expect(page).toHaveURL(/#\/leads\/lead-\d+\/edit$/)

    await expect(page.locator('#lead-name')).toHaveValue('Taylor Brooks')
    await expect(page.locator('#lead-email')).toHaveValue('taylor@acme.com')
    await expect(page.locator('#lead-company')).toHaveValue('Acme Corp')

    const leads = api.getState().leads
    expect(leads.some((lead) => lead.email === 'taylor@acme.com')).toBe(true)
  })
})
