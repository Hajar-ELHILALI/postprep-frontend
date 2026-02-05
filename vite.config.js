import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://AmineSidki-postprep.hf.space',
        changeOrigin: true,
        secure: false,
        // CRITICAL FIXES FOR COOKIES:
        cookieDomainRewrite: "", // Makes cookie valid for localhost
        cookiePathRewrite: "/",  // Makes cookie valid for ALL pages
      }
    }
  }
})
