(function initAuth(global) {
  if (!global.Utils) { throw new Error('Utils must be loaded before auth'); }

  const AUTH = { key: 'authSession', ttlMs: 8 * 60 * 60 * 1000 };
  let inMemoryAuthSession = null;

  function generateSessionToken() {
    const arr = new Uint8Array(16);
    (self.crypto || window.crypto).getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getAuthSession() {
    try {
      if (global.Utils.isStorageAvailable('sessionStorage')) {
        const raw = sessionStorage.getItem(AUTH.key);
        return raw ? JSON.parse(raw) : null;
      }
    } catch { /* fall through */ }
    return inMemoryAuthSession;
  }

  function setAuthSession(session) {
    try {
      if (global.Utils.isStorageAvailable('sessionStorage')) {
        sessionStorage.setItem(AUTH.key, JSON.stringify(session));
      } else {
        inMemoryAuthSession = session;
      }
    } catch {
      inMemoryAuthSession = session;
    }
  }

  function clearAuthSession() {
    try { sessionStorage.removeItem(AUTH.key); } catch { /* no-op */ }
    inMemoryAuthSession = null;
  }

  function isAuthSessionValid(s) { return !!(s && typeof s.expiresAt === 'number' && s.expiresAt > Date.now()); }

  function startAuthSession(ttlMs = AUTH.ttlMs) {
    const now = Date.now();
    const session = { token: generateSessionToken(), issuedAt: now, expiresAt: now + ttlMs };
    setAuthSession(session);
    return session;
  }

  global.AuthCore = { AUTH, getAuthSession, setAuthSession, clearAuthSession, isAuthSessionValid, startAuthSession };
})(window);


