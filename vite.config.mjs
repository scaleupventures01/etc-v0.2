import { defineConfig } from 'vite';

// Vite will treat project root's index.html as the entry automatically.
// We keep config minimal to avoid changing app behavior.
export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    strictPort: true,
    open: false
  },
  preview: {
    port: 5173,
    strictPort: true
  },
  build: {
    // Keep non-module loader script in assets without bundling it
    assetsInclude: ['js/entry-loader.js']
  }
});


