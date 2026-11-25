# Prototype gate — every crafted prototype, 360px

2026-11-25T11:20:38.620Z · **4 PASS / 0 FAIL / 0 error of 4**

Verdict: pixel criterion (aligned % ≤ 10 AND total offset ≤ the bound; alignment not used: unaligned % ≤ 10) AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance)

Calibration — pixel-only verdict (criteria 1+2): **4 PASS**; full verdict (1–4): **4 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 0; content n/a (origin not probed) 0; **units not declared 2 of 4** (no repeated-unit family applies: the check did not run on them); pixel criterion met only thanks to alignment (unaligned % over the threshold): 0.
| page | template | tier | origin | browser | pixel % aligned (unaligned) [text] | offsets | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/us-en-xp-golden-ticket-proposed.html` | - | - | stitch-live | chrome | 0.07 | - | 0 | 0 | n/a | not declared | PASS | (reported) units: no family declared for this page — the repeated-unit check did not run |
| `/us-en-privacy-policy-proposed.html` | - | - | stitch-live | chrome | 0.36 | - | 1 | 0 | n/a | off 0 hidden 0 missing 0 (1 family checked) | PASS | - |
| `/us-en-about-wonka-proposed.html` | - | - | stitch-live | chrome | 0.49 | - | 1 | 0 | n/a | off 0 hidden 0 missing 0 (2 families checked) | PASS | - |
| `/us-en-proposed.html` | - | - | stitch-live | chrome | 3.17 | - | 1 | 0 | n/a | not declared | PASS (masked 2757 rows: self-varying rows of the frozen reference (noise floor 2.02%)) | (reported) units: no family declared for this page — the repeated-unit check did not run |
