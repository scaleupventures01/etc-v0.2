SEQUENTIAL FEATURE IMPLEMENTATION (Range-capable, PRDs/README-aligned)
=====================================================================

Current Feature: [ROADMAP_ID] — [FEATURE_TITLE]
Source: `Plans/product-roadmap.md`
PRD: [FEATURE_PRD_PATH]
Owner: [FEATURE_OWNER_ROLE]
QA Folder: `QA/[ROADMAP_ID]-[FEATURE_SLUG]/`

INTENT
------
Execute features strictly per `Plans/product-roadmap.md` and their PRDs, without pausing between items within the selected scope. Follow the global workflow in `PRDs/README.md` end‑to‑end for each item.

SCOPE MODES
-----------
- Single Feature Mode:
  - Current Feature: [ROADMAP_ID] — [FEATURE_TITLE].
  - Do not stop until this feature reaches Ready (and Done if shipping criteria apply).

- Range Mode:
  - Range: [START_ROADMAP_ID] → [END_ROADMAP_ID] (inclusive), in the exact document order found in `Plans/product-roadmap.md`.
  - Process one roadmap line at a time using the Per‑Feature Workflow below; do not pause between items unless unresolved PRD questions block progress.
  - Continue until [END_ROADMAP_ID] completes, then notify the user.

- List Mode:
  - Items: [ID1], [ID2], [ID3] (in provided order).
  - Invocation: DO LIST=[ID1],[ID2],[ID3]  or  DO ITEMS [ID1], [ID2], [ID3]
  - Behavior: Apply the Per‑Feature Workflow sequentially to each ID without pausing, identical to Range Mode gating and artifacts.

GUARDRAILS (from PRDs/README.md)
--------------------------------
- Flip the roadmap line to Status: In Progress immediately when work starts (date it).
- Implement minimally and reversibly; match existing patterns; run lints/build/tests after edits until green.
- Execute reviews in order via PRD section 9.x: PM → VP‑Product → CTO → UX → Legal → QA → VP‑Eng.
- QA gate: Publish QA results with Overall Status: Pass and link the results path in PRD 9.4 before flipping roadmap Status to Ready.
- Roadmap mirror HTML: Ensure `docs/product-roadmap.html` remains in sync and that all file/folder references are clickable links; maintain the required “Output Files/Folder” column with links to delivered artifacts.
- Create new files or modify dependencies as needed.
- Do not ask the user to test; publish QA results first.
 - No inter‑feature stopping within the selected scope (Single or Range) unless blocked by required approvals or unresolved PRD questions.

PER‑FEATURE WORKFLOW
--------------------
1) Discovery and Status Flip
   - Locate the feature in `Plans/product-roadmap.md`.
   - Flip its Status → In Progress (include date and actor).

2) PRD Creation and Role Bootstrapping
   - If a PRD exists: open `PRDs/<Milestone>/<ROADMAP_ID>-<feature-slug>-prd.md` and confirm sections 1–6 draft completeness, section 7.3 QA artifact paths, and section 9 blocks.
   - If missing: create a new PRD from `PRDs/_templates/PRD-template.md` at `PRDs/<Milestone>/<ROADMAP_ID>-<feature-slug>-prd.md` with frontmatter populated (name, version, date, status=Draft, owner).
   - Create QA artifacts if missing:
     - Folder: `QA/<ROADMAP_ID>-<feature-slug>/`
     - Files: `test-cases.md` (scaffold from PRD 7.1/7.2); `test-results-<yyyy-mm-dd>.md` to be added on first run.
   - In the PRD, pre‑seed collaboration:
     - 7.3 QA Artifacts: reference `QA/<ROADMAP_ID>-<feature-slug>/test-cases.md` and `QA/<ROADMAP_ID>-<feature-slug>/test-results-<yyyy-mm-dd>.md`.
     - 9.2 Where Communication Happens: include the PRD path and the roadmap link.
     - 9.4 Review Log & Sign‑offs: include the QA results path placeholder; QA checkbox requires Overall Status: Pass.
     - 9.5 Reviewer Notes: reviewers must add dated notes.
   - Role prompts (reference team role guides to standardize contributions):
     - PM → `team/product-manager.md`
     - VP‑Product → `team/vp-product.md`
     - CTO → `team/cto.md`
     - UX/UI → `team/ux-ui-designer.md`
     - Legal/Compliance → record notes under PRD 9.5 until a dedicated `team/legal.md` exists
     - QA → `team/qa-engineer.md`
     - VP‑Engineering → `team/vp-engineering.md`
   - Ready gate reminder: Do not flip the roadmap item to Ready until all 9.4 checkboxes are checked AND the QA results file path in 9.4 shows Overall Status: Pass.

3) Scope Control
   - Implement ONLY this feature as defined in the PRD’s scope and acceptance criteria.
   - Do not read ahead to future features.

4) Team Collaboration (PRD 9.x)
   - Conduct role reviews in order: PM → VP‑Product → CTO → UX → Legal → QA → VP‑Eng and edit the file as needed per role.
   - Record questions in PRD 9.7 Open Questions and notes in 9.5; resolve and log decisions in 9.6.
   - Proceed when blockers are resolved; if unresolved >1 business day, set Status → Blocked and document in 9.7 and stop working, notify user.

5) Implementation
   - Make minimal, reversible edits; match current file/module structure (e.g., `index.html`, `js/core/*`).
   - Keep changes constrained to the feature’s boundaries.

6) Static Checks and Tests
   - Run lints, typechecks (if present), and unit/integration tests; fix until green.

7) QA Execution and Evidence
   - Translate PRD section 7 acceptance into test steps (or use existing `QA/[ROADMAP_ID]-[FEATURE_SLUG]/test-cases.md` if present).
   - Execute tests; publish `QA/[ROADMAP_ID]-[FEATURE_SLUG]/test-results-YYYY-MM-DD.md` including: build under test, environment, tester, summary, per‑case results, Overall Status: Pass/Fail.
   - Update PRD 9.4 with the results path and Overall Status: Pass; add reviewer notes in 9.5; record decisions in 9.6; update section 8 Changelog.

8) Ready/Done Gate and Roadmap Update
   - After QA Pass and PRD 9.4 updated, set the roadmap line → Status: Ready.
   - If PRD indicates shipping criteria are met and accepted, set → Status: Done (with date) and add to PRD 9.6 Decision Log.
   - Update the HTML mirror `docs/product-roadmap.html` in the same cycle:
     - Verify ordering rule (M3 after M5).
     - Convert all referenced paths to clickable links.
     - Populate/update the “Output Files/Folder” column with links to primary artifacts (e.g., `index.html`, `js/core/`, QA results folder).

9) Release/Push
   - Merge/push to the default branch (`main`).
   - Commands (reference): `git push -u origin main`
   - Optional tagging: `git tag -a vX.Y -m "<release notes>" && git push --tags`

RANGE EXECUTION LOOP (Range Mode)
---------------------------------
For each roadmap line from [START_ROADMAP_ID] to [END_ROADMAP_ID] inclusive, in document order:
   - Apply the Per‑Feature Workflow steps 1→8.
   - Do not pause between items unless unresolved PRD questions block progress.

LIST EXECUTION LOOP (List Mode)
-------------------------------
For each roadmap ID in the provided list, in the exact order specified:
   - Apply the Per‑Feature Workflow steps 1→8.
   - Skip and note any IDs not found in `Plans/product-roadmap.md`.
   - Stop early only if blocked by required approvals or unresolved PRD 9.7 questions.

RULES
-----
- Do NOT implement features beyond [ROADMAP_ID].
- Do NOT read ahead to future features’ details.
- Do NOT add “nice to have” items beyond the PRD.
- Respect repository constraints on new files and dependencies.
 - If the repository permits automatic creation of files, automatically create the PRD and QA artifacts described in step 2; otherwise, request approval before creating new files.
 - Within Range Mode, automatically advance to the next item after completing the current one.

OUTPUT FORMAT
-------------
- Single Feature Mode:
  1. Brief summary of what was implemented (tie to PRD acceptance)
  2. List of files changed or created (paths), including the PRD path and QA folder path
  3. QA results path and PRD 9.4 update reference
  4. Roadmap status change (In Progress → Ready/Done)
  5. "✓ Feature [ROADMAP_ID] complete — QA Pass published; PRD 9.4 linked; roadmap Ready/Done"

 - Range Mode:
   - Per‑feature mini‑summary for each item (as above, 1→4, including PRD and QA paths)
  - Final line: "✓ Features [START_ROADMAP_ID] → [END_ROADMAP_ID] complete — QA Pass published; PRDs linked; roadmaps Ready/Done as applicable"

 - List Mode:
   - Per‑feature mini‑summary for each listed ID (as above, 1→4, including PRD and QA paths)
  - Final line: "✓ Features [ID1], [ID2], [ID3] complete — QA Pass published; PRDs linked; roadmaps Ready/Done as applicable"

COMPLETION
----------
- Single Feature Mode: Notify upon completion of the current feature per Output Format.
- Range Mode: Notify only after the final item [END_ROADMAP_ID] completes. Do not stop between items.

- List Mode: Notify only after the final listed item completes. Do not stop between items.

NOTES
-----
- If the feature touches Plan Wizard UI or plan state logic, run the required smoke test (PW‑013) per `PRDs/README.md` and publish results under `QA/2.1.1.1-plan-wizard/`.
- For UI/E2E, follow the default workflow in `PRDs/README.md` for installing, linting, testing, and Playwright steps.
- Add a one‑line entry to PRD section 8 (Changelog) for any material change.

