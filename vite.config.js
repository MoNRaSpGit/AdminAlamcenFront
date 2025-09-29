import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 cambiá "AdminAlamcenFront" por el nombre EXACTO de tu repo en GitHub
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/AdminAlamcenFront/" : "/"
})
