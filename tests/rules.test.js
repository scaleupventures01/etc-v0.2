import { describe, it, expect } from 'vitest';
import { Rules } from '../js/modules/index.js';

describe('Rules module (local, pure ops)', () => {
  it('creates a rule and lists sorted', () => {
    const r = Rules.create({ name: 'Max size 1', params: { predicate: 'size_max', max: 1 }, priority: 5, active: true });
    expect(r.id).toBeTruthy();
    const list = Rules.listSorted();
    expect(Array.isArray(list)).toBe(true);
    expect(list.find(x => x.id === r.id)).toBeTruthy();
  });
});


