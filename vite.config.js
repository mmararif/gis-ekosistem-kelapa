import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: true,
    proxy: {
      '/geoserver': {
        // Ganti dengan URL Ngrok Static-mu saat ini
        target: 'http://127.0.0.1:8080', 
        changeOrigin: true,
        secure: false
      }
    }
  }
})
