# Episode 03 — He Sold 500 Products and LOST Money!

## Narration
This man sold FIVE HUNDRED products... and LOST money on every single sale!
Meanwhile, his friend sold just ONE HUNDRED... and came out seven hundred dollars ahead!
Same product. Same price. So what went wrong?
Both sold a twenty-dollar product that cost eight dollars to make and ship.
But the first man spent FIFTEEN dollars on ads... just to get ONE customer!
Twenty dollars in. Eight dollars out. Fifteen for ads.
That's THREE DOLLARS LOST on every sale!
Five hundred orders? MINUS FIFTEEN HUNDRED DOLLARS!
His friend spent just five dollars attracting each customer.
Seven dollars left per order. One hundred sales? PLUS SEVEN HUNDRED!
That's called unit economics. And repeat customers? Their lifetime value can change everything.
The first man bought customers he couldn't afford. The second built a business that could afford to keep them.

## Timing
The supplied MP3 measures 51.6441 seconds. Storyboard beat times use the supplied 48.5-second editorial map and are scaled proportionally to the measured narration length (factor 1.06483). Caption phrases inherit that mapped timing; no word-level alignment/transcription was supplied.

## Beat map
| Story time | Template | Visual beat |
| --- | --- | --- |
| 0–3.5 | Story World / hook | Leo celebrates multiplying orders; reveal 500 sales and −$3 contribution per order. |
| 3.5–7 | Comparison | Split the two stores; 500 sales / −$1,500 beside 100 sales / +$700. |
| 7–9.5 | Concept Reveal | Blue burst, same packaged $20 product, question mark. |
| 9.5–13 | Object Mechanism | Packing area: $20 price, $8 make-and-ship cost, $12 before ads. |
| 13–17 | Story World | Leo's ad spend counts to $15 for one customer. |
| 17–20 | Math Reveal | Sequential $20 − $8 − $15 deductions. |
| 20–23 | Final Payoff | Red burst resolves to −$3 per order. |
| 23–26 | Object Mechanism / math | Warehouse orders multiply; 500 × −$3 = −$1,500. |
| 26–30 | Story World | Oliver's office; $5 ad cost per order. |
| 30–34.5 | Math Reveal | $20 − $8 − $5 = +$7; 100 × $7 = +$700. |
| 34.5–39 | Concept Reveal | Unit economics and non-guaranteed repeat customer value. |
| 39–43 | Story World / consequence | Leo's ad bills, captioned reminder that sales do not equal profit before fixed costs. |
| 43–48.5 | Final Payoff | Comparison and contribution qualifier; largest reveal. |

## Financial check
Store A: 20 − 8 − 15 = −3; 500 × −3 = −1,500.
Store B: 20 − 8 − 5 = +7; 100 × +7 = +700.
Both are contribution after product, fulfillment and acquisition ads, before fixed costs; neither is final net profit.

## Restyle record (2026-10-14)
Episode 3 was fully restyled in The Curious Plot flat-vector style (thick uniform outlines, dark radial sunburst scenes, outlined ALL-CAPS display type, bottom caption bar with yellow keyword highlight, MONEY TERM card, cutout characters with swap-state faces, object-led motion). All previous episode-3 visual assets (CharacterAction rig, office/warehouse environments, box graphics) were replaced by the reusable `src/curious/` system (`theme.ts`, `primitives.tsx`, `Character.tsx`). The original V1 component is preserved unmodified at `UnitEconomicsEpisodeV1.tsx`.

Unchanged by the restyle: narration script and phrases, caption timing, financial figures and qualifiers, 1080×1920 @ 30 FPS, scene beat boundaries, and supplied narration audio.

Scene-by-scene restyle (story times as in the beat map above):
| Story time | Restyled visual |
| --- | --- |
| 0–3.5 | Navy sunburst; shocked orange seller; "500 SALES / −$3 PER ORDER" chips and gold coins pop in. |
| 3.5–7 | Red/green split screen; both sellers face off under "−$1,500 vs +$700". |
| 7–9.5 | Blue sunburst; two $20 ProductBoxes and giant gold "?" — "SO WHAT WENT WRONG?". |
| 9.5–13 | Sky scene; ProductBox with dotted-arrow to "$8 MAKE + SHIP" card; "BEFORE ADS" pill; "$20 − $8 = $12". |
| 13–17 | Storefront; three coins arc in; "$0 → $5 → $10 → $15" and "ONE CUSTOMER" pill on the ground band. |
| 17–20 | Teal sunburst; staggered "$20", "− $8 PRODUCT + SHIPPING", "− $15 ADVERTISING". |
| 20–23 | Red sunburst; giant "−$3 PER ORDER" (vector minus), sad seller, "EACH SALE" box. |
| 23–26 | Sky scene; "500 × −$3 = −$1,500"; grid of "ORDER −$3" boxes multiplies to 15. |
| 26–30 | Storefront; green seller; "AD COST / ORDER $5" chip and "ONE CUSTOMER" pill. |
| 30–34.5 | Green sunburst; "$20 − $8 − $5 = +$7 PER ORDER"; four $20 boxes; "100 x $7 = +$700". |
| 34.5–39 | Purple sunburst; MONEY TERM card "UNIT ECONOMICS"; ORDER → REPEAT arrow to "CUSTOMER LIFETIME VALUE"; smug seller. |
| 39–43 | Sky scene; "MORE SALES ≠ MORE PROFIT / BEFORE FIXED COSTS"; raining "AD $15" bills; sad seller. |
| 43–48.5 | Red/green split; "500 SALES −$1,500" vs "100 SALES +$700" contribution cards; "PROFIT PER ORDER wins over raw sales volume"; "HYPOTHETICAL • BEFORE FIXED COSTS" qualifier; both sellers. |

Verification: arithmetic re-checked ($20−$8−$15=−$3; 500×−$3=−$1,500; $20−$8−$5=+$7; 100×$7=+$700); typecheck passes; 13 representative frames rendered and inspected in `out/ep03/restyle/`; full MP4 rendered to `out/episode-03/he-sold-500-products.mp4`.

Known limitations: SVG glyphs (=, +, −) render as hollow boxes at fontSize ≥ ~150px, so giant figures use a fontSize-100 scale-group (`BigText`) or vector minus rects; caption timing is phrase-mapped to the supplied narration, not word-aligned.
