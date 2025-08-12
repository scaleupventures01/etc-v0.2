### {{MILESTONE}} {{ROADMAP_ID}} — {{FEATURE_TITLE}} (Plan for approval)

- **Proposed PRD**: `{{PRD_PATH}}`
- **Proposed QA folder**: `{{QA_FOLDER}}`
- **Goal**: Deliver a functional v0 of core feature scope per PRD.

#### Dependencies/assumptions
- Upstream dependencies available or stubbed; local-first acceptable.
- May run without full auth using local storage and feature flags as needed.
- Align to existing modules and storage adapters; keep evaluation deterministic; p95 goal ≤ 3s if applicable.

#### Team and how each will work
- **PM**: Scope in/out; user stories; acceptance.
- **VP‑Product**: KPIs and go/no-go gates.
- **Technical Product Manager**: Module API contracts; storage schemas; interfaces between modules; §10 spec links.
- **CTO**: Tech constraints; deterministic evaluation; storage keys; privacy guardrails; feature flags.
- **Security**: Threat model minimal data set; scans (deps/SAST/secrets/SBOM) → no High/Critical.
- **UX/UI Designer**: Labels, empty-states, validation, error handling; basic analytics display if present.
- **Legal**: Educational-only copy and disclaimers if analytics/results visible.
- **QA Engineer**: Test matrix; end-to-end scenarios; publish results with Overall Status: Pass.
- **VP‑Engineering**: Feasibility/sequencing; Ready recommendation post-QA.
- **Implementation Owner**: Minimal, reversible edits to existing modules and views; rollback notes.

#### Scope (in)
- Define CRUD, evaluation, journaling, analytics, or other sub-features explicitly per PRD.
- Local-first persistence via storage module(s); key names and schema documented.

#### Scope (out)
- Advanced analytics or adjacent features owned by other roadmap items.
- Multi-tenancy UI and role-based access unless in-scope.
- External DB persistence unless specified.

#### Success criteria
- Execute the primary happy path end-to-end within one session without errors.
- Performance target met (e.g., p95 ≤ 3s); no console errors in flows.
- QA results published with Overall Status: Pass; security scans clean.

#### Functional/technical notes
- Extend or adapt modules for deterministic evaluation and storage.
- Journal/analytics: compute on demand from stored entries if applicable.
- UI surfaces under `js/ui/views/*` or equivalent.
- Feature flag(s) to gate incomplete subfeatures.

#### Testing & acceptance
- Unit: core evaluation/composition, storage adapters, calculators.
- E2E smoke: primary end-to-end path.
- Acceptance: all pass; performance target met; zero console errors; scans clean.

#### Sequence
1) PM drafts PRD §§1–6 and 7.1/7.2; set 7.3 paths; 9.2/9.3.
2) VP‑Product adds KPIs/gates; TPM drafts module contracts and storage schema; CTO signs constraints.
3) Security adds threat model and scan evidence plan.
4) UX/Legal finalize labels/copy/disclaimers.
5) Implementation Owner delivers minimal, reversible edits across modules/views; feature flags.
6) Lints/build/unit/integration → E2E smoke; publish QA results in `{{QA_FOLDER}}`.
7) VP‑Eng feasibility; flip `Plans/product-roadmap.md` to Ready; mirror `docs/product-roadmap.html`.

#### Open decisions
- Priority/ordering semantics.
- Record id format and sampling window.
- Storage key versioning and migration behavior.

Approve this plan for {{ROADMAP_ID}}, and we’ll create the PRD/QA scaffolds, flip status to In Progress, update the HTML mirror, and begin the role review flow before implementation.


