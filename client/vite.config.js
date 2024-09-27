import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        secure: false,
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true
    }
  },
  plugins: [react()],
});