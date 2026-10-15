# Oddly Logical project guidance

For episode production, follow Animation Engine V6 in [ODDLY_LOGICAL_MASTER.md](ODDLY_LOGICAL_MASTER.md) and [ANIMATION ENGINE.txt](ANIMATION%20ENGINE.txt). Initialization and the reusable-system inventory are recorded in [studio/README.md](studio/README.md); avoid repeating first-time setup merely because the master file is read.

- Treat â€œinitiate the master promptâ€ and â€œINITIATE ODDLY LOGICALâ€ as equivalent, case-insensitive launch commands.
- A launch starts a fresh episode. If narration for that new episode is missing, use the master's ready message to request the final script and optional narration audio. An older episode's script does not count as the new narration.
- If the current episode's narration is already supplied, proceed without asking for it again. Infer the production decisions from it.
- Saving or updating the master instructions alone is configuration work, not a request to begin another episode. The user wants the narration request upon their next initiation.
- Preserve existing episodes, character identities and assets. Use the V5 permanent cast identities with V6 simplified, object-led animation for new episodes; do not retroactively rename or redesign prior cast members.
- Consult `studio/library.json` before creating assets. Build missing reusable features as needed and update the catalog with their actual status.
- Preserve the finalized script and financial figures. Use estimated, editable timing when no recording is supplied; do not invent voiceover or claim verified speech synchronization.
- Prefer existing SVG/Remotion tools. External paid generation requires explicit authorization. Avoid unnecessary dependencies.
- For each episode, save a time-coded storyboard, verify interactions and calculations, inspect rendered frames, and render the MP4 when possible. Report actual outputs and remaining limitations.
