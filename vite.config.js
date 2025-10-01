import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detectamos si estamos en producción (GitHub Pages) o en desarrollo (local)
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/AdminAlamcenFront/" : "/", // ✅ dinámico
}));
