#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist);

function copyRecursive(relPath) {
  const src = path.join(root, relPath);
  const dst = path.join(dist, relPath);
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(relPath, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

// Minimal copy to make a distributable folder for static hosting.
for (const p of ['index.html', 'js', 'css', 'docs', 'lib']) {
  copyRecursive(p);
}
console.log('Simple copy build completed at', dist);


