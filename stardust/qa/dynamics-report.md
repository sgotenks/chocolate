# Dynamics parity check — https://main--a6216fe5--aemcoder.aem.live — 2026-11-25T12:54:51.109Z

Replayed 15 checks over 8 features · pass 15 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| drupalSettings + dataLayer objects | A | done | no-page-errors | PASS | none on 6 page(s) |  |
| privacy policy main filled after load (13 collapsed accordions) | CR | done | dom-count | PASS | 13 × .legal-accordion .legal-acc-panel[role='region'] (min 13) |  |
| header menu (desktop link row + mobile slide-down panel) | M | done | dom-count | PASS | 3 × header nav.site-header-nav a[href^='/us/en/'] (min 3) |  |
| header menu (desktop link row + mobile slide-down panel) | M | done | dom-count | PASS | 1 × header button.mnav-toggle[aria-controls][aria-expanded] (min 1) |  |
| disclosures: product details (home), FAQ accordion (about), legal accordions (privacy) | M | done | dom-count | PASS | 5 × .product-cards button.pcard-toggle[aria-controls][aria-expanded='false'] (min 5) |  |
| disclosures: product details (home), FAQ accordion (about), legal accordions (privacy) | M | done | dom-count | PASS | 7 × .faq .faq-toggle[role='button'][aria-controls] (min 7) |  |
| disclosures: product details (home), FAQ accordion (about), legal accordions (privacy) | M | done | dom-count | PASS | 13 × .legal-accordion button.legal-acc-toggle[aria-controls] (min 13) |  |
| locale variants en-GB, en-US, de-DE, fr-FR, it-IT | I18N | interim | dom-count | PASS | 1 × html[lang='en'] (min 1) |  |
| locale variants en-GB, en-US, de-DE, fr-FR, it-IT | I18N | interim | dom-count | PASS | 4 × footer a[href^='/us/en/'] (min 3) |  |
| Google Tag Manager, GA/Ads, OneTrust CMP, runtime-injected tag iframes | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 5 gated host pattern(s) before consent |  |
| Google Tag Manager, GA/Ads, OneTrust CMP, runtime-injected tag iframes | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 5 gated host pattern(s) before consent |  |
| Google Tag Manager, GA/Ads, OneTrust CMP, runtime-injected tag iframes | T | scaffolded-awaiting-owner | dom-count | PASS | 1 × .legal-accordion .legal-consent-btn[role='button'] (min 1) |  |
| Ferrero S3 static hosts (media / promo assets) | T | done | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| Ferrero S3 static hosts (media / promo assets) | T | done | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| golden-ticket sign-in / register (/us/en/xp/golden-ticket/lead/...) | X | interim | dom-count | PASS | 8 × a[href^='https://www.wonka.com/us/en/xp/golden-ticket/lead/register'] (min 7) |  |

## Features without checks
