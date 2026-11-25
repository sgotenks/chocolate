# Dynamic features — www.wonka.com (7-page replica)

Hands-off: every non-`self` row ships its interim tier and its decision is a named assumption (never `decided-out`).
Source: stardust/dynamics/dynamic-features.generated-plan.md (15 findings, 3 probed pages; reach from the 7-page crawl).

## Listings contract
none — no index-driven listing blocks on the 7 pages (the golden-ticket 6-card group is editorially curated).

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings | drupalSettings + dataLayer objects | A | 7/7 | static-snapshot | content | self | done | read-settings | none — values only feed tags (row 6) | _dynamics.json rows 1–2 |
| 2 | cr-privacy-accordion | privacy policy main filled after load (13 collapsed accordions) | CR | 1/7 | static-snapshot | content | self | done | client-rendered-page | none — full text captured in pages/us-en-privacy-policy.json | MAIN-EMPTY-AT-LOAD, extract journal |
| 3 | m-chrome-menu | header menu / language toggle (aria-haspopup) | M | 7/7 | rebuild-native | runtime | self | done | chrome-interaction | none — header rebuilt from the measured source | _dynamics.json row 7 |
| 4 | m-product-dialogs | product detail dialogs (aria-controls → dialog) on home cards, FAQ accordion on about, legal accordions on privacy | M | 3/7 | rebuild-native | runtime | self | done | modal-loader (rebuilt as in-place disclosures) | none | _dynamics.json row 8 |
| 5 | i18n-locale-trees | locale variants en-GB, en-US, de-DE, fr-FR, it-IT | I18N | 7/7 | static-snapshot | content | needs-business-decision | interim | locale-tree | ASSUMPTION: only /us/en/ pages of the fixed plan migrate; locale-switch links keep pointing at the source origin | _dynamics.json rows 4–5 |
| 6 | t-tags-consent | Google Tag Manager, GA/Ads, OneTrust CMP, runtime-injected tag iframes | T | 7/7 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | ASSUMPTION: tags and CMP are not wired on the new host until the owner supplies property ids / CMP domain; the cookie banner is not replicated | _dynamics.json rows 9–11, 14 |
| 7 | t-ferrero-static-hosts | Ferrero S3 static hosts (media / promo assets) | T | 3/7 | static-snapshot | content | self | done | — | none — assets are rehosted with the page media | _dynamics.json rows 12–13 |
| 8 | x-sweepstakes-signin | golden-ticket sign-in / register (/us/en/xp/golden-ticket/lead/...) | X | 1/7 | static-snapshot | content | needs-backend | interim | — | ASSUMPTION: links kept, pointing at the source origin's sweepstakes flow (undecided — revisit at rollout) | _dynamics.json row 15 |

## Decision batch
One message to the owner (3 rows, each shipping its interim tier as a named hands-off assumption — none decided-out):
- **Tags & consent** (row 6, interim `scaffolded-awaiting-owner`): which GTM container / GA property and which OneTrust domain script run on the new host. Shipped: consent declined by default (scripts/consent-check.js), 0 tag / CMP requests; the `#consent-settings` controls render (privacy 2, cookie policy 1) and stay a no-op until the OneTrust SDK is present; the footer `#ot-sdk-show-settings` link likewise.
- **Locales** (row 5, interim `interim` — /us/en/ only): whether the uk/en, de/de, fr/fr, it/it trees are migrated later. Shipped: only /us/en/ served, html lang=en, no hreflang alternates (source emitted 6), chrome links stay in /us/en/.
- **Sweepstakes** (row 8, interim `interim` — links to source): whether golden-ticket registration / sign-in moves to the new host. Shipped: 8 register + 5 terms links absolute to https://www.wonka.com/us/en/xp/golden-ticket/.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none (hands-off never decides out) | — |

## B2 reconcile — 2026-11-25 (rollout pre-import gate)
- Fresh evidence: `dynamics-detect.mjs --from-state stardust/state.json --reach stardust/current` (4 probed pages, 15 findings — the
  same 15 ids as the 10:27 run, no new and none gone) and `dynamics-plan.mjs --target-origin https://main--a6216fe5--aemcoder.aem.page
  --migrated stardust/migrated --chrome` (self 3 · owner batch 10 · delivered 2 · host-bound 0/0 — no first-party API paths).
- Row 4 reach widened 2/7 → 3/7: the aria-controls trigger also fires on /us/en/privacy-policy (13 legal accordions, rebuilt natively
  in the `legal-accordion` block). No disposition changes.
- Row 8 (sweepstakes): migrated golden-ticket HTML now carries the register / terms-and-conditions links absolute to
  https://www.wonka.com (plan probe reports it as already delivered); localize-links must keep them absolute at C-deliver.
- Listing candidate on golden ticket (L, 1/4) stays not-a-listing: the 6-card group is editorially curated (Listings contract: none).
- Every row keeps a disposition; the gate for Phase C holds.

## D2 dynamic — 2026-11-25 (rollout Phase D2, dynamics Phases 4–5)
- Self rows 1, 2, 3, 4, 7 → done: delivered by the frozen C-deliver blocks / capture, no code change. Flows measured on aem.live (stardust/.work/dynamics/probe.json):
  header 1440 3 links, 360 toggle opens (3 links visible) and Escape closes; product cards 5 toggles (0 → 1269 px, label flips); FAQ 7 items (0 → 87 px, Enter toggles);
  privacy 13 accordions (hidden → 1056 px); 0 requests to the S3 hosts; 0 page errors on 6/6.
- Row 3: no language toggle exists on the source chrome (the aria-haspopup evidence was the OneTrust "Do Not Sell" / filter buttons), so none is delivered; locale switching is row 5.
- Row 4: the source triggers are aria-controls disclosures, rebuilt as in-place disclosures, not `<dialog>` — `click-dialog` does not apply, replayed as dom-count.
- Home: the portal intro (sessionStorage gate) makes the header inert until dismissed, as on the source.
- stardust/dynamics/parity.json 8 features / 15 checks; `dynamics-check --origin https://main--a6216fe5--aemcoder.aem.live` 15/15 PASS (stardust/qa/dynamics-report.md).
