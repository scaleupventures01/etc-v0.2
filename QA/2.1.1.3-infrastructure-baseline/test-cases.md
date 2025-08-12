# Test Cases — 2.1.1.3 Infrastructure Baseline

Source PRD: `PRDs/M0/2.1.1.3-infrastructure-baseline-prd.md`

## Environment
- macOS latest; Node LTS; Docker (preferred) or local Postgres

## Scenarios
1. Dev run: start Next.js app; health endpoint returns 200.
2. Prisma migrate: apply initial migration; schema present; rerun is idempotent.
3. Seed harness: creates Founder/Admin on first run; second run no-ops.
4. CI checks: lint/build/test + prisma generate/migrate succeed.
5. Security scans: deps/SAST/secrets/SBOM report no High/Critical.

## Acceptance
- All scenarios pass; results recorded in `test-results-<yyyy-mm-dd>.md` with Overall Status: Pass.


