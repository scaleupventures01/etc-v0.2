# 2025-08-11 — Phase 0–1 (2.3.3.1–2.3.3.2) Tooling and Module System

Scope: Vite/ESLint/Prettier/CI bootstrap and initial ESM barrels + entry.

## Incidents and Resolutions

1) npm ERESOLVE (ESLint 9 vs TS‑ESLint 7)
- What: `npm install` failed due to peer dependency mismatch.
- Why (10‑Why summary): Latest ESLint v9 requires TS‑ESLint 8; template lacked version matrix; strict peer deps; no preflight peer audit.
- Fix: Pin `@typescript-eslint/*` to 8.x; install succeeds.
- Prevent: Add Toolchain Matrix in PRD; run peer‑dep audit in CI.

2) ESLint v9 missing flat config
- What: `npm run lint` failed stating flat config missing.
- Why: ESLint v9 defaults to flat config; project only had `.eslintrc`.
- Fix: Add `eslint.config.mjs` (flat config).
- Prevent: Standardize flat config in templates; CI check for presence.

3) vitest not installed / happy‑dom missing
- What: `vitest` not found; later, `happy-dom` missing.
- Why: Tests added in Phase 1; deps not predeclared; env externalized.
- Fix: Add `vitest` and `happy-dom`; configure `vitest.config.mjs`.
- Prevent: Include test deps in Toolchain Matrix; CI test job.

4) Vite preview port collision (5173)
- What: `vite preview` failed with “Port 5173 is already in use”.
- Why: Previous preview left running; strictPort prevents fallback.
- Fix: `preview:stop` script; `preview:smoke` uses ephemeral port and parses URL; curl smoke then stop.
- Prevent: Use ephemeral port for local smoke; add stop step before starting preview.

5) Build warnings about non‑module scripts
- What: Vite warns non‑module `<script>` in `index.html`.
- Why: Legacy IIFEs retained during staged ESM migration.
- Fix: Acceptable for Phase 0–1; added a single module entry `js/app-entry.js`.
- Prevent: Complete ESM migration in later phases.

## Links
- PRD: `PRDs/M2/2.3.3.1-phase-0-foundation-vite-ci-linting-ts-opt-in-prd.md`
- QA: `QA/2.3.3.1-foundation/test-results-2025-08-11.md`
- CI: `.github/workflows/ci.yml`
- Scripts: `package.json` (preview:stop, preview:smoke)
