import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "https://mattarainwater.github.io/gatherings/",
  server: { port: 3000 }
})
