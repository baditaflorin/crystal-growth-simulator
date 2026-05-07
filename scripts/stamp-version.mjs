import { execSync } from 'node:child_process';

const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
process.stdout.write(commit);
