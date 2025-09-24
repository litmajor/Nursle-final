import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Use 0.0.0.0 for Replit, localhost for local development
    host: process.env.REPLIT_DOMAINS ? '0.0.0.0' : 'localhost',
    port: 5000,
    // Only set allowedHosts and HMR config for Replit environment
    ...(process.env.REPLIT_DOMAINS && {
      allowedHosts: true,
      hmr: {
        clientPort: 443
      }
    })
  }
})