# Excellence Standard v1.0 (All Roles)

Purpose
- Set a clear, shared bar: best work first, minimal tokens, zero rework.
- Codify behaviors that improve quality, speed, and signal across PM, Product, Eng, UX, Security, and QA.

Principles
- Best‑Work‑First: Deliver the highest quality output you can on the first pass; avoid throwaway work.
- Minimal Tokens, High Signal: Be concise; prefer structured checklists, diffs, and links to evidence.
- Small, Reversible Edits: Ship incremental, low‑risk changes with a clear rollback plan.
- Evidence‑Driven Gates: Tests, QA results, and security evidence decide readiness.
- Authoritative Sequencing: Document dependency order and follow it; no ad‑hoc shortcuts.
- Single Source of Truth: Update the PRD and roadmap; link rather than duplicate.
- QA‑First Communication: Don’t ask others to test; publish QA Pass before notifying.

Role Expectations (applies to each role’s guide in `team/`)
- PM: Capture scope, acceptance, and sequencing with pre/post‑conditions; keep roadmap status authoritative.
- VP‑Product: Define success metrics and go/no‑go gates; enforce adherence to this standard.
- CTO: Set technical constraints, defaults, and guardrails (perf, size, security, privacy) that reduce rework.
- UX/UI: Provide flow, labels, and states that minimize ambiguity; ensure accessibility and consistency.
- Security: Provide a concise threat model and required controls; confirm no High/Critical findings at Ready.
- QA: Author test cases from PRD acceptance; publish Pass/Fail results with evidence.
- VP‑Engineering: Confirm feasibility and sequencing; enforce minimal, reversible edits.
- Implementation Owner: Execute minimal scope aligned to PRD; publish evidence; include rollback notes.

Deliverable Format (default)
- Intent: One sentence purpose and expected outcome.
- Change Summary: High‑signal list of edits (files/paths) and why.
- Evidence Links: Tests/QA results, perf/size/security evidence, and PRD/roadmap links.
- Impact & Risk: Behavior deltas, user‑visible changes, rollback plan.

Review Rubric (apply during PRD 9.4 and code reviews)
- Clarity: Is the intent and scope unambiguous? Are pre/post‑conditions documented?
- Alignment: Does it conform to PRD scope, roadmap status, and architecture guardrails?
- Completeness: Are tests, QA, and mirrors updated? Any gaps or TODOs remaining?
- Efficiency: Is the change small, focused, and token‑efficient with high signal outputs?
- Reversibility: Can this be rolled back safely? Are rollback steps documented?
- Testability: Are unit/integration/E2E paths covered and passing?
- Security/Privacy: Are required scans/controls satisfied with links to evidence?

Excellence Checklist (attach in PRD 9.4 or reference here)
- [ ] Scope and intent are explicit; dependencies and order documented (pre/post‑conditions).
- [ ] Minimal, reversible edits; rollback steps captured in PRD 9.6 (if risk > low).
- [ ] Lints/build/unit/integration green; E2E run executed when applicable.
- [ ] QA results published at `QA/<id>-<slug>/test-results-YYYY-MM-DD.md` with Overall Status: Pass and linked in PRD 9.4.
- [ ] Security evidence (secrets, deps, SAST, SBOM; DAST if applicable) shows no High/Critical; evidence paths linked.
- [ ] Performance/size budgets respected; evidence attached when relevant.
- [ ] Roadmap and HTML mirror updated in same change; links verified clickable.
- [ ] Token efficiency: concise summary, focused diffs, no dead code, no redundant docs.
- [ ] Commit message references roadmap ID and includes a one‑line intent.

Communication & Adoption Plan
1) Repository Integration (this change)
   - Link this standard from `PRDs/README.md` Quick Start and require the Checklist in PRD 9.4.
   - Reference from `docs/RUNBOOK.md` Communication and Checklist sections.
   - Add section 10 (Excellence Checklist) to the PRD template.
2) Team Announcement (paste into Slack/Email)
   - Subject: Adopting the Excellence Standard (Best‑Work‑First, Minimal Tokens)
   - Body: Today we’re adopting the Excellence Standard across all roles. The goal is higher quality on the first pass with concise, evidence‑backed outputs. Effective immediately: follow the Excellence Checklist in PRD 9.4; publish QA Pass before any Ready flip; keep roadmap and HTML mirror in sync. See `docs/Excellence-Standard.md` and `PRDs/README.md` for details.
3) Enforcement
   - Reviewers apply the Review Rubric; Ready flips require the Excellence Checklist checked alongside existing gates.
   - VP‑Eng and VP‑Product can block merges if rubric fails or checklist is incomplete.
4) Continuous Improvement
   - Add improvements to this file via PRD section 8 (Changelog) references; version bump on material changes.

Versioning
- v1.0 — Initial adoption (linked in PRD template and PRDs README)


