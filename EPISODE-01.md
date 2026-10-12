# Episode 01 — The Bakery That Ran Out of Money

**Title:** Two Bakers Made $1,000. Only One Survived.

The `BakeryEpisode01` composition is a 90-second, 1080 × 1920, 30 FPS illustrated story. It uses the existing Remotion/React engine and keeps the original `FinanceExplainer` composition available. The pastel street is an original SVG interpretation of the supplied storefront reference: mint skyline, sage and terracotta shopfronts, striped awnings, glass reflections and warm pavement.

The export includes original synthesized instrumental music and six subtle effects. **There is no narration**: the repository's previous `audio/narration.wav` belongs to the T-shirt episode. No replacement voice was generated. All subtitle timestamps are editorial estimates, not verified speech alignment.

## Run and export

```bash
npm run typecheck
npm run check:story
npm run check:bakery
npm run studio -- --host=0.0.0.0 --port=3000 --no-open
npm run render -- --browser-executable=/usr/bin/chromium
npm run still -- --browser-executable=/usr/bin/chromium
```

The full preview is written to `out/episode-01/bakery-episode-01.mp4`. The render uses H.264, CRF 18, AAC, and two rendering workers. On another machine, replace the browser path with its Chromium executable, or let Remotion use its supported browser. Use the positional output path when calling `npx remotion render` directly; do not append a second `--output` to `npm run render`.

## Files

| File | Purpose |
| --- | --- |
| `src/data/bakery-episode.json` | Financial figures, characters, six scenes, exact script, captions, music and sound cues |
| `src/bakery/BakeryEpisode.tsx` | Continuous environment, camera choreography, action timeline and audio |
| `src/bakery/components/BakerCharacter.tsx` | Reusable Oliver/Noah rig and customer character |
| `src/bakery/components/Environment.tsx` | Street, bakeries, interiors, supermarket, supplier and camera rig |
| `src/bakery/components/Props.tsx` | Bread, flour, money, register, shelf, invoice, calendar and transfers |
| `src/bakery/components/ComparisonPanel.tsx` | Initial-batch financial comparison |
| `src/bakery/components/SubtitleOverlay.tsx` | Captions in a reserved lower-middle area |
| `src/bakery/engine/motion.ts` | Eased movement, scene time mapping, curved paths and palette |
| `out/episode-01/narration.txt` | Exact authoritative script for recording |
| `out/episode-01/captions.srt` | Complete transcript, with estimated timestamps |
| `out/episode-01/timing.json` | Editable timing reference |

The character rig blends joint and facial poses over 0.7 seconds. Its reusable states include breathing, blinking, waving, talking, pointing, holding bread or money, receiving payment, scratching, surprise, confusion, happiness, worry and walking. Positions and expressions are deterministic functions of frame time.

## Add the real voiceover

1. Record the exact text in `out/episode-01/narration.txt` with the requested conversational male English voice, including a pause before “Sixty days later.”
2. Put the new recording at `public/audio/bakery/narration.wav` (or `.mp3`). Set `narration.src` in `src/data/bakery-episode.json` to its path relative to `public`, for example `audio/bakery/narration.wav`.
3. Measure the recording with `ffprobe`. Adjust `durationSeconds`, scene boundaries, sentence timestamps, caption cues and sound events to the actual delivery. Leave a short hold after the final words. Scene choreography stretches to the configured scene boundaries automatically.
4. Set `narration.timing` to `audio-verified` only after checking the recording against the cues. Run `npm run export:bakery` to refresh the transcript and SRT.
5. Rebuild the music for the new duration if needed with `python tools/make_bakery_audio.py` (requires NumPy). This generates only music and effects and never writes narration. Then validate and render again. The current 75–90 second target is checked by `check:bakery`; revise that check deliberately if the final recording requires a different target.

## Create the next episode

Duplicate the episode JSON, replace the narration and captions, update the financial figures and headings, and register another composition in `src/Root.tsx`. Keep sales, production cost, gross profit, cash received and unpaid invoices consistent. The current comparison derives displayed values from `financials`; choreography is reusable for another two-business cash-timing story. New stories with different actions can reuse the SVG assets and camera while extending `StoryWorld`.

The illustrated financial comparison refers to the **first batch at the end of day one**: sales $1,000 minus production cost $600 equals $400 gross profit before other expenses for each baker. Oliver has received $1,000; Noah has received $0 and holds a $1,000 receivable due in 60 days. Noah's invoice is not depicted as a loss. Oliver's later $600 restocking is a separate batch.

## Validation and audio provenance

`tools/check-bakery.mjs` checks the arithmetic, complete six-scene timeline, caption bounds and exact transcript reconstruction, and required audio assets. `tools/review-bakery.mjs` renders representative frames and transition boundaries for visual inspection. Caption and action space is kept above the lower platform-interface area.

The instrumental score and effects in `public/audio/bakery/` are synthesized by `tools/make_bakery_audio.py`; they use no third-party samples. The score ducks around the payment-delay reveal. All SVG illustrations are source components, not flattened stock images.
