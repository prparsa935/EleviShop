import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    // Inline small assets to avoid extra HTTP requests; bump limit for tiny icons
    assetsInlineLimit: 4096,
    // Don't fail the build on large chunks; we split vendors explicitly below
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Split heavy vendors into their own long-term-cacheable chunks
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          carousel: ["embla-carousel-react", "embla-carousel-autoplay"],
          tables: ["@tanstack/react-table", "react-select", "@radix-ui/react-tabs"],
        },
        // Stable, content-hashed file names for better caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  // Pre-bundle commonly used deps for faster dev + smaller dep graph
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "axios",
      "embla-carousel-react",
      "embla-carousel-autoplay",
    ],
  },
});
