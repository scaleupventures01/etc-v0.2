import { AppConfig } from '../core/config.esm.js';
import { StorageCore } from '../core/storage.esm.js';

function now() { return Date.now(); }

function generateId() { return `journal_${Math.random().toString(36).slice(2, 10)}_${now()}`; }

function loadEntries() {
  const key = AppConfig.STORAGE_KEYS.journal;
  const list = StorageCore.loadFromLocalStorage(key);
  return Array.isArray(list) ? list : [];
}

function persistEntries(list) {
  const key = AppConfig.STORAGE_KEYS.journal;
  StorageCore.saveToLocalStorage(key, list);
}

export function list() { return loadEntries(); }

export function create(entryInput) {
  const id = generateId();
  const entry = {
    id,
    trade: entryInput?.trade ?? {},
    verdictSnapshot: entryInput?.verdictSnapshot,
    pnl: entryInput?.pnl,
    rr: entryInput?.rr,
    tags: Array.isArray(entryInput?.tags) ? entryInput.tags : [],
    created_at: now()
  };
  const list = loadEntries();
  list.push(entry);
  persistEntries(list);
  return entry;
}

export function update(id, patch) {
  const list = loadEntries();
  const idx = list.findIndex(e => e?.id === id);
  if (idx === -1) throw new Error('Journal entry not found');
  const curr = list[idx];
  const next = {
    ...curr,
    trade: patch?.trade != null ? patch.trade : curr.trade,
    verdictSnapshot: patch?.verdictSnapshot != null ? patch.verdictSnapshot : curr.verdictSnapshot,
    pnl: patch?.pnl != null ? patch.pnl : curr.pnl,
    rr: patch?.rr != null ? patch.rr : curr.rr,
    tags: patch?.tags != null ? patch.tags : curr.tags
  };
  list[idx] = next;
  persistEntries(list);
  return next;
}

export function removeById(id) {
  const list = loadEntries();
  const next = list.filter(e => e?.id !== id);
  persistEntries(next);
}

export const Journal = { create, update, delete: removeById, list };


