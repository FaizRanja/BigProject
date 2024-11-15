import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths()
  ],
  base: '/react/free',
  define: {
    global: 'window'
  },
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1')
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1')
      }
    ]
  },
  server: {
    open: true, // Opens the browser upon server start
    port: 3000, // Sets default port to 3000
    proxy: {
      // Proxy API calls to the backend
      '/api': {
        target: 'http://localhost:4000', // Backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api prefix if needed
      },
    },
  },
  preview: {
    open: true, // Opens the browser upon preview start
    port: 3000  // Sets default port to 3000 for preview
  }
});
