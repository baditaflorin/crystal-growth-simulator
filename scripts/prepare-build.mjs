import { readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const generatedPaths = [
  'docs/assets',
  'docs/icons',
  'docs/index.html',
  'docs/404.html',
  'docs/registerSW.js',
  'docs/sw.js',
  'docs/manifest.webmanifest',
  'docs/version.json'
];

for (const target of generatedPaths) {
  rmSync(target, { recursive: true, force: true });
}

try {
  for (const entry of readdirSync('docs')) {
    if (entry.startsWith('workbox-') && entry.endsWith('.js')) {
      rmSync(join('docs', entry), { force: true });
    }
  }
} catch {
  // The docs directory may not exist before the first build.
}
