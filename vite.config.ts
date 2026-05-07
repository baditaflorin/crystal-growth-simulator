import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

const repoName = 'crystal-growth-simulator';
const version = process.env.npm_package_version ?? '0.1.0';

function gitValue(command: string, fallback: string) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return fallback;
  }
}

const commit = process.env.APP_COMMIT ?? gitValue('git rev-parse --short HEAD', 'local');
const buildDate = new Date().toISOString();

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.svg'],
      manifest: {
        name: 'Crystal Growth Simulator',
        short_name: 'Crystal Growth',
        description:
          'Live WebGPU crystal-growth simulator with Three.js visualization and Web Audio sonification.',
        theme_color: '#08111f',
        background_color: '#08111f',
        display: 'standalone',
        scope: `/${repoName}/`,
        start_url: `/${repoName}/`,
        icons: [
          {
            src: 'icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,webmanifest,wasm}'],
        navigateFallback: '/crystal-growth-simulator/index.html',
        runtimeCaching: [
          {
            urlPattern:
              /^https:\/\/api\.github\.com\/repos\/baditaflorin\/crystal-growth-simulator/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'github-metadata',
              expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 }
            }
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'docs',
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return undefined;
        }
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_COMMIT__: JSON.stringify(commit),
    __APP_BUILD_DATE__: JSON.stringify(buildDate),
    __REPO_URL__: JSON.stringify('https://github.com/baditaflorin/crystal-growth-simulator'),
    __PAYPAL_URL__: JSON.stringify('https://www.paypal.com/paypalme/florinbadita')
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['node_modules/**', 'dist/**', 'docs/**', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: [
        'src/features/simulation/cpuPhaseField.ts',
        'src/features/simulation/presets.ts',
        'src/features/simulation/color.ts',
        'src/features/simulation/field.ts',
        'src/lib/settingsStorage.ts'
      ],
      exclude: [
        'src/main.tsx',
        'src/**/*.d.ts',
        'src/test/**',
        'src/features/rendering/threeRenderer.ts',
        'src/features/simulation/webgpuPhaseField.ts'
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70
      }
    }
  }
});
