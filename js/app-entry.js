// ESM entry: imports barrel facades so modules can be consumed via imports later.
import { AppConfig, StorageCore, Utils } from './core/index.js';
import { seedFounderTenant } from './core/seed.esm.js';
import { UIComponents, UINavigation, UIErrorHandler } from './ui/index.js';
import { TradingPlan, Verdict, Journal, Tenant } from './modules/index.js';
import { getCurrentRoute, onRouteChange, navigateTo } from './ui/router.esm.js';
import { showWizard, hideWizard } from './ui/views/wizard-view.esm.js';
import { showVerdict, hideVerdict } from './ui/views/verdict-view.esm.js';
import { showJournal, hideJournal } from './ui/views/journal-view.esm.js';
import { showSaved, hideSaved } from './ui/views/saved-plan-view.esm.js';

// Expose a DI-ready app object for future phases
export const App = {
  config: AppConfig,
  storage: StorageCore,
  utils: Utils,
  ui: { components: UIComponents, navigation: UINavigation, errors: UIErrorHandler },
  modules: { TradingPlan, Verdict, Journal, Tenant }
};

// Optional: attach to window for backward compatibility during migration
window.__App = App;

function ensureRoot() {
  let root = document.getElementById('app');
  if (!root) {
    root = document.createElement('div');
    root.id = 'app';
    document.body.appendChild(root);
  }
  return root;
}

function mountShell() {
  const root = ensureRoot();
  if (root.querySelector('#wizardSection')) return; // already mounted
  root.innerHTML = `
    <main style="padding:16px">
      <section id="wizardSection" class="hidden"><h1>Plan Wizard</h1></section>
      <section id="verdictSection" class="hidden"><h1>Verdict</h1></section>
      <section id="journalSection" class="hidden"><h1>Journal</h1></section>
      <section id="savedPlanSection" class="hidden"><h1>Saved Plan</h1></section>
    </main>
  `;
}

function render(name) {
  mountShell();
  const ids = {
    landing: 'wizardSection',
    wizard: 'wizardSection',
    saved: 'savedPlanSection',
    verdict: 'verdictSection',
    journal: 'journalSection'
  };
  const activeId = ids[name] || ids.landing;
  ['wizardSection','verdictSection','journalSection','savedPlanSection'].forEach((id)=>{
    const el = document.getElementById(id);
    if (!el) return;
    if (id === activeId) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });

  // Wire views when shown
  if (name === 'wizard' || name === 'landing') {
    showWizard(); hideVerdict(); hideJournal(); hideSaved();
  } else if (name === 'verdict') {
    showVerdict(); hideWizard(); hideJournal(); hideSaved();
  } else if (name === 'journal') {
    showJournal(); hideWizard(); hideVerdict(); hideSaved();
  } else if (name === 'saved') {
    showSaved(); hideWizard(); hideVerdict(); hideJournal();
  }
}

function boot() {
  // Initial render
  try {
    // Best-effort idempotent seed on first boot (no-op on repeats)
    seedFounderTenant();
  } catch (e) {
    console.error('[seed] Founder/Admin seeding skipped:', e?.message || e);
  }
  render(getCurrentRoute());
  // React to hash changes
  onRouteChange((name) => render(name));
  // Default route
  if (!window.location.hash) navigateTo('wizard');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}


