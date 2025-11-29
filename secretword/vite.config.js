import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/ (documentação de configuração do Vite)
export default defineConfig({
  plugins: [react()],
})
