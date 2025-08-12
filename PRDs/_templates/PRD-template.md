---
name: <feature-name>-prd
version: 1.0
date: <yyyy-mm-dd>
status: Draft | Ready for Development | Approved
owner: <team/role>
source: <link to strategy or parent doc>
milestone: M<0-9> (<roadmap id e.g., 2.1.1.1>)
---

<a id="sec-1"></a>
## 1. Executive Summary

<a id="sec-2"></a>
## 2. Scope
- In scope:
- Out of scope:

<a id="sec-3"></a>
## 3. Success Criteria

<a id="sec-4"></a>
## 4. User Stories

<a id="sec-5"></a>
## 5. Functional Requirements

<a id="sec-6"></a>
## 6. Technical Requirements
<a id="sec-6-1"></a>
### 6.1 Architecture
<a id="sec-6-2"></a>
### 6.2 Data Model
<a id="sec-6-3"></a>
### 6.3 Storage/Schema
<a id="sec-6-4"></a>
### 6.4 Validation
<a id="sec-6-5"></a>
### 6.5 UI/UX
<a id="sec-6-6"></a>
### 6.6 Legal/Privacy

<a id="sec-7"></a>
## 7. Testing & Acceptance
<a id="sec-7-1"></a>
### 7.1 Test Scenarios
<a id="sec-7-2"></a>
### 7.2 Acceptance Criteria
<a id="sec-7-3"></a>
### 7.3 QA Artifacts
- Test cases file: `QA/<roadmap-id>-<feature>/test-cases.md`
- Latest results: `QA/<roadmap-id>-<feature>/test-results-<yyyy-mm-dd>.md` (Overall Status: Pass required)

<a id="sec-8"></a>
## 8. Changelog
- v1.0: Initial draft

<a id="sec-9"></a>
## 9. Collaboration & Review Workflow

<a id="sec-9-1"></a>
### 9.1 Roles and Order
- PM → VP-Product → CTO → UX/UI → Legal → QA → VP-Eng

<a id="sec-9-2"></a>
### 9.2 Where Communication Happens
- Primary: this PRD
- Status: `Plans/product-roadmap.md`

<a id="sec-9-3"></a>
### 9.3 Handoff Contracts (Inputs → Outputs)
- PM: Input strategy → Output scope, user stories, acceptance
- VP-Product: Input PM → Output KPIs/gates
- CTO: Input PM/VP-Product → Output tech constraints/defaults
- UX: Input PM/CTO → Output flow/labels/error states
- Legal: Input UX/CTO → Output approved disclaimer/privacy
- QA: Input PM/CTO/UX → Output test scenarios/acceptance checklist
- VP-Eng: Input all → Output feasibility/sequencing (Ready)

<a id="sec-9-4"></a>
### 9.4 Review Log & Sign‑offs
- [ ] PM — Scope/user stories/acceptance confirmed
- [ ] VP-Product — Business alignment/KPIs confirmed
- [ ] CTO — Tech constraints/defaults confirmed
- [ ] UX — UX notes/labels/error states confirmed
- [ ] Legal — Disclaimer/privacy approved
- [ ] QA — Test scenarios/acceptance confirmed; results published at: `QA/<roadmap-id>-<feature>/test-results-<yyyy-mm-dd>.md` (Overall Status: Pass)
- [ ] VP‑Eng — Feasibility/sequencing confirmed (Ready)

<a id="sec-9-5"></a>
### 9.5 Reviewer Notes

<a id="sec-9-6"></a>
### 9.6 Decision Log

<a id="sec-9-7"></a>
### 9.7 Open Questions

<a id="sec-9-8"></a>
### 9.8 Ready‑to‑Implement Gate
- Condition: All boxes checked in [9.4](#sec-9-4) AND QA results published with Overall Status: Pass and linked above
- Action: Flip status in roadmap and start implementation


<a id="sec-9-9"></a>
### 9.9 Release/Push
- After QA Pass and final approvals, merge/push the change to the default branch (`main`).
- Commands (reference): `git push -u origin main`
- Optional tagging: `git tag -a vX.Y -m "<release notes>" && git push --tags`


<a id="sec-10"></a>
## 10. Excellence Checklist (link evidence per `docs/Excellence-Standard.md`)
- [ ] Scope/intent clear; dependencies and order documented
- [ ] Minimal, reversible edits; rollback steps noted in 9.6 (if risk > low)
- [ ] Lints/build/unit/integration/E2E green (as applicable)
- [ ] QA results published and linked: `QA/<roadmap-id>-<feature>/test-results-<yyyy-mm-dd>.md` (Overall Status: Pass)
- [ ] Security evidence linked (secrets, deps, SAST, SBOM; DAST if applicable) — no High/Critical outstanding
- [ ] Performance/size budgets respected; evidence attached if relevant
- [ ] Roadmap + `docs/product-roadmap.html` updated in same change; links verified clickable
- [ ] Token‑efficient summary and diffs; no redundant docs or dead code


