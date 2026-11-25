# EDS conversion log — www.wonka.com

- 2026-11-25T10:26:50Z — Publish decision: **publish** (made by the run owner before the run). Every delivered page, the redirects sheet and the chrome documents (nav, footer and locale variants) go live on the aem.live origin.

## archetype-static — us-en-privacy-policy (2026-11-25)
- Section 0 (legal-page): h1 → default content (gold uppercase via `.legal-accordion-container` section scope); body → block
  `legal-accordion` (variant `notice`), decode tier **reconstructive** (rows classified by cell count: 1 cell = rich-text
  passage, 2–3 cells = section title `<p>` | body | open-label `<h3>`). Shell (1268 shell / 800 column) = section-scoped CSS.
- Decisions: consent `<button>`s authored as `#consent-settings` links, unwrapped (EW6) into span[role=button]; source
  colour spans (legal-ink/legal-blue) dropped (DA strips span classes; visible only in open panels); in-page section links
  re-pointed at pipeline heading ids (leading number dropped). D3 🟡 mixed cell counts accepted (passage vs section rows).
- Gates: davids-model 0 🔴; block-roundtrip --ew 0 🔴, editable 83/83; qa-gate units 13 ok (header broken-image + cap 1536
  vs template shell 1268 are harness/foundation-level); delivery-lint 6 P1 one-cta-per-p = prose bold lead-ins, not CTAs.
- Encoder: stardust/.work/rollout/static/encode-legal.mjs (reused for terms-of-use / cookie-policy).

## rollout C-deliver archetype-landing (us-en) — 2026-11-25
- Decode tier per section: portal = template-slotted (slide rows → orbit/title/CTA slots; backdrop row → video; label row → swipe hint);
  home-hero = template-slotted (ship / h1 banner / product pictures / CTAs by role); product-cards = reconstructive (one row per card,
  cells classified image / summary / details-with-h4; nutrition facts as nested list, bold = daily value); coming-soon = template-slotted.
- David's model 🟡 justified: portal + home-hero D3 (fixed compositions, rows differ by role); coming-soon D1 kept as a block per plan
  step us-en (bespoke cloud-framed backdrop band with generated star; not reusable as a section style).
- Deviations: banner p → h1 (one-h1 rule; same look); portal "Taste the Wonder" authored as plain text (no destination) in a
  role=button wrapper (EW7); nutrition table → nested list with a derived sr-only caption (@ew-exempt); hat webm + clouds on the code origin.
- Lint: npm run lint clean (js, css, breakpoints).

## archetype-about — us-en-about-wonka (2026-11-25)
- discover-hero (dhero): **template-slotted** — image → book slot, p before h1 → eyebrow, h1 → title, p after → text,
  link p → scroll button (text MOVED into the visible hint; aria-label from it); clouds/dust/arrow = block assets.
  D1 🟡 (prose-only block) accepted: bespoke full-viewport composition with decorative layers + eased scroll.
- story-cards (scards): **reconstructive** — row with an image = card (icon | text), other rows = section head;
  stars/seal art = block assets (card 1 of 3 bottom-right, card 3 top-left). D3 🟡 (1 vs 2 cells) accepted.
- image-text (itext): **template-slotted** — first image → media, first heading → desktop title (mobile title =
  EW4 presentational clone, instrumentation stripped), other elements → copy slots with a star between.
- promo-banner (promo): **template-slotted** — headings/text → head, images: 1st ≥768px / 2nd <768px (two authored
  images, art direction by CSS), button p → CTA (+ arrow icon). D3 🟡 accepted.
- social: **reconstructive** — h → title, p → text, list of `:social-x: Label` links → round buttons, label text
  MOVED into the caption. D1 🟡 accepted (bespoke button row). faq: **reconstructive** — 2 cells = item
  (question | answer), 1 cell = head; EW7: row takes the click, icon-only button toggles. D3 🟡 accepted.
- Gates: delivery-lint clean; media-reconcile 7 hosted (media/about); davids-model 0 🔴 / 5 🟡; block-roundtrip --ew
  0 🔴, editable 32/32; qa-gate 24 ok (3 broken = chrome logo via dev proxy, header h=0 + cap 1536 = harness/foundation).
- Encoder: stardust/.work/rollout/about/encode-about.mjs (input: prototype or migrated about page).

## rollout C-deliver archetype-unique — us-en-xp-golden-ticket (2026-11-25)
- DA /us/en/xp/golden-ticket/index (served /us/en/xp/golden-ticket/), metadata `Theme | golden-ticket` → foundation promo
  header/footer (/us/en/xp/golden-ticket/{nav,footer}); encoder stardust/.work/rollout/unique/encode-golden-ticket.mjs.
- Decode tier per section: promo-visual = template-slotted (desktop/mobile art by role, decor CSS/code assets);
  promo-editorial qr + image-left = template-slotted (heading/body/CTA/media/note by content); promo-steps =
  reconstructive (rows with picture = steps); promo-prizes = reconstructive (rows with picture = slides, dot pager);
  promo-title-text = default content (rules link + legal copy) in the ar-banner section; ar-banner = template-slotted, hidden.
- David's model 🟡 justified: D1 promo-visual (art-directed key visual + decor, fixed composition), D1 ar-banner (bespoke
  hidden AR call-out mirrored from source); D3 editorial/steps/prizes (title row + repeat rows differ by role).
- Decisions: sweepstakes links (lead/register, terms-and-conditions) absolute to www.wonka.com (migration decision);
  is-desktop switch → UA test in block JS (phone UA shows the CTAs the desktop hides); default-content frame + page
  row-gap scoped on .promo-visual-container / .ar-banner-container (foundation request filed).
- Lint: npm run lint clean (js, css, breakpoints). delivery-lint clean; media-reconcile 9 hosted; roundtrip --ew 27/27.

## cluster-static — us-en-terms-of-use, us-en-cookie-policy (2026-11-25)
- legal-accordion gains variants `plain` (sling legal-page__body 16/21 +.02em, disc lists) and `cookies` (OneTrust notice
  values, 0 1rem inset, cookie-list h3/h4/desc); rows with 4+ cells = table rows (first = header) → table.legal-cookie-table,
  td data-label from header (stacked < 531px as the source), sr-only caption + "Opens in a new Tab" aria-labels rebuilt
  (DA drops them). Decode tier reconstructive. Terms lead line "Last Updated" = default content under the h1.
- Pipeline deltas handled in the encoder: leading/trailing `<br>` and `<p><br></p>` blank lines are trimmed on delivery →
  anchored with U+200B (25 instances; invisible, recorded as a transform). davids D1 🟡 (terms) / D3 🟡 (cookie) accepted.
- Harness: build-harness drops a block's last single-cell row (verified on .plain.html instead); qa-gate units count
  prose P as units (false positive). Local code + preview content vs source: terms Δh 1 px both widths; cookie 4 / 31 px.
