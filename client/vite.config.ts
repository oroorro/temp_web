import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The client only ever calls relative /api URLs; Vite forwards them to the Node server.
const apiProxy = {
  '/api': { target: 'http://localhost:4000', changeOrigin: true },
};

export default defineConfig({
  plugins: [react()],
  // Fixed, non-default ports so this app never lands on another Vite project's 5173.
  server: { port: 5180, strictPort: true, proxy: apiProxy },
  preview: { port: 4180, strictPort: true, proxy: apiProxy },
});
