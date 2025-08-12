import fs from 'node:fs';
import path from 'node:path';

/**
 * Inserts a single ESM entry tag for js/app-entry.js into index.html
 * before </body> if not already present. Idempotent.
 */
function ensureEsmEntry(htmlPath) {
  const abs = path.resolve(htmlPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`index.html not found at: ${abs}`);
  }
  let content = fs.readFileSync(abs, 'utf8');
  if (content.includes('js/app-entry.js') || content.includes('js\\/app-entry.js')) {
    console.log('[ensure-esm-entry] ESM entry already present. Skipping.');
    return;
  }
  const scriptTag = '<script type="module" src="js/app-entry.js"></script>';
  const lower = content.toLowerCase();
  const closeIdx = lower.lastIndexOf('</body>');
  if (closeIdx === -1) {
    // Fallback: append at end
    content = content + '\n' + scriptTag + '\n';
  } else {
    content = content.slice(0, closeIdx) + scriptTag + content.slice(closeIdx);
  }
  fs.writeFileSync(abs, content, 'utf8');
  console.log('[ensure-esm-entry] Inserted module script tag for js/app-entry.js');
}

// Execute against repo root index.html
const repoRoot = path.resolve(process.cwd());
ensureEsmEntry(path.join(repoRoot, 'index.html'));


