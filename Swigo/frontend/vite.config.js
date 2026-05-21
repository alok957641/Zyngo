


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
 plugins: [react(), tailwindcss()],
  build: {
    // Vite 8/Rolldown ke errors se bachne ke liye
    minify: 'terser', // Rolldown ki jagah Terser use karega
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion', 'lucide-react']
        }
      }
    }
  }
})