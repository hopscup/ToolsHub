import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replaceAll('\\', '/');

            if (normalizedId.includes('/src/data/')) return 'editorial-data';
            if (normalizedId.includes('/node_modules/lucide-react/')) return 'icons';
            if (normalizedId.includes('/node_modules/motion/')) return 'motion';
            if (
              normalizedId.includes('/node_modules/react/')
              || normalizedId.includes('/node_modules/react-dom/')
              || normalizedId.includes('/node_modules/scheduler/')
            ) {
              return 'react';
            }
            if (normalizedId.includes('/node_modules/@vercel/analytics/')) return 'analytics';

            return undefined;
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
