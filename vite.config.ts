
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // ELIMINADO: Ya no definimos process.env.API_KEY aquí.
  // Esto asegura que la clave de servidor (API_KEY) nunca se filtre al cliente.
})
