// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,  // Fixes network change reloads on Windows
    },
    host: true,  // Allows external access
    port: 5173,
  },
  optimizeDeps: {
    include: ['ethers'],  // Pre-bundle ethers to avoid load errors
  },
  define:{
    global:{},
  },
  resolve:{
    alias:{
      buffer:'buffer/',
    },
  },
  
})
