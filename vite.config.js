import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === "development"
      ? [eslint({ cache: true, lintOnStart: true })]
      : []),
  ],
  build: {
    minify: "terser",
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          icons: ["lucide-react"],
        },
      },
    },
  },
}));
