# Test Results — 2.1.1.1 Founder Tenant Seed (2025-08-12)

- Build under test: local preview (vite) — see commit hash in PRD 9.6
- Environment: macOS (user host), Chrome via Playwright
- Tester: Automation (Playwright)
- Overall Status: Pass

## Summary
- First run created `Founder` tenant meta and `Admin` user (role=admin)
- Second run was idempotent (no duplicates)
- Missing env `VITE_FOUNDER_ADMIN_EMAIL` produced a clear error message and aborted
- Screenshot evidence captured

## Evidence
- Screenshot: `QA/2.1.1.1-founder-tenant-seed/evidence/seed-smoke.png`
- Console: No errors observed during smoke

## Case Outcomes
| Case | Description | Result |
| --- | --- | --- |
| 1 | First run creates Founder tenant and Admin user | Pass |
| 2 | Second run is a no-op (idempotent) | Pass |
| 3 | Missing required envs → abort with message | Pass |
| 4 | Security spot check: no plaintext admin secrets in repo | Pass |


