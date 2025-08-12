# Test Cases — 2.1.1.6 Deployment: Vercel + Runbook

## Scenarios
1. Deploy to Vercel main succeeds; build logs clean.
2. Health check endpoint returns 200.
3. Rollback steps in runbook verified (dry-run acceptable).
4. Secrets present only in Vercel; not in repo.

## Acceptance
- Results logged in `test-results-<yyyy-mm-dd>.md` with Overall Status: Pass.


