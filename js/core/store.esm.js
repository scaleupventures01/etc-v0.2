export function createStore(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(partial) {
    const next = typeof partial === 'function' ? partial(state) : { ...state, ...partial };
    state = next;
    listeners.forEach((l) => l(state));
    return state;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}

export const appStore = createStore({ currentView: 'landing' });


