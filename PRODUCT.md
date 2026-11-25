<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-25T10:24:00Z
  readArtifacts:
    - stardust/current/pages/*.json
    - stardust/current/pages/us-en.post-portal.json
    - stardust/current/_brand-extraction.json
    - stardust/current/_crawl-log.json
  synthesizedInputs: []
  stardustVersion: 0.10.0
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — basis: product range (chocolates, gummies, chewy ropes), Netflix film tie-in FAQ, sweepstakes open to US residents 21+._

US shoppers and fans of the Wonka film/series universe: families and treat buyers
discovering the new Wonka confectionery range, plus adults (21+) entering the
Golden Ticket Sweepstakes by scanning a pack.

## Product Purpose

Brand showcase for Ferrero's Wonka confectionery range in the US: present the
products (Magic Hats, PurplyPurple Tablet, Magic Garden Ropes, Oompa Loompa
Gummies) with ingredients and nutrition details, tell the "born in the Wonka
factory" brand story, and drive entries to the Golden Ticket Sweepstakes
microsite (`/us/en/xp/golden-ticket/`, prize: trip to Netflix House Las Vegas).
No commerce on site; "Where can I find Wonka products?" is answered in the FAQ.

## Positioning

"Extraordinary creations from the Wonka Factory" — inventive creations,
unexpected flavours and delicious surprises; wonder and imagination over
indulgence claims. A Ferrero brand (stated in FAQ and footer).

## Capabilities and Constraints

- Two Drupal front ends under one origin: brand site (theme `sling`, Tailwind)
  and the sweepstakes microsite (theme `gpp_promo_theme`).
- Locale-pathed site: `https://www.wonka.com/` 301-redirects to `/us/en/`;
  hreflang alternates `/uk/en/`, `/de/de/`, `/fr/fr/`, `/it/it/` (out of scope).
- OneTrust consent (Do Not Sell link, cookie tables on the cookie policy),
  Google Tag Manager. No site search, no forms on the captured pages (sweepstakes
  entry lives at `/us/en/xp/golden-ticket/lead/register`, not captured).
- First-session animated hat-portal intro on home (video), skipped under
  reduced motion.

## Brand Commitments

- Register: **brand** (consumer marketing / landing).
- Personality observed: whimsical, magical, playful-premium; uppercase gold
  headlines, purple velvet world, clouds and sparkle.
- Anti-references observed: no flat corporate whites, no stock-photo lifestyle
  imagery, no dense e-commerce grids.

## Evidence on Hand

- `stardust/current/pages/<slug>.json` + `.html` — 7 live captures
  (us-en, index, us-en-about-wonka, us-en-privacy-policy, us-en-terms-of-use,
  us-en-cookie-policy, us-en-xp-golden-ticket); `us-en.post-portal.json`.
- `stardust/current/assets/screenshots/` — full-page screenshots (+ home post-portal).
- `stardust/current/_computed-styles.json` — style census (1440 + 360).
- `stardust/current/_brand-extraction.json`, `DESIGN.md`, `DESIGN.json`.
- `stardust/current/assets/fonts/` (Inter 400–700, Work Sans 600 + variable),
  `assets/logo.svg`, `assets/favicon.svg`, `assets/media/` (63 images + hat-portal video).

## Product Principles

_provenance: inferred — basis: recurring copy and layout._

- Wonder first: every page opens on an immersive, image-led hero.
- Products as characters: each item gets a name, a story line and a details modal.
- The sweepstakes is the active campaign: it is linked from nav and home hero.

## Accessibility & Inclusion

Observed: gold-gradient text on purple (contrast varies along the gradient),
intro overlay honours `prefers-reduced-motion`, mobile nav is an ARIA dialog,
FAQ and legal sections are accordions. Legal fine print on the promo page is small.
