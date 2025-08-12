# Roadmap Mirror — Test Cases

Scope: Validate `lib/generate-roadmap-html.mjs` and `lib/check-roadmap-sync.mjs` keep `docs/product-roadmap.html` in sync with `Plans/product-roadmap.md`.

## Environment
- Host: macOS latest
- Node: system default

## Cases

- TC-01 Status update parity
  - Edit a Status in `Plans/product-roadmap.md`.
  - Run `node lib/generate-roadmap-html.mjs`.
  - Expected: Corresponding row in `docs/product-roadmap.html` reflects the new status.
  - Run `node lib/check-roadmap-sync.mjs`.
  - Expected: Checker passes.

- TC-02 New row addition
  - Add a new roadmap ID row under §2.
  - Run generator.
  - Expected: New row appears in the correct subsection panel.
  - Checker passes.

- TC-03 Link resolution
  - Add one valid and one invalid artifact path under Files/QA.
  - Run generator and checker.
  - Expected: Checker reports missing-link error only for the invalid path.

- TC-04 Ordering (ascending)
  - Ensure phases include at least M2, M3, M4, M5.
  - Run generator.
  - Expected: Display order is M0, M1, M2, M3, M4, M5, then M6+; checker passes.

- TC-05 At‑a‑Glance accuracy
  - Flip some items to Done to change Done/Total.
  - Run generator.
  - Expected: At‑a‑Glance percentage labels/bars update accordingly.

- TC-06 Timestamp update
  - Run generator twice.
  - Expected: `<span data-sync>` updates to a newer timestamp on second run.


