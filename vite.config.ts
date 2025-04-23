import { defineConfig } from 'vite'
import path from "path";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://backend-api.space',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''), // Перенаправляйте всі запити
  //     },
  //   },
  // },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
})
