# Learnings — wonka.com replica run (2026-11-25)

### Preview gate blocked until the coordinator pushes new block code
- failure class: path-safety (code bus serves only pushed code)
- evidence: archetype-static, archetype-landing, archetype-about, archetype-unique — each cluster deployed content, then gate-all on main--a6216fe5--aemcoder.aem.page measured a block-less page (/blocks/legal-accordion/legal-accordion.js 404) until the main agent committed + pushed; every fix round needed another push
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C — name the push step (coordinator commits + pushes the cluster's block files and polls the code bus byte-identical) between `.plain.html` checks and the preview gate
- status: pending

### Folder-index migrated files make verify request slash URLs of document pages
- failure class: path-safety (served path vs migrated file shape)
- evidence: verify.mjs failed us-en-about-wonka and us-en-privacy-policy with HTTP 404 — publicUrl() appends `/` because the migrated file is `…/about-wonka/index.html`, while the DA document is `/us/en/about-wonka` (served without slash); the source serves /us/en (no slash) 200 while EDS 404s it
- proposed change: `skills/rollout/scripts/lib.mjs` publicUrl — derive folder-index from the DA content path (content/<path>.html vs content/<path>/index.html), not the migrated file; `skills/rollout/SKILL.md` § Phase D — add slash/no-slash redirect rows for every delivered page whose source answers both forms
- status: pending

### Redirect-only roster rows break assemble and da-library
- failure class: capture-gap (duplicateOf root recorded as a page row)
- evidence: index (https://www.wonka.com/ 301 → /us/en/, duplicateOf us-en) kept a coverage row; assemble --verify-origin expected 7 vs 6 served, da-library exited 1 "no content file under content/ for /"; update-coverage has no redirect status or row removal
- proposed change: `skills/rollout/scripts/inventory.mjs` — skip state rows with `duplicateOf` + a redirecting finalUrl (or add `update-coverage.mjs --redirect <slug>`); `skills/rollout/SKILL.md` § Phase A
- status: pending

### Delivery pipeline drops empty-line paragraphs in legal prose
- failure class: silent-render (paragraphs holding only <br> and leading/trailing <br> stripped)
- evidence: us-en-terms-of-use lost 18 blank lines (~380 px at 1440), us-en-cookie-policy 7; encoder fixed with a zero-width space per blank line (stardust/eds-conversion-log.md)
- proposed change: `skills/deploy/SKILL.md` § Section schema — document the stripping and the encoder rule for verbatim blank lines
- status: pending

### Source JSON-LD not carried to the delivery
- failure class: dynamic-gap (head metadata)
- evidence: optimize run-1 — 5 P2 ai-search/jsonld on pages whose source has JSON-LD; autofix-aem routes eds-jsonld to manual
- proposed change: `skills/deploy/SKILL.md` § metadata — carry the captured JSON-LD into page metadata and emit it from the head pipeline at C0
- status: pending
