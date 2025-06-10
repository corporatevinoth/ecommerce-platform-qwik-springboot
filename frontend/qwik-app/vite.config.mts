import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
// REMOVED: import tsconfigPaths from 'vite-tsconfig-paths'; // Direct import removed for ESM compatibility

export default defineConfig(() => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      // NEW: Dynamic import for tsconfigPaths to handle ESM
      (async () => {
        const tsconfigPaths = await import('vite-tsconfig-paths');
        return tsconfigPaths.default();
      })(),
    ],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    server: {
      proxy: {
        '/api/products': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/products/, '/api/products'),
          secure: false
        },
        '/api/orders': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/orders/, '/api/orders'),
          secure: false
        },
        '/api/users': {
          target: 'http://localhost:8083',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/users/, '/users'),
          secure: false
        },
      }
    }
  };
});
