import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Zero-Trust Password Manager',
        short_name: 'Passwords',
        description: '100% offline, zero-knowledge password manager.',
        theme_color: '#000000',
        icons: []
      }
    })
  ],
});
