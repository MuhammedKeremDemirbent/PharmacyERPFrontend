import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: true, // Cloudflare Tunnel gibi dış hostlara izin ver
    hmr: false, // Cloudflare Tunnel üzerinden WebSocket bağlantısı çalışmadığı için HMR kapatıldı refresh kapandı
    proxy: {
      '/api': {
        target: 'http://nginx:80', // Docker ağında Nginx'e git
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://nginx:80',
        changeOrigin: true,
      },
    },
  },
})

//Backend bağlantısı için proxy ayarı
//Backendin localhostu 8000 portundan çalışır api ile başlayan istekleri alır. ama api yazısını silerek gönderir.