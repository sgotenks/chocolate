# Inconsistency register — www.wonka.com replica

Everything not listed here is frozen; any design delta found by the gate is a defect, not an
improvement. Hands-off policy adopts no changes: every entry below is `deferred` (handover list).

## R-01 — content max-width differs per template

- **Evidence:** cap-probe (DESIGN.json extensions.breakpoints.capRegister[0]): contentMaxWidth 739 px (home), fluid (about), 800 px (legal pages), 1536 px (golden ticket).
- **Finding:** the four templates cap their reading column at different widths with no shared token.
- **Minimal change:** none in this run — each template keeps its own captured cap.
- **Status:** deferred
- **Where:** landing, static, unique

## R-02 — shell max-width only on legal pages

- **Evidence:** capRegister[1]: shellMaxWidth 1268 px on privacy-policy, fluid elsewhere.
- **Finding:** legal pages sit in a 1268 px shell; every other template is fluid.
- **Minimal change:** none — kept as captured.
- **Status:** deferred
- **Where:** static

## R-03 — single 1536 px module cap on golden ticket editorial

- **Evidence:** capRegister[2]: `.p-editorial .container` capped at 1536 px, golden-ticket only.
- **Finding:** one section carries a cap no other section uses.
- **Minimal change:** none — kept as captured.
- **Status:** deferred
- **Where:** unique (promo-editorial)

## R-04 — single 700 px module cap on about discover-hero

- **Evidence:** capRegister[3]: `.discover-hero > .relative.z-10` capped at 700 px, about-wonka only.
- **Finding:** one hero text column capped at 700 px, unlike the other modules.
- **Minimal change:** none — kept as captured.
- **Status:** deferred
- **Where:** landing (about-wonka discover-hero)
