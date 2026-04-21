import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// When VITE_CITIZEN_BASE=1 (Docker nginx at http://host:8080/citizen/), use base /citizen/ so /src and /@vite
// are not confused with the admin app (nginx would otherwise route /src to react_frontend).
export default defineConfig(({ mode }) => ({
  base:
    mode === 'production' || process.env.VITE_CITIZEN_BASE === '1'
      ? '/citizen/'
      : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        // In Docker: use service name 'api'
        // Override with VITE_PROXY_TARGET env var if needed
        target: process.env.VITE_PROXY_TARGET || 'http://api:3000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        // Proxy uploads to API server for local development
        target: process.env.VITE_PROXY_TARGET || 'http://api:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core dependencies
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          utils: ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
    assetsInlineLimit: 4096
  }

}))
