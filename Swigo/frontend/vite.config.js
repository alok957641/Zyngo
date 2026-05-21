
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
 plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Rollup ko force karo
    },
    // Rolldown ko disable karne ke liye ensure karo ki vite version 5 ho
  }
})