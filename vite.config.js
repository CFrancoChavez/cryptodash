import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/cryptodash/', 
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        details: resolve(__dirname, 'details.html'), 
      },
    },
  },
});