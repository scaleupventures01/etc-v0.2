import { AppConfig } from '../core/config.esm.js';
import { StorageCore } from '../core/storage.esm.js';

function now() { return Date.now(); }

function generateId() {
  return `rule_${Math.random().toString(36).slice(2, 10)}_${now()}`;
}

function coercePriority(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  const i = Math.max(0, Math.min(999, Math.trunc(n)));
  return i;
}

export function validateRuleInput(input) {
  const errors = [];
  const name = String(input?.name ?? '').trim();
  if (!name) errors.push('Name is required');
  const active = Boolean(input?.active ?? true);
  const priority = coercePriority(input?.priority ?? 0);
  return { valid: errors.length === 0, errors, cleaned: { name, active, priority } };
}

function loadRulesList() {
  const key = AppConfig.STORAGE_KEYS.rules;
  const list = StorageCore.loadFromLocalStorage(key);
  return Array.isArray(list) ? list : [];
}

function persistRulesList(list) {
  const key = AppConfig.STORAGE_KEYS.rules;
  StorageCore.saveToLocalStorage(key, list);
}

export function listSorted() {
  const list = loadRulesList();
  return list
    .slice()
    .sort((a, b) => {
      const pa = coercePriority(a?.priority);
      const pb = coercePriority(b?.priority);
      if (pa !== pb) return pa - pb;
      return (a?.created_at ?? 0) - (b?.created_at ?? 0);
    });
}

export function create(ruleInput) {
  const { valid, errors, cleaned } = validateRuleInput(ruleInput);
  if (!valid) {
    const err = new Error('Invalid rule input: ' + errors.join(', '));
    err.details = errors;
    throw err;
  }
  const list = loadRulesList();
  const newRule = {
    id: generateId(),
    name: cleaned.name,
    params: ruleInput?.params ?? {},
    active: cleaned.active,
    priority: cleaned.priority,
    created_at: now(),
    updated_at: now()
  };
  list.push(newRule);
  persistRulesList(list);
  return newRule;
}

export function update(id, patch) {
  const list = loadRulesList();
  const idx = list.findIndex(r => r?.id === id);
  if (idx === -1) throw new Error('Rule not found');
  const current = list[idx];
  const next = {
    ...current,
    name: patch?.name != null ? String(patch.name).trim() : current.name,
    params: patch?.params != null ? patch.params : current.params,
    active: patch?.active != null ? Boolean(patch.active) : current.active,
    priority: patch?.priority != null ? coercePriority(patch.priority) : current.priority,
    updated_at: now()
  };
  list[idx] = next;
  persistRulesList(list);
  return next;
}

export function toggle(id, active) {
  return update(id, { active: Boolean(active) });
}

export function removeById(id) {
  const list = loadRulesList();
  const next = list.filter(r => r?.id !== id);
  persistRulesList(next);
}

export const Rules = { create, update, toggle, delete: removeById, listSorted };


