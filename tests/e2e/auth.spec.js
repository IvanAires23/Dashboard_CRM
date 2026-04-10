import { expect, test } from '@playwright/test'
import { gotoApp, login } from './helpers/auth.js'

test.describe('Auth flows', () => {
  test('redirects unauthenticated access from dashboard to login', async ({ page }) => {
    await gotoApp(page, '/dashboard')

    await expect(page).toHaveURL(/#\/login$/)
    await expect(page.getByRole('heading', { name: /access your workspace/i })).toBeVisible()
  })

  test('logs in with valid credentials and allows logout', async ({ page }) => {
    await login(page)

    await expect(page.getByRole('heading', { name: /^dashboard$/i })).toBeVisible()

    await page.getByRole('button', { name: /^sign out$/i }).click()

    await expect(page).toHaveURL(/#\/login$/)
    await expect(page.getByRole('heading', { name: /access your workspace/i })).toBeVisible()
  })

  test('shows error on failed login attempt', async ({ page }) => {
    await gotoApp(page, '/login')

    await page.getByLabel('Email').fill('wrong@email.com')
    await page.getByLabel('Password').fill('wrong-password')
    await page.getByRole('button', { name: /^sign in$/i }).click()

    await expect(page.locator('.cover-login__form .form-feedback--error')).toContainText(
      /invalid email or password/i,
    )
    await expect(page).toHaveURL(/#\/login$/)
  })
})
