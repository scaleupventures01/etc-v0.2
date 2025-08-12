#!/usr/bin/env node
// Scaffolds a feature from the roadmap:
// - Creates PRD from template
// - Creates QA folder with test-cases.md
// - Creates a Kickoff Plan from template
// - Updates Plans/product-roadmap.md row (Status → In Progress if Planned; set PRD/QA paths)
// - Regenerates docs/product-roadmap.html

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const mdPath = path.join(repoRoot, 'Plans', 'product-roadmap.md');
const prdTemplatePath = path.join(repoRoot, 'PRDs', '_templates', 'PRD-template.md');
const kickoffTemplatePath = path.join(repoRoot, 'PRDs', '_templates', 'feature-kickoff-plan.md');

function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, s) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); }
function exists(p) { return fs.existsSync(p); }

function slugify(title) {
  const ascii = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return ascii
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/--+/g, '-');
}

function parseArgs(argv) {
  const args = { id: '', kickoff: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--kickoff') { args.kickoff = true; continue; }
    const m = a.match(/^--(\w+?)=(.*)$/);
    if (m) { args[m[1]] = m[2]; continue; }
    if (!args.id && /^(\d+\.){3}\d+$/.test(a)) { args.id = a; continue; }
  }
  if (!args.id) {
    console.error('Usage: node lib/scaffold-feature.mjs --id 2.1.1.2 [--kickoff]');
    process.exit(1);
  }
  return args;
}

function parseRoadmapRows(md) {
  const lines = md.split(/\r?\n/);
  const rows = [];
  for (let idx = 0; idx < lines.length; idx++) {
    if (/\|\s*Phase\s*\|\s*ID\s*\|\s*Item\s*\|\s*Status/i.test(lines[idx])) {
      idx += 2; // skip header separator
      for (; idx < lines.length; idx++) {
        const line = lines[idx];
        if (!line || !line.trim().startsWith('|')) break;
        const cols = line.split('|').slice(1, -1).map(c => c.trim());
        if (cols.length < 7) continue;
        rows.push({
          raw: line,
          phase: cols[0],
          id: cols[1],
          item: cols[2],
          status: cols[3],
          owner: cols[4],
          plan: cols[5],
          files: cols[6],
          idx,
        });
      }
    }
  }
  return rows;
}

function deriveMilestone(phaseCell) {
  // Expect formats like: "M0 — Founder Instance"
  const head = (phaseCell || '').split('—')[0].trim();
  return head || 'M0';
}

function ensurePrd(prdPath, roadmapId, owner, milestone, featureTitle) {
  if (exists(prdPath)) return false;
  const template = read(prdTemplatePath);
  const today = new Date().toISOString().slice(0, 10);
  const slug = path.basename(prdPath).replace(/^(\d+\.){3}\d+-|(-prd\.md)$/g, '');
  const out = template
    .replace(/<feature-name>/g, slug)
    .replace(/<yyyy-mm-dd>/g, today)
    .replace(/<team\/role>/g, owner || 'Implementation Owner')
    .replace(/<link to strategy or parent doc>/g, 'Plans/product-roadmap.md')
    .replace(/M<0-9> \(<roadmap id e\.g\., 2\.1\.1\.1\)>/g, `${milestone} (${roadmapId})`);
  write(prdPath, out);
  return true;
}

function ensureQa(qaCasesPath) {
  if (exists(qaCasesPath)) return false;
  const idSlug = qaCasesPath
    .replace(/^.*QA\//, '')
    .replace(/\/test-cases\.md$/, '');
  const content = `# Test Cases — ${idSlug}\n\n- Derive from PRD section 7.1/7.2.\n- Record environment assumptions and acceptance expectations.\n\n## Scenarios\n- [ ] T-001 — ...\n- [ ] T-002 — ...\n\n## Acceptance\n- Overall Status: Pass required before Ready flip.\n`;
  write(qaCasesPath, content);
  return true;
}

function ensureKickoff(kickoffPath, ctx) {
  if (!ctx.createKickoff) return false;
  if (exists(kickoffPath)) return false;
  if (!exists(kickoffTemplatePath)) return false;
  let t = read(kickoffTemplatePath);
  t = t
    .replace(/{{ROADMAP_ID}}/g, ctx.id)
    .replace(/{{FEATURE_TITLE}}/g, ctx.item)
    .replace(/{{PRD_PATH}}/g, ctx.prdPath)
    .replace(/{{QA_FOLDER}}/g, path.dirname(ctx.qaCasesPath) + '/');
  write(kickoffPath, t);
  return true;
}

function updateRoadmap(md, target, newPlan, newFiles, newStatus) {
  const lines = md.split(/\r?\n/);
  let changed = false;
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    if (!line || !line.trim().startsWith('|')) continue;
    if (!line.includes(`| ${target.id} |`)) continue;
    const cols = line.split('|');
    if (cols.length < 9) continue;
    const status = cols[4].trim();
    const plan = cols[6].trim();
    const files = cols[7].trim();
    const nextStatus = newStatus || status;
    const nextPlan = newPlan || plan;
    const nextFiles = newFiles || files;
    const rebuilt = [
      cols[0],
      ` ${target.phase} `,
      ` ${target.id} `,
      ` ${target.item} `,
      ` ${nextStatus} `,
      ` ${target.owner} `,
      ` ${nextPlan} `,
      ` ${nextFiles} `,
      cols[8] ?? ' '
    ].join('|');
    if (rebuilt !== line) {
      lines[idx] = rebuilt;
      changed = true;
    }
    break;
  }
  return { text: lines.join('\n'), changed };
}

function main() {
  const args = parseArgs(process.argv);
  const md = read(mdPath);
  const rows = parseRoadmapRows(md);
  const row = rows.find(r => r.id === args.id);
  if (!row) {
    console.error(`Roadmap ID not found in ${mdPath}: ${args.id}`);
    process.exit(1);
  }

  const milestone = deriveMilestone(row.phase);
  const title = row.item;
  const slug = slugify(title);

  // Determine PRD path and QA folder
  const planCell = (row.plan || '').replace(/`/g, '');
  const filesCell = (row.files || '').replace(/`/g, '');
  const defaultPrd = path.join('PRDs', milestone, `${row.id}-${slug}-prd.md`);
  const prdPath = planCell || defaultPrd;
  const defaultQaFolder = path.join('QA', `${row.id}-${slug}`);
  const qaFolder = filesCell || defaultQaFolder;

  const absPrdPath = path.join(repoRoot, prdPath);
  const qaCasesPath = path.join(repoRoot, qaFolder, 'test-cases.md');
  const kickoffPath = path.join(repoRoot, 'PRDs', milestone, `${row.id}-${slug}-kickoff.md`);

  const prdCreated = ensurePrd(absPrdPath, row.id, row.owner, milestone, title);
  const qaCreated = ensureQa(qaCasesPath);
  const kickoffCreated = ensureKickoff(kickoffPath, { id: row.id, item: title, prdPath, qaCasesPath, createKickoff: args.kickoff });

  // Update roadmap line: ensure backticked paths and flip status if still Planned
  const desiredStatus = (/^planned/i.test(row.status) ? 'In Progress' : row.status);
  const desiredPlan = `\`${prdPath}\``;
  const desiredFiles = `\`${qaFolder}/\``;
  const { text: updatedMd, changed } = updateRoadmap(md, row, desiredPlan, desiredFiles, desiredStatus);
  if (changed) write(mdPath, updatedMd);

  // Regenerate HTML mirror
  try {
    execSync('node lib/generate-roadmap-html.mjs', { cwd: repoRoot, stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to regenerate roadmap HTML:', e?.message || e);
    process.exit(1);
  }

  console.log('Scaffold complete:', {
    prdCreated,
    qaCreated,
    kickoffCreated,
    prdPath,
    qaFolder: qaFolder + '/',
    kickoffPath: path.relative(repoRoot, kickoffPath),
  });
}

main();


