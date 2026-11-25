---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-25T10:26:50Z
  againstInput: https://www.wonka.com/us/en/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.wonka.com/us/en/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-25T10:26:50Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(4 entries, all deferred — pure replica in this run).

Fidelity: ia verbatim · design verbatim · content verbatim.

Hands-off: activated by `--hands-off` at 2026-11-25T10:26:50Z (state.json.handsOff = true). Roster fixed by
stardust/.labs/site-plan.json: 7 pages, no volume cap applies. Gate widths: desktop,mobile → 1440,360.
Publish decision: publish (recorded in stardust/eds-conversion-log.md).

Owner decisions (dynamic features, hands-off assumptions, not decided-out): tags & consent (scaffolded off), locales (/us/en/ only),
sweepstakes (links to www.wonka.com) — one batch in stardust/dynamic-features.md § Decision batch (rollout D2, 2026-11-25).

Decision — link targets outside the plan (rollout E2, 2026-11-25): scope extension → repoint to source. Targets not in
stardust/.labs/site-plan.json and never captured stay absolute to the source/external host (no new pages): www.wonka.com
/us/en/xp/golden-ticket/lead/register (8 links, sweepstakes lead form) and /us/en/xp/golden-ticket/terms-and-conditions (5 links);
external: instagram/tiktok/facebook (wonka_usa, wonka_global), ferrero.com (contact-us, all-brands), ferreronorthamerica.com,
nutella.com cookie-policy, globalprivacycontrol.org, applaydu.kinder.com privacy doc, cookiepedia.co.uk (9 cookie/host refs; 403 to bots).
