import { expect } from '@playwright/test'

function normalizePath(path) {
  if (!path) {
    return '/dashboard'
  }

  return path.startsWith('/') ? path : `/${path}`
}

export async function gotoApp(page, path = '/dashboard') {
  await page.goto(`/#${normalizePath(path)}`)
}

export async function login(page, credentials = {}) {
  const email = credentials.email ?? 'email@email.com'
  const password = credentials.password ?? '123456'

  await gotoApp(page, '/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /^sign in$/i }).click()
  await expect(page).toHaveURL(/#\/dashboard$/)
}

