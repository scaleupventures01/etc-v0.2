#!/usr/bin/env node
// Simple roadmap mirror consistency check
// - Compares section 2 table rows in Plans/product-roadmap.md vs WBS rows in docs/product-roadmap.html
// - Validates Phase/ID/Item/Status/Owner parity and natural ascending phase ordering
// - Validates that all file paths in HTML are clickable links and exist on disk

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const mdPath = path.join(repoRoot, 'Plans', 'product-roadmap.md');
const htmlPath = path.join(repoRoot, 'docs', 'product-roadmap.html');

function read(p){ return fs.readFileSync(p, 'utf8'); }

function parseMarkdownTable(md){
  const lines = md.split(/\r?\n/);
  const start = lines.findIndex(l=>/\|\s*Phase\s*\|\s*ID\s*\|\s*Item\s*\|\s*Status/i.test(l));
  if(start === -1) return [];
  const rows = [];
  for(let i=start+2;i<lines.length;i++){
    const line = lines[i];
    if(!line.trim().startsWith('|')) break;
    const cols = line.split('|').slice(1,-1).map(c=>c.trim());
    if(cols.length < 6) continue;
    rows.push({ phase: cols[0], id: cols[1], item: cols[2], status: cols[3], owner: cols[4] });
  }
  return rows;
}

function parseHtmlWbs(html){
  // Very lightweight parser: find tbody rows under WBS details; extract first 5 <td>
  const sectionRegex = /<div class="section"[\s\S]*?<h2>2\. Phases and Milestones.*?<\/div>/i;
  const match = html.match(sectionRegex);
  let body = match ? match[0] : html;
  // strip scripts to avoid catching template hrefs inside JS strings
  body = body.replace(/<script[\s\S]*?<\/script>/g, '');
  const rowRegex = /<tr>[\s\S]*?<\/tr>/g;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
  const rows = [];
  let r;
  while((r = rowRegex.exec(body))){
    const tds = Array.from(r[0].matchAll(cellRegex)).map(m=>normalizeHtmlText(m[1]));
    if(tds.length >= 5){
      rows.push({ phase: tds[0], id: tds[1], item: tds[2], status: tds[3], owner: tds[4] });
    }
  }
  return rows;
}

function decodeHtmlEntities(s){
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8212;|&mdash;/g, '—');
}

function normalizeHtmlText(s){
  return decodeHtmlEntities(String(s||'')
    .replace(/<[^>]+>/g,'')
    .replace(/`/g,'')
    .replace(/\s+/g,' ')
    .trim());
}

function normalizeMdText(s){
  return String(s||'')
    .replace(/`/g,'')
    .replace(/\s+/g,' ')
    .trim();
}

function normalizeStatus(s){
  const x = (s||'').toLowerCase();
  if(x.startsWith('done')) return 'done';
  if(x.includes('in progress')) return 'in progress';
  if(x.includes('ready')) return 'ready';
  if(x.includes('blocked')) return 'blocked';
  return 'planned';
}

function main(){
  const md = read(mdPath);
  const html = read(htmlPath);
  const mdRows = parseMarkdownTable(md).filter(r=>r.id && /^(2\.)/.test(r.id));
  const htmlRows = parseHtmlWbs(html).filter(r=>r.id && /^(2\.)/.test(r.id));

  const mdIndex = new Map(mdRows.map(r=>[r.id, r]));
  const htmlIndex = new Map(htmlRows.map(r=>[r.id, r]));

  const errors = [];

  // Parity check for IDs present in markdown
  for(const r of mdRows){
    const h = htmlIndex.get(r.id);
    if(!h){ errors.push(`Missing in HTML: ${r.id} ${r.item}`); continue; }
    if(normalizeHtmlText(h.phase) !== normalizeMdText(r.phase)) errors.push(`Phase mismatch for ${r.id}: md='${r.phase}' html='${h.phase}'`);
    if(normalizeHtmlText(h.item) !== normalizeMdText(r.item)) errors.push(`Item mismatch for ${r.id}: md='${r.item}' html='${h.item}'`);
    if(normalizeStatus(h.status) !== normalizeStatus(r.status)) errors.push(`Status mismatch for ${r.id}: md='${r.status}' html='${h.status}'`);
    if(h.owner !== r.owner) errors.push(`Owner mismatch for ${r.id}: md='${r.owner}' html='${h.owner}'`);
  }

  // Ordering rule: natural ascending M order (M0, M1, M2, M3, M4, M5, ...)
  const expectedOrder = ['M0','M1','M2','M3','M4','M5','M6','M7','M8','M9'];
  const firstIndex = new Map();
  htmlRows.forEach((r, i)=>{
    const tag = (r.phase||'').split('—')[0].trim();
    if(!firstIndex.has(tag)) firstIndex.set(tag, i);
  });
  let last = -1;
  for(const tag of expectedOrder){
    const idx = firstIndex.has(tag) ? firstIndex.get(tag) : -1;
    if(idx === -1) continue;
    if(idx < last){
      errors.push(`Ordering rule violated: ${tag} appears before a lower-numbered phase in HTML.`);
      break;
    }
    last = idx;
  }

  // Link existence check in HTML tables
  const linkRegex = /<a\s+class="file-link"\s+href="([^"]+)">/g;
  let m;
  while((m = linkRegex.exec(html))){
    const target = m[1];
    // ignore in-page anchors and template placeholders inside JS
    if(target.startsWith('#') || target.includes('${')) continue;
    const abs = path.join(path.dirname(htmlPath), target);
    // allow directory links and globs collapsed to directories
    if(abs.endsWith('/') && fs.existsSync(abs)) continue;
    if(!fs.existsSync(abs)){
      // allow optional results links tagged with data-optional
      const tail = html.slice(linkRegex.lastIndex, linkRegex.lastIndex+200);
      const isOptional = /data-optional/.test(tail);
      if(!isOptional) errors.push(`Missing file for link: ${target}`);
    }
  }

  if(errors.length){
    console.error('Roadmap sync check failed:\n' + errors.map(e=>' - '+e).join('\n'));
    process.exit(1);
  }
  console.log('Roadmap sync check passed.');
}

main();


