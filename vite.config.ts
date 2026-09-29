/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handleAudit } from './server/handle-audit';

/**
 * Serves the same `/api/audit` handler that runs on Vercel, so local
 * development and production share one code path (and one API key strategy).
 */
function devApi(apiKey: string | undefined): Plugin {
  return {
    name: 'verdict:dev-api',
    configureServer(server) {
      server.middlewares.use('/api/audit', (req, res) => {
        const request = new Request(`http://localhost${req.originalUrl ?? req.url ?? ''}`);
        void handleAudit(request, apiKey).then(async (response) => {
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(await response.text());
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApi(env.PSI_API_KEY)],
    build: { target: 'es2022', sourcemap: true },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      restoreMocks: true,
    },
  };
});
