import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.js'],
    css: true,
    clearMocks: true,
    restoreMocks: true,
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
})
