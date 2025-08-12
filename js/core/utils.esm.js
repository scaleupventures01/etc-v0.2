export function isStorageAvailable(type) {
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

export function debounce(fn, waitMs = 150) {
  let timeoutId = null;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), waitMs);
  };
}

export function memoize(fn, keyFn) {
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
export function timeStart(label) {
  timers.set(label, performance.now());
}

export function timeEnd(label) {
  const start = timers.get(label) ?? performance.now();
  const durationMs = performance.now() - start;
  timers.delete(label);
  return durationMs;
}


