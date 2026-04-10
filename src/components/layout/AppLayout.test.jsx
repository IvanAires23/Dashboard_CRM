import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import AppLayout from '../../app/layout.jsx'
import { renderWithProviders } from '../../test/renderWithProviders.jsx'

vi.mock('../../components/layout/Sidebar.jsx', () => ({
  default: () => (
    <aside aria-label="Primary navigation">
      Shared Sidebar
    </aside>
  ),
}))

vi.mock('../../components/layout/Header.jsx', () => ({
  default: ({ title, headingId }) => (
    <header>
      <h1 id={headingId}>{title}</h1>
    </header>
  ),
}))

function renderLayout(initialPath = '/dashboard') {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<p>Dashboard route content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
    {
      withRouter: false,
      withFeedbackProviders: false,
      withQueryClient: false,
    },
  )
}

describe('AppLayout', () => {
  it('renders shared navigation and main content regions', () => {
    renderLayout('/dashboard')

    expect(screen.getByLabelText('Primary navigation')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Dashboard route content')).toBeInTheDocument()
  })

  it('renders skip link and route-aware header title', () => {
    renderLayout('/dashboard')

    expect(screen.getByRole('link', { name: 'Skip to main content' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })
})
