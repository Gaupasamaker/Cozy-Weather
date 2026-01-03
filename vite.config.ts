
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno. 
  // loadEnv carga automáticamente las que empiezan por VITE_ y las del sistema.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    define: {
      // Inyectamos la variable 'process.env.API_KEY' en el código del cliente.
      // Buscamos primero 'VITE_API_KEY' y si no, 'API_KEY'.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || "")
    }
  }
})
