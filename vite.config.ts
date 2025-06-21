import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      crypto: "crypto-browserify",
    },
  },
});
