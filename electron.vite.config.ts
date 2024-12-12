import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import eslint from 'vite-plugin-eslint2'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@components': resolve(__dirname, 'src/renderer/src/components'),
        '@context': resolve(__dirname, 'src/renderer/src/context'),
        '@renderer': resolve(__dirname, 'src/renderer/src')
      }
    },
    plugins: [react(), eslint()]
  }
})
