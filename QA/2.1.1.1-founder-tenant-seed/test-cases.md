# Test Cases — 2.1.1.1 Founder Tenant Seed

Source PRD: `PRDs/M0/2.1.1.1-founder-tenant-seed-prd.md`

## Environment
- macOS latest; Node LTS

## Scenarios
1. First run creates Founder tenant and Admin user; returns success indicator.
2. Second run (idempotency) makes no changes; still exactly one tenant/admin.
3. Missing required envs → seed aborts with clear message and non‑zero exit.
4. Security spot check: repository contains no plaintext admin secret values.

## Acceptance
- All scenarios pass; outputs match expectations.
- Evidence recorded in `test-results-<yyyy-mm-dd>.md` with Overall Status: Pass.


