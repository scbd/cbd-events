#!/usr/bin/env node
// Build smoke test: runs `nuxt generate` from a clean .nuxt and asserts the
// static output in capacitor/www (see nuxt.config.js generate.dir) is a
// usable app shell. Run manually via `yarn test:smoke` before release builds.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outDir = resolve(root, 'capacitor/www');

const fail = (msg) => { console.error(`SMOKE FAIL: ${msg}`); process.exit(1); };

rmSync(resolve(root, '.nuxt'), { recursive: true, force: true });
console.log('Running nuxt generate...');
try {
  execSync('npx --no-install nuxt generate', { cwd: root, stdio: 'inherit', timeout: 15 * 60 * 1000 });
} catch {
  fail('nuxt generate exited non-zero');
}

const indexPath = resolve(outDir, 'index.html');
if (!existsSync(indexPath)) fail(`missing ${indexPath}`);

const html = readFileSync(indexPath, 'utf8');
if (!html.includes('<div id="__nuxt">')) fail('index.html has no #__nuxt mount point');
if (!/<script[^>]+src=/.test(html)) fail('index.html references no script bundles');

// every locally-served bundle referenced by index.html must exist and be non-empty
const bundles = [...html.matchAll(/src="([^"]+\.js)"/g)]
  .map((m) => m[1])
  .filter((p) => !/^https?:/.test(p))
  .map((p) => p.replace(/^\//, ''));
if (!bundles.length) fail('index.html references no local script bundles');
const missing = bundles.filter((p) => !existsSync(resolve(outDir, p)));
if (missing.length) fail(`index.html references missing bundles: ${missing.join(', ')}`);
const empty = bundles.filter((p) => statSync(resolve(outDir, p)).size === 0);
if (empty.length) fail(`empty bundles: ${empty.join(', ')}`);

console.log(`SMOKE PASS: ${bundles.length} referenced bundles OK (${outDir})`);
