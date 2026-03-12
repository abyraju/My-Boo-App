import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()], // Don't forget your plugins!
  server: {
    allowedHosts: true,
    host: true,
    port: 5173,
  },
})