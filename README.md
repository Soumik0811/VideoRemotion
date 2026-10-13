# Oddly Logical Animation Studio

Say **“initiate the master prompt”** or **“INITIATE ODDLY LOGICAL”** to start a new episode. I’ll ask for the final narration script and optional audio, then follow the saved [V5 master prompt](ODDLY_LOGICAL_MASTER.md). See [studio setup and reusable assets](studio/README.md).

## Latest episode: Cinematic V4

The `GiftCardBreakage02` composition follows a Starbucks gift card through a purchase, gift, redemption, forgotten drawer and accounting office. The 138-second vertical animation uses 27 camera shots, articulated SVG characters, physical handoffs and financial values on register, terminal and computer screens.

```bash
npm install
npm run check:giftcard
npm run check:giftcard:v4
npm run studio
npm run render:giftcard
```

In the cloud environment, render with `npm run render:giftcard -- --browser-executable=/usr/bin/chromium`.

See [EPISODE-02.md](EPISODE-02.md) for the reusable components, editing guide and source status. The finalized narration text is preserved. The preview includes original music and effects, with estimated captions and no recorded voiceover. Earlier bakery and T-shirt compositions remain functional.
