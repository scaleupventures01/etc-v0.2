// Fallback entry for file:// protocol where ESM modules are blocked by CORS.
// This file relies on legacy globals already bundled in non-module scripts when needed.
(function bootFileProtocol() {
  function ensureRoot() {
    var root = document.getElementById('app');
    if (!root) {
      root = document.createElement('div');
      root.id = 'app';
      document.body.appendChild(root);
    }
    return root;
  }

  function mountShell() {
    var root = ensureRoot();
    if (root.querySelector('#wizardSection')) return;
    root.innerHTML = '<main style="padding:16px">\n' +
      '  <section id="wizardSection"><h1>Plan Wizard</h1><p>Running in local file mode. For full experience, run npm run preview.</p></section>\n' +
      '  <section id="verdictSection" class="hidden"><h1>Verdict</h1></section>\n' +
      '  <section id="journalSection" class="hidden"><h1>Journal</h1></section>\n' +
      '  <section id="savedPlanSection" class="hidden"><h1>Saved Plan</h1></section>\n' +
      '</main>';
  }

  function boot() {
    mountShell();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();


