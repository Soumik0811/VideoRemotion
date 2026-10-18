# Oddly Logical episode production

This file is the reusable production brief for the explainer studio. Follow [ODDLY_LOGICAL_MASTER.md](ODDLY_LOGICAL_MASTER.md) and [ANIMATION ENGINE.txt](ANIMATION%20ENGINE.txt) for the active V6 visual direction. Read [studio/README.md](studio/README.md) and [studio/library.json](studio/library.json) before reusing or adding assets.

## Episode rules

- Preserve earlier episode scripts, figures, cast identities, assets, and exports.
- New episodes use simple character motion and object-led storytelling. Select story-world, concept-reveal, object-mechanism, math-reveal, comparison, and final-payoff beats as the narration requires.
- Put new episode-specific work in its own folder under `src/episodes/` until the migration to `src/videos/` is complete. Keep shared systems in `src/core/` and reusable topic-neutral assets in `src/library/`.
- Keep narration, timing, financial inputs, and storyboard together for each episode. Do not reuse audio or anchors from another episode.
- Preserve the finalized narration and figures. Use editable estimated timing when audio alignment is unavailable; do not claim verified synchronization.
- Prefer the existing Remotion, React, SVG, and local audio stack. Do not add dependencies or paid media generation without need and authorization.
- Record actual asset status in `studio/library.json`. For production, verify arithmetic, inspect motion frames, and render when practical.

## Current project layout

The existing `src/bakery/`, `src/giftcard/`, and `src/episodes/unitEconomics/` implementations are completed historical episodes and remain intact. Shared primitive styling used by the unit-economics episode currently lives in `src/curious/`. Existing production scripts and source data remain in `tools/` and `src/data/`; consolidate them only when their import paths and episode renders can be migrated together.

`src/Root.tsx` is currently the composition registry. `src/index.tsx` is the Remotion entry point. The package scripts in `package.json` are the runnable workflow; do not replace them with placeholder scripts.
