# Test Cases — 2.1.1.4 Auth: Email/Password

Source PRD: `PRDs/M0/2.1.1.4-auth-email-password-prd.md`

## Environment
- macOS latest; Node LTS; local app server

## Scenarios
1. Login success with seeded admin → session established; guard passes.
2. Login failure → error displayed; attempt count increments.
3. Lockout/backoff after N failed attempts; login disabled during lockout.
4. Logout clears session; guard blocks access.
5. Security scans: deps/SAST/secrets/SBOM → no High/Critical.

## Acceptance
- All scenarios pass; Overall Status: Pass in `test-results-<yyyy-mm-dd>.md`.


