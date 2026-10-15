# Oddly Logical studio context

The active new-episode direction is **Animation Engine V6**, documented in [ANIMATION ENGINE.txt](../ANIMATION%20ENGINE.txt) and summarized in [ODDLY_LOGICAL_MASTER.md](../ODDLY_LOGICAL_MASTER.md). V6 uses simple recurring characters, persistent story worlds, object-led explanations, six selectable scene templates, selective radial bursts, bold stepwise number reveals, and frequent motivated visual events.

Say **initiate the master prompt** or **INITIATE ODDLY LOGICAL** to begin a fresh episode. If narration is missing, request the final script and optional narration audio. A supplied current script skips that request. Updating the production context alone does not launch an episode.

## Existing implementation snapshot

| System | Existing implementation | Status |
| --- | --- | --- |
| Timeline/rendering | React, TypeScript, Remotion; src/Root.tsx | Existing compositions: GiftCardBreakage02, BakeryEpisode01, FinanceExplainer |
| Characters | Gift-card cinematic character rig and bakery character components | Existing designs/motion are reusable; use simple V6 character movement for new episodes. Preserve older episode identities. |
| Story worlds | Gift-card cinematic environments and bakery environments | Existing café, home, office, bakery, neighborhood, supermarket and supplier settings. Reuse layouts when relevant. |
| Object interactions | Gift-card Interactions.tsx, choreography and props | Existing hand-contact choreography belongs to the earlier episode. For new V6 work, prefer floating/sliding object motion and avoid realistic handoffs. |
| Camera/motion | EnvironmentCamera.tsx, motion.ts, engine motion helpers | Frame-driven camera and coordinate helpers exist. Reuse selectively. |
| Boards/captions | Financial boards, Caption.tsx, bakery subtitle overlay | Existing components; adapt for concise V6 headings, sequential math and safe caption placement. |
| Episode data/timing | Episode JSON, cinematic storyboard/timing | Existing formats are episode-specific. Create a fresh storyboard and timing anchors for each script. |
| Quality review | Story/check scripts and gift-card frame review tooling | Existing checks are tied to specific episodes; use relevant checks and inspect several frames through motion. |
| V6 template components | Story World, Concept Reveal, Object Mechanism, Math Reveal, Comparison Screen, Final Payoff | Selection is a production rule. Catalog/inspect before treating any as implemented reusable components. |
| Radial burst / ambient engine / object library | No confirmed dedicated general-purpose implementation in the inspected inventory | Build only as needed; update catalog to reflect actual status. |
| Optional libraries | GSAP, Lottie, Rive, PixiJS | Not installed or integrated in the inspected setup. Remotion/SVG is the default. |

The machine-readable studio/library.json records known reusable files and constraints. Consult it before creating assets; update it when reusable systems actually change.

## Episode safeguards

Use a new episode ID/directory and preserve earlier scripts, assets, and exports. Keep 1080×1920, 30 FPS, H.264 by default. Never reuse episode-specific narration audio or sentence anchors for another story. Use narration audio for final timing when supplied; otherwise use editable estimates and describe synchronization as pending.

Preserve the user's script and figures. Verify arithmetic and distinguish sourced claims from supplied or hypothetical claims. Use only licensed/original audio. External paid media generation requires explicit authorization.

## Existing commands

npm run studio
npm run typecheck
npm run check:story
npm run check:bakery
npm run check:giftcard
npm run check:giftcard:v4
npm run review:giftcard
npm run render:giftcard -- --browser-executable=/usr/bin/chromium

The gift-card checks and render target that episode only. Give every new episode its own composition and commands as appropriate.
