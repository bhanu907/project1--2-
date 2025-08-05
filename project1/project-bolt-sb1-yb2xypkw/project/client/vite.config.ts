import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1", // ✅ use IPv4
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000", // ✅ match backend IP
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
