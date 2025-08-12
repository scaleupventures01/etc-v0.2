(function initStorage(global) {
  if (!global.AppConfig) { throw new Error('AppConfig must be loaded before storage'); }
  const { STORAGE_KEYS } = global.AppConfig;

  // TENANT namespace helper
  const TENANT = (() => {
    const ACTIVE_KEY = 'tenant_active';
    const TENANTS_KEY = 'tenant_list';

    function unique(arr) { return Array.from(new Set(arr)); }

    function sanitizeTenantId(id) {
      try {
        const trimmed = String(id || '').trim();
        if (!/^[-_A-Za-z0-9]{1,32}$/.test(trimmed)) return '';
        return trimmed;
      } catch { return ''; }
    }

    function loadList() {
      try {
        const raw = localStorage.getItem(TENANTS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        const withDefault = unique(['default', ...parsed.filter(Boolean)]);
        return withDefault;
      } catch { return ['default']; }
    }

    function saveList(list) {
      const cleaned = unique((list || []).map(sanitizeTenantId).filter(Boolean));
      localStorage.setItem(TENANTS_KEY, JSON.stringify(cleaned));
    }

    function getActive() {
      const v = sanitizeTenantId(localStorage.getItem(ACTIVE_KEY) || 'default') || 'default';
      return v;
    }

    function setActive(id) {
      const v = sanitizeTenantId(id);
      if (!v) return getActive();
      const list = loadList();
      if (!list.includes(v)) { list.push(v); saveList(list); }
      localStorage.setItem(ACTIVE_KEY, v);
      return v;
    }

    function removeNamespace(id) {
      const tid = sanitizeTenantId(id);
      if (!tid || tid === 'default') return;
      const prefix = `${tid}::`;
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(k => { if (k.startsWith(prefix)) localStorage.removeItem(k); });
        const remaining = loadList().filter(t => t !== tid);
        saveList(remaining);
      } catch { /* no-op */ }
    }

    function nsKey(baseKey) { return `${getActive()}::${baseKey}`; }

    if (!localStorage.getItem(ACTIVE_KEY)) localStorage.setItem(ACTIVE_KEY, 'default');
    if (!localStorage.getItem(TENANTS_KEY)) localStorage.setItem(TENANTS_KEY, JSON.stringify(['default']));

    return { sanitizeTenantId, list: loadList, getActive, setActive, removeNamespace, nsKey };
  })();

  function loadFromLocalStorage(key) {
    try {
      const raw = localStorage.getItem(TENANT.nsKey(key));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveToLocalStorage(key, value) {
    localStorage.setItem(TENANT.nsKey(key), JSON.stringify(value));
    localStorage.setItem(TENANT.nsKey(STORAGE_KEYS.lastAccessed), String(Date.now()));
  }

  function removeFromLocalStorage(key) {
    localStorage.removeItem(TENANT.nsKey(key));
    localStorage.setItem(TENANT.nsKey(STORAGE_KEYS.lastAccessed), String(Date.now()));
  }

  function getCurrentPlan() { return loadFromLocalStorage(STORAGE_KEYS.current); }
  function getDraft() { return loadFromLocalStorage(STORAGE_KEYS.draft); }
  function getHistory() { return loadFromLocalStorage(STORAGE_KEYS.history) || []; }
  function getJournal() { return loadFromLocalStorage(STORAGE_KEYS.journal) || []; }

  function setCurrentPlan(plan) { saveToLocalStorage(STORAGE_KEYS.current, plan); }
  function setDraft(draft) { saveToLocalStorage(STORAGE_KEYS.draft, draft); }
  function clearDraft() { removeFromLocalStorage(STORAGE_KEYS.draft); }
  function setHistory(history) { saveToLocalStorage(STORAGE_KEYS.history, history); }
  function setJournal(entries) { saveToLocalStorage(STORAGE_KEYS.journal, entries); }

  global.StorageCore = {
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
    setJournal,
  };
})(window);


