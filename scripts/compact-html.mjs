import fs from 'node:fs';
import path from 'node:path';

const targetPath = path.resolve(process.cwd(), 'index.html');
const original = fs.readFileSync(targetPath, 'utf8');

// Compact strategy:
// 1) Normalize newlines
// 2) Remove whitespace between tags (>   < → ><)
// 3) Remove all remaining newlines to collapse to a single line (browser-safe)
// 4) Trim leading/trailing whitespace

const normalized = original.replace(/\r?\n/g, '\n');
const noBetweenTags = normalized.replace(/>\s+</g, '><');
const singleLine = noBetweenTags.replace(/\n+/g, '');
const compact = singleLine.trim();

fs.writeFileSync(targetPath, compact + '\n', 'utf8');
console.log('Compacted index.html to a single line.');


