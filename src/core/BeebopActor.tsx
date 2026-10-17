import React, { useMemo } from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BeebopRig } from "./Beebop";
import {
  FEET_Y_FRAC,
  GESTURES,
  POSITION_X,
  RIG,
  SIZE_FRAC,
  blendExpression,
  lerp,
  type BeebopScene,
  type Hand,
  type Hands,
  type Position,
} from "./beebop.config";
import { flattenWords, visemeAt, type LipSegment } from "./lipSync";

/**
 * BeebopActor.tsx — FIXED. Reads the scene timeline and animates the ONE Beebop:
 * slides him between positions, glides his hands/expression to each scene's gesture,
 * adds squash/jump/hover motion, and lip-syncs him to the narration words.
 *
 * Usage (inside VideoTemplate, above SceneRenderer):
 *   <BeebopActor timeline={config.scenes} segments={config.segments} />
 */

export type TimelineScene = { start: number; end: number; beebop: BeebopScene };

type Placed = {
  scene: BeebopScene;
  hidden: boolean;
  x: number; // px, centre
  size: number; // fraction of frame height
};

const lerpHand = (a: Hand, b: Hand, t: number): Hand => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  shape: t < 0.5 ? a.shape : b.shape,
  bend: lerp(a.bend, b.bend, t),
  wave: lerp(a.wave, b.wave, t),
});

export const BeebopActor: React.FC<{ timeline: TimelineScene[]; segments?: LipSegment[] }> = ({
  timeline,
  segments = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const words = useMemo(() => flattenWords(segments), [segments]);

  if (!timeline.length) return null;

  const time = frame / fps;
  let idx = timeline.findIndex((s) => time >= s.start && time < s.end);
  if (idx < 0) idx = time < timeline[0].start ? 0 : timeline.length - 1;
  const cur = timeline[idx];
  const prevScene: BeebopScene | undefined = timeline[idx - 1]?.beebop;
  const localFrame = Math.max(0, frame - Math.round(cur.start * fps));

  // ease from the previous scene's state into this one
  const t = spring({ frame: localFrame, fps, config: { damping: 15, stiffness: 150, mass: 0.8 } });

  const place = (s: BeebopScene, enterFrom?: Position): Placed => {
    const size = SIZE_FRAC[s.size ?? "normal"];
    if (s.position === "hidden") {
      const side = enterFrom === "left" ? -0.3 : 1.3;
      return { scene: s, hidden: true, x: side * width, size };
    }
    return { scene: s, hidden: false, x: POSITION_X[s.position] * width, size };
  };

  // If he was hidden (or this is the first scene), he slides in from the side he's heading to.
  const curP = place(cur.beebop);
  const prevP = prevScene
    ? place(prevScene, cur.beebop.position === "left" ? "left" : "right")
    : place({ ...cur.beebop, position: "hidden" }, cur.beebop.position === "left" ? "left" : "right");
  if (prevP.hidden) prevP.x = (cur.beebop.position === "left" ? -0.3 : 1.3) * width;
  if (curP.hidden) curP.x = (prevScene?.position === "left" ? -0.3 : 1.3) * width;

  const x = lerp(prevP.x, curP.x, t);
  const size = lerp(prevP.size, curP.size, t);
  const px = size * height; // rendered height in px
  const k = px / RIG.height;
  const feetY = FEET_Y_FRAC * height;
  const top = feetY - RIG.feetY * k;

  // Resolve a scene's hands. For point-* gestures with `pointAt`, aim the correct arm at the screen target.
  const handsFor = (p: Placed): Hands => {
    const g = GESTURES[p.scene.gesture];
    if (!p.scene.pointAt || !p.scene.gesture.startsWith("point")) return g.hands;
    const kk = (p.size * height) / RIG.height;
    const topP = feetY - RIG.feetY * kk;
    const tx = p.scene.pointAt.x * width;
    const ty = p.scene.pointAt.y * height;
    const side = tx < p.x ? "left" : "right";
    const S = RIG.shoulders[side];
    const sx = p.x + (S.x - RIG.width / 2) * kk;
    const sy = topP + S.y * kk;
    const len = Math.hypot(tx - sx, ty - sy) || 1;
    const reach = 130;
    const aim: Hand = {
      x: S.x + ((tx - sx) / len) * reach,
      y: S.y + ((ty - sy) / len) * reach,
      shape: "point",
      bend: 1,
      wave: 0,
    };
    const other: Hand = { x: side === "left" ? 238 : 162, y: 428, shape: "fist", bend: -1, wave: 0 };
    return side === "left" ? { left: aim, right: other } : { left: other, right: aim };
  };

  const hA = handsFor(prevP);
  const hB = handsFor(curP);
  const hands: Hands = { left: lerpHand(hA.left, hB.left, t), right: lerpHand(hA.right, hB.right, t) };

  const gA = GESTURES[prevP.scene.gesture];
  const gB = GESTURES[curP.scene.gesture];
  const expression = blendExpression(
    prevP.scene.expression ?? gA.expression,
    curP.scene.expression ?? gB.expression,
    t,
  );

  // body motion
  const jumpPhase = Math.abs(Math.sin((Math.PI * frame) / (fps * 0.8)));
  const liftOf = (g: typeof gA) =>
    (g.jump ? jumpPhase * 70 : 0) + g.hover * (1 + 0.08 * Math.sin(frame / 12));
  const lift = lerp(liftOf(gA), liftOf(gB), t);
  const landing = gB.jump ? (1 - Math.min(1, jumpPhase / 0.15)) * 0.07 : 0;
  const pop = 0.05 * Math.sin(Math.min(localFrame / 9, 1) * Math.PI);
  const squash = 1 - landing + pop;
  const tuck = lerp(gA.tuck, gB.tuck, t);
  const flap = lerp(gA.flap, gB.flap, t);
  const dir = Math.sign(curP.x - prevP.x);
  const lean = Math.sin(frame / 20) * 0.6 + (1 - Math.min(1, t)) * dir * 4;

  // lip-sync
  const ls = visemeAt(words, time);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x - (RIG.width * k) / 2,
          top,
          width: RIG.width * k,
          height: RIG.height * k,
        }}
      >
        <BeebopRig
          frame={frame}
          fps={fps}
          hands={hands}
          expression={expression}
          viseme={ls?.viseme ?? null}
          mouthOpen={ls?.open ?? 0}
          body={{ lift, squash, tuck, flap, lean }}
        />
      </div>
    </AbsoluteFill>
  );
};
