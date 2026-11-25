# Journal — wonka.com replica (same-design migration)

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-11-25T10:20:00Z — extract — discovery, per-page-extraction, vision-verification over the 7 named pages

**Prompt:** Replica Phase 1 (hands-off): run `stardust:extract --prep --dynamics` over exactly seven wonka.com URLs (home, bare origin, about, three legal pages, golden-ticket microsite).

**Decisions:**
- Discovery skipped in favour of `--pages` (7 URLs, no sitemap expansion); `crawl.mjs` copied byte-identical to `stardust/scripts/extract/`, run with `--concurrency 3 --dynamics`.
- Real Chrome headless (technique `chrome`) cleared the Akamai edge with no challenge; no headed fallback needed.
- `https://www.wonka.com/` answers 301 → `/us/en/` (geo/locale root); slug `index` is kept as its own page row but flagged `duplicateOf: us-en`.
- OneTrust consent dismissal is racy: the first run (wait=medium) leaked the banner into `us-en-terms-of-use`; a full rerun at wait=slow was clean except `index`, which was recaptured alone (crawl log restored from the 7-page run, recapture noted under `crawl.recaptures`).
- Home first viewport is a first-session "hat portal" intro overlay (`.wonka-hat-portal`, sessionStorage `wonka-hat-portal-seen`, skipped under reduced motion) that makes `main` inert, so the crawler and census read 0 headings/CTAs there. Captured the post-intro state separately (`pages/us-en.post-portal.json`, `assets/screenshots/us-en-post-portal.png`) via a /tmp script on `browser.mjs`.

**Artifacts touched:**
- stardust/current/pages/*.json, *.html (7) — created
- stardust/current/pages/us-en.post-portal.json, assets/screenshots/us-en-post-portal.png — created
- stardust/current/assets/screenshots/ (7 + thumbs), assets/favicon.svg — created
- stardust/current/_crawl-log.json — created (visionCheck[], recaptures)

**Findings worth flagging:**
- Two platforms under one origin: `/us/en/*` is Drupal theme `sling` (Tailwind, Inter + Work Sans 600); `/us/en/xp/golden-ticket/` is a separate Drupal promo theme `gpp_promo_theme` (CSS vars `--font-family-title`, Google Work Sans variable).
- Privacy policy body is 13 collapsed accordion sections (1433 px tall page); text is present via textContent.
- Capture gaps: /us/en links 5 first-level targets, 0 uncaptured.

**Open questions:** none

**Next:** brand-surface extraction (census done), seed PRODUCT/DESIGN, prep typing + modules.

---

## 2026-11-25T10:26:00Z — extract — brand-surface-extraction, seed, brand-review, prep, state-and-report

**Prompt:** Continue the replica Phase 1 extract: brand surface, descriptive PRODUCT/DESIGN, brand review, prep typing + module candidates, state.json.

**Decisions:**
- Style census run once (background) at 1440 + 360 over the 6 distinct URLs; home rows are empty because the hat-portal intro makes the page inert, so home tokens come from the post-portal capture and the shared sling theme.
- Fonts pulled from the site CSS `@font-face` (asset requests, not page navigations): Inter 400/500/600/700 + Work Sans 600 (self-hosted, sling) and Work Sans variable normal/italic (Google, promo theme).
- 63 referenced images + hat-portal videos saved to `assets/media/` (manifest `_manifest.json`); logo = header SVG wordmark.
- Page types: us-en, index, about-wonka → landing; privacy/terms/cookie → static; xp/golden-ticket → unique (separate promo theme).
- 19 module candidates drafted from Drupal paragraph types + cross-page header/footer repeats.
- cap-probe recorded containerMaxWidth 1536 / shell 1268 with 4 register entries (content width differs per archetype).
- state.json stamped flow replica, flowSource user-phrase, handsOff true; 7 pages extracted, site.captureGaps from crawl log (/us/en 0 uncaptured).
- Sibling candidates (hreflang /uk/en, /de/de, /fr/fr, /it/it) are same-origin locales — not added (scope fixed to 7 pages).

**Artifacts touched:**
- stardust/current/_computed-styles.json, _brand-extraction.json — created
- stardust/current/PRODUCT.md, DESIGN.md, DESIGN.json — created
- stardust/current/brand-review.html — created
- stardust/current/assets/fonts/ (7), assets/logo.svg, assets/media/ — created
- stardust/current/pages/*.json — updated (type, slots)
- stardust/chrome/header-contract.json — created (empty, see findings)
- stardust/state.json — created

**Findings worth flagging:**
- Header contract: `chrome-explore` found 0 controls / 0 links on the sling header (also with `--root [data-component-id="sling:navigation"]`); the nav lives in a `pointer-events-none` fixed wrapper with `pointer-events-auto` children. The contract needs a manual pass in the replica foundation.
- Gold headings are gradient text (`background-clip:text`, computed colour transparent) — the build must use the same gradient, not a flat gold.

**Open questions:** none (hands-off)

**Next:** replica preserve-mode prep (confirm types/modules), then the dynamics archetype pass.

---

## replica — extract (Phase 1)

- Flow: replica — the design is kept. Delegated `stardust:extract https://www.wonka.com/us/en/ --prep --dynamics --pages <7 planned pages>`.
- 7/7 pages captured live (headless Chrome, Akamai served no challenge). `index` (https://www.wonka.com/) 301s to /us/en/ → `duplicateOf: us-en`.
- Types: landing (us-en, index, us-en-about-wonka), static (privacy, terms, cookie), unique (us-en-xp-golden-ticket, separate gpp_promo_theme).
- OneTrust banner dismissal flaky (recaptured terms + index). Home has a first-visit hat-portal intro gated by sessionStorage `wonka-hat-portal-seen`; post-portal capture at pages/us-en.post-portal.json.
- Fonts: Inter 400/500/600/700, Work Sans 600, Work Sans variable (golden ticket). Header contract empty (pointer-events:none fixed wrapper) — header behaviour recorded by hand in the foundation.

## replica — preserve-direction (Phase 2)

- Promoted current/PRODUCT.md, DESIGN.md, DESIGN.json verbatim to the project root; wrote stardust/direction.md.
- Register: 4 entries (R-01..R-04, content/shell/module cap differences per template), all deferred — pure replica.
- No --target-breakpoints: source breakpoints kept.
- Dynamics detect + triage (detect, triage): 15 findings curated to 8 rows in stardust/dynamic-features.md; decision batch (tags/consent, locales, sweepstakes) shipped as named hands-off assumptions.
- Publish decision recorded in stardust/eds-conversion-log.md.

## replica — recreate (Phase 3) — archetype plan

- Retyped us-en-about-wonka landing → about: it shares no module with home, so a sibling render off the home archetype could not hold fidelity.
- Archetypes: landing = us-en (index is its 301 duplicate), about = us-en-about-wonka, static = us-en-privacy-policy (terms, cookie siblings), unique = us-en-xp-golden-ticket.
- Order: landing first (gates the shared site header/footer canon), then about + static importing the canon; golden ticket (own promo theme chrome) in parallel.

## recreate — us-en-xp-golden-ticket (2026-11-25)

- Promo theme (gpp_promo_theme), own fixed promo-header + promo-footer; no canon import. Files: prototypes/us-en-xp-golden-ticket-proposed.html, us-en-xp-golden-ticket.css, us-en-xp-golden-ticket.js, assets/gt/ (media + Work Sans variable normal/italic).
- source-spec compare exit 0 at both widths before round 1 (Δh 0, 0 nodes off).
- 1440: pixel 0.04 % (Δh 0, no offset steps), content-diff 0 red / 0 nothing-lost after iter1 fixed the hidden slider arrows / fraction / footer h2 / menu-close; chrome crops header 0.00 % footer 0.00 %; Clipped 0; overflow ok; cap-probe PASS @2560. 2 counted rounds + confirm.
- 360: pixel 0.07 % (Δh 0), content-diff 0 red / 0 yellow; chrome crops 0.00 % / 0.00 %; Clipped 0; overflow ok. 1 counted round + confirm.
- Capture flags: --consent '#onetrust-accept-btn-handler' --main main on both sides.
- Motion: slider pagination (transform 0.3 s, dot 0.6 s) + primary-button hover implemented; header morph, autoplay, other hovers dead on live.
- Residuals: IMAGERY GAP advisory (hidden lazyload f-el decor not mirrored); static body.is-desktop (live sniffs UA); mobile sweets set hard-coded to the prod2 set that live shows.

## recreate — us-en (2026-11-25)

- Gate state: the live first visit shows the hat-portal intro overlay (fixed 100dvh backdrop) in every stitched chunk; the prototype reproduces it with the same mechanism (sessionStorage `wonka-hat-portal-seen`; live has no reduced-motion skip — verified, so none in the prototype). Frozen refs forced (intro video/float make 77% of 1440 rows self-vary).
- 1440: pixel 7.69% (masked), Δh −1, content-diff 0 🔴 / 0 🟡, visual none, chrome-parity quiet, clipped 0, overflow ok, cap-probe PASS @2560. Rounds: 2 counted + 2 confirmations.
- 360: pixel 3.26% (masked), Δh −1, content-diff 0/0, visual none, chrome-parity quiet, clipped 0, overflow ok. Rounds: 1 counted + 3 confirmations.
- source-spec compare 0 off at both widths; post-intro state vs extract post-portal screenshot 97.7–99.9% per band.
- Residuals (permanent): chrome crop bands are overlay pixels (stars frame, hat-float phase); exit timeline approximated (source GSAP + magnific disc).
- Canon: prototypes/canon.css, canon-chrome.css, canon-chrome.html (HEADER/FOOTER), canon-chrome.js.

## recreate — us-en-privacy-policy (2026-11-25)

- Static/legal template (siblings us-en-terms-of-use, us-en-cookie-policy). Imports canon.css + canon-chrome.css/.js + canon HEADER/FOOTER verbatim; page files prototypes/us-en-privacy-policy-proposed.html, us-en-privacy-policy.css, us-en-privacy-policy.js. `[data-no-clouds]` verified (source CSS hides page clouds on .legal-page). Canon chrome needed no compensation.
- Body generated verbatim from the captured OneTrust notice by stardust/.work/legal/gen-legal.mjs <slug> (vendor wrappers → .legal-body rich text + .legal-acc accordion; editor residue dropped). Terms has a plain rich-text body (generator throws there — extend it), cookie policy an otnotice with cookie tables.
- source-spec compare 0 off at both widths (Δh −1) before round 1. Root font 16px at both widths.
- 1440: pixel 0.15%, Δh −1, content-diff 0 🔴 / 0 🟡 (iter1 fixed 13 hidden footer headings + section aria-label), visual none, chrome-parity quiet, crops header 0.11% / footer 0.07%, clipped 0, overflow ok, units legal-accordion 13/13, cap-probe PASS @2560. 2 counted rounds + 1 confirmation.
- 360: pixel 0.36%, Δh −1, content-diff 0/0, visual none, chrome-parity quiet, crops 0.00% / 0.13%, clipped 0, overflow ok, units 13/13. 1 counted round.
- Motion: row click → class active + panel display toggle + marker " +"/" -" (no transitions) implemented; motion-compare 1 parity / 0 missing.

## recreate — us-en-about-wonka (2026-11-25)

- Archetype `about` (discover-hero, story-cards, image-text, promo-section, social, faq-accordion) on the shared canon (canon.css + canon-chrome.css/.html/.js, chrome copied verbatim; no canon edits). Page files: stardust/prototypes/us-en-about-wonka-proposed.html / .css / .js, built by stardust/.work/about-src/build.cjs.
- source-spec compare: exit 0 at 1440 and 360 before the first round (0 section deltas, 0 nodes off).
- 1440: pixel 0.24 %, Δh −1, content-diff 0 red / 0 nothing-lost, visual flags none, clipped 0, overflow ok, units 10/10, header crop 0.12 % / footer 1.15 %, cap-probe PASS at 2560 — 2 counted rounds.
- 360: pixel 0.49 %, Δh −1, same probe results, header crop 0.00 % / footer 1.69 % — 3 counted rounds (cap reached, passed).
- Fixes: page clouds now mirror the source's load-time placement (promo mobile image keeps the source markup, no intrinsic size); h2 glyph clipping removed with overflow-x:clip (look-neutral).
- Motion: 6 parity, 0 missing, 0 extra (accordion + hovers); accordion and scroll CTA follow the source behaviors.
- Units declared: story-cards, faq-accordion (stardust/replica/units.json). Header contract compared on this URL: PASS, but the contract is empty (see progress residuals).

## replica — recreate + source-fidelity-gate (Phases 3–4) — summary

- 4 archetypes approved (hands-off). Prototype tables (gates/prototypes-1440, -360), 4/4 PASS:
  us-en 6.79% / 3.17% (masked self-varying intro overlay), about 1.82% / 0.49%, privacy 0.15% / 0.36%, golden ticket 0.04% / 0.07%; Δh ≤ 1 px.
- Capture flags for every gate: `--consent '#onetrust-accept-btn-handler' --main main`.
- Note for handoff: terms-of-use is plain rich text (no OneTrust notice wrapper) — sibling render needs that branch; cookie policy has cookie tables.

## migrate plan — 2026-11-25
- Roster 7: Path A 4 gated archetypes (us-en, about-wonka, privacy-policy, xp-golden-ticket; replica gates pass at 1440/360);
  Path A' 2 static siblings (terms-of-use, cookie-policy) render after C-archetype static; index = duplicateOf us-en (source 301 → /us/en/).
- Provenance OK 7/7, 0 data-placeholder, pagemap 7 entries / 0 collisions. Canon CSS = stardust/prototypes/canon.css (no stardust/canon/ in replica flow).
- Units in stardust/migrate/progress.json (plan done; render-archetypes running; render-static / render-landing / assets / report pending).

## migrate render (archetypes) + assets — 2026-11-25
- render: `migrate.mjs render` 4 archetypes → rendered 4, refused 0 (Path A, tier archetype). modules[] recorded per page;
  dynamic-dependency deviations (rows 4/5/6/8). Render phase stays OPEN: static siblings + index render after their C-archetype units.
- Hand fixes after the driver (logged as migrationDecisions): us-en portal video `data-src-desktop/mobile` webm not detected by the
  bundler → copied + rewritten; golden-ticket sweepstakes links (13) were tree-relative to non-roster pages → repointed to
  https://www.wonka.com per dynamic-features row 8.
- assets: logo/favicon bundled, robots.txt + sitemap.xml (4 urls), portability greps clean, pagemap-audit OK, file-protocol-audit OK.

## rollout A-inventory — 2026-11-25
- Setup: flow replica; 4 archetypes gated (replica progress.json, all ≤ bar at 1440/360); handsOff. EDS target: scaffold present,
  DA token authenticated GET admin.da.live/list/aemcoder/a6216fe5/ → 200, `git push --dry-run origin main` OK; preview `/` 404 (nothing delivered yet).
- inventory.mjs --state: 7 rows (4 pending archetypes, 3 content-pending: index → us-en, terms + cookie → us-en-privacy-policy via
  state.pages[].representative). Templates 4. rollout.json site.da = aemcoder/a6216fe5/main, liveHost main--a6216fe5--aemcoder.aem.live.
- Source root `https://www.wonka.com/` answers 301 → /us/en/: index is a REDIRECT row at D-site (`/`, `/index.html` → `/us/en/`), not a page document.

## rollout B-block — 2026-11-25
- blocks.mjs: 17 distinct module blocks, 23 instances; plan.mjs representative-first (privacy → us-en → about → golden ticket).
- EDS names: id = name, except `hero` → `home-hero` (avoid boilerplate hero/buildAutoBlocks), `promo-title-text` → default-content
  (text + button in a styled section). 16 blocks to convert. Chrome (header/footer, golden-ticket promo theme) is the foundation unit, not in blocks.json.
- Note: terms-of-use inherits legal-accordion from the static template but is plain rich text — its convert uses default content only.

## rollout B2-dynamic — 2026-11-25
- detect (4 pages, 15 findings, identical ids to the prep run) + plan vs aem.page target (host-bound 0, delivered 2). dynamic-features.md
  reconciled: row 4 reach 3/7 (privacy legal accordions); row 8 links absolute to source origin in migrated golden ticket. No new rows.

## rollout C-deliver archetype-static — 2026-11-25
- Block `legal-accordion` (reconstructive; notice variant) + content /us/en/privacy-policy: PUT → preview → publish OK.
- Chain: delivery-lint (6 P1 false-positive one-cta-per-p on prose), lint clean, media 0, davids 0 🔴, roundtrip --ew 0 🔴.
- .plain.html: 200, one h1, 0 about:error, 0 /img/; ai-readability code 100 %. Coverage row → deployed.
- Local code + previewed content vs prototype (measure.mjs): Δ 0 px on h1/body/rows/footer, height equal at 1440 & 360.
- Preview gate-all BLOCKED: blocks/legal-accordion not on origin/main (404 on code bus) — needs the coordinator's push.
- gate round 1 (preview, pushed ac4a3cf): 1440 0.21 % Δh 1, 360 0.40 % Δh 1, clip 0, content 0 missing — FAIL units off 13 (title <p> inline
  376×20 vs source button 768×30). Fix: title block-level + marker ::after on it (local Δ 0); awaiting push for round 2.
- gate round 2 (preview): 1440 0.21 % Δh 1 / 360 0.40 % Δh 1, clip 0, content 0, units off 0 — PASS both widths; row verified.

## rollout C-deliver archetype-landing — 2026-11-25
- us-en (/us/en/ ← DA /us/en/index) converted to 4 blocks: portal (first section, eager: no page flash before the intro), home-hero, product-cards, coming-soon; encoder stardust/.work/rollout/landing/encode-landing.mjs (prototype DOM → DA body fragment, media from the ledger).
- Chain: delivery-lint clean, media-reconcile 14 hosted (scope media/home, stars mp4 via media bus), davids-model-lint 0 🔴 / 3 🟡, sanitise, qa-gate (residuals: fixed-chrome header h=0, harness logo 401, R-01 739 cap), block-roundtrip --ew 55/56 editable (1 exempt), PUT → preview → live.
- Published-origin gate (preview host, first run, 0 fix rounds): 1440 6.05 % Δh 1 / 360 3.01 % Δh 1, clip 0, MISSING 0 / HIDDEN 0. Crop bands (post-intro, seen flag both sides): header 0.13 % / 0.00 %, footer 0.07 % / 0.13 %. Chrome parity: 1 delta per width = logo file signature (wonka-logo.svg → DA media hash; foundation, not visual). ai-readability code 100 %.
- captureState delivered: intro overlay with seen flag, stars mp4 autoplay muted loop + keep-alive (playing on preview, currentTime advancing), orbit swap, CTA busy + spinner, exit zoom; product details disclosure.
- Banner text authored as the page h1 (source has none): block-roundtrip flags ROLE SWAP 🔴, content-diff accepts it as a same-look ROLE UPGRADE.
- Foundation requests: 0. foundation-freeze check: unchanged.

## rollout C-deliver cluster-landing — 2026-11-25
- index is a redirect, not a page: curl -sI https://www.wonka.com/ → 301 Location /us/en/. stardust/redirects.tsv: / and /index.html → /us/en/.
- Redirects sheet /redirects.json (DA sheet, Source / Destination): PUT 201 → preview 200 → live 200. curl -sIL ends 200 at /us/en/ on aem.page and aem.live (also /index.html).
- Coverage: update-coverage.mjs has no redirect status; the index row stays content-pending (coordinator decision).

## migrate render-static — siblings rendered (2026-11-25)
- sibling-variance (live, 1440): terms 6 deltas → variant legal-body--plain (16/21 +.02em, no notice inset, lead "Last
  Updated" line); cookie 5 deltas → legal-body--notice + legal-cookie-list (OneTrust SDK list as static tables).
- Path A′ clones via stardust/.work/rollout/static/{legal_extract.py,build_sibling.py}; state extracted→directed; render
  A′ 2/2. content-diff capture→render: terms 54=54, cookie 62=62 (+12 aria attrs), looks-same 0 · nothing-lost 0.

## rollout C-deliver archetype-about — 2026-11-25
- Six new blocks (discover-hero, story-cards, image-text, promo-banner, social, faq) from the gated prototype;
  content /us/en/about-wonka via encode-about.mjs; 7 editorial images in DA media/about.
- Local structural asserts green (block-roundtrip --ew 0 🔴, 32/32 editable; qa-gate harness-only fails).
- Deployed + published via deploy-batch (ledger-about.json); .plain.html: 1 h1, 7 img/alt, 0 about:error.
- Gate round 1 (preview): pixel 1440 2.39% / 360 2.48%, Δh 1, clip 0, content 0 red; FAIL units only (source FAQ
  question is a <button>, ours a <p>): faq row → div[role=button]; units.json eds selectors.
- Round 2 PASS: 1440 2.39% / 360 2.48%, Δh 1, units 3+7 within 4px; ai-readability code 100%; row verified.

## rollout C-deliver archetype-unique — 2026-11-25
- us-en-xp-golden-ticket (/us/en/xp/golden-ticket/ ← DA …/golden-ticket/index), `Theme | golden-ticket` → foundation promo chrome; 5 blocks
  (promo-visual, promo-editorial qr/image-left, promo-steps, promo-prizes, ar-banner) + default content; encoder stardust/.work/rollout/unique/encode-golden-ticket.mjs.
- Chain: delivery-lint clean, lint clean, media 9 hosted (media/golden-ticket), davids 0 🔴 / 5 🟡, sanitise, qa-gate (residuals: fixed header h=0,
  harness logo 401, ar-banner hidden by design), roundtrip --ew 27/27 → PUT → preview → live; .plain.html 1 h1, 0 about:error; ai-readability code 99 %.
- Published-origin gate (preview, round 1, 0 fix rounds): 1440 0.83 % Δh 0 / 360 1.02 % Δh 0, clip 0, MISSING 0 / HIDDEN 0 → PASS; row verified.
- Motion: dot pager (track 0.3s, dot 0.6s); is-desktop switch via UA test in block JS. Sweepstakes links stay absolute to source (migration decision).
- Foundation requests: 1 (golden-ticket default-content frame, shipped scoped in promo-visual/ar-banner CSS). foundation-freeze check: unchanged.
- cluster-static gate round 1 (preview): privacy 0.21/0.40 %, terms 0.38/0.74 %, cookie 1.23/2.87 % — all PASS gate-all; cookie 360 Δh 31 px
  over the 8 px bar → CSS fix (source whitespace around cell labels/links, 24px content lines; local Δh 4/6 px), awaiting push.
- cluster-static gate round 2 (preview): cookie 1.23 % Δh -4 / 1.80 % Δh -6, terms 0.38/0.74 % Δh 1, privacy 0.21/0.40 %
  Δh 1 — 3/3 PASS both widths; rows verified.

## rollout C-deliver final — 2026-11-25
- Units done: foundation, 4 archetypes, 4 clusters (landing = root redirect, static = terms + cookie, about/unique no siblings), gate-all, final.
- gate-all on aem.live: 1440 6/6 PASS (us-en 3.19, about 2.39, cookie 1.23, privacy 0.21, gt 0.83, terms 0.38 %); 360 6/6 PASS (2.96, 2.48, 1.80, 0.40, 1.02, 0.74 %); Δh ≤ 6 px, clipped 0, content 0. Wide 2560: 5 PASS, us-en source reference unstable (animated intro) — report only.
- foundation-freeze check: unchanged (27 files). foundation-requests.md: 1 line (golden-ticket theme default-content frame). Decision: kept as the shipped section-scoped override in promo-visual.css / ar-banner.css (only the golden-ticket template uses that theme); no foundation edit, so no archetype re-gate.
- Redirects sheet 8 rows: / and /index.html → /us/en/; /us/en and /us/en/xp/golden-ticket → slash forms (source serves both); slash forms of the 4 document pages → bare path. All end 200 on .aem.page and .aem.live.
- Coverage: update-coverage --gate (1440, 360) 0 flips; index row = redirect, recorded deployed at the live root and verified; verify.mjs --all 7/7 verified on aem.live.
- Landing → golden-ticket links localized (root-relative), landing republished.

## rollout D-site — 2026-11-25
- Served /sitemap.xml = 6 urls (the 6 pages, no chrome); assemble --verify-origin exit 1: assembled 7 incl. `/` from the `index` coverage row (a 301 redirect, not a page). With that row filtered (scratch copy) served 6 = assembled 6, exit 0.
- Chrome /nav, /footer, /us/en/xp/golden-ticket/{nav,footer}: `robots noindex` in head, 200 on .aem.page + .aem.live (4/4); no change needed.
- /redirects.json live, 8 rows; `/` and `/index.html` 301 → /us/en/, curl -sIL ends 200 on .aem.page and .aem.live.
- da-library exit 1 on real coverage (no content file for `/`); run with the filtered coverage: 16 blocks (19 variants), 4 templates, config library tab, exit 0 (marker in stardust/.work/rollout/site/probe/library, not stardust/rollout/library).
- Open: the `index` row needs a redirect status / removal (update-coverage has none), then re-run both checks on the real coverage.
- Decision (coordinator): the `index` coverage row (source root, a 301 to /us/en/, duplicateOf us-en) is a redirect row, not a page — dropped from coverage (pages/templates/blocks) so the sitemap, verify and library count delivered documents only; the redirect lives in /redirects.json. After: verify 6/6, assemble --verify-origin exit 0 (6 urls), da-library exit 0.

## rollout D2-dynamic — 2026-11-25
- 5 self rows (settings, privacy capture, header menu, disclosures, S3 hosts) confirmed delivered by the frozen blocks; no code edit. Flows measured on aem.live 1440/360 (probe: stardust/.work/dynamics/probe.json).
- parity.json 8 features / 15 checks (dom-count, consent-gate, no-page-errors); dynamics-check on aem.live 15/15 PASS, exit 0.
- Owner batch 3 rows: tags & consent (scaffolded-awaiting-owner, consent declined, 0 tag requests), locales (interim, /us/en/ only, no hreflang), sweepstakes (interim, links to www.wonka.com).
- Learnings: no language toggle on the source chrome (aria-haspopup = OneTrust buttons); source "dialogs" are disclosures, so click-dialog does not apply; home portal intro keeps the header inert until dismissed.

## rollout E-full-site — 2026-11-25
- `verify.mjs` (liveHost aem.live): 6/6 verified, 0 failed, exit 0.
- Headless render check (stardust/.work/rollout/verify/render-check.mjs → render-check.json) on first page per template @1440: 4/4 pass — body.appear, sections 5/7/1/6, 0 pageerror, 0 console errors, 0 broken img (47/51/9/29 imgs).
- captureState held: landing hat-portal shown on first visit + stars video playing (currentTime 3.62→5.12 s), seen flag skips it; privacy 13 legal toggles all collapsed, no clouds; golden-ticket body.golden-ticket.
- Note only: a few lazy imgs never entered view (hidden/off-canvas slides), not errors; the one visible pending GT image serves 200 image/png.

## rollout E2-link-audit — 2026-11-25
- localize-links --check over content/ (10 docs): exit 0, 0 localizable; 13 source-host links kept (GT lead/register ×8, GT terms-and-conditions ×5).
- Link audit (stardust/.work/rollout/verify/link-audit.mjs → link-audit.json): 10 docs served 200; 39 unique hrefs — internal 7/7 200, 0 404; 2 source targets 200; 20 external (cookiepedia 9× 403 bot-block); 10 in-page anchors.
- direction.md: one named decision "link targets outside the plan" (scope extension → repoint to source) with the list. No content changed, no re-deploy.

## rollout F-optimize + G-aem — 2026-11-25
- optimize on aem.live: 6 pages, open P1 0, P2 5 (ai-search/jsonld: the source carries JSON-LD on 5 pages, the delivery none), 1 source-parity (golden-ticket). Gate PASS.
- autofix-aem --dry-run: 5 candidates, all manual (eds-jsonld → head/metadata pipeline). Left open as P2 for a follow-up pass; nothing applied, no re-deploy.

## rollout H-report — 2026-11-25
```
rollout — https://www.wonka.com/ → aem-eds (main--a6216fe5--aemcoder.aem.live)
Pages       6 total · 6 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale (+ root / as redirect)
Templates   4 (us-en 1/1, us-en-about-wonka 1/1, us-en-privacy-policy 3/3, us-en-xp-golden-ticket 1/1)
Blocks      17 total · 17 converted · 0 pending
Quality     health 50/100 (ai layer only scored) · open P1 0 / P2 5 (jsonld) / P3 0
Pixel table prototypes 4/4 PASS · deployed 6/6 PASS at 1440 and 360 (pixel-only 6/6) — gates/{prototypes,all}-1440/summary.md
To deliver  —
Content     —
Dynamics    8/8 parity rows pass on aem.live (stardust/qa/dynamics-report.md); owner batch 3 rows interim
```
- learnings.md: 5 entries (pending).

## units declared — 2026-11-25
- units.json +6 families (product-cards us-en; legal-prose-plain terms; legal-prose-cookies + legal-cookie-tables cookie; promo-steps + promo-prizes golden-ticket); hero CTA pair (non-uniform gold/blurred, inner span vs bare text) left undeclared.
- gate-all live host: 1440 4/6, 360 4/6 PASS (pixel-only 6/6); units_not_declared gone. FAIL units: cookie-policy tables off 20@1440/13@360 (cell vs inner-text boxes, cols Δx +6/+7, Δy ≤ +5; 360 rows hidden both sides); golden-ticket step/prize h3 box Δy +8 Δh −8 (glyph rects identical) off 5 both widths.
- No block/style/content edits; coverage flipped cookie-policy + golden-ticket to failed → done-check pages_failed:2. Needs a block fix or an owner-approved `waives:["units"]` override.

## unit fixes — 2026-11-25
- golden-ticket headings: source h3.p-editorial__title carries the side padding (0 1rem) and contains the star's 8px top margin; ours collapsed it through the h3 and padded a wrapper → promo-steps/promo-prizes h3 `display: flow-root` + padding moved onto the h3; injected on the live page all 5 headings match the source box exactly at 1440/360, docH unchanged.
- cookie tables: source table + cells are content-box (770 incl. borders, th min 75+30), first-column/header cells hold text directly, links line-height normal, stacked header rows positioned against #ot-sdk-cookie-policy-v2 → legal-accordion css+js (unwrap p in th/first td, `.legal-cookie-list` wrapper position:relative); units.json eds selector now `.legal-body-cookies table.legal-cookie-table`. Local unit-geometry: 0 off at 1440 and 360; privacy/terms units still PASS.
- header_parity recorded on the live host (chrome-explore → chrome-compare published, 0 errors, 390/1440); chrome-parity live 1440 0 deltas, 360 0 deltas (1 advisory REST STATE). Block code awaiting push before the re-gate.
- live purge (admin code+cache POST via the deploy token rule, all 200, twice): .js refreshed on .aem.live; the 3 block CSS files still served stale on the plain URL (Age ~3360, X-Cache MISS ×3; cache-busted ?x= URL serves the new file) — re-gate not run.

## handoff note — 2026-11-25 13:40Z
- Open: rollout I-dashboard started, not ended. Unit fixes for cookie-policy (legal-cookie-tables) + golden-ticket (promo-steps/prizes) pushed in 340be18; .aem.page serves them, .aem.live CDN still serves the old 3 CSS files (max-age 7200, stale until ~14:30Z). Next: confirm live CSS = repo, re-gate gate-all --width 1440/360 --eds-host main--a6216fe5--aemcoder.aem.live --skip-existing --recapture-eds, update-coverage --gate both widths, done-check, then I-dashboard end and replica handoff end.

## rollout I-dashboard — 2026-11-25
- Live CSS for promo-steps/promo-prizes/legal-accordion matched the repo at 14:37Z (CDN max-age expiry). First 1440 re-gate caught transient 401s from aem.live on block assets (golden-ticket Δh −1240, unstyled); browser probe then clean (h 3641) → re-gate.
- gate-all aem.live --recapture-eds: 1440 6/6 PASS (max 2.39%, golden-ticket 0.83% Δh 0), 360 6/6 PASS (max 2.48%); units off 0. update-coverage --gate both widths (2 flips back), verify --all 6/6.
- Local done-check names about-wonka/privacy-policy as not live at their folder-index URL (`/x/` → 301); the extensionless paths answer 200 and the runner's done-check does not list them — tool false positive, records left as they are.
- dashboard.mjs → stardust/rollout/dashboard/index.html (7 identified, 6 deployed).

## replica handoff end — 2026-11-25
- Runner done-check {"complete":true,"gaps":[]}. 6 pages + root redirect live on aem.live, published-origin gate 6/6 at 1440 and 360.
