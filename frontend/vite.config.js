import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      'es-toolkit/compat/get': path.resolve(__dirname, './src/utils/compat/get.js'),
      'es-toolkit/compat/uniqBy': path.resolve(__dirname, './src/utils/compat/uniqBy.js'),
      'es-toolkit/compat/omit': path.resolve(__dirname, './src/utils/compat/omit.js'),
      'es-toolkit/compat/maxBy': path.resolve(__dirname, './src/utils/compat/maxBy.js'),
      'es-toolkit/compat/sumBy': path.resolve(__dirname, './src/utils/compat/sumBy.js'),
      'es-toolkit/compat/sortBy': path.resolve(__dirname, './src/utils/compat/sortBy.js'),
      'es-toolkit/compat/throttle': path.resolve(__dirname, './src/utils/compat/throttle.js'),
      'es-toolkit/compat/minBy': path.resolve(__dirname, './src/utils/compat/minBy.js'),
      'es-toolkit/compat/last': path.resolve(__dirname, './src/utils/compat/last.js'),
      'es-toolkit/compat/isPlainObject': path.resolve(__dirname, './src/utils/compat/isPlainObject.js'),
      'es-toolkit/compat/range': path.resolve(__dirname, './src/utils/compat/range.js'),
    }
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})
