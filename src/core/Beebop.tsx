import React from "react";
import {
  BEEBOP_THEME as C,
  RIG,
  VISEMES,
  type Hand,
  type Hands,
  type Mouth,
  type RigExpression,
  type Viseme,
} from "./beebop.config";

/**
 * Beebop.tsx — FIXED. The one and only Beebop.
 *
 * Pure and deterministic: everything is a function of `frame` (no hooks, no Math.random),
 * so it renders identically in Studio and in `remotion render`.
 * BeebopActor.tsx decides WHAT he does; this file only draws him.
 *
 * NOTE: SVG ids below (bb-*) are fixed, so use one Beebop per frame.
 */

export type BeebopBody = {
  lift?: number; // rig units off the ground
  squash?: number; // 1 = normal; <1 squashed, >1 stretched (anchored at the feet)
  tuck?: number; // 0..1 legs tucked up
  flap?: number; // 0..1 wing flap intensity
  lean?: number; // degrees, rotates around the feet
};

export type BeebopRigProps = {
  frame: number;
  fps: number;
  hands: Hands;
  expression: RigExpression;
  viseme?: Viseme | null; // null/undefined = resting mouth from the expression
  mouthOpen?: number; // 0..1
  body?: BeebopBody;
  sticker?: boolean; // off-white outline
};

// ───────────── 2-bone IK for an arm ─────────────
function solveArm(shoulder: { x: number; y: number }, target: { x: number; y: number }, bend: number, side: "left" | "right") {
  const L1 = RIG.upperArm;
  const L2 = RIG.foreArm;
  const dx = target.x - shoulder.x;
  const dy = target.y - shoulder.y;
  const d = Math.min(Math.max(Math.hypot(dx, dy), 18), L1 + L2 - 0.5);
  const a = Math.atan2(dy, dx);
  const cosA = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
  const alpha = Math.acos(Math.min(1, Math.max(-1, cosA)));
  const s = side === "right" ? bend : -bend; // mirrored so the same `bend` means the same thing on both arms
  const ea = a + s * alpha;
  const elbow = { x: shoulder.x + L1 * Math.cos(ea), y: shoulder.y + L1 * Math.sin(ea) };
  const hand = { x: shoulder.x + d * Math.cos(a), y: shoulder.y + d * Math.sin(a) };
  const angle = (Math.atan2(hand.y - elbow.y, hand.x - elbow.x) * 180) / Math.PI;
  return { elbow, hand, angle };
}

const r = (n: number) => Math.round(n * 100) / 100;
const STROKE = { stroke: C.ink, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// ───────────── Hand shapes, drawn along +x (the forearm direction) ─────────────
const HandShapeSvg: React.FC<{ shape: Hand["shape"] }> = ({ shape }) => {
  if (shape === "fist") {
    return <circle cx={9} cy={0} r={10} fill={C.hand} {...STROKE} strokeWidth={5} />;
  }
  if (shape === "point") {
    return (
      <g>
        <path d="M12 -2 L46 -2" {...STROKE} strokeWidth={10} fill="none" />
        <path d="M12 -2 L46 -2" stroke={C.hand} strokeLinecap="round" strokeWidth={4} fill="none" />
        <circle cx={8} cy={2} r={9} fill={C.hand} {...STROKE} strokeWidth={5} />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx={14} cy={0} rx={15} ry={10.5} fill={C.hand} {...STROKE} strokeWidth={5} />
      <ellipse cx={9} cy={-10} rx={6} ry={4.5} fill={C.hand} {...STROKE} strokeWidth={4} transform="rotate(-25 9 -10)" />
    </g>
  );
};

// ───────────── Mouth ─────────────
const openMouthPath = (w: number, hh: number) =>
  `M${-w} 0 C${-w} ${r(hh * 1.7)} ${w} ${r(hh * 1.7)} ${w} 0 Q0 -3 ${-w} 0 Z`;

const RestMouth: React.FC<{ kind: Mouth }> = ({ kind }) => {
  const line = { ...STROKE, strokeWidth: 5, fill: "none" } as const;
  switch (kind) {
    case "grin":
      return <OpenMouth w={26} h={17} tongue />;
    case "o":
      return <ellipse cx={0} cy={8} rx={10} ry={13} fill={C.mouth} {...STROKE} strokeWidth={4} />;
    case "flat":
      return <path d="M-14 6 L14 6" {...line} />;
    case "frown":
      return <path d="M-18 12 Q0 -4 18 12" {...line} />;
    case "side":
      return <path d="M-14 8 Q4 14 20 0" {...line} />;
    default:
      return <path d="M-24 0 Q0 20 24 0" {...line} />;
  }
};

const OpenMouth: React.FC<{ w: number; h: number; tongue?: boolean }> = ({ w, h, tongue }) => (
  <g>
    <clipPath id="bb-mouth">
      <path d={openMouthPath(w, h)} />
    </clipPath>
    <path d={openMouthPath(w, h)} fill={C.mouth} {...STROKE} strokeWidth={4.5} />
    {(tongue || h > 12) && (
      <ellipse cx={0} cy={h * 1.05} rx={w * 0.55} ry={Math.max(3, h * 0.38)} fill={C.tongue} clipPath="url(#bb-mouth)" />
    )}
  </g>
);

// ───────────── The character ─────────────
export const BeebopRig: React.FC<BeebopRigProps> = ({
  frame,
  fps,
  hands,
  expression,
  viseme = null,
  mouthOpen = 1,
  body = {},
  sticker = true,
}) => {
  const { lift = 0, squash = 1, tuck = 0, flap = 0.15, lean = 0 } = body;
  const t = frame / fps;
  const ex = expression.state;

  // idle life
  const breath = 1 + Math.sin(t * 2.2) * 0.012;
  const bob = Math.sin(t * 2.6) * 3.5;
  const wing = Math.sin(t * (6 + flap * 22)) * (3 + flap * 20);
  const sway1 = Math.sin(t * 3.1) * 5;
  const sway2 = Math.sin(t * 3.1 - 0.9) * 5;

  // blink: ~every 3.9s, 6 frames long, deterministic
  const period = Math.round(fps * 3.9);
  const bf = (frame + 37) % period;
  const blink = bf < 6 ? Math.sin((bf / 6) * Math.PI) : 0;
  const eyeY = 1 - 0.92 * blink;

  // arms
  const wv = (hd: Hand): Hand => ({
    ...hd,
    x: hd.x + hd.wave * Math.sin(t * 9) * 22,
    y: hd.y + hd.wave * Math.cos(t * 9) * 5,
  });
  const armL = solveArm(RIG.shoulders.left, wv(hands.left), hands.left.bend, "left");
  const armR = solveArm(RIG.shoulders.right, wv(hands.right), hands.right.bend, "right");

  // legs
  const footY = RIG.feetY - tuck * 120;
  const dangle = Math.sin(t * 3) * tuck * 14;
  const leg = (side: -1 | 1) => {
    const hip = { x: 200 + side * 13, y: 456 };
    const foot = { x: 200 + side * (24 + tuck * 10) + dangle * side, y: footY };
    const ctrl = { x: hip.x + side * (6 + tuck * 46), y: (hip.y + footY) / 2 + tuck * 20 };
    return { hip, foot, ctrl };
  };
  const legL = leg(-1);
  const legR = leg(1);

  // squash & stretch anchored at the feet
  const sy = squash * breath;
  const sx = 1 / Math.sqrt(sy);
  const shadowScale = Math.max(0.45, 1 - lift / 420);

  const eyes = (cx: number) => {
    if (expression.eyes === "arc") {
      return <path key={cx} d={`M${cx - 22} 210 Q${cx} 182 ${cx + 22} 210`} {...STROKE} strokeWidth={7} fill="none" />;
    }
    const px = ex.lookX * 10;
    const py = ex.lookY * 10;
    return (
      <g key={cx} transform={`translate(${cx} 204) scale(${r(ex.eye)} ${r(ex.eye * eyeY)})`}>
        <ellipse rx={31} ry={35} fill="#fff" {...STROKE} strokeWidth={4} />
        <circle cx={px} cy={py} r={19} fill={C.ink} />
        <circle cx={px - 6} cy={py - 7} r={6} fill="#fff" />
        <circle cx={px + 6} cy={py + 7} r={2.8} fill="#fff" />
      </g>
    );
  };

  const brow = (cx: number, b: { y: number; rot: number }) => (
    <path d="M-20 3 Q0 -7 20 3" {...STROKE} strokeWidth={6} fill="none" transform={`translate(${cx} ${150 + b.y}) rotate(${b.rot})`} />
  );

  const v = viseme ? VISEMES[viseme] : null;
  const vh = v ? v.h * (0.55 + 0.45 * mouthOpen) : 0;

  return (
    <svg
      viewBox={`0 0 ${RIG.width} ${RIG.height}`}
      width="100%"
      height="100%"
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        <radialGradient id="bb-head" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={C.skinLight} />
          <stop offset="100%" stopColor={C.skin} />
        </radialGradient>
        <clipPath id="bb-torso">
          <ellipse cx={200} cy={410} rx={31} ry={54} />
        </clipPath>
        <filter id="bb-sticker" filterUnits="userSpaceOnUse" x={-120} y={-260} width={640} height={1100}>
          <feMorphology in="SourceAlpha" operator="dilate" radius={6} result="grow" />
          <feFlood floodColor={C.sticker} />
          <feComposite in2="grow" operator="in" result="rim" />
          <feMerge>
            <feMergeNode in="rim" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ground shadow (stays on the floor while he jumps/flies) */}
      <ellipse cx={200} cy={RIG.feetY + 6} rx={78 * shadowScale} ry={9 * shadowScale} fill="#000" opacity={0.32 * shadowScale} />

      <g filter={sticker ? "url(#bb-sticker)" : undefined}>
        <g
          transform={`translate(0 ${r(-lift + bob * 0.4)}) rotate(${lean} 200 ${RIG.feetY}) translate(200 ${RIG.feetY}) scale(${r(sx)} ${r(sy)}) translate(-200 ${-RIG.feetY})`}
        >
          {/* wings */}
          <g transform={`rotate(${r(-wing)} 188 350)`}>
            <ellipse cx={132} cy={336} rx={58} ry={22} transform="rotate(-28 132 336)" fill={C.wing} fillOpacity={0.85} {...STROKE} strokeWidth={4} />
            <ellipse cx={148} cy={372} rx={38} ry={13} transform="rotate(-8 148 372)" fill={C.wing} fillOpacity={0.85} {...STROKE} strokeWidth={4} />
          </g>
          <g transform={`rotate(${r(wing)} 212 350)`}>
            <ellipse cx={268} cy={336} rx={58} ry={22} transform="rotate(28 268 336)" fill={C.wing} fillOpacity={0.85} {...STROKE} strokeWidth={4} />
            <ellipse cx={252} cy={372} rx={38} ry={13} transform="rotate(8 252 372)" fill={C.wing} fillOpacity={0.85} {...STROKE} strokeWidth={4} />
          </g>

          {/* legs */}
          {[legL, legR].map((lg, i) => (
            <g key={i}>
              <path d={`M${lg.hip.x} ${lg.hip.y} Q${r(lg.ctrl.x)} ${r(lg.ctrl.y)} ${r(lg.foot.x)} ${r(lg.foot.y)}`} {...STROKE} strokeWidth={6} fill="none" />
              <ellipse cx={lg.foot.x} cy={lg.foot.y + 2} rx={18} ry={7} fill={C.hand} {...STROKE} strokeWidth={4.5} />
            </g>
          ))}

          {/* abdomen */}
          <g clipPath="url(#bb-torso)">
            <rect x={160} y={350} width={80} height={120} fill={C.skin} />
            {[386, 412, 438].map((y) => (
              <rect key={y} x={160} y={y} width={80} height={14} fill={C.band} />
            ))}
          </g>
          <ellipse cx={200} cy={410} rx={31} ry={54} fill="none" {...STROKE} strokeWidth={5} />

          {/* bandana */}
          <path d="M158 316 Q200 336 242 316 L230 342 L200 382 L170 342 Z" fill={C.bandana} {...STROKE} strokeWidth={4.5} />
          <path d="M176 334 Q200 346 224 334" stroke={C.ink} strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" fill="none" />

          {/* head */}
          <g transform={`translate(0 ${r(bob * 0.6)}) rotate(${r(ex.tilt + Math.sin(t * 1.7) * 1.2)} 200 300)`}>
            {/* antennae: left has a leaf sprout, right has a bone */}
            <path d={`M172 96 C160 62 140 52 ${r(126 + sway1)} 40`} {...STROKE} strokeWidth={5} fill="none" />
            <g transform={`translate(${r(126 + sway1)} 40) rotate(-35)`}>
              <path d="M0 0 C-2 -14 14 -24 24 -17 C22 -4 8 5 0 0Z" fill={C.leaf} {...STROKE} strokeWidth={3.5} />
            </g>
            <path d={`M228 96 C242 62 262 54 ${r(278 + sway2)} 44`} {...STROKE} strokeWidth={5} fill="none" />
            <g transform={`translate(${r(278 + sway2)} 44) rotate(-15)`}>
              <line x1={0} y1={0} x2={22} y2={0} {...STROKE} strokeWidth={10} />
              <line x1={0} y1={0} x2={22} y2={0} stroke={C.sticker} strokeLinecap="round" strokeWidth={4} />
              {[[-1, -4], [-1, 4], [23, -4], [23, 4]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={4.5} fill={C.sticker} {...STROKE} strokeWidth={3} />
              ))}
            </g>

            <circle cx={200} cy={200} r={112} fill="url(#bb-head)" {...STROKE} strokeWidth={6} />

            <ellipse cx={126} cy={256} rx={20} ry={12} fill={C.blush} opacity={ex.cheeks * 0.4} />
            <ellipse cx={274} cy={256} rx={20} ry={12} fill={C.blush} opacity={ex.cheeks * 0.4} />

            {eyes(160)}
            {eyes(240)}
            {brow(160, ex.browL)}
            {brow(240, ex.browR)}

            <g transform="translate(200 262)">
              {v ? (
                vh < 2 ? (
                  <path d="M-16 4 Q0 9 16 4" {...STROKE} strokeWidth={5} fill="none" />
                ) : (
                  <OpenMouth w={v.w} h={vh} />
                )
              ) : (
                <RestMouth kind={expression.mouth} />
              )}
            </g>
          </g>

          {/* arms last so hands can sit on the chin / in front of the face */}
          {[
            { a: armL, s: RIG.shoulders.left, shape: hands.left.shape },
            { a: armR, s: RIG.shoulders.right, shape: hands.right.shape },
          ].map(({ a, s, shape }, i) => (
            <g key={i}>
              <path d={`M${s.x} ${s.y} L${r(a.elbow.x)} ${r(a.elbow.y)} L${r(a.hand.x)} ${r(a.hand.y)}`} {...STROKE} strokeWidth={6} fill="none" />
              <g transform={`translate(${r(a.hand.x)} ${r(a.hand.y)}) rotate(${r(a.angle)}) scale(1 ${Math.abs(a.angle) > 90 ? -1 : 1})`}>
                <HandShapeSvg shape={shape} />
              </g>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
};
