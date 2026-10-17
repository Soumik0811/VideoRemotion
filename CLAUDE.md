# Beebop Studio rules

1. Only edit files inside `src/videos/<slug>/` and `public/videos/<slug>/`. Never modify `src/core/`.
2. `input.json` is the only human-edited video input. AI output is `scenes.ts` plus video-local backgrounds and props.
3. Split scenes at topic shifts; a scene is typically 3–8 seconds.
4. Check `src/library/backgrounds/` before creating a video-local background. Keep backgrounds dark and low contrast.
5. Never edit `src/core/` or draw a new Beebop. Choose only gesture, position, size, expression, and pointAt values from `beebop.config.ts`.
6. Use `pointAt` with point gestures, place Beebop opposite the prop, and keep him out of the title/caption zones.
7. Change gesture or position every scene; never repeat the same gesture and position consecutively.
8. Highlight 1–2 important words per segment with `*asterisks*`.
9. Titles are short, uppercase, and end in a period: setup on line 1, punchline on line 2.
10. Run `npm run validate -- <slug>` and fix all errors before finishing.
11. Use Remotion animation primitives, never CSS transitions or `Math.random()`.
