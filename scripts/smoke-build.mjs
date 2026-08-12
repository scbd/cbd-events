#!/usr/bin/env node
// Build smoke test: runs `nuxt generate` and asserts the static output
// in capacitor/www (see nuxt.config.js generate.dir) is a usable app shell.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const outDir = resolve(root, 'capacitor/www');
const env = process.env.NODE_ENV || 'local';

const fail = (msg) => { console.error(`SMOKE FAIL: ${msg}`); process.exit(1); };

console.log(`Running nuxt generate (NODE_ENV=${env})...`);
try {
  execSync('npx nuxt generate', { cwd: root, stdio: 'inherit', env: { ...process.env, NODE_ENV: env } });
} catch {
  fail('nuxt generate exited non-zero');
}

const indexPath = resolve(outDir, 'index.html');
if (!existsSync(indexPath)) fail(`missing ${indexPath}`);

const html = readFileSync(indexPath, 'utf8');
if (!html.includes('<div id="__nuxt">')) fail('index.html has no #__nuxt mount point');
if (!/<script[^>]+src=/.test(html)) fail('index.html references no script bundles');

const nuxtDir = resolve(outDir, '_nuxt');
if (!existsSync(nuxtDir)) fail('missing _nuxt asset directory');
const js = readdirSync(nuxtDir).filter((f) => f.endsWith('.js'));
if (js.length < 5) fail(`only ${js.length} js chunks in _nuxt (expected app + vendors + pages)`);
const empty = js.filter((f) => statSync(resolve(nuxtDir, f)).size === 0);
if (empty.length) fail(`empty js chunks: ${empty.join(', ')}`);

// every bundle referenced by index.html must exist on disk
const missing = [...html.matchAll(/src="([^"]+\.js)"/g)]
  .map((m) => m[1].replace(/^\//, ''))
  .filter((p) => !existsSync(resolve(outDir, p)));
if (missing.length) fail(`index.html references missing bundles: ${missing.join(', ')}`);

console.log(`SMOKE PASS: ${js.length} js chunks, index.html shell OK (${outDir})`);
