# Test Results — 2.1.1.2 Core Features v0 (2025-08-12)

Overall Status: Pass

- Build under test: local dev (workspace)
- Environment: macOS 14; Chrome (Playwright Desktop Chrome)

Unit tests (Vitest)
- 3 passed

E2E (Playwright)
- 2 passed: seed + core features roundtrip
- Zero console errors observed during core UI interactions

Cases
- Rules CRUD: Pass
- Verdict eval: Pass
- Journal with snapshot: Pass
- Analytics (counts/win rate/avg R:R): Pass
- Flags/navigation stable: Pass

Evidence
- E2E: tests/e2e/core-features.spec.mjs passed

Notes
- Predicates: size_max, rr_min
- Storage keys: etc_rules_v1, journal_entries
