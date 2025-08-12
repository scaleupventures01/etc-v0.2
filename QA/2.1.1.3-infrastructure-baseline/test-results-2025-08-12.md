---
roadmap_id: 2.1.1.3
feature: Infrastructure Baseline
date: 2025-08-12
tester: Autonomous Agent
build: commit 9e504b8
overall_status: Blocked
---

# Test Results — 2.1.1.3 Infrastructure Baseline (2025-08-12)

## Environment
- macOS; Node LTS; Docker: unavailable

## Summary
- Scenario 1 (Dev run/health endpoint): Pass (200)
- Scenarios 2–5: Blocked (Docker not available for Postgres; migrations/seed/scans deferred)

## Details
- Started Next dev at port 3030; `GET /health` returned 200.
- Prisma client generated successfully.

## Evidence
- `.next-dev.log` (local; on request)

## Case Outcomes
| # | Scenario | Result | Notes |
| - | - | - | - |
| 1 | Dev run: start Next app; health 200 | Pass | Status 200 at `/health` |
| 2 | Prisma migrate applies; idempotent | Blocked | Postgres not running |
| 3 | Seed harness idempotent | Blocked | Postgres not running |
| 4 | CI checks incl. prisma migrate | Blocked | Deferred; local only |
| 5 | Security scans (deps/SAST/secrets/SBOM) | Blocked | Deferred |

## Overall Status
- Blocked — waiting on local Postgres (Docker) availability to complete scenarios 2–5.


