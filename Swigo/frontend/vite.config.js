import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600, // Limit badha di
    rollupOptions: {
      output: {
        manualChunks: undefined // Filhal manualChunks hata do, error wahi se ho sakta hai
      }
    }
  }
})