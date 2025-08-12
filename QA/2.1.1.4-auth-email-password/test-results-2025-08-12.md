# Test Results — 2.1.1.4 Auth: Email/Password (2025-08-12)

- Build under test: Next.js dev, local Postgres
- Environment: macOS, Chrome (Playwright)
- Tester: Autonomous Agent
- Overall Status: Pass

## Summary
- Login success with seeded admin → Pass
- Login failure shows error and increments attempts → Pass
- Lockout/backoff → Pass (multi-submit exercised; 429 observed)
- Logout clears session; guard redirects to /login → Pass

## Evidence
- Flow: / → /login → POST /api/auth/login → /protected → POST /api/auth/logout

## Case Results
| Case | Description | Result |
| --- | --- | --- |
| 1 | Successful login with seeded admin | Pass |
| 2 | Failed login shows error | Pass |
| 3 | Lockout/backoff after N fails | Pass |
| 4 | Logout clears session, guard blocks | Pass |
