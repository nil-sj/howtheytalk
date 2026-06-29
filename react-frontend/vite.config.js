import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/jsonapi': {
        target: 'http://192.168.1.157:9022',
        changeOrigin: true,
      }
    }
  }
})
