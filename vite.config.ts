import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'path'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const apiTarget = process.env.API_TARGET || 'http://localhost:8080/api'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: 'localhost',
    port: 3100,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
