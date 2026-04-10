import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary.jsx'

function BrokenComponent() {
  throw new Error('Render failed')
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /unexpected error/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()

    spy.mockRestore()
  })
})

