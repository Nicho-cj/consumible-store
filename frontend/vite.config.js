import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    host: true,   //  Prueba en maquina de nicho
    proxy: {
      // En dev el frontend usa rutas relativas /api (same-origin): el proxy las lleva
      // al backend local. En produccion lo hace nginx (ver nginx.conf).
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Tiempo real (WebSocket) en dev
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
  },
})

