import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './LoginPage.jsx'
import { useAuth } from '../useAuth.js'
import { useToast } from '../../../lib/toast/useToast.js'

const mockNavigate = vi.fn()

vi.mock('../useAuth.js', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../../lib/toast/useToast.js', () => ({
  useToast: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('LoginPage', () => {
  const signInMock = vi.fn()
  const toastSuccessMock = vi.fn()
  const toastErrorMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    useAuth.mockReturnValue({
      signIn: signInMock,
      isLoading: false,
    })

    useToast.mockReturnValue({
      success: toastSuccessMock,
      error: toastErrorMock,
    })
  })

  it('renders login form fields and action', () => {
    render(<LoginPage />)

    expect(screen.getByRole('heading', { name: 'Access your workspace' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('submits successfully and navigates to dashboard', async () => {
    signInMock.mockResolvedValue({
      token: 'token',
      user: { id: 'user-1' },
    })
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText('Email'), 'email@email.com')
    await user.type(screen.getByLabelText('Password'), '123456')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({
        email: 'email@email.com',
        password: '123456',
      })
    })

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    expect(toastSuccessMock).toHaveBeenCalledWith('Signed in successfully.')
  })

  it('shows error feedback when login fails', async () => {
    signInMock.mockRejectedValue(new Error('Invalid email or password. Please try again.'))
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText('Email'), 'wrong@email.com')
    await user.type(screen.getByLabelText('Password'), 'wrong-pass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Invalid email or password. Please try again.')).toBeInTheDocument()
    expect(toastErrorMock).toHaveBeenCalledWith('Invalid email or password. Please try again.')
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
