import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';


export default defineConfig({
  plugins: [vue()],
      server: {
    host: '0.0.0.0',
      port : 5173,
      proxy: {
      '/usuarios': 'http://localhost:3005',
        '/auth': 'http://localhost:3005',
        '/receitas': 'http://localhost:3005',
      '/categorias': 'http://localhost:3005',
        '/health': 'http://localhost:3005'
    }
    }
});
