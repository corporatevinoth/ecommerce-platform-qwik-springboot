    import { defineConfig } from 'vite';
    import { qwikVite } from '@builder.io/qwik/optimizer';
    import { qwikCity } from '@builder.io/qwik-city/vite';
    import tsconfigPaths from 'vite-tsconfig-paths';

    export default defineConfig(() => {
      return {
        plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
        preview: {
          headers: {
            'Cache-Control': 'public, max-age=600',
          },
        },
        // --- ADDED: Vite Proxy Configuration ---
        server: {
          proxy: {
            '/api/products': { // When Qwik requests /api/products...
              target: 'http://localhost:8081', // ...proxy to the product service
              changeOrigin: true, // Needed for virtual hosts
              rewrite: (path) => path.replace(/^\/api\/products/, '/api/products'), // Ensure the path is correct
              secure: false // Important for development, allows proxying to http
            },
            '/api/orders': { // When Qwik requests /api/orders...
              target: 'http://localhost:8080', // ...proxy to the order service
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/orders/, '/api/orders'),
              secure: false
            },
            '/api/users': { // When Qwik requests /api/users...
              target: 'http://localhost:8083', // ...proxy to the user service
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/users/, '/users'), // Note: user service uses /users, not /api/users at its root
              secure: false
            },
          }
        }
        // --- END ADDED ---
      };
    });
    