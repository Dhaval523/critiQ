import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0', // required on Render
    port: 4173,       // optional, default for preview
    allowedHosts: ['critiq-1.onrender.com'], // ✅ your Render host
  }
})
