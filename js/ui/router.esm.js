import { StorageCore } from '../core/storage.esm.js';

const routes = {
  landing: '#/',
  wizard: '#/wizard',
  saved: '#/saved',
  verdict: '#/verdict',
  journal: '#/journal'
};

export function getCurrentRoute(hash = window.location.hash || '#/') {
  const h = hash.split('?')[0];
  if (h.startsWith('#/wizard')) return 'wizard';
  if (h.startsWith('#/saved')) return 'saved';
  if (h.startsWith('#/verdict')) return 'verdict';
  if (h.startsWith('#/journal')) return 'journal';
  return 'landing';
}

export function navigateTo(name) {
  const target = routes[name] || routes.landing;
  if (window.location.hash !== target) window.location.hash = target;
}

export function guard(name) {
  // Require current plan for verdict/journal/saved
  if (name === 'verdict' || name === 'journal' || name === 'saved') {
    return !!StorageCore.getCurrentPlan();
  }
  return true;
}

export function onRouteChange(callback) {
  function handler() {
    const name = getCurrentRoute();
    callback(name);
  }
  window.addEventListener('hashchange', handler);
  return () => window.removeEventListener('hashchange', handler);
}


