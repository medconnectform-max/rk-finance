import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



export default defineConfig({
  plugins: [
    react(),
    


  ],
  server: {


    allowedHosts: [
      'added-analytical-sagem-nicole.trycloudflare.com'
    ],

  }
})