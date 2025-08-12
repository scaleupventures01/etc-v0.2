# Test Cases — 2.1.1.2 Core Features v0

Source PRD: `PRDs/M0/2.1.1.2-core-features-v0-prd.md`

## Environment
- macOS latest; Node LTS; local preview via Vite

## Scenarios
1. Rules CRUD: create/update/toggle/delete; ordering by priority; persists across reload.
2. Verdict evaluation: sample trade evaluated deterministically; rule hits and reasons match expectations.
3. Journal: create entry with optional verdict snapshot; edit entry; persists across reload.
4. Analytics: counts, win rate, average R:R reflect journal entries accurately.
5. Flags: disable a subfeature → no broken navigation or errors.

## Acceptance
- All scenarios pass; zero console errors; verdict p95 ≤ 3s; evidence in `test-results-<yyyy-mm-dd>.md` (Overall Status: Pass).


