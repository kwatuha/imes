// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Removed ArcGIS-specific alias and optimizeDeps as we are using the CDN approach.
  // base: '/impes/',  // Removed - nginx handles the /impes/ routing
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      port: 5173,
    },
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      // Keep other aliases if you have them, e.g.:
      // 'src': '/src',
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'react-router-dom',
      'socket.io-client'
    ],
    force: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          socket: ['socket.io-client']
        }
      }
    }
  }
});
