# legal-accordion

Custom **accordion** block. Purpose: Legal page body (privacy policy, terms of use, cookie policy): rich-text passages, collapsible "layer breaker" sections, cookie tables and a consent-settings button..

## Authoring (Document Authoring)

Model: `collection`

Repeating rows — one row per item. Each item: One-cell rows = rich-text passage; two-cell rows = collapsible section (h2 title | body, optional third cell = label shown while open); four-plus-cell rows = table rows (first row is the header). A link to #consent-settings renders as the consent-settings button..

## Supported variations

| Variation | Option class |
| --- | --- |
| Notice | `notice` |
| Plain | `plain` |
| Cookies | `cookies` |

## Universal Editor fields

N/A (Document Authoring project)
