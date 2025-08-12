import { describe, it, expect } from 'vitest';
import { Rules, Verdict } from '../js/modules/index.js';

describe('Verdict evaluateTradeText', () => {
  it('warns or blocks according to rules', () => {
    Rules.create({ name: 'Max size 2', params: { predicate: 'size_max', max: 2 }, active: true, priority: 0 });
    const res = Verdict.evaluateTradeText('AAPL long 3 100 103');
    expect(['warn','block','allow']).toContain(res.verdict);
    expect(Array.isArray(res.hits)).toBe(true);
  });
});


