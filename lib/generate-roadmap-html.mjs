#!/usr/bin/env node
// Generator to update docs/product-roadmap.html WBS tables from Plans/product-roadmap.md section 2
// Rebuilds each subsection (2.x.y) table body from the canonical markdown rows.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const mdPath = path.join(repoRoot, 'Plans', 'product-roadmap.md');
const htmlPath = path.join(repoRoot, 'docs', 'product-roadmap.html');

function read(p){ return fs.readFileSync(p, 'utf8'); }
function write(p, s){ fs.writeFileSync(p, s); }

function parseMdRows(md){
  const lines = md.split(/\r?\n/);
  const rows = [];
  for(let idx=0; idx<lines.length; idx++){
    if(/\|\s*Phase\s*\|\s*ID\s*\|\s*Item\s*\|\s*Status/i.test(lines[idx])){
      // Skip separator line next
      idx += 2;
      for(; idx < lines.length; idx++){
        const line = lines[idx];
        if(!line || !line.trim().startsWith('|')){ break; }
        const cols = line.split('|').slice(1,-1).map(c=>c.trim());
        if(cols.length < 7) continue;
        rows.push({ phase: cols[0], id: cols[1], item: cols[2], status: cols[3], owner: cols[4], plan: cols[5]||'', files: cols[6]||'' });
      }
    }
  }
  return rows;
}

function mapPathToHref(p){
  let clean = p.replace(/^`|`$/g,'');
  // collapse globs to directory
  if(clean.includes('*')){
    clean = clean.split('*')[0];
  }
  return clean
    .replace(/^docs\//,'../docs/')
    .replace(/^QA\//,'../QA/')
    .replace(/^PRDs\//,'../PRDs/')
    .replace(/^Plans\//,'../Plans/')
    .replace(/^js\//,'../js/')
    .replace(/^css\//,'../css/')
    .replace(/^lib\//,'../lib/')
    .replace(/^team\//,'../team/')
    .replace(/^index\.html$/,'../index.html');
}

function toHtmlCells(r){
  function splitArtifacts(csv){
    if(!csv) return [];
    return csv
      .replace(/`/g, '')
      .replace(/\bQA:\s*/gi, '')
      .split(/[;,]+/)
      .map(s=>s.trim())
      .filter(Boolean);
  }
  function toLinks(csv){
    const parts = splitArtifacts(csv);
    if(!parts.length) return '—';
    return parts.map(p=>{
      const clean = p.replace(/^`|`$/g,'');
      const href = mapPathToHref(clean);
      return `<a class="file-link" href="${href}">${clean}</a>`;
    }).join(', ');
  }
  function toPlanLink(plan){
    const clean = (plan||'').replace(/^`|`$/g,'');
    if(!clean) return '—';
    const href = mapPathToHref(clean);
    return `<a class="file-link" href="${href}">${clean}</a>`;
  }
  return [
    `<td>${r.phase}</td>`,
    `<td>${r.id}</td>`,
    `<td>${r.item}</td>`,
    `<td>${r.status}</td>`,
    `<td>${r.owner}</td>`,
    `<td>${toPlanLink(r.plan)}</td>`,
    `<td>${toLinks(r.files)}</td>`,
    `<td>${toLinks(r.files)}</td>`
  ].join('\n');
}

function injectRows(html, rows){
  let out = html;
  // Identify all subsection panels by summary containing an id like 2.x.y
  const summaryRegex = /<details[^>]*class=\"panel\"[^>]*>\s*<summary>[\s\S]*?(2\.[0-9]+\.[0-9]+)[\s\S]*?<\/summary>/g;
  const found = [];
  let m;
  while((m = summaryRegex.exec(html))){ found.push(m[1]); }
  const subsectionIds = Array.from(new Set(found));
  for(const sid of subsectionIds){
    const panelRegex = new RegExp(`(<details[^>]*class=\\"panel\\"[^>]*>\\s*<summary>[\\s\\S]*?${sid}[\\s\\S]*?<\\/summary>[\\s\\S]*?)<tbody>[\\s\\S]*?<\\/tbody>`);
    const subrows = rows.filter(r=>r.id.startsWith(sid)).map(r=>`<tr>\n${toHtmlCells(r)}\n</tr>`).join('\n');
    out = out.replace(panelRegex, (whole, beforeTbody)=>{
      return `${beforeTbody}<tbody>\n${subrows}\n</tbody>`;
    });
  }
  // Update Last Mirror Sync
  out = out.replace(/(<span data-sync>)([^<]*)(<\/span>)/, `$1${new Date().toISOString().slice(0,19).replace('T',' ')}$3`);

  // Also pre-render At-a-Glance bars from markdown to avoid runtime discrepancies
  const phases = ['M2', 'M5', 'M3'];
  const percentByPhase = new Map();
  phases.forEach(prefix=>{
    const phaseRow = rows.find(r=>r.phase.startsWith(prefix));
    const phaseName = phaseRow ? phaseRow.phase.split('—')[0].trim() : prefix;
    const sub = rows.filter(r=>r.phase.startsWith(prefix));
    const totals = sub.reduce((acc,r)=>{
      const s = (r.status||'').toLowerCase();
      if(s.startsWith('done')) acc.done++;
      else if(s.includes('in progress')) acc.inprog++;
      else if(s.includes('ready')) acc.ready++;
      else if(s.includes('blocked')) acc.blocked++;
      else acc.planned++;
      acc.total++;
      return acc;
    }, {done:0,inprog:0,ready:0,blocked:0,planned:0,total:0});
    const pct = totals.total ? Math.round((totals.done / totals.total) * 100) : 0;
    percentByPhase.set(prefix, pct);
  });
  function applyCard(outHtml, anchor, pct){
    const color = pct === 100 ? '#28a745' : '#f1c40f';
    // width replacement: ensure we match 0 or number followed by optional %
    const widthRe = new RegExp(`(<a href=\\"${anchor}\\"[\\s\\S]*?<div style=\\"height:6px[\\s\\S]*?<span style=\\"display:block; height:6px; width:)`+
                               `(?:[0-9]+|0)(?:%?);?([^>]*>)[\\s\\S]*?<\\/span>`);
    if(widthRe.test(outHtml)){
      outHtml = outHtml.replace(widthRe, `$1${pct}%; background:${color};$2</span>`);
    }
    // percentage label replacement
    const labelRe = new RegExp(`(<a href=\\"${anchor}\\"[\\s\\S]*?<span data-pct>)`+
                               `[^<]*(<\\/span>)`);
    if(labelRe.test(outHtml)){
      outHtml = outHtml.replace(labelRe, `$1${pct}%$2`);
    }
    return outHtml;
  }
  out = applyCard(out, '#phase-M2', percentByPhase.get('M2')||0);
  out = applyCard(out, '#phase-M5', percentByPhase.get('M5')||0);
  out = applyCard(out, '#phase-M3', percentByPhase.get('M3')||0);
  return out;
}

function main(){
  const md = read(mdPath);
  const html = read(htmlPath);
  const rows = parseMdRows(md);
  const updated = injectRows(html, rows);
  write(htmlPath, updated);
  console.log('Regenerated docs/product-roadmap.html from canonical markdown for all subsections.');
}

main();


