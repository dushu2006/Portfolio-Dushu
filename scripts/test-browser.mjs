import chromium from '@sparticuz/chromium';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
// npm-hosted Linux browser avoids an additional browser-download host in restricted CI.
const env = { ...process.env };
if (!env.CHROMIUM_PATH) {
  env.CHROMIUM_PATH = await chromium.executablePath();
  const root = dirname(dirname(fileURLToPath(import.meta.resolve('@sparticuz/chromium'))));
  const libs = join(tmpdir(), 'portfolio-browser-libs');
  mkdirSync(libs, { recursive: true });
  const archive = join(libs, 'runtime.tar');
  writeFileSync(archive, brotliDecompressSync(readFileSync(join(root, 'bin/al2023.tar.br'))));
  const extraction = spawnSync('tar', ['xf', archive, '-C', libs]);
  if (extraction.status !== 0) throw new Error('Unable to extract Linux browser runtime');
  env.LD_LIBRARY_PATH = `${join(libs, 'lib')}:${env.LD_LIBRARY_PATH || ''}`;
}
const result = spawnSync(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)], { env, stdio: 'inherit' });
process.exit(result.status ?? 1);
