import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/open-notify': {
        target: 'http://api.open-notify.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/open-notify/, '')
      },
      '/hf-api': {
        target: 'https://router.huggingface.co',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/hf-api/, '')
      }
    }
  }
})
