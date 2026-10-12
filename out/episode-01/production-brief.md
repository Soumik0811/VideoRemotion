# TASK: Produce Episode 01 — The Bakery That Ran Out of Money

You are working inside my existing React + TypeScript + Remotion financial explainer animation repository.

Your task is to create a complete, production-quality, vertical animated YouTube video using the existing animation engine.

**First, inspect the entire relevant repository structure, package.json, Remotion compositions, scene components, animation utilities, assets, audio handling and rendering scripts. Reuse and improve the existing architecture rather than replacing it with an unrelated project.**

## 1. PROJECT OVERVIEW

**Episode title:** Two Bakers Made $1,000. Only One Survived.

**Financial concept:** Cash flow vs. gross profit.

**Format:** 1080 × 1920, vertical 9:16, 30 FPS.

**Target duration:** Approximately 75–90 seconds. Use the final narration audio to determine the exact duration.

**Style:** Minimalist, clean, polished 2D flat-vector animation.

**Storytelling reference:** A simple animated business story where characters start with the same resources, make different decisions, and gradually produce surprising financial outcomes.

The entire video must feel like one continuous animated story.

No photorealism, stock footage, 3D animation, drastic artistic style changes, or disconnected slideshow scenes.

## 2. EXACT NARRATION SCRIPT

Use this narration as the authoritative spoken script. Do not paraphrase or change financial figures without explaining why.

"Two bakers opened their shops on the same street.

Both started with exactly six hundred dollars.

Both spent their money making bread.

And by the end of the day, both had sold one thousand dollars' worth of bread.

But the next morning, something strange happened.

One baker opened his shop like usual.

The other couldn't even afford to buy flour.

Here's what happened.

The first baker sold his bread directly to customers.

Every customer paid him immediately.

So by the end of the day, he had one thousand dollars in cash.

He used six hundred dollars to prepare the next batch.

And the business kept running.

But the second baker did something different.

Instead of selling to customers, he sold all his bread to a supermarket.

The supermarket agreed to pay him one thousand dollars...

Sixty days later.

Now think about that.

Both bakers made the same sales.

Both had four hundred dollars in gross profit, before other expenses.

But one had a thousand dollars in cash.

And the other had a thousand dollars on paper.

He had to wait sixty days to collect it.

And without additional cash, he couldn't afford to make another batch.

You see, making a profit and having cash are two different things.

Because a business can look profitable on paper... and still run out of money."

Keep the opening as a declarative story, not a question. Build dramatic pauses into the timeline, particularly before "Sixty days later."

## 3. CHARACTER DESIGN — REUSABLE SVG CHARACTERS

Create two original animated cartoon characters using SVG components.

### Character A: Oliver

- Friendly young cartoon baker.
- Rounded head, simple eyes, eyebrows, small nose and expressive mouth.
- Cream shirt, sage-green apron and matching green baker cap.
- Brown trousers and shoes.
- Simple arms with independently animatable shoulder and elbow groups.
- Visual personality: friendly, calm, confident.

### Character B: Noah

- Same overall animation language and proportions as Oliver, but visually distinguishable.
- Rounded face, expressive eyebrows and simple eyes.
- Cream shirt, terracotta-red apron and matching cap.
- Brown trousers and shoes.
- Visual personality: optimistic at the start, increasingly confused and worried.
- Slightly different facial features and hairstyle.

Both must be expressive without requiring complicated frame-by-frame animation.

### Animation states

Implement reusable actions for both characters:

- idle breathing
- natural blinking
- friendly wave
- simple talking/mouth movement
- pointing toward an object
- holding money or bread
- receiving money
- scratching head
- surprised reaction
- confused reaction
- happy reaction
- worried reaction
- subtle walking movement

Use SVG groups and Remotion animations. Maintain fixed character identity, proportions and clothing across every scene.

Do not replace characters with emoji, generic stick figures or placeholder rectangles.

## 4. BACKGROUND DESIGN

Create a reusable neighborhood environment using vector shapes.

Visual palette:

- Cream sky: #F7F1E4
- Sage green: #92AE85
- Soft terracotta: #D68C73
- Brown outlines: #382F2A
- Pale green hills: #DCE8CE
- Warm pavement: #E9DAC4

### Main background

Two small bakeries sit next to each other on a quiet street.

Left bakery belongs to Oliver:
- Sage-green awning
- Large bakery window
- Simple shelves with bread
- Cash register inside

Right bakery belongs to Noah:
- Terracotta-red awning
- Similar overall shape and size
- Bread display
- Cash register and empty ingredient shelf

Include subtle distant hills, pavement, trees and clouds, but keep the background visually simple.

### Additional reusable environments

Create:
- bakery interior view
- supermarket front and receiving counter
- bread supplier / ingredient counter
- simple full-screen financial comparison layout

All environments must look like they belong to the same illustrated world.

Prefer a single larger coordinate-based environment or visually matching scene backgrounds that permit smooth panning.

## 5. REUSABLE ANIMATED OBJECTS

Create illustrated SVG objects with consistent outlines and flat colors:

- individual bread loaf
- bread tray
- flour sack
- money bill
- money stack
- cash register
- supermarket
- invoice sheet
- calendar
- customer character
- ingredient shelf
- sales counter
- simple money-flow arrow

Build animation utilities for:

- slide into view
- pop and scale
- object duplication
- item grouping
- counting numbers
- money transfer
- object following a curved path
- calendar flipping
- expression changes
- camera pan
- camera zoom
- ease-in and ease-out transitions

Animations must be smooth and understandable. Avoid excessive movement.

## 6. SCENE-BY-SCENE PRODUCTION

Use these timings as approximate targets, then align all important visual actions with the narration.

### SCENE 1 — THE SETUP (0–12 seconds)

Narration:
"Two bakers opened their shops on the same street..."

Start with a continuous horizontal view of the neighborhood.

Both bakery storefronts appear.

Oliver stands in front of the green bakery.
Noah stands in front of the red bakery.

Two stacks of money, each labeled $600, appear.

Money flows toward bread ingredients.

Bread loaves appear on trays.

When the narrator says both sold $1,000 worth of bread, animate a sales counter above each shop from $0 to $1,000.

Keep the camera movement subtle.

### SCENE 2 — THE MYSTERY (12–24 seconds)

Narration:
"But the next morning, something strange happened..."

Transition smoothly to morning using a small sun movement and lighting adjustment.

Oliver opens his shop happily.

Noah checks an empty cash drawer.

Show a worried reaction.

Create anticipation before explaining why.

### SCENE 3 — OLIVER'S BUSINESS (24–38 seconds)

Narration:
"The first baker sold his bread directly to customers..."

Move the camera toward Oliver's shop.

Reusable customer figures enter.

They exchange cash for bread.

Animate dollar bills entering the register.

Show $1,000 CASH RECEIVED.

Then animate $600 leaving the register and moving to the ingredient supplier.

Fresh bread loaves appear on the shelves again.

The point must be visually clear: direct sales generated immediate cash for the next batch.

### SCENE 4 — NOAH'S BUSINESS (38–55 seconds)

Narration:
"But the second baker did something different..."

Move toward Noah's shop.

Bread trays slide toward a supermarket.

An invoice sheet appears.

Display:
INVOICE: $1,000
PAYMENT TERMS: 60 DAYS

When the narration says "Sixty days later," briefly hold the shot, then animate a calendar flipping forward.

Noah checks his empty cash drawer.

Do not depict this as money lost. It is money owed but not yet received.

### SCENE 5 — FINANCIAL REVEAL (55–70 seconds)

Narration:
"Both bakers made the same sales..."

Create a readable split-screen comparison.

Both show:
SALES: $1,000
PRODUCTION COST: $600
GROSS PROFIT: $400

Then highlight:
OLIVER — CASH RECEIVED: $1,000
NOAH — CASH RECEIVED: $0
NOAH — UNPAID INVOICE: $1,000

Clarify that figures represent the initial batch and exclude other operating expenses.

Use number count-up animations, green highlights and clear visual hierarchy.

The viewer must understand that the difference is payment timing, not the profitability of the individual batch.

### SCENE 6 — FINAL LESSON (70 seconds to end)

Narration:
"You see, making a profit and having cash are two different things..."

Return to the two-store street background.

Oliver has enough received cash to restock and continue baking.

Noah stands beside an empty ingredient shelf while awaiting supermarket payment.

Slowly reveal:
PROFIT ≠ CASH FLOW

End on the final narration:
"Because a business can look profitable on paper... and still run out of money."

Hold the final text for a moment.

Do not add an unrelated outro or subscribe animation.

## 7. CAMERA AND CONTINUITY RULES

The visual continuity is crucial.

- Use stable character sizes and proportions.
- Preserve the exact same color palette in every scene.
- Reuse SVG assets rather than redrawing characters.
- Use gentle panning to shift attention between the bakeries.
- Animate objects into and out of a persistent environment.
- Avoid a hard cut every time a new narration sentence begins.
- Keep a continuous visual thread from scene to scene.
- Use foreground objects and minor camera motion to maintain energy.
- Avoid chaotic zooms, fast shakes and excessive VFX.

Animation should resemble a professionally designed educational motion-graphics explainer, not a collection of AI-generated clips.

## 8. AUDIO AND CAPTIONS

Use a warm, conversational male English narration.

If an ElevenLabs narration file exists in the project, use it.

If no narration exists:
- Save the exact voiceover script to a text file.
- Allow the user to supply a WAV or MP3 file later.
- Do not require an ElevenLabs API key to render the silent preview.
- Do not invent narration audio.
- Keep the visual timing editable so the exported voiceover can be synchronized later.

Add large dynamic subtitles near the lower-middle portion of the vertical screen.

Use 3–6 words per subtitle group where practical.

Highlight significant phrases:
- SIX HUNDRED DOLLARS
- ONE THOUSAND DOLLARS
- SIXTY DAYS LATER
- GROSS PROFIT
- CASH FLOW

Do not display large subtitles over important character actions or equations.

Reserve space at the bottom for the YouTube Shorts interface.

When voice audio is available, align subtitles to spoken words or verified audio timestamps. Do not claim word-level synchronization if only approximate timing is available.

Add subtle sound effects for:
- money movement
- bread popping into place
- cash register
- invoice appearance
- calendar flipping
- financial reveal

Music should be subtle, upbeat and unobtrusive. Only use appropriately licensed audio.

## 9. REMOTION IMPLEMENTATION

Inspect the existing repository and follow its conventions.

Prefer:
- React functional components
- TypeScript
- Remotion useCurrentFrame()
- Remotion interpolate()
- Remotion spring()
- Sequence or Series for timeline arrangement
- SVG for scalable visual assets
- Data-driven reusable animations
- Deterministic frame-based rendering

Build new reusable components only where the current engine lacks functionality.

Suggested components:
- BakerCharacter
- BakeryExterior
- BakeryInterior
- CustomerCharacter
- BreadLoaf
- MoneyTransfer
- InvoiceCard
- CalendarFlip
- AnimatedCounter
- ComparisonPanel
- CameraRig
- SubtitleOverlay

Keep financial values separate from animation code.

Maintain an episode configuration for:
- title
- story data
- characters
- narration
- scene timings
- assets
- financial figures
- caption cues

Make future episodes easy to create without rewriting the entire animation system.

## 10. QUALITY CONTROL

Before considering the implementation complete:

1. Inspect the existing project and ensure compatibility with its dependencies.
2. Implement the complete six-scene episode.
3. Run TypeScript and project checks.
4. Render a short sample for visual inspection.
5. Render the complete video when dependencies and the environment permit.
6. Inspect frames at scene transitions and numerical reveals.
7. Verify mathematical correctness.
8. Verify that all text remains inside the 9:16 safe area.
9. Check for missing SVGs, broken animations, overlapping subtitles and character inconsistencies.
10. Verify the final output's resolution, frame rate and duration.

Avoid excessive scene changes. Ensure smooth transitions.

## 11. OUTPUT REQUIREMENTS

Deliver:
- A reusable Remotion composition for Episode 01.
- All newly created SVG character and environmental assets.
- Reusable animation components.
- The complete episode configuration.
- The narration text file.
- A subtitle file or subtitle configuration.
- An MP4 preview if rendering is available.
- The command to render the final video.
- A short explanation of how to replace the script and financial values for the next episode.

If environment limitations prevent rendering, implement and validate everything possible, then clearly report what remains.

Do not leave unfinished placeholder scenes and claim the video is production-ready.

**Final objective:** Produce a coherent, engaging, visually polished 2D business story where viewers understand the difference between profit and cash flow without needing an accounting background.