import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import Card from './Card.jsx'
import { renderWithProviders } from '../../test/renderWithProviders.jsx'

describe('Card', () => {
  it('renders children content', () => {
    renderWithProviders(<Card>CRM content</Card>)

    expect(screen.getByText('CRM content')).toBeInTheDocument()
  })

  it('supports custom element type via "as" prop', () => {
    renderWithProviders(<Card as="section">Widget</Card>)

    const section = screen.getByText('Widget').closest('section')
    expect(section).toBeInTheDocument()
    expect(section).toHaveClass('ui-card')
  })
})
