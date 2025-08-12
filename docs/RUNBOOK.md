L1: # Incident Runbook (Local MVP)
L2: 
L3: ## Overview
L4: This runbook covers incident handling for the local-first MVP (`index.html`) including UI errors, data corruption, and recovery steps.
L5: 
L6: ## Severity Levels
L7: - SEV-1: App unusable for all users (cannot load/seed data)
L8: - SEV-2: Core flows blocked (cannot save plan or log journal)
L9: - SEV-3: Degraded experience (toasts/banners/diagnostics issues)
L10: 
L11: ## Triage Steps
L12: 1) Reproduce issue; capture console logs and `sessionStorage['lastError']` if present.
L13: 2) Toggle Monitoring in Settings to capture breadcrumbs (dev only).
L14: 3) Check CSP console for violations after recent changes.
L15: 
L16: ## Recovery Steps
L17: - If data inconsistency suspected:
L18:   1) Open Settings → Backup & Restore.
L19:   2) Export Backup (if possible) for evidence.
L20:   3) If prior backup exists: Import Backup JSON; verify plan/journal restored.
L21: - If UI stuck due to error overlay: Reload; verify auth gate and resume.
L22: 
L23: ## Communication
L24: - Add summary and steps taken to PRD 9.5 Reviewer Notes with date/owner.
L25: - Reference `docs/Excellence-Standard.md` and apply the Excellence Checklist when closing incidents; provide high‑signal notes and link evidence.
L26: 
L27: ## Postmortem
L28: - Document root cause, impact, and fixes in PRD section 8 (Changelog).
L29: 
L30: ## Checklist
L31: - [ ] Console logs captured (with timestamps)
L32: - [ ] `lastError` saved (if available)
L33: - [ ] Backup exported (if possible)
L34: - [ ] Restore attempted and verified
L35: - [ ] Changelog and PRD notes updated
L36: - [ ] Excellence Checklist applied (summary, evidence links, roadmap/mirror verified if status flips)

## Size Governance (Phase 4)
- Run: `node lib/check-size.mjs`
- Thresholds: WARN > 400 lines; FAIL > 600 lines
- Scope: `.js`, `.mjs`, `.cjs`, `.css`, `.html`
- Ignore: Directories `node_modules`, `.git`, `QA`, `docs`; Files: `index.html`
- CI Gate: Treat WARN as advisory. Treat FAIL as blocking. Integrate a CI step that executes `node lib/check-size.mjs` and fails the job on non‑zero exit.
- Reporting: Publish results in `QA/file-architecture-split/test-results-YYYY-MM-DD.md` under "Phase 4 (2.3.2)".


## Release/Push Procedure

Preconditions
- QA results published with Overall Status: Pass and linked in PRD 9.4
- Roadmap updated and HTML mirror in sync (same change set)

Steps
- Merge/push to default branch (`main`): `git push -u origin main`
- Optional: create and push a tag: `git tag -a vX.Y -m "<release notes>" && git push --tags`

Notes
- For multi-feature ranges, repeat per feature after each Done flip; ensure ordering rules hold after merges.

