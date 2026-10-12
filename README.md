# Finance Motion Engine (Remotion + TypeScript)

## New: Episode 01 — The Bakery That Ran Out of Money

The latest composition is **BakeryEpisode01**, a 90-second vertical animation about cash flow versus gross profit. It includes expressive SVG bakers, a continuous pastel neighborhood, six scenes, exact-script captions, original music and sound effects. The preview has no narration; a real voiceover can be added later.

```bash
npm run check:bakery
npm run render -- --browser-executable=/usr/bin/chromium
```

Output: `out/episode-01/bakery-episode-01.mp4`. See [EPISODE-01.md](EPISODE-01.md) for assets, narration replacement, timing, and how to create another episode. The original T-shirt composition and its legacy render scripts remain available below.

Reusable minimalist 2D money/business explainer format for YouTube Shorts. First episode: **He Sold 50 Shirts Without Owning One!** (58 seconds, 1080 × 1920, 30 FPS).

## Architecture

```text
src/data/episode.json                <-- Story and scene timings (edit this first)
             |
             v
src/Root.tsx                         <-- Video metadata, total duration, registration
             |
             v
src/Explainer.tsx                    <-- Timeline assembler + audio tracks
       /        |          \
  Stage       Captions     SceneRenderer
  common      timed        hook | inventory | preorder | math | compare
  background  overlays             |
                                    v
                        Shapes + motion helpers + theme
```

## Quick start

Prerequisites: Node 20+, npm, internet access for the initial install, and a compatible Chromium/Chrome environment. Remotion downloads or uses a browser for rendering.

```bash
npm install
npm run check:story
npm run typecheck
npm run studio
npm run render:legacy
```

- `npm run studio` opens the video editor/preview and lets you inspect exact frames.
- `npm run render:legacy` produces `out/tshirt-explainer.mp4` (1080 × 1920, H.264).
- `npm run still:legacy` creates a frame for a thumbnail. You can select other frames with Remotion CLI `--frame`.

To create other episodes, duplicate/edit `src/data/episode.json` and keep scenes in a supported `type` among `hook`, `inventory`, `preorder`, `math`, and `compare`. Add new scene types in `SceneRenderer.tsx` for additional visual metaphors (pizza, kiosks, vending machines, etc.). The `seconds` fields automatically determine total duration. Scene narration must match the timeline length; regenerate/replace narration if timings change.

## Audio and captions

- `public/audio/narration.wav`: automatically generated **temporary offline TTS** (robotic). It is meant for timing review, **not the final published voice**.
- `public/audio/music.wav`: a synthesized original background instrumental with no licensed samples.
- `out/captions.srt`: editable timecoded on-screen punchline captions; exported from the episode JSON.
- `out/elevenlabs-script.txt`: exact script for ElevenLabs replacement.

For publishing, use a clear, warm ElevenLabs voice and export one 58-second WAV at 44.1 or 48 kHz. Keep scene pauses close to the timeline. Replace `public/audio/narration.wav`, then `npm run render:legacy`. Preserve a backup of the original file first if needed. For a different story, update `episode.json` and the narration together. Background music and captions are optional and fully editable.

An offline helper `python tools/make_audio.py` regenerates draft narration, original music and SRT from the scene JSON. It uses the system's `espeak` and Python packages `numpy` plus `scipy` optionally. Running it **overwrites** the supplied narration audio. Do not run it after replacing audio with a better narration unless you have a backup.

## Fallback demonstration render

`tools/render_offline_preview.py` recreates the basic animation language from the same story JSON using Pillow + FFmpeg and makes `out/tshirt-explainer-preview.mp4`. This preview is **not a Remotion render**, and the Remotion TSX source is the master editable animation. This fallback exists because package-registry network access was unavailable when the example was prepared. The preview can look slightly different from the Remotion render.

## Reusable system layout

- `src/components/Shapes.tsx`: generic SVG human characters, shirts, bills, label pills; add SVG objects here.
- `src/components/Stage.tsx`: fixed camera and recurring background, brand masthead, green ground, footer progress.
- `src/components/Caption.tsx`: phrase-level caption timing directly from the JSON.
- `src/engine/motion.ts`: `pop()`, `progress()`, `drift()` motion primitives driven by Remotion's frame counter.
- `src/engine/theme.ts`: palette and typography.
- `src/scenes/SceneRenderer.tsx`: scene grammar and story-specific visual composition.
- `src/Explainer.tsx`: timeline and audio composition.

## Narrative and financial accuracy notes

**Scenario assumptions:** Two friends each begin with $100. Alex buys five shirts for $20 each and sells them for $30 each; his **gross margin dollars** are $50. Maya takes 50 paid preorders at $30 each ($1,500 total), then uses $1,000 of those receipts to fulfill the orders; the remaining $500 is **gross margin dollars**, excluding sample production, marketing, platform fees, shipping, taxes, refunds and chargebacks. Her initial $100 may help fund a sample but is not included in the gross margin example.

**Causality:** The difference in gross margin totals reflects **10 times as many shirts sold**. Taking preorders does not itself ensure 50 buyers or 10x profit. The lesson is that preorders can reduce unsold-inventory risk and help fund fulfillment after genuine, paid demand has been secured. Businesses must honor refunds and delivery promises.

## Publishing checklist

1. Replace robotic draft voice with natural narration.
2. Preview every scene and check exact arithmetic in Studio.
3. Check voice timings, SFX/music levels and subtitle safe area on a phone.
4. Export 1080 × 1920, 30 FPS, H.264 + AAC.
5. Confirm all facts/cost disclaimers remain readable and title does not promise guaranteed profits.
