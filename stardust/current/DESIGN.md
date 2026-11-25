<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-25T10:22:00Z
  readArtifacts:
    - stardust/current/_computed-styles.json
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/*.json
    - stardust/current/pages/us-en.post-portal.json
    - https://www.wonka.com/us/sites/wonka.com.us/files/css/ (sling theme CSS)
  synthesizedInputs: []
  stardustVersion: 0.10.0
-->
---
name: Wonka US (current)
description: Whimsical purple-and-gold confectionery brand site — Ferrero's Wonka range, US locale
colors:
  purple-600: "#810172"
  purple-500: "#980186"
  purple-800: "#4c0143"
  purple-800-70: "#4c0143b3"
  purple-900: "#2e0028"
  purple-400: "#bc5ab0"
  pink-muted: "#d18dc9"
  white: "#ffffff"
  glass: "#ffffff1a"
  glass-hover: "#ffffff4d"
  gold-200: "#f1de9c"
  gold-300: "#e5c76a"
  gold-400: "#d4a93d"
  ink-brown: "#3d2507"
  promo-body: "#77186e"
  promo-gold: "#eec60d"
  promo-cream: "#fff5d9"
  promo-ink: "#29144e"
  table-border: "#d7d7d7"
typography:
  display:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "54px"
    fontWeight: 600
    lineHeight: 1.11
    letterSpacing: "normal"
  headline:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "42px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.7px"
  title:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.7px"
  product-eyebrow:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "18px"
    fontWeight: 600
  lede:
    fontFamily: "Inter, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "23px"
    letterSpacing: "0.36px"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 500
  button:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1
  button-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1
  promo-headline:
    fontFamily: "Work Sans, sans-serif"
    fontSize: "37.5px"
    fontWeight: 700
    lineHeight: 1
rounded:
  sm: "12px"
  md: "24px"
  footer: "40px"
  pill: "160px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "48px"
  section: "80px"
components:
  button-gold:
    textColor: "{colors.ink-brown}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.pill}"
    padding: "20px 40px"
    height: "64px"
  button-glass:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "20px 32px"
  button-glass-hover:
    backgroundColor: "{colors.glass-hover}"
  button-promo:
    backgroundColor: "{colors.promo-gold}"
    textColor: "{colors.promo-ink}"
    rounded: "{rounded.pill}"
    padding: "17px 28px"
  nav-pill:
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "10px"
    height: "36px"
  card-panel:
    backgroundColor: "{colors.purple-800-70}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
  footer:
    backgroundColor: "{colors.purple-800-70}"
    textColor: "{colors.white}"
    rounded: "{rounded.footer}"
---

# Design System: Wonka US (current state)

## Overview

A saturated magenta-purple world lit with metallic gold. Every page sits on a
deep purple field (`#810172`) dressed with soft 3D cloud decals drifting in from
the edges, golden sparkle particles and translucent deep-purple panels. Headlines
are uppercase Work Sans 600 filled with a metallic gold gradient; body copy is
white Inter. Primary actions are gold-foil pills with a light sweep on hover;
secondary actions and the nav are frosted glass pills. The home page opens (first
session only) on an animated top-hat "portal" intro before revealing a product
hero under a Wonka airship. The golden-ticket sweepstakes microsite shares the
palette family but is a separate theme: flatter, bolder Work Sans 700, a solid
`#eec60d` pill button with a purple drop edge, and a cream step panel.

Register: brand (consumer confectionery marketing). Tone reads whimsical,
wonder-forward, playful-premium.

## Colors

Source: `_computed-styles.json § aggregate.colors` (census, 6 pages × 1440/360) and
the sling theme's Tailwind classes (`bg-purple-*`, `text-gold-*`).

- **Purple field `#810172` (purple-600)** — `body` background on every sling page
  (census bgArea 80 M px²; `body` prop background on terms-of-use). Some sections
  shade to `rgb(139,0,123)`.
- **Purple-500 `#980186`** — strong magenta: copyright bar, promo header, the
  4 px drop edge under promo buttons.
- **Purple-800 at 70 % `#4c0143b3`** — the translucent panel colour of cards,
  accordions and the rounded footer.
- **Purple-900 `#2e0028`** — dark ink used on light table headers (cookie policy).
- **Gold** — never a flat fill on sling pages: a metallic gradient
  `linear-gradient(270deg, #d2ba83 10%, #f1dc97, #faeab8 40%, #faeab8 60%, #f1dc97, #d2ba83 90%)`
  clipped to heading text (32 instances), and a foil gradient on `.gold-button`
  (`#ad8544 → #f8e999 → #ac8543`). Gold-200/300/400 utility tints exist.
- **Ink brown `#3d2507`** — label colour on gold buttons.
- **White / glass** — all body text is white; glass surfaces are white at 10 %
  (hover 30 %).
- **Promo theme (golden-ticket)** — body `#77186e`, button `#eec60d` with
  `#29144e` label, cream panel `#fff5d9`.

## Typography

Two families, both self-hosted on sling (`assets/fonts/`):

- **Work Sans 600** — every heading, uppercase, letter-spacing −0.7 px, line-height
  1.0, gold-gradient text fill (computed `color` is transparent). Levels at 1440:
  h1 54 px (about hero) / 42 px, h2 34–42 px, product names h3 34 px.
- **Inter 400/500/600/700** — body 16/24, lede 18/23 (+0.36 px tracking),
  small product copy 14 px 500, buttons 700 at 16 px (glass) or 20 px (gold).
- Promo microsite: Google Work Sans variable, headings 700 at 37.5/30 px, mixed case.
- Scale audit: ad-hoc (54/42/37.5/34/30/24/19.2 px — no constant ratio).

## Layout

- Tailwind container: 16 px gutters < 640, 48 px gutters from 1024; max widths
  640/768/1024/1280/1440. Breakpoints seen in CSS: 640, 768 (main layout switch,
  `md:`), 1024, 1140, 1280, 1440.
- Header 62 px, absolutely positioned over the first section; logo at x 75, nav
  pill at x 200. Below 768 the nav collapses into a full-width dialog menu.
- Sections stack full-bleed on the purple field; hero sections are `100vh`
  (max 800 px on mobile). Product cards on home alternate image left/right,
  separated by 1 px `purple-400` rules.
- Legal pages: single centred text column under an uppercase gold title.

## Elevation & Depth

Depth comes from layering, not shadows: parallax cloud decals (webp) at section
edges, star/particle sparkle overlays, translucent purple panels and
backdrop-blur glass. The only box-shadows are the promo theme's solid
`0 4px 0 #980186` drop edge on buttons (`0 3px 0` on small ones).

## Shapes

- Pills everywhere for actions (`border-radius: 160px`, 30 instances).
- Nav pill 12 px; cards/panels 24 px; footer top corners 40 px.
- Organic shapes are carried by imagery (clouds, hat, airship), not CSS.

## Components

- **Site header** — logo (gold Wonka wordmark SVG, 70×40) + glass nav pill:
  Home / About Wonka / Golden Ticket Sweepstakes.
- **Gold button** — foil gradient pill, 64 px tall, Inter 700 20 px, brown label,
  noise overlay `::before`, white light sweep `::after` on hover.
- **Glass button** — white/10 fill + white/10 1 px border, backdrop blur,
  hover white/30 (300 ms ease-out).
- **Product card** (home) — pack shot + eyebrow (full product name, Work Sans
  18 px) + gold h3 name + 14 px blurb + "See more details" opening a product
  modal (ingredients, nutrition facts).
- **Story cards / image-text / promo strip / FAQ accordion / social** (about).
- **Legal page** — gold title, last-updated line, long-form body; privacy uses
  numbered accordion sections.
- **Footer** — rounded-top translucent panel: logo, "Follow us" (Instagram,
  TikTok), five legal links, copyright bar on purple-500.

## Do's and Don'ts

- Do keep gold for headings and primary actions only; body stays white.
- Do keep headings uppercase Work Sans with the gradient fill.
- Don't introduce flat light backgrounds on sling pages (cream exists only on
  the promo microsite).
- Don't add drop shadows to cards — depth is clouds, glass and translucency.
