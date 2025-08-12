# Elite Trading Coach AI — MVP v.01

## Definition of Done (Executive Summary)

Done means shipped code + green CI + published QA Pass + roadmap/mirror updated in the same commit (and perf budgets where applicable). Documentation‑only or QA‑only changes cannot mark features Done.

See `PRDs/README.md` for the enforced Definition of Done, Ready/Done gates, Proof‑of‑Done checklist, and CI enforcement.

Final action after QA Pass and roadmap mirror update: push/merge to the default branch (`main`); optionally tag the release.

## Excellence Standard

All roles follow the Excellence Standard (best‑work‑first, minimal tokens, evidence‑driven). See `docs/Excellence-Standard.md` and PRD section 10 (Excellence Checklist) for required links and gates.

## UI Quality Gate (Real Browser)

- Mandatory for any UI‑affecting change before Ready/Done flips:
  - Run unit tests: `npm test` (happy‑dom)
  - Run real‑browser smoke: `npm run e2e:install` (first time), then `npm run e2e` or `npm run e2e:local`
  - Gate: Zero console errors and warnings; `#app` mounts; screenshot captured
  - Publish QA results and evidence under `QA/<id>-<slug>/` and link in PRD 9.4 before flipping status

Scripts
- `npm run e2e` — Run Playwright smoke against an existing preview/dev server
- `npm run e2e:local` — Start preview on 5173, run E2E smoke, stop preview

