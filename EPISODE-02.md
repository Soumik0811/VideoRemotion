# Oddly Logical — The Gift-Card Secret / Cinematic V4

`GiftCardBreakage02` is a 138-second, 1080 × 1920, 30 FPS Remotion animation. V4 follows a buyer, recipient and cashier through a physical transaction, then a forgotten card and the accounting process. The finalized 311-word narration and all 77 caption groups are preserved.

## Preview and export

```bash
npm install
npm run typecheck
npm run check:giftcard
npm run check:giftcard:v4
npm run studio
npm run render:giftcard
```

The MP4 is written to `out/episode-02/gift-card-breakage-02.mp4`. In the cloud environment, append `-- --browser-executable=/usr/bin/chromium`. Locally, let Remotion manage Chrome or supply your installed browser's path. `npm run still:giftcard` exports the fiscal-2025 reveal.

The preview includes original music and synthesized Foley, with **no spoken voiceover**. No narration recording has been supplied. Existing sentence and caption timings are editorial estimates. Audio synchronization can only be verified after adding a recording.

## What changed in V4

The composition uses 27 shots across a layered coffee shop, storefront, home, neighborhood and accounting office. Wide shots establish locations; tracking shots follow customers; close-ups show the wallet, card, terminal and drawer; over-the-shoulder views show the ledger. Camera moves transform the entire shared world. Windows and distant scenery add subtle parallax.

Five consistent SVG characters use articulated two-bone arms, walking legs, head tilts, eye lines, blinks, breathing and expressions. The explainer wears a cream shirt, forest-green overshirt and brown trousers; the buyer wears blue; the recipient terracotta; the cashier a green apron and name tag; the analyst a simple professional outfit with glasses. The explainer appears for the hook, explanation and ending rather than every shot.

Actions include withdrawing money from a wallet, exchanging cash and a card, gifting the card, tapping the terminal, serving and picking up coffee, opening a drawer, putting the card inside, closing it, and operating a computer. Props and hands share the same position calculations. Drawer geometry, counter layout and register location persist between camera views.

Financial values appear on physical register, terminal and computer displays. The full-scale typography is reserved for the main fiscal-2025 reveal. The earlier reusable board components and previous bakery and T-shirt episodes remain available.

## Reusable implementation

| File | Purpose |
| --- | --- |
| `src/giftcard/cinematic/CharacterAction.tsx` | Layered SVG rig and shared hand-to-world conversion |
| `src/giftcard/cinematic/choreography.ts` | Buyer, cashier, recipient and drawer action states |
| `src/giftcard/cinematic/motion.ts` | Two-bone IK, motion paths and camera interpolation |
| `src/giftcard/cinematic/EnvironmentCamera.tsx` | Shared camera transform and parallax layers |
| `src/giftcard/cinematic/Environments.tsx` | Reusable café, exterior, home and office scenery |
| `src/giftcard/cinematic/Interactions.tsx` | Held props, object transfers, register, terminal, drawer, calendar and reveal |
| `src/giftcard/cinematic/LedgerMonitor.tsx` | Historical patterns, proportional recognition and cash timing interfaces |
| `src/giftcard/cinematic/CinematicStory.tsx` | Shot blocking, camera framing and depth ordering |
| `src/giftcard/cinematic/storyboard.json` | 27-shot audit and reference sentence boundaries |
| `src/giftcard/cinematic/timing.ts` | Narration-driven mapping for camera/action timing and Foley |
| `src/data/giftcard-episode.json` | Narration, captions, cast, financial figures and sound cues |

## Narration and timing

Record the exact script in `out/episode-02/narration.txt` and save the recording under `public/audio/giftcard/`. Set `narration.src` to its path relative to `public`. Update `narration.sentences` with measured start/end timestamps for the same 35 sentences, preserving their order and wording. Update the caption groups, scene boundaries and `durationSeconds` to the real recording.

The cinematic clock maps all reference sentence boundaries to the updated sentence timestamps. This stretches actions, camera moves and sound-event positions with the delivery, including pauses, rather than forcing equal-length scenes. `soundEvents.at` stays in the reference storyboard's time coordinates. Do not rewrite the reference sentence boundaries when measuring a new recording.

Set `narration.timing` to `audio-verified` only after listening and checking synchronization. Run `npm run export:giftcard` to regenerate the SRT and timing notes. Regenerate/extend the music for a longer recording. The optional composition prop `showCaptions: false` supports a visual-storytelling audit without subtitles.

## Financial data and source status

The single-card example remains $20 received, $14 redeemed, $6 outstanding. At issue, the register distinguishes $20 cash, $20 deferred revenue / obligation and $0 revenue. The terminal's simplified single-card balance excludes aggregate breakage adjustments. Closing the drawer never recognizes the individual $6 as revenue or marks the card forfeited.

The monitor demonstrates proportional recognition with matching 50% counters: a share of **expected redemptions** and a share of **estimated breakage**. The proportions are explicitly illustrative, not Starbucks' breakage rate. The later ledger shows **$0 additional cash collected** when revenue is recognized.

V4 displays the brief's supplied **$222.4 million for fiscal 2025**, compatible with the unchanged spoken wording “over two hundred and twenty-two million.” This added precision comes from the user's V4 brief, not a retrieved filing. Independent verification remains pending: official Starbucks filing domains are unavailable under the current network policy. `source-notes.json` records that limitation; attempted URLs are not retrieved citations. Real-world recognition also depends on applicable rules, including unclaimed-property obligations.

## Sound and quality checks

`python tools/make-giftcard-foley.py` synthesizes original door chime, terminal beep, cup, drawer and computer effects. Existing original paper/register/reveal sounds are reused. `python tools/make_giftcard_audio.py` regenerates the original instrumental and six earlier effects. No third-party sound samples or new animation dependencies are required.

`npm run review:giftcard` renders representative frames to `out/episode-02/v4-review/`. Pass seconds after `--` to inspect specific moments. Add `--no-captions` to audit the visual story without subtitles. `check:giftcard:v4` checks continuous shot coverage, sentence-based retiming, world-space handoff distances, cup pickup, drawer-handle contact and arm reach across every action frame. The original episode and TypeScript checks remain part of validation. Full-export metadata and decode results are recorded in `out/episode-02/VALIDATION.md`.
