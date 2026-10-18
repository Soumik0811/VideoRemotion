# Video episodes

This is the destination for the reusable per-video layout described in `AGENT_PROMPT.md` (`_template/`, `input.json`, cast, timeline, props, worlds, and composition entry). Existing releases are preserved in their current source locations under `src/bakery/`, `src/giftcard/`, and `src/episodes/`; the live composition registry and package scripts depend on those paths. Migrate each episode as a single source-and-import change so historical render commands remain valid.
