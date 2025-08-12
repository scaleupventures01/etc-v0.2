# Test Cases — 2.1.1.9 Trade Ticket Cap + Counter‑Trend Brake

Source PRD: `PRDs/M0/2.1.1.9-trade-limits-prd.md`

## Scenarios
1. Daily trade ticket cap enforced; soft‑block prompts override note when exceeded.
2. Counter‑trend detection triggers soft‑block; override requires note; event logged.
3. Overrides captured and visible in journal/limits log.
4. No hard crash; UX messages clear.

## Acceptance
- Results recorded in `test-results-<yyyy-mm-dd>.md` with Overall Status: Pass.


