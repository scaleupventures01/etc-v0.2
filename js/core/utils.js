(function initUtils(global) {
  function isStorageAvailable(type) {
    try {
      const storage = window[type];
      const x = '__test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch {
      return false;
    }
  }

  function debounce(fn, waitMs = 150) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), waitMs);
    };
  }

  function memoize(fn, keyFn) {
    const cache = new Map();
    return (...args) => {
      const key = keyFn ? keyFn(...args) : JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const value = fn(...args);
      cache.set(key, value);
      return value;
    };
  }

  const timers = new Map();
  function timeStart(label) { timers.set(label, performance.now()); }
  function timeEnd(label) {
    const start = timers.get(label) ?? performance.now();
    const dur = performance.now() - start; timers.delete(label); return dur;
  }

  global.Utils = { isStorageAvailable, debounce, memoize, timeStart, timeEnd };
})(window);


