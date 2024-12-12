import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import eslint from 'vite-plugin-eslint2'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: {
      '@renderer': resolve('src/renderer/src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/renderer/src/setupTests.ts'
  }
})
