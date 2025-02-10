import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: false, // Prevents Vite from opening the browser automatically
    allowedHosts: ['ksyw83-5173.csb.app'], // Allow the specific host
  },
});
