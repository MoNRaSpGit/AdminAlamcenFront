import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Si está en producción (GitHub Pages), usa la carpeta del repo
// Si está en desarrollo (local), base es "/"
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/AdminAlamcenFront/" : "/",
});
