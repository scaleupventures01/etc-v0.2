import { AppConfig } from './config.esm.js';

function createTenantHelpers(storage = localStorage) {
  const ACTIVE_KEY = 'tenant_active';
  const TENANTS_KEY = 'tenant_list';

  const unique = (arr) => Array.from(new Set(arr));

  function sanitizeTenantId(id) {
    try {
      const trimmed = String(id || '').trim();
      if (!/^[-_A-Za-z0-9]{1,32}$/.test(trimmed)) return '';
      return trimmed;
    } catch {
      return '';
    }
  }

  function loadList() {
    try {
      const raw = storage.getItem(TENANTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return unique(['default', ...parsed.filter(Boolean)]);
    } catch {
      return ['default'];
    }
  }

  function saveList(list) {
    const cleaned = unique((list || []).map(sanitizeTenantId).filter(Boolean));
    storage.setItem(TENANTS_KEY, JSON.stringify(cleaned));
  }

  function getActive() {
    const v = sanitizeTenantId(storage.getItem(ACTIVE_KEY) || 'default') || 'default';
    return v;
  }

  function setActive(id) {
    const v = sanitizeTenantId(id);
    if (!v) return getActive();
    const list = loadList();
    if (!list.includes(v)) {
      list.push(v);
      saveList(list);
    }
    storage.setItem(ACTIVE_KEY, v);
    return v;
  }

  function removeNamespace(id) {
    const tid = sanitizeTenantId(id);
    if (!tid || tid === 'default') return;
    const prefix = `${tid}::`;
    try {
      const keys = Object.keys(storage);
      keys.forEach((k) => {
        if (k.startsWith(prefix)) storage.removeItem(k);
      });
      const remaining = loadList().filter((t) => t !== tid);
      saveList(remaining);
    } catch {
      // no-op
    }
  }

  if (!storage.getItem(ACTIVE_KEY)) storage.setItem(ACTIVE_KEY, 'default');
  if (!storage.getItem(TENANTS_KEY)) storage.setItem(TENANTS_KEY, JSON.stringify(['default']));

  const nsKey = (baseKey) => `${getActive()}::${baseKey}`;

  return { sanitizeTenantId, list: loadList, getActive, setActive, removeNamespace, nsKey };
}

export function createStorageCore(storage = localStorage, config = AppConfig) {
  const TENANT = createTenantHelpers(storage);
  const { STORAGE_KEYS } = config;

  const loadFromLocalStorage = (key) => {
    try {
      const raw = storage.getItem(TENANT.nsKey(key));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const saveToLocalStorage = (key, value) => {
    storage.setItem(TENANT.nsKey(key), JSON.stringify(value));
    storage.setItem(TENANT.nsKey(STORAGE_KEYS.lastAccessed), String(Date.now()));
  };

  const removeFromLocalStorage = (key) => {
    storage.removeItem(TENANT.nsKey(key));
    storage.setItem(TENANT.nsKey(STORAGE_KEYS.lastAccessed), String(Date.now()));
  };

  const getCurrentPlan = () => loadFromLocalStorage(STORAGE_KEYS.current);
  const getDraft = () => loadFromLocalStorage(STORAGE_KEYS.draft);
  const getHistory = () => loadFromLocalStorage(STORAGE_KEYS.history) || [];
  const getJournal = () => loadFromLocalStorage(STORAGE_KEYS.journal) || [];

  const setCurrentPlan = (plan) => saveToLocalStorage(STORAGE_KEYS.current, plan);
  const setDraft = (draft) => saveToLocalStorage(STORAGE_KEYS.draft, draft);
  const clearDraft = () => removeFromLocalStorage(STORAGE_KEYS.draft);
  const setHistory = (history) => saveToLocalStorage(STORAGE_KEYS.history, history);
  const setJournal = (entries) => saveToLocalStorage(STORAGE_KEYS.journal, entries);

  return {
    TENANT,
    nsKey: TENANT.nsKey,
    loadFromLocalStorage,
    saveToLocalStorage,
    removeFromLocalStorage,
    getCurrentPlan,
    getDraft,
    getHistory,
    getJournal,
    setCurrentPlan,
    setDraft,
    clearDraft,
    setHistory,
    setJournal
  };
}

export const StorageCore = createStorageCore();


