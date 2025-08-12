#!/usr/bin/env node
/**
 * File size governance checker
 * - Warn when a source file exceeds 400 lines
 * - Fail (exit 1) when a source file exceeds 600 lines
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WARN_LINES = 300;
const FAIL_LINES = 400;
const EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.css', '.html']);
const IGNORE_DIRS = new Set(['node_modules', '.git', 'QA', 'docs']);
const IGNORE_FILES = new Set([]);

function isIgnoredDir(dir) { return IGNORE_DIRS.has(path.basename(dir)); }
function shouldCheck(file) {
  if (IGNORE_FILES.has(path.basename(file))) return false;
  return EXTENSIONS.has(path.extname(file));
}

function listFilesRecursive(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!isIgnoredDir(full)) files.push(...listFilesRecursive(full));
    } else if (e.isFile()) {
      if (shouldCheck(full)) files.push(full);
    }
  }
  return files;
}

function countLines(file) {
  const content = fs.readFileSync(file, 'utf8');
  return content.split(/\r?\n/).length;
}

function main() {
  const root = PROJECT_ROOT;
  const files = listFilesRecursive(root);
  let hasFailure = false;
  let hasWarning = false;
  const results = [];

  for (const f of files) {
    const lines = countLines(f);
    results.push({ file: path.relative(root, f), lines });
    if (lines > FAIL_LINES) {
      hasFailure = true;
      console.error(`FAIL: ${path.relative(root, f)} — ${lines} lines (> ${FAIL_LINES})`);
    } else if (lines > WARN_LINES) {
      hasWarning = true;
      console.warn(`WARN: ${path.relative(root, f)} — ${lines} lines (> ${WARN_LINES})`);
    }
  }

  if (process.argv.includes('--report')) {
    const sorted = results.sort((a, b) => b.lines - a.lines);
    console.log('# Size Audit Report');
    console.log('');
    console.log(`- Root: ${root}`);
    console.log(`- Thresholds: WARN > ${WARN_LINES} lines; FAIL > ${FAIL_LINES} lines`);
    console.log('');
    console.log('| File | Lines | Status |');
    console.log('|---|---:|---|');
    for (const r of sorted) {
      const status = r.lines > FAIL_LINES ? 'FAIL' : (r.lines > WARN_LINES ? 'WARN' : 'OK');
      console.log(`| ${r.file} | ${r.lines} | ${status} |`);
    }
  } else if (!hasFailure && !hasWarning) {
    console.log('OK: All checked files are within thresholds');
  }

  process.exit(hasFailure ? 1 : 0);
}

main();


