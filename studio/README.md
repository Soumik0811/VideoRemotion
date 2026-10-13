# Oddly Logical studio setup

The supplied V5 instructions are preserved in [ODDLY_LOGICAL_MASTER.md](../ODDLY_LOGICAL_MASTER.md). Say **initiate the master prompt** or **INITIATE ODDLY LOGICAL** to begin a new episode. If its script is missing, the assistant asks for the final narration and optional audio using the master's initiation message. Supplying both the command and narration skips that question.

Only the script is needed to plan and build an estimated preview. Audio allows final timing and synchronization. Routine choices about the title, cast, scenery, poses, props and camera are handled during production. A prior episode's narration is never silently reused for a fresh initiation.

This setup saves the assistant's production workflow and an asset catalog. It is not a standalone script that automatically converts arbitrary prose into a finished film without further implementation by the assistant.

## Inspected foundation

| System | Existing implementation | Status |
| --- | --- | --- |
| Timeline and rendering | React, TypeScript, Remotion; `src/Root.tsx` | Working compositions: `GiftCardBreakage02`, `BakeryEpisode01`, `FinanceExplainer` |
| Character animation | `src/giftcard/cinematic/CharacterAction.tsx`, `src/bakery/components/BakerCharacter.tsx` | Articulated SVG limbs, idle/blink/breathe, walk, expressions, head movement, gaze, costume variants; several actions are currently composed from pose data |
| Physical interactions | `Interactions.tsx`, `choreography.ts` under `src/giftcard/cinematic/` | Shared hand coordinates, cash/card transfers, cup pickup, drawer grips and card insertion |
| Environments | `src/giftcard/cinematic/Environments.tsx`, `src/bakery/components/Environment.tsx` | Café, storefront, home, office, bakery neighborhood, supermarket façade, supplier counter |
| Cameras | `EnvironmentCamera.tsx`, `motion.ts` under `src/giftcard/cinematic/` | Shared world coordinates, pan, push-in, pull-out, tracking and parallax |
| Numbers and props | `src/giftcard/components/Boards.tsx`, cinematic displays and ledger | Counters, labels, arrows, register, terminal, computer, cards, cash, wallet, cup, drawer, calendar |
| Narration and captions | Episode JSON, phrase captions, cinematic `timing.ts` | Estimated timings and optional recording paths; sentence-based retiming demonstrated for the 35-sentence gift-card script |
| Sound | `public/audio/`, `tools/make_giftcard_audio.py`, `tools/make-giftcard-foley.py` | Original synthesized music and effects; legacy T-shirt draft speech belongs only to that episode |
| Quality review | TypeScript and story checks, `check:giftcard:v4`, `review:giftcard`, FFmpeg/ffprobe | Arithmetic, caption reconstruction, hand contacts, frame inspection and full-export checks |
| Optional libraries | GSAP, Lottie, Rive, PixiJS | Not installed or integrated; no existing assets found. Ordinary production uses SVG and Remotion |

The machine-readable [library.json](library.json) points to real assets and records reuse constraints. The [storyboard template](storyboard.template.json) contains the V5 planning fields without introducing a new story or invented figures.

## Permanent cast and migration

The V5 canon is **Oliver, Leo, Maya and Mr. Brooks**, as defined in the master. Register stable identity IDs independently from the roles/costumes assigned in a story. Reuse existing body geometry, motion helpers and hand-coordinate math.

Historical episodes keep their recorded identities: bakery Oliver/Noah, the original T-shirt cast, and gift-card Miles/Ben/Alex/Riley/Sam. Do not rename those characters or revise their exported episodes as part of initialization.

The current role-keyed rig is a reusable foundation, not yet the full V5 cast library. The following extensions should be built once and retained when first needed:

- Separate character identity from story role and costume, with backward-compatible defaults for old episodes.
- Establish the V5 character variants, including Maya's shoulder-length hair and Mr. Brooks' middle-aged face, mustache and navy blazer. A terracotta shirt alone does not make the old recipient rig Maya.
- Add missing common actions such as sit/stand, turn, shrug, nod/shakeHead and richer expressions; do not claim every V5 action already has a reusable preset.
- Replace named main-cast clones used as ambient extras with a small generic crowd collection in new scenes.
- Extend prop rendering for contracts, receipts, parcels and other objects without rebuilding the shared transfer motion.
- Add bank, factory, airport, historical or other locations only when the narration needs them.

## Episode production layout

Use a new episode ID and directory rather than editing the previous episode's narration. Save the script, financial/source notes, selected asset IDs and time-coded storyboard with the episode. The template's `null` timestamps are placeholders: replace them with measured or clearly estimated values before rendering.

Retain 1080 × 1920, 30 FPS, H.264 unless the user requests otherwise. Register each new composition in `src/Root.tsx` and add a named render script rather than changing an earlier episode's command.

For a different script, create its own sentence reference anchors. The gift-card `storyTime`/`audioTime` wrappers are tied to its 35 sentences and must not be reused unchanged for unrelated narration. Its `mapTime` algorithm and timing approach can be generalized. Never attach `public/audio/narration.wav` to a new story simply because it already exists.

Preserve the user's script. Check claims against available sources, distinguish supplied claims from verified ones, and label hypothetical calculations. Use licensed/original sound only; paid generation stays off unless explicitly authorized.

## Established commands

```bash
npm install
npm run studio
npm run typecheck
npm run check:story
npm run check:bakery
npm run check:giftcard
npm run check:giftcard:v4
npm run review:giftcard
npm run render:giftcard -- --browser-executable=/usr/bin/chromium
```

The final command is the cloud browser example for the existing episode. Locally, omit that browser flag or use the local Chrome path. New episodes receive their own render/review commands. The first V5 setup changes instructions, catalog and planning scaffolding; it does not create or rerender an episode.
