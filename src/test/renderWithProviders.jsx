import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ConfirmProvider from '../components/feedback/ConfirmProvider.jsx'
import ToastProvider from '../components/feedback/ToastProvider.jsx'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export function renderWithProviders(
  ui,
  {
    route = '/',
    routerEntries = [route],
    withRouter = true,
    withQueryClient = true,
    withFeedbackProviders = true,
    queryClient = createTestQueryClient(),
    wrapper: CustomWrapper,
    ...renderOptions
  } = {},
) {
  function TestWrapper({ children }) {
    let wrapped = children

    if (withFeedbackProviders) {
      wrapped = (
        <ConfirmProvider>
          <ToastProvider>{wrapped}</ToastProvider>
        </ConfirmProvider>
      )
    }

    if (withRouter) {
      wrapped = <MemoryRouter initialEntries={routerEntries}>{wrapped}</MemoryRouter>
    }

    if (withQueryClient) {
      wrapped = <QueryClientProvider client={queryClient}>{wrapped}</QueryClientProvider>
    }

    if (CustomWrapper) {
      wrapped = <CustomWrapper>{wrapped}</CustomWrapper>
    }

    return wrapped
  }

  return {
    queryClient,
    ...render(ui, {
      wrapper: TestWrapper,
      ...renderOptions,
    }),
  }
}

export default renderWithProviders
