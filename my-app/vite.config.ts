import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    allowedHosts: [
      'website.matchafunding.com',
      'ipod-ha-reel-tennessee.trycloudflare.com'
    ]
  }
})
