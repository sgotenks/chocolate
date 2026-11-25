# Dynamic features plan — www.wonka.com

| phase | deliverable | rows | verification | owner decision | effort |
|---|---|---|---|---|---|
| interactive | header menu + locale toggle in the header block; product dialogs and FAQ accordion in their blocks | 3, 4 | motion-observe / interaction parity per archetype | none | S |
| capture | privacy accordions authored from captured text | 2 | content-diff 0 red | none | S |
| tags | scaffolded off (no tags on new host) | 1, 6 | none | tags & consent (batch) | — |
| locale / sweepstakes | links retained to source origin | 5, 8 | link check | locales, sweepstakes (batch) | — |

Status 2026-11-25 (rollout D2): interactive + capture phases done (no locale toggle exists on the source chrome; disclosures, not dialogs); tags,
locale and sweepstakes ship their interim tiers as the one owner batch (stardust/dynamic-features.md § Decision batch). Parity:
stardust/dynamics/parity.json, dynamics-check 15/15 PASS on aem.live.
