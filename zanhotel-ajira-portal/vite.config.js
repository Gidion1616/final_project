import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Plugin huwezesha JSX. Proxy hupeleka /api na /media kwa Django port 8000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:8000",
      "/media": "http://localhost:8000",
    },
  },
});
