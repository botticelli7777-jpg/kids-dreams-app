import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// PWA временно отключён — раскомментировать при необходимости
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  plugins: [
    react()
    // PWA временно отключён — раскомментировать при необходимости
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   manifest: {
    //     name: 'Моя мечта',
    //     short_name: 'Моя мечта',
    //     description: 'Приложение для детей: копи на свои мечты!',
    //     theme_color: '#4f46e5',
    //     background_color: '#f8fafc',
    //     display: 'standalone',
    //     orientation: 'portrait',
    //     lang: 'ru',
    //     icons: [
    //       {
    //         src: '/favicon.svg',
    //         sizes: 'any',
    //         type: 'image/svg+xml',
    //         purpose: 'any maskable'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
    //   }
    // })
  ]
})
