import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  define: {
    // This allows the code to access process.env.API_KEY as a string literal replaced at build time
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})