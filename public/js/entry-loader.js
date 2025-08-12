// HTTP bootstrap loader served from /public per 2.3.5
(() => {
  const script = document.createElement('script');
  script.type = 'module';
  // In dev/preview, Vite serves source files at /js/app-entry.js
  script.src = '/js/app-entry.js';
  script.onerror = () => {
    const msg = document.createElement('div');
    msg.style.padding = '1rem';
    msg.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    msg.textContent = 'Failed to load app module. Please reload or run via file:// fallback.';
    document.body.appendChild(msg);
  };
  document.body.appendChild(script);
})();
// Classic loader that selects the appropriate entry based on protocol.
// - On http(s): load ESM entry (js/app-entry.js)
// - On file://: load classic fallback (js/app-entry.file-fallback.js)
(function loadEntry() {
  var isFile = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
  var script = document.createElement('script');
  if (isFile) {
    script.defer = true;
    script.src = 'js/app-entry.file-fallback.js';
  } else {
    script.type = 'module';
    script.src = 'js/app-entry.js';
  }
  document.head.appendChild(script);
})();


