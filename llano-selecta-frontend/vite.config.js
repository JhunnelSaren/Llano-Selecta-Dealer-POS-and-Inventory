import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg', 'robots.txt'],
      manifest: {
        name: 'Llano SELECTA Dealer System',
        short_name: 'SELECTA Dealer',
        description: 'Offline-first business management system for Llano SELECTA Dealer',
        theme_color: '#D32F2F',
        background_color: '#F8FAFC',
        display: 'standalone',
        icons: [
          {
            src: '/icons.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/icons.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});