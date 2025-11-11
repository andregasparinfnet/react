/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Permite usar 'test', 'expect' etc. sem importar
    environment: 'jsdom', // Simula o DOM do navegador
    setupFiles: './src/setupTests.js', // Arquivo de setup (vamos criar a seguir)
  },
})
