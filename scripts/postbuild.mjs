import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

mkdirSync('docs', { recursive: true });
copyFileSync('docs/index.html', 'docs/404.html');

function gitValue(command, fallback) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return fallback;
  }
}

const version = process.env.npm_package_version ?? '0.1.0';
const commit =
  process.env.APP_COMMIT ?? gitValue("git log -1 --format=%h -- . ':(exclude)docs'", 'local');
const builtAt =
  process.env.APP_BUILD_DATE ??
  (commit === 'local'
    ? new Date().toISOString()
    : gitValue(`git show -s --format=%cI ${commit}`, new Date().toISOString()));

writeFileSync(
  'docs/version.json',
  `${JSON.stringify(
    {
      version,
      commit,
      builtAt,
      repository: 'https://github.com/baditaflorin/crystal-growth-simulator'
    },
    null,
    2
  )}\n`
);
