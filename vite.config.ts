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
    // Safely replace process.env.API_KEY. If it doesn't exist, use an empty string.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  }
})