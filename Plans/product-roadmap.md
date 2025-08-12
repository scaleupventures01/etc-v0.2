---
title: Product Roadmap
version: v0.1
last-updated: 2025-08-12
owner: VP-Product / CTO / VP-Engineering
---

## 0. Executive Rollup

- Overall: Planned → Sprint 1 in preparation (M0 foundation)
- Focus (next 2 sprints):
  - Sprint 1: Repo/CI, auth + tenancy + baseline schema, Rule Set/Rule CRUD; discipline scaffolding (checklists, ticket cap, brakes)
  - Sprint 2: Verdict engine v0, Journal + analytics v0, prod deploy + runbook; ATR advisory; MFE tracking
- Top risks: scope creep at M0; over-engineering multi-tenancy; auth complexity
- Mitigations: keep verdict deterministic; shared-schema with strict `tenant_id`; Credentials-only Auth.js; reversible edits; CI gates


## 2. Phases and Milestones (Canonical)

| Phase | ID | Item | Status | Owner | PRD/Plan | Files/QA |
| --- | --- | --- | --- | --- | --- | --- |
| M0 — Founder Instance | 2.1.1.1 | Seed Founder tenant and admin user | Done (2025-08-12) | PM | `PRDs/M0/2.1.1.1-founder-tenant-seed-prd.md` | `QA/2.1.1.1-founder-tenant-seed/test-results-2025-08-12.md` |
| M0 — Founder Instance | 2.1.1.2 | Core features v0: rules, verdict, journal, analytics | Done (2025-08-12) | Implementation Owner | `PRDs/M0/2.1.1.2-core-features-v0-prd.md` | `QA/2.1.1.2-core-features-v0/test-results-2025-08-12.md` |
| M0 — Founder Instance | 2.1.1.3 | Infrastructure baseline: Next.js + Postgres + Prisma | In Progress | CTO | `PRDs/M0/2.1.1.3-infrastructure-baseline-prd.md` | `QA/2.1.1.3-infrastructure-baseline/` |
| M0 — Founder Instance | 2.1.1.4 | Authentication: email/password (Auth.js) | In Progress | Implementation Owner | `PRDs/M0/2.1.1.4-auth-email-password-prd.md` | `QA/2.1.1.4-auth-email-password/` |
| M0 — Founder Instance | 2.1.1.5 | Testing v0: unit tests; manual QA run (smoke) | In Progress | QA | `PRDs/M0/2.1.1.5-testing-v0-prd.md` | `QA/2.1.1.5-testing-v0/` |
| M0 — Founder Instance | 2.1.1.6 | Deployment: Vercel prod + basic runbook | In Progress | SRE/DevOps | `PRDs/M0/2.1.1.6-deployment-vercel-runbook-prd.md` | `QA/2.1.1.6-deployment-vercel-runbook/` |
| M0 — Founder Instance | 2.1.1.7 | Acceptance: 100 trades processed; verdict p95 ≤3s | In Progress | VP‑Product | `PRDs/M0/2.1.1.7-acceptance-100-trades-prd.md` | `QA/2.1.1.7-acceptance-100-trades/` |

| Phase | ID | Item | Status | Owner | PRD/Plan | Files/QA |
| --- | --- | --- | --- | --- | --- | --- |
| M0 — Founder Instance | 2.1.1.8 | Rehab routine checklist (visualization, market mapping, breath/verse, expectation neutraliser, risk check) | In Progress | PM | `PRDs/M0/2.1.1.8-rehab-checklist-prd.md` | `QA/2.1.1.8-rehab-checklist/` |
| M0 — Founder Instance | 2.1.1.9 | Trade ticket cap + counter‑trend brake (soft‑block with override note) | In Progress | Implementation Owner | `PRDs/M0/2.1.1.9-trade-limits-prd.md` | `QA/2.1.1.9-trade-limits/` |
| M0 — Founder Instance | 2.1.1.10 | Journal MFE capture and MFE‑Error‑R (Stop$, MFE$; derived metric) | In Progress | Implementation Owner | `PRDs/M0/2.1.1.10-mfe-tracking-prd.md` | `QA/2.1.1.10-mfe-tracking/` |
| M0 — Founder Instance | 2.1.1.11 | ATR volatility advisory (manual ATR input → advisory gating) | In Progress | CTO | `PRDs/M0/2.1.1.11-atr-advisory-prd.md` | `QA/2.1.1.11-atr-advisory/` |

| Phase | ID | Item | Status | Owner | PRD/Plan | Files/QA |
| --- | --- | --- | --- | --- | --- | --- |
| M1 — Stability Improvements | 2.2.1.1 | Input validation: sanitize all user inputs | Planned | Implementation Owner | `PRDs/README.md` |  |
| M1 — Stability Improvements | 2.2.1.2 | Error handling: graceful failures, user messages | Planned | Implementation Owner | `PRDs/README.md` |  |
| M1 — Stability Improvements | 2.2.1.3 | Performance: query optimization, caching layer | Planned | CTO | `PRDs/README.md` |  |
| M1 — Stability Improvements | 2.2.1.4 | Monitoring: Sentry baseline | Planned | SRE/DevOps | `PRDs/README.md` |  |
| M1 — Stability Improvements | 2.2.1.5 | Backup: daily automated DB backup | Planned | SRE/DevOps | `PRDs/README.md` |  |
| M1 — Stability Improvements | 2.2.1.6 | Security: HTTPS, rate limiting, CORS | Planned | Security | `PRDs/README.md` |  |
| M1 — Stability Improvements | 2.2.1.7 | Documentation: API + deployment guide | Planned | PM | `PRDs/README.md` |  |

| Phase | ID | Item | Status | Owner | PRD/Plan | Files/QA |
| --- | --- | --- | --- | --- | --- | --- |
| M2 — White‑Label Foundation | 2.3.1.1 | Multi‑tenancy (shared schema + RLS) | Planned | CTO | `PRDs/README.md` |  |
| M2 — White‑Label Foundation | 2.3.1.2 | Theming engine (CSS variables/tokens) | Planned | Frontend | `PRDs/README.md` |  |
| M2 — White‑Label Foundation | 2.3.1.3 | Logo upload/resize pipeline | Planned | Backend | `PRDs/README.md` |  |
| M2 — White‑Label Foundation | 2.3.1.4 | Domain mapping (CNAME) | Planned | SRE/DevOps | `PRDs/README.md` |  |
| M2 — White‑Label Foundation | 2.3.1.5 | Tenant isolation & access controls | Planned | Security | `PRDs/README.md` |  |
| M2 — White‑Label Foundation | 2.3.1.6 | Admin panel: basic tenant mgmt | Planned | Implementation Owner | `PRDs/README.md` |  |
| M2 — White‑Label Foundation | 2.3.1.7 | Onboarding flow: self‑service tenant creation | Planned | PM | `PRDs/README.md` |  |

| Phase | ID | Item | Status | Owner | PRD/Plan | Files/QA |
| --- | --- | --- | --- | --- | --- | --- |
| M4 — Billing V1 | 2.5.1.1 | Stripe integration (Connect/account setup) | Planned | Backend | `PRDs/README.md` |  |
| M4 — Billing V1 | 2.5.1.2 | Invoice generation (PDF) | Planned | Backend | `PRDs/README.md` |  |
| M4 — Billing V1 | 2.5.1.3 | Payment collection: card charging logic | Planned | Backend | `PRDs/README.md` |  |
| M4 — Billing V1 | 2.5.1.4 | Dunning: email sequences, retry logic | Planned | PM | `PRDs/README.md` |  |
| M4 — Billing V1 | 2.5.1.5 | Ledger system: transaction tracking | Planned | Backend | `PRDs/README.md` |  |
| M4 — Billing V1 | 2.5.1.6 | Reporting: revenue/MRR/churn | Planned | Data | `PRDs/README.md` |  |
| M4 — Billing V1 | 2.5.1.7 | Webhook handling: payment events | Planned | Backend | `PRDs/README.md` |  |

| Phase | ID | Item | Status | Owner | PRD/Plan | Files/QA |
| --- | --- | --- | --- | --- | --- | --- |
| M5 — Billing Enhancements | 2.6.1.1 | Weekly billing: threshold detection/switching | Planned | Backend | `PRDs/README.md` |  |
| M5 — Billing Enhancements | 2.6.1.2 | Settlement reports | Planned | Backend | `PRDs/README.md` |  |
| M5 — Billing Enhancements | 2.6.1.3 | Dispute system | Planned | PM | `PRDs/README.md` |  |
| M5 — Billing Enhancements | 2.6.1.4 | Revenue recognition: journal entries | Planned | Backend | `PRDs/README.md` |  |
| M5 — Billing Enhancements | 2.6.1.5 | Tax calculation by jurisdiction | Planned | Backend | `PRDs/README.md` |  |
| M5 — Billing Enhancements | 2.6.1.6 | Partner portal: billing history/downloads | Planned | Frontend | `PRDs/README.md` |  |
| M5 — Billing Enhancements | 2.6.1.7 | Forecasting: predictive revenue models | Planned | Data | `PRDs/README.md` |  |

| Phase | ID | Item | Status | Owner | PRD/Plan | Files/QA |
| --- | --- | --- | --- | --- | --- | --- |
| M3 — Legal/Contracts | 2.4.1.1 | ToS implementation: versioning/acceptance | Planned | PM/Legal | `PRDs/README.md` |  |
| M3 — Legal/Contracts | 2.4.1.2 | Consent system: schema + UI | Planned | PM | `PRDs/README.md` |  |
| M3 — Legal/Contracts | 2.4.1.3 | Legal review: external counsel approval | Planned | Legal | `PRDs/README.md` |  |
| M3 — Legal/Contracts | 2.4.1.4 | Audit logging: agreement interactions | Planned | Backend | `PRDs/README.md` |  |
| M3 — Legal/Contracts | 2.4.1.5 | Document storage: encrypted S3 bucket | Planned | SRE/DevOps | `PRDs/README.md` |  |
| M3 — Legal/Contracts | 2.4.1.6 | API endpoints: consent status/updates | Planned | Backend | `PRDs/README.md` |  |
| M3 — Legal/Contracts | 2.4.1.7 | Compliance reports/export | Planned | PM | `PRDs/README.md` |  |

| Phase | ID | Item | Status | Owner | PRD/Plan | Files/QA |
| --- | --- | --- | --- | --- | --- | --- |
| M6 — Partner Launch | 2.7.1.1 | Partner selection & vetting | Planned | VP‑Product | `PRDs/README.md` |  |
| M6 — Partner Launch | 2.7.1.2 | Onboarding package: videos/docs/support | Planned | PM | `PRDs/README.md` |  |
| M6 — Partner Launch | 2.7.1.3 | Launch campaign: email/webinar | Planned | PM/Marketing | `PRDs/README.md` |  |
| M6 — Partner Launch | 2.7.1.4 | Support preparation: macros/FAQ/training | Planned | Support | `PRDs/README.md` |  |
| M6 — Partner Launch | 2.7.1.5 | Monitoring: real‑time metrics dashboard | Planned | SRE/DevOps | `PRDs/README.md` |  |
| M6 — Partner Launch | 2.7.1.6 | Feedback loop: daily first‑week check‑ins | Planned | PM | `PRDs/README.md` |  |
| M6 — Partner Launch | 2.7.1.7 | Success: 200 seats, <6% churn | Planned | VP‑Product | `PRDs/README.md` |  |


