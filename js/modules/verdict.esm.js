import { Rules } from './rules.esm.js';
import { timeStart, timeEnd } from '../core/utils.esm.js';

function normalizeTradeInput(textOrObj) {
  if (typeof textOrObj === 'object' && textOrObj) return textOrObj;
  const text = String(textOrObj || '').trim();
  // Very simple parser placeholder; expects CSV-ish: symbol,side,size,entry,exit(optional)
  const parts = text.split(/[\s,;]+/).filter(Boolean);
  const [symbol, side, sizeStr, entryStr, exitStr] = parts;
  const size = Number(sizeStr);
  const entry = Number(entryStr);
  const exit = exitStr != null ? Number(exitStr) : undefined;
  return { symbol, side, size, entry, exit };
}

function evaluateAgainstRule(trade, rule) {
  // Minimal predicate contract: if rule.params.predicate is a string among known predicates
  const p = rule?.params || {};
  const pred = p?.predicate;
  switch (pred) {
    case 'size_max': {
      const max = Number(p?.max ?? Number.POSITIVE_INFINITY);
      const hit = Number(trade?.size ?? 0) > max;
      return hit ? { decision: 'block', reason: `Size ${trade.size} > max ${max}` } : null;
    }
    case 'rr_min': {
      const target = Number(p?.min ?? 0);
      if (trade?.entry != null && trade?.exit != null) {
        const rr = Math.abs((trade.exit - trade.entry) / (trade.entry || 1));
        const hit = rr < target;
        return hit ? { decision: 'warn', reason: `R:R ${rr.toFixed(2)} < ${target}` } : null;
      }
      return null;
    }
    default:
      return null;
  }
}

export function evaluateTradeText(text, plan, options) {
  const trade = normalizeTradeInput(text);
  const activeRules = Rules.listSorted().filter(r => r?.active);
  timeStart('verdict');
  const hits = [];
  const reasons = [];
  let decision = 'allow';
  for (const rule of activeRules) {
    const outcome = evaluateAgainstRule(trade, rule);
    if (!outcome) continue;
    hits.push(rule.id);
    reasons.push(outcome.reason);
    if (outcome.decision === 'block') {
      decision = 'block';
      // keep collecting reasons, but block has precedence
    } else if (outcome.decision === 'warn' && decision !== 'block') {
      decision = 'warn';
    }
  }
  const durationMs = timeEnd('verdict');
  return {
    verdict: decision,
    reasons,
    hits,
    evaluated_at: Date.now(),
    p95_ms_hint: durationMs
  };
}

export const Verdict = { evaluateTradeText };


