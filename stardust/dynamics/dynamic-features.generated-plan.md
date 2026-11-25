<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-25T11:28:37.890Z · input stardust/current/_dynamics.json (4 pages, 15 findings) · target probe https://main--a6216fe5--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-drupalsettings | A | CMS / app settings object drupalSettings | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 4/4 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | cr-main-empty-at-load-filled-after-client-rendered-page | CR | main empty at load, filled after (client-rendered page) | 1/4 | static-snapshot | content | needs-human-capture | pending | client-rendered-page | human-browser capture; never migrate blank |  |
| 4 | i18n-locale-variants-en-gb-en-us-de-de-fr-fr-it-it-en | I18N | locale variants en-GB,en-US,de-DE,fr-FR,it-IT,en | 3/4 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 5 | i18n-locale-variants-en | I18N | locale variants en | 1/4 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 6 | l-listing-candidate-n-landing-page-full-paragraphs-paragraph | L | listing candidate n-landing-page-full__paragraphs paragraphs (6 cards) | 1/4 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 7 | m-modal-trigger-aria-haspopup-chrome-only-button-content | M | modal trigger aria-haspopup (chrome only) → button:content | 4/4 | rebuild-native | runtime | self | delivered-by-capture | chrome-interaction | none (the header contract is the spec) | output already carries "Do Not Sell or Share My Personal Informa" |
| 8 | m-modal-trigger-aria-controls-dialog-dialog-content | M | modal trigger aria-controls→dialog → dialog:content | 3/4 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 9 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 10 | t-consent-onetrust | T | consent: OneTrust | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 11 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 4/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 12 | t-unknown-third-party-host-ferrero-kube-stack-prod-static-s3 | T | unknown third-party host ferrero-kube-stack-prod-static.s3.eu-west-1.amazonaws.com | 3/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 13 | t-unknown-third-party-host-ferrero-gpp-wonka-prod-static-s3- | T | unknown third-party host ferrero-gpp-wonka-prod-static.s3.eu-west-1.amazonaws.com | 1/4 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 14 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 4/4 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 15 | x-sign-in-account-links | X | sign-in / account links | 1/4 | decided-out | — | needs-backend | delivered-by-capture | decided-out | auth / commerce on the new host? | output already carries "https://www.wonka.com/us/en/xp/golden-ti" |

## Triage

- **Ships autonomously (reproducibility `self`):** 3 row(s) — read-settings, modal-loader.
- **One owner decision batch:** 10 row(s) — human-browser capture; never migrate blank · scope of the locale trees · index-driven or editorially curated? · which tags run on the new host; property ids · CMP domain script reuse on the new host · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 2 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **tags** — 5
- **detect** — 2
- **locale wave** — 2
- **interactive** — 2
- **capture** — 1
- **listings** — 1
- **embeds** — 1
- **register** — 1
