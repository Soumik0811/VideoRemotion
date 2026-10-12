# Oddly Logical — The $222 Million Gift-Card Secret

`GiftCardBreakage02` is a new 1080 × 1920, 30 FPS Remotion composition. The editorial preview is 138 seconds long and preserves the supplied 311-word narration, including the final Oddly Logical call to action.

## Watch, edit, render

```bash
npm install
npm run typecheck
npm run check:giftcard
npm run studio -- --no-open
npm run render:giftcard -- --browser-executable=/usr/bin/chromium
```

On a local machine, omit the Linux browser path if Remotion manages its browser, or substitute that machine's Chromium path. The output is `out/episode-02/gift-card-breakage-02.mp4`. `npm run still:giftcard` creates the reveal thumbnail. The earlier bakery and T-shirt compositions remain available.

The preview has original instrumental music and subtle effects. It has **no spoken narration**: only narration text was supplied. Caption and action timestamps are editorial estimates, not audio-verified synchronization.

## Visual system

The episode uses a continuous illustrated cafe, a cream/green/gold palette, large counting boards, chalkboard labels and step arrows. The same jointed SVG character rig supports five consistent cast members:

| Role | Character | Appearance |
| --- | --- | --- |
| Narrator / explainer | Miles | Teal neutral jacket, rounded face |
| Customer | Ben | Warm tan jacket, darker swept hair |
| Business / barista | Alex | Green apron and cafe cap |
| Gift recipient | Riley | Terracotta jacket |
| Accounting analyst | Sam | Gold jacket, tie, round glasses |

Characters breathe and blink throughout, blend gestures and expressions, and react to the board reveals. Character placements ease between sections. The boards communicate the accounting independently of a talking character.

The eleven sections are: $222M+ hook; recognized accounting practice; $20 purchase; cash/liability/revenue comparison; $14 redemption and $6 remainder; forgotten drawer; millions of small balances; proportional recognition; fiscal-2025 reveal; cash-versus-revenue timing; recipient-versus-company question and brand ending.

## Accounting and source status

The single-card example reconciles: $20 cash received; initially $20 deferred revenue / liability and $0 revenue. Redeeming $14 leaves a $6 balance. The simplified single-card ledger omits aggregate breakage adjustments.

The forgotten balance is not shown as automatically forfeited. Breakage recognition is illustrated using matching percentages of **expected redemptions** and **estimated breakage**, explicitly labeled as illustrative proportions, not Starbucks' breakage rate. Recognition does not collect cash a second time.

**The supplied “over $222 million in fiscal 2025” claim has not been independently verified in this environment.** Requests to the official investor site and candidate filing URL were blocked by the network proxy. The video preserves the user's claim as `$222M+`; no extra decimal precision is invented. Network-domain additions for `investor.starbucks.com`, `s203.q4cdn.com`, and `www.sec.gov` were saved to the environment configuration draft. Draft saving does not activate access or establish verification. Check the fiscal-2025 annual report's stored-value-card/breakage disclosure after access is enabled, and update `source.status` accordingly. The candidate PDF URL in the source notes is an attempted location, not a retrieved source.

Real-world recognition also depends on the applicable rules and facts, including amounts required to be remitted under unclaimed-property laws. The animation explains the supplied general mechanism and is not a full accounting-policy treatment.

## Editable files

- `src/data/giftcard-episode.json`: exact narration, 77 caption groups, financial figures, cast, scene boundaries, audio events, and source status.
- `src/giftcard/GiftCardEpisode.tsx`: timeline, captions, brand layout and audio tracks.
- `src/giftcard/components/StoryBoards.tsx`: reusable narrative boards and number reveals.
- `src/giftcard/components/Boards.tsx`: panel, counter, arrow and chalkboard primitives.
- `src/giftcard/components/Assets.tsx`: cafe, gift card, coffee cup and drawer SVGs.
- `src/giftcard/components/Cast.tsx`: recurring cast placements and reactions.
- `src/bakery/components/BakerCharacter.tsx`: shared character rig, with backward-compatible costume options.

To make the next episode, duplicate the JSON and composition, replace the script and financial data, and reuse or extend the boards and characters. Scene choreography stretches to configured scene boundaries. Caption, sentence and sound-effect cues must be adjusted to match a real recording.

## Add a voiceover

Record `out/episode-02/narration.txt`, then place the audio under `public/audio/giftcard/`. Set `narration.src` to its path relative to `public`. Measure the audio, update `durationSeconds`, scene boundaries, sentence/caption times and sound cues, and run `npm run export:giftcard`. Set `narration.timing` to `audio-verified` only after listening and checking the synchronization.

`python tools/make_giftcard_audio.py` regenerates the episode's original synthesized music and effects using NumPy. It creates no narration. Regenerate the score if the final narration changes the duration.

## Validation

`npm run check:giftcard` checks $20 − $14 = $6, figure consistency, scene coverage, exact narration reconstruction from captions, cue bounds and required audio. `tools/review-giftcard.mjs` creates frames for visual inspection. Full MP4 metadata and decoding should be checked after rendering. Passing the local checks does not verify the external annual-report claim.
