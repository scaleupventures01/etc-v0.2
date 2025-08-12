## Quick Start (TL;DR)

- Start work: Flip the roadmap line in `Plans/product-roadmap.md` to In Progress as soon as you begin any task (requirements, design, code, or QA).
- Execute reviews in order: PM → VP‑Product → CTO → Security → UX → Legal → QA → VP‑Eng → Implementation Owner.
- QA gate: Publish `QA/<roadmap-id>-<feature>/test-results-<yyyy-mm-dd>.md` with Overall Status: Pass and link it in PRD 9.4 before flipping Status to Ready.
- Security gate: Threat model documented; no High/Critical findings in SAST/DAST/dependency/secrets scans; SBOM generated. Link evidence in PRD 9.4.
- Implementation: Prefer minimal, reversible edits; after any change, run lints/build/tests and fix until green.
- Excellence Standard: Follow `docs/Excellence-Standard.md` and complete the Excellence Checklist (PRD section 10) before Ready/Done flips.
- Do‑It‑Fully: When asked to “do” a feature or scope, implement end‑to‑end, add/update tests, execute QA cases, publish results (Overall Status: Pass), update roadmap/docs, then notify. Do not ask the user whether to test; it isn’t done until QA passes.
- Automation trigger: Say "ORCH START" in a new chat to kick off the autonomous testing workflow described below (Agent Prompt section).
 - Bug‑fix trigger: Say "fix the bug" or "fix the problem" to run the RCA/10‑Whys workflow (single or multi‑issue) per `team/rca-10-whys-prompt.md`.
- Roadmap mirror: When you update `Plans/product-roadmap.md`, immediately mirror the change into `docs/product-roadmap.html` (Phases & Milestones table). Both must stay in sync at all times.
  - Mirror detail: The HTML mirror uses nested accordions with tables at each level (2.x → 2.x.x → 2.x.x.x → …). Maintain parity with the markdown IDs and items.
  - Ordering rule: Use natural ascending phase order. Ensure display order reflects: M0, M1, M2, M3, M4, M5, then M6+.
  - Link rule: In `docs/product-roadmap.html`, every referenced file/folder must be a clickable hyperlink that resolves locally (file://) to an existing target (PRDs, QA results, Plans, implementation files like `index.html`, `js/core/`). No plain-text paths.
  - Output column: `docs/product-roadmap.html` includes a final column named “Output Files/Folder” listing primary artifacts. Use clickable links.
  - Controls: Provide "Expand all" / "Collapse all" for both the WBS and Milestones sections.
  - Executive Rollup & At‑a‑Glance: Keep the CEO summary sections current.
    - `Plans/product-roadmap.md` section 0 (Executive Rollup) must reflect the latest rollup (overall progress, per‑phase status, top risks, next 2 sprints). Update when any material status flips occur.
    - `docs/product-roadmap.html` must include the At‑a‑Glance header (phase cards + status filters + search) and derive its data from the same WBS content. Update the header bars and counts when statuses change.

## Table of Contents

- [Quick Start (TL;DR)](#quick-start-tldr)
- [0. Do‑It‑Fully Policy (Build → Verify → Notify)](#do-it-fully-policy-build--verify--notify)
- [1. PRD Collaboration & Review Workflow (Global)](#prd-collaboration--review-workflow-global)
- [2. Agent Prompt: Fully Autonomous Testing & Verification in Cursor](#agent-prompt-fully-autonomous-testing--verification-in-cursor)
  - [Role](#role)
  - [Objectives](#objectives)
  - [Capabilities (MCPs)](#capabilities-to-use-mcps)
  - [Model routing](#model-routing)
  - [Operating rules](#operating-rules)
  - [Range Execution (Roadmap X.X → Y.Y)](#range-execution)
  - [List Execution (Non-Contiguous Items)](#list-execution)
  - [Default workflow](#default-workflow)
- [3. Continuous Test Methodology (UI/E2E)](#continuous-test-methodology-uie2e)
  - [Required smoke test](#required-smoke-test-always-run)
  - [Full regression](#full-regression-pre-release-or-when-flows-materially-change)
  - [How to run](#how-to-run-cursor-mcp-playwright-browser)
  - [Reporting and gating](#reporting-and-gating)
  - [Environments](#environments)
  - [Command hints](#command-hints-adapt-as-needed)
  - [Artifacts and diagnostics](#artifacts-and-diagnostics)
  - [Reporting and plan updates](#reporting-and-plan-updates)
  - [Safety and constraints](#safety-and-constraints)
  - [Environment assumptions](#environment-assumptions)
- [4. Role‑Based Execution & Plan Update (Agent Playbook)](#role-based-execution--plan-update-agent-playbook)
- [5. Roadmap Mirror Sync Policy](#roadmap-mirror-sync-policy)

---

<a id="do-it-fully-policy-build--verify--notify"></a>
### 0. Do‑It‑Fully Policy (Build → Verify → Notify)

When the user says “do” a feature or scope, the task is only complete when it has been fully implemented, verified, and has passed QA.

- What “do it” means
  - Implement the feature end‑to‑end per the PRD and acceptance criteria.
  - Add/update automated tests (unit/integration) and ensure a green run.
  - Execute the defined QA test cases; fix issues until all pass.
  - Publish QA results before notifying the user.

- No partial handoffs
  - Do not pause after coding to ask if testing should occur.
  - Do not ask the user to test. Testing must be completed and passed first.

- Definition of Done
  - Code is implemented and merged to the default branch; PRD 9.6 lists commit hash(es) and dates
  - Linting/type checks pass
  - Unit/integration tests added and passing in CI
  - QA test cases executed and passing
  - QA results published under `QA/<roadmap-id>-<feature>/test-results-YYYY-MM-DD.md` with Overall Status: Pass and linked in PRD 9.4
  - Roadmap updated in `Plans/product-roadmap.md` with status and key file paths
  - Roadmap HTML mirror updated in `docs/product-roadmap.html` to match section 2 of `Plans/product-roadmap.md`
  - Performance/budget gates (if applicable) have evidence (e.g., Lighthouse ≥95 report) and budgets are configured in CI
  - Relevant docs updated (PRD notes, READMEs, or usage guides)
  - No TODOs or known failing tests remain
  - Excellence Checklist (PRD section 10) completed and referenced

- No paper flips
  - Status MUST NOT be flipped to Ready/Done via documentation or placeholder QA alone
  - A Done flip must be part of a change set that includes implementation code within the feature scope (or an explicit “no code needed” rationale in PRD 9.6 with reviewer sign‑off)

### Definition of Done (Enforced)

An item is Done only when ALL are true:
- Code implemented and merged to the default branch; PRD 9.6 lists commit hash(es) with dates
- CI green for that commit (lint, build, unit/integration)
- QA results published under `QA/<id>-<slug>/test-results-YYYY-MM-DD.md` with Overall Status: Pass and linked in PRD 9.4
- Roadmap updated in `Plans/product-roadmap.md` AND mirrored in `docs/product-roadmap.html` in the same change set
- Performance/budget gates (if applicable) have evidence in QA (e.g., Lighthouse ≥95 report) and budgets are configured in CI

### Status Lifecycle & Gates (Ready → Done)

Ready gate
- PRD 9.4 fully checked (all roles)
- QA test cases published (PRD 7.3)
- First green CI run on a branch build

Done gate
- Satisfy Definition of Done above
- PRD 9.6 lists commit hash(es) and date
- Flip to Done with date in `Plans/product-roadmap.md` and mirror in `docs/product-roadmap.html` in the same commit

### Proof‑of‑Done Checklist (attach links in PRD 9.4 / 9.6)

- [ ] Commit(s): <hash links to default branch>
- [ ] CI: Lint/build/tests green (run link or screenshot)
- [ ] QA: `QA/<id>-<slug>/test-results-YYYY-MM-DD.md` (Overall Status: Pass)
- [ ] Roadmap + HTML mirror updated in the same commit
- [ ] Release/Push: Merged and pushed to the default branch (`main`); tag created if applicable (`git tag -a vX.Y -m "<msg>" && git push --tags`)
- [ ] Perf evidence + CI budgets (if applicable)

- Notify only after passing QA
  - After all the above is complete, notify the user with:
    - A brief summary of the change
    - Links/paths to PRD, code, and QA results
    - Any migration or setup notes

 - Exceptions / Blockers
   - If a required decision is unclear, pause and ask for guidance.

### Global Execution & Sequencing Standard (All Roles, All Work)

- Execute every change in a dependency-aware order documented in the PRD and reflected in `Plans/product-roadmap.md` (sub-items with preconditions/postconditions). Applies to features, refactors, docs, security, and QA.
- Default sequence pattern (adapt as needed):
  1) Establish safe entry points or interfaces first (e.g., ESM entry, API contract, DI surface, feature flag).
  2) Modify hosts/shells or fan-out integrations second (e.g., skeletonize HTML shells, wire new endpoints behind flags).
  3) Extract/migrate internals with behavior parity (move templates/styles, refactor modules, reversible migrations).
  4) Validate: lints → build → unit/integration → smoke/E2E → guardrails (size/perf) → security gates (secrets/deps/SAST/SBOM). Attach evidence.
  5) Flip statuses only after QA Pass is published and linked in PRD 9.4; mirror roadmap changes in `docs/product-roadmap.html` in the same change set.
- Reversibility: Prefer minimal, reversible edits; include rollback notes for risky steps in PRD 9.6.
- Enforcement: VP‑Eng confirms sequencing feasibility; PM maintains the authoritative order; CI gates block on QA/Security/size/perf failures.

<a id="prd-collaboration--review-workflow-global"></a>
### 1. PRD Collaboration & Review Workflow (Global)

Purpose
- Standardize how all teams collaborate, review, and approve PRDs across milestones (M0–M9).
- Ensure every PRD has clear inputs/outputs per role and a consistent Ready-to-Implement gate.

Folder structure & naming
- PRDs/
  - M0/ … M9/
  - _templates/
- File naming: numeric-prefixed, e.g., `2.1.1.1-feature-name-prd.md` mapped to roadmap IDs.

QA artifacts & results (global policy)
- QA/ — Top-level folder for per-feature QA artifacts (test cases, results, evidence)
- Per feature/milestone, create a subfolder named with the roadmap id and feature slug, e.g., `QA/2.1.1.1-plan-wizard/`
  - `test-cases.md` — Authoritative test matrix derived from PRD section 7.1 and acceptance in 7.2
  - `test-results-<yyyy-mm-dd>.md` — Run log with environment, build under test, overall status (Pass/Fail), and per-case outcomes
  - `evidence/` — Optional subfolder for screenshots, HAR logs, console logs
  - Each results file must include: Build under test (commit/date), Environments/browsers, Tester, Summary, and a table of case results

Review sequence (roles)
1. Product Manager (PM)
2. VP-Product
3. CTO
4. Security
5. UX/UI Designer
6. Legal/Compliance
7. QA Engineer
8. VP-Engineering (feasibility)
9. Implementation Owner (Engineer)

Where to collaborate
- Primary: Inside each PRD file under sections 9.x (below).
- Status-only: `Plans/product-roadmap.md` — flip item status to In Progress immediately when work starts; flip to Ready when all sign-offs are complete.
- Mirror: `docs/product-roadmap.html` — table view of section 2 (Phases & Milestones); keep mirrored with the markdown roadmap on every change.
  - Ordering rule applies to both files: use natural ascending phase order.
  - Executive sections: Maintain `Plans/product-roadmap.md` Executive Rollup (section 0) and the HTML “At‑a‑Glance” so CEOs can quickly assess: what’s done, what’s in progress, what’s blocked, and drill down via WBS.

Status lifecycle & PM enforcement
- States: Planned → In Progress → Blocked → Ready → Done (dated)
- Flip triggers
  - In Progress: Must be set the moment any work begins (requirements edits, design, code, or QA), before engaging any other team member for reviews or dependency work.
  - Blocked: Set when progress is halted for >1 business day; record reason in PRD 9.7 Open Questions and tag owner.
  - Ready: All 9.4 checkboxes checked and QA results published/linked with Overall Status: Pass.
  - Done: Feature shipped or accepted per PRD; include completion date in roadmap line.
- Enforcement and ownership
  - Product Manager is accountable to ensure the roadmap line is In Progress before requesting engagement from UX, Engineering, QA, Legal, or Exec reviewers.
  - Assignee may flip to In Progress, but PM must confirm within the same day.
- Audit note: Each status flip should include date and actor in the PRD 9.6 Decision Log.

Handoff contracts (inputs → outputs)
- Product Manager
  - Input: Strategy constraints (e.g., `Input/business-plan-*.md`)
  - Output: Final scope, user stories, acceptance criteria
- VP-Product
  - Input: PM outputs
  - Output: Success metrics/KPIs and go/no-go gates
- CTO
  - Input: PM scope, VP-Product KPIs
  - Output: Technical constraints, defaults, security/privacy guardrails
- Security
  - Input: PM scope, CTO constraints
  - Output: Threat model and mitigations; security requirements and gates (secrets handling, dependency policy, authN/Z, logging/retention); scan plan
- UX/UI Designer
  - Input: PM scope, CTO constraints
  - Output: Flow notes, labels, validation/error states, disclaimer placement
- Legal/Compliance
  - Input: UX copy, CTO constraints
  - Output: Approved disclaimer/privacy and language rules
- QA Engineer
  - Input: PM acceptance, CTO constraints, UX states
  - Output: Test scenarios and acceptance checklist; published test cases and results in `QA/<roadmap-id>-<feature>/`
- VP-Engineering
  - Input: All above
  - Output: Feasibility/sequencing note; Ready recommendation
- Implementation Owner (Engineer)
  - Input: All above
  - Output: Implementation plan, risk/rollback notes; confirms scope and feasibility of edits

Standard PRD sections
1. Executive Summary
2. Scope (in/out)
3. Success Criteria
4. User Stories
5. Functional Requirements
6. Technical Requirements (incl. Data Model, Storage/schema, Validation, UI/UX, Security/Privacy — threat model, secrets, logging/retention)
   - Security & Privacy: Threat Model, Data Classification/PII, AuthN/AuthZ, Cryptography & Secrets, Logging/Retention, Security Telemetry, Abuse/AI‑Safety considerations
7. Testing & Acceptance (incl. Security Testing)
   - Security Testing: SAST, dependency vulnerabilities, secrets scanning, SBOM; optional DAST for web. Acceptance: No High/Critical findings.
8. Changelog
9. Collaboration & Review Workflow (below)
10. Excellence Checklist (reference `docs/Excellence-Standard.md`)

Collaboration blocks to include in every PRD
- 9.1 Roles and Order (as above)
- 9.2 Where Communication Happens (PRD path + roadmap link)
- 9.3 Handoff Contracts (copy this section, adapt to feature)
- 9.4 Review Log & Sign-offs (checklist)
- 9.5 Reviewer Notes (role‑tagged bullets with dates)
- 9.6 Decision Log (numbered, dated)
- 9.7 Open Questions (move items to Decision Log when resolved)
- 9.8 Ready‑to‑Implement Gate (condition + roadmap status flip)
- 10. Excellence Checklist — Apply the rubric and check all boxes; link `QA/.../test-results-YYYY-MM-DD.md`, security evidence, and roadmap/mirror updates.

QA artifacts & results requirements
- Every PRD’s section 7 must enumerate scenarios and acceptance that QA will translate into `QA/<roadmap-id>-<feature>/test-cases.md`.
- Before the QA checkbox in 9.4 can be checked, QA must:
  - Execute the test cases against the build under test
  - Publish a `test-results-<yyyy-mm-dd>.md` file in the feature’s QA folder with an Overall Status: Pass, plus evidence as needed
  - Add the relative path to the results file in the PRD (see template update below)
- Enforcement: Until QA marks Overall Status: Pass in the published results file and references it in the PRD, the feature is not considered Ready and must not be flipped to Ready in `Plans/product-roadmap.md`.

Security artifacts & gates (global policy)
- Each PRD must include security requirements in section 6 and a brief threat model (key assets, trust boundaries, primary risks, mitigations).
- Before Security checkbox in 9.4 can be checked, publish evidence (links/paths acceptable) for:
  - Secrets scan (e.g., Gitleaks/TruffleHog): no High/Critical.
  - Dependency/vulnerability scan (e.g., OSV, npm audit): no High/Critical.
  - SAST (e.g., Semgrep ruleset appropriate to stack): no High/Critical.
  - Optional/when applicable: DAST baseline (e.g., OWASP ZAP) for web flows.
  - SBOM (CycloneDX) generated for the build under test.
- Reference the evidence paths in PRD 9.4 and/or 7.3.

Review Log & Sign-offs (template)
- [ ] PM — Scope/user stories/acceptance confirmed
- [ ] VP-Product — Business alignment/KPIs confirmed
- [ ] CTO — Tech constraints/defaults confirmed
- [ ] Security — Threat model/controls confirmed; scans attached; no High/Critical outstanding
- [ ] UX — UX notes/labels/error states confirmed
- [ ] Legal — Disclaimer/privacy approved
- [ ] QA — Test scenarios/acceptance confirmed; results published at: `<path to QA/test-results-*.md>`; Overall Status: Pass
- [ ] VP-Eng — Feasibility/sequencing confirmed (Ready)
- [ ] Implementation Owner — Implementation risks and rollback plan confirmed

Reviewer Notes (example)
- [PM yyyy‑mm‑dd] …
- [VP‑Product yyyy‑mm‑dd] …
- [CTO yyyy‑mm‑dd] …
- [Security yyyy‑mm‑dd] …
- [UX yyyy‑mm‑dd] …
- [Legal yyyy‑mm‑dd] …
- [QA yyyy‑mm‑dd] …
- [VP‑Eng yyyy‑mm‑dd] …
- [Implementation Owner yyyy‑mm‑dd] …

Versioning & changelog
- Semantic doc versions (e.g., v1.1) in frontmatter.
- Every material change gets a one-line entry in section 8.

Ready gate
- Condition: All boxes checked in Review Log AND QA results published with Overall Status: Pass and linked in the PRD.
  - Additionally: PRD section 10 (Excellence Checklist) completed with links to evidence per `docs/Excellence-Standard.md`.
- Action: Update corresponding roadmap line in `Plans/product-roadmap.md` to Status: Ready and begin implementation. Mirror the same change in `docs/product-roadmap.html`.
  - Maintain ordering rule when flipping statuses; do not reinsert M3 ahead of M5.

#### 1.1 PRD Creation Bootstrapping

Purpose
- Standardize first‑mile setup so every feature begins with a complete PRD scaffold, QA artifacts, and role alignment.

Checklist
- Resolve `ROADMAP_ID` and `feature-slug` from `Plans/product-roadmap.md`.
- Create PRD at `PRDs/<Milestone>/<ROADMAP_ID>-<feature-slug>-prd.md` from `PRDs/_templates/PRD-template.md` with frontmatter populated (name, version, date, status=Draft, owner).
- Create QA folder `QA/<ROADMAP_ID>-<feature-slug>/` with `test-cases.md` scaffolded from PRD section 7.1/7.2. Add `test-results-<yyyy-mm-dd>.md` after first execution.
- Populate PRD core sections to Draft:
  - Sections 1–6 with sufficient detail for reviewers
  - Section 7.3 (QA Artifacts): paths to `QA/<ROADMAP_ID>-<feature-slug>/test-cases.md` and `QA/<ROADMAP_ID>-<feature-slug>/test-results-<yyyy-mm-dd>.md`
  - Section 9.2 (Where Communication Happens): PRD path + roadmap link
  - Section 9.4 (Review Log & Sign‑offs): include QA results path placeholder
- Flip roadmap line to Status: In Progress immediately (include date/actor) and mirror in `docs/product-roadmap.html`.

Role prompts and documentation links
- PM: `team/product-manager.md`
- VP‑Product: `team/vp-product.md`
- CTO: `team/cto.md`
- Security: `team/security.md` (or record notes in PRD 9.5 until created)
- UX/UI: `team/ux-ui-designer.md`
- Legal/Compliance: Record notes in PRD 9.5 until a dedicated `team/legal.md` exists
- QA: `team/qa-engineer.md`
- VP‑Engineering: `team/vp-engineering.md`
- Implementation Owner: `team/implementation-owner.md` (engineering lead for the change)

Minimum gate before requesting reviews
- PRD sections 1–6 drafted; 7.1/7.2 enumerated; 7.3 paths set; 9.2 and 9.3 completed; 9.4 checklist present.

Artifacts and changelog
- Log PRD creation and QA folder creation in PRD section 8 (Changelog) as one‑line entries.



<a id="agent-prompt-fully-autonomous-testing--verification-in-cursor"></a>
### 2. Agent Prompt: ORCH START — Autonomous Orchestrator & Test/Verify Agent

Note: To start this flow in a fresh chat, type "ORCH START". The agent will follow the workflow below end‑to‑end.

Role
- You are the Autonomous Orchestrator & Test/Verify Agent for this repository in Cursor.

Objectives
- Assign and activate the right team for the target `ROADMAP_ID`/PRD (PM/TPM-led role selection).
- Have the team complete the work end-to-end (docs/design/code/tests) with minimal, reversible edits; keep the suite green after each step.
- Then operate as the Autonomous Test & Verify Agent.
- Fully test and verify end‑to‑end; iterate run → diagnose → propose minimal edits → (on approval) apply → rerun until green.

Capabilities to use (MCPs)
- Playwright Browser: Real-browser E2E/UI flows, screenshots, network logs.
- Terminal/Shell: Build, run unit/integration tests, linters, coverage, git, docker.
- Filesystem: Read/update existing files, create new files (QA artifacts, docs, evidence, test scaffolds), and parse test/coverage artifacts.
- Lints/Diagnostics: Surface and resolve typecheck/linter errors.
- Search (semantic + grep): Locate definitions, failing code paths, tests, configs.

Model routing
- Route LLM calls via LiteLLM where applicable.

Operating rules
- Prefer non-interactive commands; add flags like: --yes, --no-install, --frozen-lockfile. If a command would page output, append: | cat.
- Long-running commands should be backgrounded; do not block the session.
- Parallelize independent reads/searches and diagnostics to reduce cycle time.
- After any edit, immediately run lints/build/tests; ensure green before proceeding.
- Creating new files is allowed for this project (QA artifacts, docs, evidence, test scaffolds).
- Provide concise status updates and a short, high-signal summary each cycle.
- When tasks complete, update the plan with status and file locations (if plan docs exist).
- When the user says “do” a feature or scope, execute it fully: implement per PRD, add/update tests, run lints/build/tests, execute QA test cases, publish results (Overall Status: Pass) and update roadmap/docs; only then notify the user.
- Do not ask the user to test; notify only after QA has published a Pass result and the PRD references the results file.
  - Keep the roadmap mirror in sync: Any change to `Plans/product-roadmap.md` must be reflected in `docs/product-roadmap.html` (Phases & Milestones table) in the same cycle.
  - Enforce ordering rule: After edits, verify natural ascending phase order in both files.

Team Orchestration Workflow
1) Discover
   - Identify `ROADMAP_ID` from `Plans/product-roadmap.md` and open the PRD at `PRDs/<Milestone>/<ROADMAP_ID>-<slug>-prd.md`.
   - If work is starting, set roadmap Status → In Progress and mirror in `docs/product-roadmap.html`.

2) Activate team (PM/TPM-led)
   - Tag in `team/product-manager.md` and `team/technical-product-manager.md` to select required roles from `team/` (e.g., `frontend-engineer.md`, `backend-engineer.md`, `qa-engineer.md`, `devops-engineer.md`, `security-architect.md`).
   - Record owners in the PRD header and collaboration blocks (9.1/9.3).

3) PRD task decomposition (authoritative)
   - Insert an “Execution Plan (Decomposed Tasks)” table into the PRD (template below).
   - Enumerate tasks per role with dependencies/preconditions, outputs (files/PRD sections), and risks/issues.
   - Confirm dependency-aware ordering and minimal, reversible steps.

4) Execute work
   - Roles complete docs/design/code/tests per the Execution Plan.
   - After each code change, run lints/build/tests to green; update PRD §8 (Changelog) and §9.6 (Decisions) as needed.
   - Create QA artifacts under `QA/<ROADMAP_ID>-<slug>/` (`test-cases.md`, `test-results-<DATE>.md`, optional `evidence/`).

5) Autonomous test & verify
   - Fully test end-to-end; iterate run → diagnose → propose minimal edits → apply → rerun until green.
   - Publish QA results with Overall Status: Pass; link in PRD §7.3 and §9.4.

6) Status flips and mirroring
   - Flip roadmap status (Ready/Done as applicable) in `Plans/product-roadmap.md` and mirror in `docs/product-roadmap.html` in the same change set.
   - Maintain natural ascending phase order; ensure all HTML mirror references are clickable and targets exist.

7) Bug handling (RCA + 10‑Whys with owner recheck)
   - On any failure/bug: pause flips; capture evidence per `docs/RUNBOOK.md`.
   - Circle back to `team/product-manager.md` and `team/technical-product-manager.md` to re‑validate needed roles for root cause analysis.
   - Run RCA + 10‑Whys per `team/rca-10-whys-prompt.md`; assign the correct team roles to fix.
   - Implement minimal, reversible edits; rerun to green; publish QA results; then resume status flips and mirroring.

PRD “Execution Plan (Decomposed Tasks)” — Template (place after §9.3 Handoff Contracts)

| Task ID | Owner (Role) | Description | Preconditions/Dependencies | Outputs (Files/PRD sections) | Risks/Issues | Status |
| --- | --- | --- | --- | --- | --- | --- |
| EX-01 | Frontend Engineer | Build plan wizard step 2 validation | EX-00 (entry ready) | `js/modules/trading-plan.js`; PRD §6 updated | Edge-case inputs; a11y | Planned |
| EX-02 | QA Engineer | Author PW-013 smoke + run | EX-01 complete | `QA/2.1.1.1-plan-wizard/test-cases.md`; test-results | Flaky selectors | Blocked (await EX-01) |

#### Bug Fix Orchestration Trigger (RCA + 10‑Whys)

- Invocation (in chat)
  - "fix the bug" or "fix the problem" → The agent will execute the RCA workflow in `team/rca-10-whys-prompt.md`.
  - For multiple bugs, the agent switches to Multi‑Issue Mode: normalize, cluster, analyze linkage, run per‑issue and cross‑cutting 10‑Whys, then plan shared and issue‑specific fixes.
- Behavior
  - Triage and evidence capture per `docs/RUNBOOK.md`.
  - 10‑Whys across roles (PM, VP‑Product, CTO, UX, Legal, QA, VP‑Eng).
  - ≥2 solution options per root cause with effort/risk/owner/files/tests.
  - Minimal, reversible edits; lints/build/tests; enforce QA gate per section 1.
  - Publish `QA/<id>-<slug>/test-results-YYYY-MM-DD.md` with Overall Status: Pass, link in PRD 9.4, then mirror roadmap flips in `docs/product-roadmap.html`.
  - Maintain M3-after-M5 ordering.

#### Range Execution (Roadmap X.X → Y.Y)

Purpose
- Allow the user to trigger continuous, sequential execution across a range of roadmap items without pausing between them, following the template at `PRDs/_templates/sequential-feature-implementation-template.md` in Range Mode.

Invocation (in chat)
- DO RANGE START=[START_ROADMAP_ID] END=[END_ROADMAP_ID]
- DO RANGE [START_ROADMAP_ID] → [END_ROADMAP_ID]
- Example: `DO RANGE START=2.3.1.3 END=2.3.1.7`

Behavior
- Process items in the exact document order from `Plans/product-roadmap.md`, inclusive of both endpoints.
- For each item, apply the Per‑Feature Workflow from the template: flip to In Progress, confirm or create PRD, conduct role reviews in PRD 9.x, implement minimal reversible edits, run lints/tests, execute QA, publish results under `QA/<roadmap-id>-<slug>/`, update PRD 9.4 with the results path (Overall Status: Pass), flip roadmap to Ready (or Done if shipping criteria apply), then immediately advance to the next item.
- Only stop early if blocked by unresolved PRD 9.7 questions that cannot be resolved autonomously or by repository constraints.

Template Reference
- Execution details and output format are defined in: `PRDs/_templates/sequential-feature-implementation-template.md` (Range Mode).

Approvals and File Creation
- For this project, the user has authorized automatic creation of files (QA artifacts, docs, etc.) without prior approval [[memory:5790555]], and permits the assistant to create files automatically [[memory:5790534]]. Prefer minimal changes; update dependencies only when necessary for the scoped feature(s).

Completion
- After completing the final item in the specified range, post a consolidated summary with per‑feature outputs and a final line: “✓ Features [START_ROADMAP_ID] → [END_ROADMAP_ID] complete — QA Pass published; PRDs linked; roadmaps Ready/Done as applicable”.

<a id="list-execution"></a>
#### List Execution (Non‑Contiguous Items)

Purpose
- Allow the user to trigger continuous, sequential execution across a non‑contiguous set of roadmap items, following the same workflow as Range Mode.

Invocation (in chat)
- DO LIST=<ID1>,<ID2>,<ID3>
- DO ITEMS <ID1>, <ID2>, <ID3>
- Examples:
  - DO LIST=2.1.1.1,2.1.2.3,2.3.1.2
  - DO ITEMS 2.3.1.3, 2.3.1.7, 2.2.1.2

Behavior
- Process the specified roadmap IDs strictly in the order provided.
- For each item, apply the Per‑Feature Workflow from the template: flip to In Progress, confirm or create PRD, conduct role reviews in PRD 9.x, implement minimal reversible edits, run lints/tests, execute QA, publish results under `QA/<roadmap-id>-<slug>/`, update PRD 9.4 with the results path (Overall Status: Pass), flip roadmap to Ready (or Done if shipping criteria apply), then immediately advance to the next listed item.
- Do not pause between items unless blocked by repository rules (e.g., creating new files/dependencies requiring approval) or by unresolved PRD 9.7 questions.

Validation and error handling
- If an ID is not found in `Plans/product-roadmap.md`, record a note in the final summary and skip that item.
- Maintain natural ascending phase order in both `Plans/product-roadmap.md` and `docs/product-roadmap.html` after any flips.
- Convert all file/folder references in the HTML mirror to clickable links and verify targets exist.

Note
- For contiguous ranges, use Range Execution via `DO RANGE START=… END=…`. Behavior and gates are identical.

Default workflow
1) Detect stack and test runner
   - Identify package manager, framework, and test tools (e.g., Vitest/Jest/Pytest/Playwright).
2) Install dependencies (non-interactive)
   - Try in order and use the first that works:
     - pnpm install --frozen-lockfile
     - npm ci
     - yarn install --frozen-lockfile
3) Static checks
   - Run linters and type checks if available (e.g., eslint, tsc, mypy, ruff).
4) Unit tests
   - Run unit tests with full output and no watch mode.
5) API/Integration tests
   - Use HTTP/Fetch or CLI-based tests. Read and validate JSON/JUnit reports if present.
6) E2E/UI tests (Playwright)
   - If a dev server is required, start it in the background.
   - Run Playwright with a simple reporter and capture screenshots on failure.
7) Diagnose failures; propose fixes
   - Read test output, logs, coverage, stack traces.
   - Identify the smallest, safest edit to fix the failure.
   - Propose the exact file/line changes; only apply after approval.
8) Rerun the relevant subset; then full suite
   - Confirm fixes by rerunning failing tests, then the full suite.
9) Exit criteria
   - All tests green, no lints/type errors, build succeeds.
   - Coverage meets configured thresholds if any.
   - Summarize changes and affected files.

<a id="continuous-test-methodology-uie2e"></a>
### 3. Continuous Test Methodology (UI/E2E)

Scope
- Applies to all UI features development

Required smoke test (always run)
- PW-013 — Create → Edit → Toggle Roundtrip (E2E)
  - Objective: Validate end-to-end plan creation, editing, and toggle enable/disable behavior; verify `localStorage` schema updates and history semantics.
  - Trigger: Any commit touching `index.html` or logic affecting plan state.
  - Evidence: Update `QA/2.1.1.1-plan-wizard/test-results-<yyyy-mm-dd>.md` with Pass/Fail and notes.

Full regression (pre‑release or when flows materially change)
- PW-001 … PW-012 from `QA/2.1.1.1-plan-wizard/test-cases.md`.
- Acceptance requires: All green, no console errors, performance within target.

How to run (Cursor MCP, Playwright Browser)
- Open `index.html` (served locally or via file://). Ensure desktop width ≥ 1024px.
- Use the in‑page harness exposed as `window.__planWizardTest` to drive flows:
  - Create plan: set inputs, click Next per step, call `savePlan()` on Step 4.
  - Edit plan: navigate to Saved Plan → Edit; modify fields; `savePlan()` again.
  - Toggle checks: Uncheck/recheck `#noOpenRegimeTrades`, `#noRevengeTrades`; verify dependent fields enable/disable as expected.
  - Validate storage: read `tradingPlan_current`, `tradingPlan_draft`, `tradingPlan_history` via the harness.
- Capture results in the daily results file under `QA/2.1.1.1-plan-wizard/`.

Reporting and gating
- If PW-013 fails: Block status flips; diagnose, edit, rerun until green; document the fix in PRD section 8 (Changelog).
- After all required tests Pass: Mark Overall Status: Pass in results and proceed to flip roadmap status to Done for the feature line.
- Real‑browser gate (mandatory): E2E smoke must pass with zero console errors/warnings and a screenshot artifact attached in the results.

Environments
- macOS latest; Chrome latest required. Safari latest recommended secondary check.

Command hints (adapt as needed)
- Build: pnpm build | cat  OR  npm run build | cat
- Lint: pnpm lint --no-fix | cat  OR  npm run lint --silent | cat
- Typecheck: pnpm typecheck | cat  OR  tsc -p . | cat
- Unit: pnpm test --reporter=verbose --run | cat  OR  npm test --silent | cat
- Start dev server (background): pnpm dev  (run in background)
- Playwright E2E:
  - npx playwright install --with-deps | cat
  - npx playwright test --reporter=list | cat

Artifacts and diagnostics
- Prefer machine-readable outputs when available (JUnit/XML, JSON).
- Read coverage reports (lcov, cobertura, HTML) to guide testing gaps.
- Persist or summarize artifact locations in the final summary.
  - For UI/E2E: attach Playwright screenshots, traces, and console excerpts; store under `QA/<id>-<slug>/evidence/` where feasible.

Reporting and plan updates
- Each cycle, produce:
  - What was run, high-level results, failing tests if any.
  - Root cause hypothesis, proposed edit, and why it is safe.
  - After approval and edits: list changed files with paths and the effect.
- If plan docs exist, append status updates referencing file paths:
  - Examples: `Plans/product-roadmap.md`, `docs/product-roadmap.html`, `Input/mvp project plan.md`.
  - Note the ordering validation in your summary when roadmap is touched.

 Safety and constraints
 - Creating new files is allowed for this project (QA artifacts, docs, evidence, test scaffolds).
 - Prefer minimal, reversible edits; avoid broad refactors during test-fix loops.
 - Keep summaries concise; focus on actionable items and file paths.

Environment assumptions
- macOS host; standard POSIX shell behavior.
- If a pager would be used by a command, ensure output is printed without blocking.

<a id="role-based-execution--plan-update-agent-playbook"></a>
### 4. Role‑Based Execution & Plan Update (Agent Playbook)

- Purpose: Document the steps to read inputs, create/confirm the plan, execute by role, enforce QA gates, and update roadmap/PRD.

- Inputs
  - PRD path: e.g., `PRDs/M0/<roadmap-id>-<feature>-prd.md`
  - Roadmap line: `Plans/product-roadmap.md`
  - QA folder: `QA/<roadmap-id>-<feature>/`

- Execution flow
  1) Discovery
     - Read this README and the target PRD; check QA artifacts; set roadmap Status → In Progress when work starts.
  2) Plan confirmation (PM)
     - Validate Scope, User Stories, Testing & Acceptance; add PRD 9.5 note; check PM in 9.4.
  3) Business alignment (VP‑Product)
     - Confirm success criteria/KPIs; add 9.5 note; check VP‑Product in 9.4.
  4) Tech constraints (CTO)
     - Confirm architecture, storage keys, privacy guardrails; add 9.5 note; check CTO in 9.4.
  5) UX review (UX/UI)
     - Validate labels, validation, non‑advisory messaging; add 9.5 note; check UX in 9.4.
  6) Legal check (Legal)
     - Confirm educational‑only copy; add 9.5 note; check Legal in 9.4.
  7) Implementation
     - Minimal, reversible edits; run lints/build/tests after edits; scope remains aligned to PRD.
  8) QA gate (QA)
     - Translate PRD 7.1 to `QA/.../test-cases.md`; execute; publish `test-results-<yyyy-mm-dd>.md` with Overall Status: Pass; link in PRD 9.4; add 9.5 note; check QA in 9.4.
  9) Ready decision (VP‑Eng)
     - After QA Pass linked, confirm feasibility; check VP‑Eng in 9.4; add decision in 9.6.
  10) Status flips
     - Update `Plans/product-roadmap.md`: In Progress → Ready → Done (dated). Record in PRD 9.6.
     - Mirror the same status and dates in `docs/product-roadmap.html`.
     - Confirm ordering rule (M3 after M5) still holds after flips.

<a id="roadmap-mirror-sync-policy"></a>
### 5. Roadmap Mirror Sync Policy

- Canonical source: `Plans/product-roadmap.md` (section 2: Phases and Milestones).
- Mirror artifact: `docs/product-roadmap.html` — contains the HTML table view of the same roadmap content.
- Always-in-sync rule: Any addition, edit, or status/date change in the markdown roadmap must be mirrored in the HTML within the same change cycle.
  - HTML-only requirement: The HTML mirror includes an additional required column titled “Output Files/Folder” to aggregate clickable links to primary artifacts; the markdown can capture this information inline. Content (IDs, items, statuses, owners, paths) must still match between files.

Sync checklist (use on every roadmap change)
- Edit `Plans/product-roadmap.md` (add/update IDs, items, Status, Owner, PRD/Plan, Files/QA).
- Update `docs/product-roadmap.html` table rows to match exactly and ensure the “Output Files/Folder” column is present and populated.
- Convert all file/folder references in `docs/product-roadmap.html` to clickable links and verify targets exist.
- Quick validation: Open `docs/product-roadmap.html` in a browser and click a representative PRD, QA, and implementation link to ensure navigation works (file:// acceptable in local dev).
- Scan both for mismatches (IDs, dates, owners, paths).
- Include both file paths in your change summary.

Notes
- The HTML page is for stakeholder-friendly viewing; do not diverge content. Styling changes are allowed; content must match the markdown roadmap.
- If a roadmap line is flipped by automation, ensure the mirror file is included in the same commit/change set.
 - The HTML mirror must use clickable links for all file/folder references and maintain the “Output Files/Folder” column.

### CI Enforcement (Status Flips)
- Reject PRs that flip any item to Done if:
  - PRD 9.4 is not fully checked, or
  - PRD 7.3/9.4 lacks a QA results path with Overall Status: Pass, or
  - The PR has no non-doc code change within the feature’s implementation scope, or
  - Performance items (e.g., 2.3.3.7) lack a Lighthouse report and configured budgets.
- Validate that `Plans/product-roadmap.md` and `docs/product-roadmap.html` are updated together.

- Security enforcement
  - Reject flips if any High/Critical findings remain in: dependency scan, SAST, secrets scan, or if SBOM is missing for the build under test.
  - For web features, include DAST baseline results when applicable; note exceptions in PRD 9.6.

- Artifacts and evidence
  - Implementation: Edited file paths (e.g., `index.html`) and PRD 8 changelog entries.
  - QA: Results path in PRD 9.4; scenarios in QA test cases; optional `evidence/` assets.
