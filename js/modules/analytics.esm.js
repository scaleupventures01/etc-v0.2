import { Journal } from './journal.esm.js';

export function calcCounts(entries = Journal.list()) {
  return { total: entries.length };
}

export function calcWinRate(entries = Journal.list()) {
  if (!Array.isArray(entries) || entries.length === 0) return 0;
  const wins = entries.filter(e => Number(e?.pnl ?? 0) > 0).length;
  return wins / entries.length;
}

export function calcAverageRR(entries = Journal.list()) {
  if (!Array.isArray(entries) || entries.length === 0) return 0;
  const vals = entries.map(e => Number(e?.rr ?? 0)).filter(Number.isFinite);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export const Analytics = { calcCounts, calcWinRate, calcAverageRR };


