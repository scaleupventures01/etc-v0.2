# Test Cases — 2.1.1.13 Password Reset

Source PRD: `PRDs/M0/2.1.1.13-password-reset-prd.md`

## Environment
- macOS latest; Node LTS; local app server

## Scenarios
1. Forgot: existing email → token issued; dev email sink contains link; API 200.
2. Forgot: non‑existing email → API 200; no token created.
3. Rate limit: multiple forgot requests per IP/email → limited with 429 after threshold.
4. Reset: valid token → password updated; prior sessions invalid; new session active.
5. Reset: invalid token → denied with generic UI; API 400.
6. Reset: expired token → denied with generic UI; API 410.
7. Reset: used token (replay) → denied; API 410/400.
8. Security scans: deps/SAST/secrets/SBOM → no High/Critical.

## Acceptance
- All scenarios pass; Overall Status: Pass in `test-results-<yyyy-mm-dd>.md`.


