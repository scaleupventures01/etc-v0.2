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


