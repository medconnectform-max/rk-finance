import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'



export default defineConfig({
  plugins: [
    react(),
    


  ],
  server: {


    allowedHosts: [
      'particularly-chargers-creativity-tires.trycloudflare.com',
      'changelog-demand-vitamins-stranger.trycloudflare.com'
    ],

  }
})