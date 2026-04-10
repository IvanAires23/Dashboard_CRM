import { vi } from 'vitest'

export function installBrowserMocks() {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  }

  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}

      unobserve() {}

      disconnect() {}
    }
  }

  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class IntersectionObserver {
      observe() {}

      unobserve() {}

      disconnect() {}
    }
  }

  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
  }
}

export default installBrowserMocks
