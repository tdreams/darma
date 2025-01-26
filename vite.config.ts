import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Add this to listen on all addresses
    port: Number(process.env.PORT) || 3000,
    strictPort: true,
  },
  preview: {
    host: true, // Add this for preview server
    port: Number(process.env.PORT) || 3000,
    strictPort: true,
  },
});
