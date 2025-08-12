import { describe, it, expect } from 'vitest';
import { Analytics } from '../js/modules/index.js';

describe('Analytics calculators', () => {
  it('computes counts/winrate/avgRR from synthetic entries', () => {
    const entries = [
      { pnl: 10, rr: 2 },
      { pnl: -5, rr: -1 },
      { pnl: 3, rr: 0.5 }
    ];
    expect(Analytics.calcCounts(entries).total).toBe(3);
    expect(Analytics.calcWinRate(entries)).toBeCloseTo(2 / 3);
    expect(Analytics.calcAverageRR(entries)).toBeCloseTo((2 - 1 + 0.5) / 3);
  });
});


