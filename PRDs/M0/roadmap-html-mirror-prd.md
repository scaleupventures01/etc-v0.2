---
name: roadmap-html-mirror-prd
version: 1.0
date: 2025-08-12
status: Draft
owner: Product Manager
source: PRDs/README.md §5 (Roadmap Mirror Sync Policy)
milestone: M0 (governance — roadmap mirror)
---

<a id="sec-1"></a>
## 1. Executive Summary

Establish a single source of truth for the product roadmap in `Plans/product-roadmap.md` and maintain an always-in-sync HTML mirror at `docs/product-roadmap.html` for executive and stakeholder consumption. The mirror must be regenerated deterministically from the canonical markdown and include: At‑a‑Glance phase cards, nested milestone "details" panels, sortable/consistent tables, clickable links for all referenced artifacts, and a visible Last Mirror Sync timestamp. Sync parity (IDs, items, statuses, owners, links) will be enforced by a validation script.

Primary components:
- Generator: `lib/generate-roadmap-html.mjs`
- Sync checker: `lib/check-roadmap-sync.mjs`
- Canonical source: `Plans/product-roadmap.md` (section 2)
- Mirror artifact: `docs/product-roadmap.html`

<a id="sec-2"></a>
## 2. Scope

- In scope:
  - Parse section 2 of `Plans/product-roadmap.md` and regenerate corresponding `<tbody>` rows for each subsection panel in `docs/product-roadmap.html`.
  - Maintain column mapping and clickable links for artifacts (PRDs, QA, implementation paths) and update Last Mirror Sync timestamp.
  - Compute and render At‑a‑Glance phase completion percentages consistent with markdown statuses.
  - Validate parity and link existence via a script; fail on mismatch.
- Out of scope:
  - Authoring roadmap content itself (PM-owned in markdown).
  - Non-roadmap HTML styling changes beyond structural needs.
  - CI wiring (future work can add CI steps to run the checker on PRs).

<a id="sec-3"></a>
## 3. Success Criteria

- Any edit to `Plans/product-roadmap.md` can be mirrored by running the generator once, producing an HTML that:
  - Reflects exact parity for Phase, ID, Item, Status, Owner for all roadmap rows under section 2.
  - Converts all artifact references into clickable links that resolve locally.
  - Updates Last Mirror Sync to the current timestamp and recomputes At‑a‑Glance percentages correctly.
- The sync checker exits zero for a correct mirror and non-zero with actionable errors when parity breaks or links are missing.

<a id="sec-4"></a>
## 4. User Stories

- As a PM, I want a stakeholder-friendly HTML roadmap that is always consistent with the markdown roadmap, so leadership can browse status and drill into artifacts.
- As an engineer, I want a one-command regeneration to update the mirror after changing the markdown, so I don’t manually edit HTML.
- As QA, I want an automated check that fails when links or statuses diverge, so I can block incorrect roadmap flips.

<a id="sec-5"></a>
## 5. Functional Requirements

1) Canonical source and mirror
   - The canonical roadmap is `Plans/product-roadmap.md` (section 2 tables). The mirror is `docs/product-roadmap.html`.

2) Table regeneration (WBS)
   - For each subsection group (e.g., 2.1.1.x), the generator replaces the corresponding `<tbody>` inside the matching `<details class="panel">` in HTML with rows derived from the markdown.
   - Column mapping from markdown → HTML:
     - Phase → `<td>` 1
     - ID → `<td>` 2
     - Item → `<td>` 3
     - Status → `<td>` 4
     - Owner → `<td>` 5
     - PRD/Plan (path) → `<td>` 6 (as clickable `<a>`)
     - Files/QA (comma/semicolon separated) → `<td>` 7 (as clickable `<a>` list)
     - Output Files/Folder → `<td>` 8 (clickable). For now, duplicates Files/QA until a distinct output field is added to markdown.

3) Links and paths
   - All file/folder references are converted to clickable links. Supported roots: `PRDs/`, `QA/`, `Plans/`, `docs/`, `js/`, `css/`, `lib/`, `team/`, and `index.html`.
   - Globs may be collapsed to their directory for linking.

4) At‑a‑Glance cards
   - The mirror header displays phase cards (currently M2, M5, M3). Percent complete is computed as Done/Total for rows in that phase. Bars and labels update during generation.

5) Timestamp and controls
   - The Last Mirror Sync timestamp (`<span data-sync>`) is set to the generator’s run time.
   - Expand/Collapse all buttons continue to work across panels.

6) Ordering
   - Phase display order follows natural ascending sequence: M0, M1, M2, M3, M4, M5, M6, …

<a id="sec-6"></a>
## 6. Technical Requirements

<a id="sec-6-1"></a>
### 6.1 Architecture

- Regenerator: `lib/generate-roadmap-html.mjs`
  - Reads markdown and HTML, extracts markdown rows via `parseMdRows`, injects rows via `injectRows` by panel, updates the sync timestamp, and recomputes At‑a‑Glance bars.
- Sync checker: `lib/check-roadmap-sync.mjs`
  - Parses markdown and HTML rows, normalizes text and statuses, enforces parity and ordering governance, and verifies that linked targets exist on disk.

Data flow
- Source: `Plans/product-roadmap.md` (tables under §2)
- Transform: parse → normalize → map paths to hrefs → render `<tr>/<td>` → update metrics/timestamp
- Sink: `docs/product-roadmap.html` (replace `<tbody>` per subsection panel)

<a id="sec-6-2"></a>
### 6.2 Data Model

- Row fields: `{ phase, id, item, status, owner, plan, files }`.
- Status normalization for metrics/parity: `done | in progress | ready | blocked | planned`.
- Phase grouping: derived from the `phase` cell prefix (e.g., `M2 — …`).

<a id="sec-6-3"></a>
### 6.3 Storage/Schema

- Files only; no database. Source markdown tables are authoritative; HTML is generated.

<a id="sec-6-4"></a>
### 6.4 Validation

- Command: `node lib/check-roadmap-sync.mjs`
  - Parity on Phase/ID/Item/Status/Owner between markdown and HTML WBS rows.
  - Ordering enforcement: Natural ascending phase order (M0, M1, M2, M3, M4, M5, M6, …).
  - All `<a class="file-link" href="…">` targets exist locally (directories permitted). Non-existent links fail unless explicitly marked optional.

<a id="sec-6-7"></a>
### 6.7 CLI and Exit Codes

- Generator
  - Invocation: `node lib/generate-roadmap-html.mjs`
  - Exit code: 0 on success; non-zero on I/O errors (read/write failures).
  - Idempotent: running multiple times without markdown changes produces identical HTML (timestamp aside).
- Checker
  - Invocation: `node lib/check-roadmap-sync.mjs`
  - Exit code: 0 on full parity; 1 on any mismatch or missing link.
  - Error messages must enumerate: missing IDs, field mismatches, ordering violations, missing-link targets.

<a id="sec-6-8"></a>
### 6.8 HTML Structure Invariants (Contract)

- Each subsection panel uses `<details class="panel">` with a `<summary>` containing a roadmap ID prefix token `2.x.y` that identifies its group. The generator locates panels by this token and replaces exactly the `<tbody>` content within that panel.
- Tables under §2 must keep column headers stable to match column mapping (Phase, ID, Item, Status, Owner, PRD/Plan, Files/QA, Output Files/Folder).
- Links must use `<a class="file-link" href="…">…</a>`; optional links may include the attribute `data-optional` to allow checker leniency.

<a id="sec-6-9"></a>
### 6.9 Ordering Policy

- Governance: Use natural ascending phase order. Current checker implementation already enforces ascending order; no change required.

<a id="sec-6-5"></a>
### 6.5 UI/UX

- HTML retains stakeholder-friendly layout with `details` panels, table headers, and At‑a‑Glance cards. All artifact paths are hyperlinked.

<a id="sec-6-6"></a>
### 6.6 Legal/Privacy

- No user data. No PII or telemetry introduced.

<a id="sec-7"></a>
## 7. Testing & Acceptance

<a id="sec-7-1"></a>
### 7.1 Test Scenarios

1) Status update parity
   - Edit a Status in markdown; run generator; verify HTML mirrors status and sync checker passes.
2) New row addition
   - Add a new roadmap ID row to markdown; run generator; verify row appears under the correct panel with links.
3) Link resolution
   - Add one valid and one invalid artifact path; run checker; valid passes, invalid is reported as missing.
4) Ordering (ascending)
   - Arrange sample rows spanning M2, M3, M4, M5; run generator; verify display order is M0, M1, M2, M3, M4, M5, then M6+; checker must pass.
5) At‑a‑Glance accuracy
   - Modify statuses to change Done/Total ratio; run generator; verify percentage labels/bars reflect the new ratio.
6) Timestamp update
   - Run generator twice; verify `data-sync` timestamp updates.

<a id="sec-7-2"></a>
### 7.2 Acceptance Criteria

- Generator produces an HTML mirror with correct rows, links, timestamp, and At‑a‑Glance metrics after edits to markdown.
- Sync checker returns success with no errors and enforces ascending phase order; any missing links or mismatches cause a failure with actionable messages.

<a id="sec-7-3"></a>
### 7.3 QA Artifacts

- Test cases file: `QA/roadmap-mirror/test-cases.md`
- Latest results: `QA/roadmap-mirror/test-results-2025-08-12.md` (Overall Status: Pass required)

<a id="sec-8"></a>
## 8. Changelog

- v1.0 (2025-08-12): Initial PRD for roadmap HTML mirror and sync policy.

<a id="sec-9"></a>
## 9. Collaboration & Review Workflow

<a id="sec-9-1"></a>
### 9.1 Roles and Order

- PM → VP-Product → CTO → UX/UI → Legal → QA → VP‑Eng → Implementation Owner

<a id="sec-9-2"></a>
### 9.2 Where Communication Happens

- Primary: this PRD (`PRDs/M0/roadmap-html-mirror-prd.md`)
- Status: `Plans/product-roadmap.md` (mirror via `docs/product-roadmap.html`)

<a id="sec-9-3"></a>
### 9.3 Handoff Contracts (Inputs → Outputs)

- PM: Owns markdown roadmap content; defines acceptance.
- CTO: Confirms generator/checker approach, performance, and guardrails.
- QA: Authors test cases and publishes results; enforces checker.
- VP‑Eng: Confirms feasibility; recommends Ready.

<a id="sec-9-4"></a>
### 9.4 Review Log & Sign‑offs

- [ ] PM — Scope/user stories/acceptance confirmed
- [ ] VP-Product — Business alignment/KPIs confirmed
- [ ] CTO — Tech constraints/defaults confirmed
- [ ] UX — UX notes/labels/error states confirmed
- [ ] Legal — Disclaimer/privacy approved
- [ ] QA — Test scenarios/acceptance confirmed; results published at: `QA/roadmap-mirror/test-results-2025-08-12.md` (Overall Status: Pass)
- [ ] VP‑Eng — Feasibility/sequencing confirmed (Ready)
- [ ] Implementation Owner — Implementation risks and rollback plan confirmed

<a id="sec-9-5"></a>
### 9.5 Reviewer Notes

<a id="sec-9-6"></a>
### 9.6 Decision Log

<a id="sec-9-7"></a>
### 9.7 Open Questions

- Do we want additional phase cards (M0/M1/M4/M6+) in At‑a‑Glance, or keep the current subset (M2/M5/M3)?
- When the roadmap adds a distinct Output column in markdown, update generator mapping to stop duplicating Files/QA into Output.

<a id="sec-9-8"></a>
### 9.8 Ready‑to‑Implement Gate

- Condition: Review Log all checked AND QA results published with Overall Status: Pass.
- Action: Keep mirror and markdown in sync for all future roadmap edits; enforce checker on PRs.

<a id="sec-10"></a>
## 10. Excellence Checklist (link evidence per `docs/Excellence-Standard.md`)

- [ ] Scope/intent clear; dependencies and order documented
- [ ] Minimal, reversible edits; rollback steps noted in 9.6 (if risk > low)
- [ ] Lints/build/unit/integration/E2E green (as applicable)
- [ ] QA results published and linked: `QA/roadmap-mirror/test-results-<yyyy-mm-dd>.md` (Overall Status: Pass)
- [ ] Security evidence linked (secrets, deps, SAST, SBOM if applicable) — no High/Critical outstanding
- [ ] Roadmap + `docs/product-roadmap.html` kept in sync; checker passes; links verified clickable
- [ ] Token‑efficient summary and diffs; no redundant docs or dead code


