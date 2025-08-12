#!/usr/bin/env node
// Minimal ORCH START CLI: resolves a PRD, ensures QA artifacts, and updates PRD changelog.
// Modes supported (initial): --prd-path <path> | --id <ROADMAP_ID> | --dry-run
// Range/List grammar can be added incrementally; this CLI focuses on single-item execution.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(path.join(__dirname, '..'));

function readUtf8(p) {
  return fs.readFileSync(p, 'utf8');
}

function writeUtf8(p, s) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
}

function parseArgs(argv) {
  const args = { prdPath: '', id: '', dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') { args.dryRun = true; continue; }
    // Support --key=value with hyphenated keys
    let m = a.match(/^--([\w-]+?)=(.*)$/);
    if (m) {
      const [, k, v] = m;
      if (k === 'prd-path') args.prdPath = v;
      else if (k === 'id') args.id = v;
      continue;
    }
    // Support split form: --prd-path <value> or --id <value>
    if (a === '--prd-path' && i + 1 < argv.length) { args.prdPath = argv[++i]; continue; }
    if (a === '--id' && i + 1 < argv.length) { args.id = argv[++i]; continue; }
  }
  return args;
}

function resolvePrdPathById(roadmapId) {
  // Attempt to read plan cell from roadmap; if not present, derive default path using slug in file name if exists.
  const roadmapPath = path.join(repoRoot, 'Plans', 'product-roadmap.md');
  const md = readUtf8(roadmapPath);
  const line = md.split(/\r?\n/).find(l => l.includes(`| ${roadmapId} |`));
  if (!line) return '';
  const cols = line.split('|').map(s => s.trim());
  // cols: [ '', Phase, ID, Item, Status, Owner, PRD/Plan, Files/QA, '' ]
  const planCell = cols[6] || '';
  const m = planCell.match(/`([^`]+)`/);
  if (m) return path.join(repoRoot, m[1]);
  // Fallback to default convention: PRDs/<Milestone>/<ID>-<slug>-prd.md using phase cell's milestone head
  const phase = cols[1] || 'M0';
  const milestone = (phase.split('—')[0] || 'M0').trim();
  const item = cols[3] || '';
  const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').replace(/--+/g, '-');
  return path.join(repoRoot, 'PRDs', milestone, `${roadmapId}-${slug}-prd.md`);
}

function parseIdAndSlugFromPrd(prdPath) {
  const base = path.basename(prdPath);
  const m = base.match(/^((\d+\.){3}\d+)-(.*?)-prd\.md$/);
  if (!m) return { id: '', slug: '' };
  return { id: m[1], slug: m[3] };
}

function ensureQaArtifacts(id, slug, dryRun) {
  const qaFolder = path.join(repoRoot, 'QA', `${id}-${slug}`);
  const casesPath = path.join(qaFolder, 'test-cases.md');
  const today = new Date().toISOString().slice(0, 10);
  const resultsPath = path.join(qaFolder, `test-results-${today}.md`);
  const actions = [];
  if (!fs.existsSync(qaFolder)) {
    actions.push({ type: 'mkdir', path: qaFolder });
    if (!dryRun) fs.mkdirSync(qaFolder, { recursive: true });
  }
  if (!fs.existsSync(casesPath)) {
    actions.push({ type: 'write', path: casesPath });
    if (!dryRun) writeUtf8(casesPath, `# Test Cases — ${id}-${slug}\n\n- Derive from PRD section 7.1/7.2.\n\n## Scenarios\n- [ ] ORCH-CLI-001 — Trigger parsing\n- [ ] ORCH-CLI-002 — PRD edits idempotent\n\n## Acceptance\n- Overall Status: Pass required before Ready flip.\n`);
  }
  if (!fs.existsSync(resultsPath)) {
    actions.push({ type: 'write', path: resultsPath });
    if (!dryRun) writeUtf8(resultsPath, `# ORCH START — Results (${today})\n\n- Build under test: local (N/A)\n- Overall Status: Pending\n- Notes: Initial orchestrator scaffold run.\n`);
  }
  return { qaFolder, casesPath, resultsPath, actions };
}

function updatePrd(prdPath, qaCasesRel, qaResultsRel, dryRun) {
  let text = readUtf8(prdPath);
  let changed = false;

  // Ensure §7.3 QA Artifacts lines exist/are updated
  if (/### 7\.3 QA Artifacts[\s\S]*?\n/.test(text)) {
    const updated = text.replace(/(### 7\.3 QA Artifacts[\s\S]*?)(\n<|\n## |\n<a id=|\n$)/m, (m0, p1, p2) => {
      const block = `### 7.3 QA Artifacts\n- Test cases file: \`${qaCasesRel}\`\n- Latest results: \`${qaResultsRel}\` (Overall Status: Pass required)\n`;
      return block + (p2 || '\n');
    });
    if (updated !== text) { text = updated; changed = true; }
  }

  // Append to §8 Changelog
  if (/## 8\. Changelog/.test(text)) {
    const today = new Date().toISOString().slice(0, 10);
    const updated = text.replace(/(## 8\. Changelog\n)/, `$1- orch: initial scaffold executed on ${today}.\n`);
    if (updated !== text) { text = updated; changed = true; }
  }

  if (changed && !dryRun) writeUtf8(prdPath, text);
  return changed;
}

function main() {
  const args = parseArgs(process.argv);
  let prdPath = args.prdPath ? path.resolve(args.prdPath) : '';
  if (!prdPath && args.id) {
    prdPath = resolvePrdPathById(args.id);
  }
  if (!prdPath || !fs.existsSync(prdPath)) {
    console.error('PRD not found. Use --prd-path <path> or --id <ROADMAP_ID>.');
    process.exit(1);
  }

  const { id, slug } = parseIdAndSlugFromPrd(prdPath);
  if (!id || !slug) {
    console.error('Unable to parse id/slug from PRD filename. Expected <id>-<slug>-prd.md');
    process.exit(1);
  }

  const { qaFolder, casesPath, resultsPath, actions } = ensureQaArtifacts(id, slug, args.dryRun);
  const qaCasesRel = path.relative(repoRoot, casesPath).replace(/\\/g, '/');
  const qaResultsRel = path.relative(repoRoot, resultsPath).replace(/\\/g, '/');
  const prdChanged = updatePrd(prdPath, qaCasesRel, qaResultsRel, args.dryRun);

  const summary = {
    mode: args.dryRun ? 'dry-run' : 'apply',
    prdPath: path.relative(repoRoot, prdPath),
    id,
    slug,
    qaFolder: path.relative(repoRoot, qaFolder),
    actions,
    prdChanged,
  };
  console.log(JSON.stringify(summary, null, 2));
}

main();


