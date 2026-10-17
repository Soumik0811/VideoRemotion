/**
 * Characters.tsx: Slapper + Receiver for "The Physics of a Perfect Slap"
 *
 * Place at: src/videos/001-perfect-slap/props/Characters.tsx
 * (inside the video folder, so core/ is never touched)
 *
 * Rules followed: frame-driven animation only (useCurrentFrame, interpolate,
 * spring), no Math.random, no CSS transitions, no external images.
 * Both characters are pure SVG, drawn in a 400 x 640 box and positioned by
 * their CENTER (x, y) on the 1080 x 1920 canvas.
 */
import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ------------------------------------------------------------------ */
/* Palette + layout                                                    */
/* ------------------------------------------------------------------ */

const C = {
  ink: "#1B1B22",
  skin: "#F6C9A0",
  skinPink: "#FFC9B3",
  red: "#E5392B",
  offWhite: "#E8E2D9",
  blue: "#6FA8DC",
  pants: "#2B3A55",
  hair: "#2A2118",
  blush: "#FF8FA3",
  water: "#7FD6FF",
  gold: "#F2B134",
  mouth: "#5A1A24",
};

const VB_W = 400;
const VB_H = 640;

/** Positions where the hand lands on the cheek at scale 1. Reuse for every scene. */
export const SLAP_LAYOUT = {
  slapper: { x: 300, y: 1000 },
  receiver: { x: 700, y: 1000 },
};

export type SlapperPose = "idle" | "windup" | "smirk" | "judge" | "dip";
export type ReceiverState =
  | "neutral"
  | "unimpressed"
  | "brace"
  | "hit"
  | "crying"
  | "dazed";

/* ------------------------------------------------------------------ */
/* Helpers / hooks (use these from scenes.ts or your scene components) */
/* ------------------------------------------------------------------ */

/** 0 -> 1 swing progress. Accelerates (slow wind-up, fast strike). */
export const useSwingProgress = (startSec: number, durationSec: number): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(
    frame,
    [startSec * fps, (startSec + durationSec) * fps],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    }
  );
};

/**
 * Damped wobble that starts at 1 on the impact frame and rings out.
 * Feed the result to <Receiver hit={...} />. Negative values = rebound.
 */
export const useImpactWobble = (impactSec: number): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - Math.round(impactSec * fps);
  if (f < 0) return 0;
  return Math.exp(-f / 7) * Math.cos(f * 0.5);
};

const star = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
  }).join(" ");

const spiralPath = (cx: number, cy: number, maxR: number, turns = 2.5) => {
  const steps = 48;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const r = t * maxR;
    d += `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(a)).toFixed(1)} ${(
      cy +
      r * Math.sin(a)
    ).toFixed(1)} `;
  }
  return d;
};

/* ------------------------------------------------------------------ */
/* Shared frame: placement, pop-in, idle bob, flip                     */
/* ------------------------------------------------------------------ */

type FrameProps = {
  x: number;
  y: number;
  scale: number;
  flip: boolean;
  appearAtSec?: number;
  children: React.ReactNode;
};

const CharacterFrame: React.FC<FrameProps> = ({
  x,
  y,
  scale,
  flip,
  appearAtSec,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop =
    appearAtSec === undefined
      ? 1
      : spring({
          frame: frame - Math.round(appearAtSec * fps),
          fps,
          config: { damping: 11, stiffness: 140 },
        });
  const bob = Math.sin(frame / 14) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: VB_W,
        height: VB_H,
        transform: `translate(-50%, -50%) translateY(${bob}px) scale(${
          scale * pop
        }) scaleX(${flip ? -1 : 1})`,
        transformOrigin: "50% 50%",
      }}
    >
      <svg
        width={VB_W}
        height={VB_H}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        style={{ overflow: "visible" }}
      >
        {children}
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* SLAPPER                                                             */
/* ------------------------------------------------------------------ */

export type SlapperProps = {
  pose?: SlapperPose;
  /** 0 = wound back, 1 = contact. Overrides the pose's arm angle. */
  swing?: number;
  /** Weak, floppy tap (scene 1). Arm only travels part of the way. */
  limp?: boolean;
  /** -1..1 torso rotation (squeezes the torso to fake a twist). */
  twist?: number;
  /** Motion-trail strength 0..1 (ghost copies of the arm). */
  trail?: number;
  wet?: boolean;
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  appearAtSec?: number;
};

const ARM = 190; // shoulder -> hand centre
const POSE_ANGLE: Record<SlapperPose, number> = {
  idle: 75,
  windup: -140,
  smirk: 75,
  judge: -75,
  dip: 60,
};

export const Slapper: React.FC<SlapperProps> = ({
  pose = "idle",
  swing,
  limp = false,
  twist = 0,
  trail = 0,
  wet = false,
  x = SLAP_LAYOUT.slapper.x,
  y = SLAP_LAYOUT.slapper.y,
  scale = 1,
  flip = false,
  appearAtSec,
}) => {
  const frame = useCurrentFrame();

  const judge = pose === "judge";
  const smirk = pose === "smirk" || judge;

  // Arm angle (0 = pointing forward, negative = up/back)
  let angle = POSE_ANGLE[pose];
  if (swing !== undefined) {
    const [from, to] = judge ? [-100, 15] : limp ? [-140, -15] : [-140, 5];
    angle = interpolate(swing, [0, 1], [from, to]);
  }

  // Torso twist squeezes horizontally; shoulder moves with it
  const s = 1 - 0.28 * Math.abs(twist);
  const shoulder = { x: 200 + 62 * s, y: 300 };

  const rad = (angle * Math.PI) / 180;
  const hand = {
    x: shoulder.x + ARM * Math.cos(rad),
    y: shoulder.y + ARM * Math.sin(rad),
  };

  // Blink (deterministic)
  const blinking = (frame + 20) % 120 < 4;

  const renderArm = (a: number, opacity: number, key: string) => (
    <g key={key} transform={`rotate(${a} ${shoulder.x} ${shoulder.y})`} opacity={opacity}>
      <line
        x1={shoulder.x}
        y1={shoulder.y}
        x2={shoulder.x + 105}
        y2={shoulder.y}
        stroke={C.red}
        strokeWidth={38}
        strokeLinecap="round"
      />
      <line
        x1={shoulder.x + 105}
        y1={shoulder.y}
        x2={shoulder.x + ARM}
        y2={shoulder.y}
        stroke={C.skin}
        strokeWidth={30}
        strokeLinecap="round"
      />
      <circle cx={shoulder.x + ARM} cy={shoulder.y} r={30} fill={C.skin} />
      <circle cx={shoulder.x + ARM - 8} cy={shoulder.y - 26} r={11} fill={C.skin} />
      {wet && (
        <>
          <circle cx={shoulder.x + ARM} cy={shoulder.y} r={30} fill={C.water} opacity={0.45} />
          <path
            d={`M${shoulder.x + ARM - 14} ${shoulder.y - 10} Q${shoulder.x + ARM} ${
              shoulder.y - 22
            } ${shoulder.x + ARM + 12} ${shoulder.y - 12}`}
            stroke="#fff"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            opacity={0.9}
          />
        </>
      )}
      {judge && (
        <g transform={`translate(${shoulder.x + ARM} ${shoulder.y})`}>
          <rect x={-6} y={-70} width={12} height={70} rx={5} fill="#7A4A21" />
          <rect x={-30} y={-96} width={60} height={32} rx={8} fill="#A8662B" />
        </g>
      )}
    </g>
  );

  const ghosts =
    trail > 0
      ? [1, 2, 3].map((k) =>
          renderArm(angle - k * trail * 20, (trail * 0.4) / k, `ghost-${k}`)
        )
      : null;

  return (
    <CharacterFrame x={x} y={y} scale={scale} flip={flip} appearAtSec={appearAtSec}>
      {/* shadow */}
      <ellipse cx={200} cy={622} rx={100} ry={14} fill="#000" opacity={0.3} />

      {/* legs */}
      <rect x={158} y={450} width={34} height={150} rx={14} fill={C.pants} />
      <rect x={208} y={450} width={34} height={150} rx={14} fill={C.pants} />
      <ellipse cx={170} cy={604} rx={30} ry={13} fill={C.ink} />
      <ellipse cx={232} cy={604} rx={30} ry={13} fill={C.ink} />

      {/* torso (twist) */}
      <g transform={`translate(200 0) scale(${s} 1) translate(-200 0)`}>
        <rect x={138} y={250} width={124} height={215} rx={52} fill={C.red} />
        <path d="M172 252 L200 288 L228 252 Z" fill={C.offWhite} />
        {Math.abs(twist) > 0.05 && (
          <path
            d="M160 330 Q200 350 240 330"
            stroke="#fff"
            strokeWidth={4}
            fill="none"
            opacity={0.35}
          />
        )}
      </g>

      {/* back arm (resting) */}
      <line x1={142} y1={300} x2={128} y2={420} stroke={C.red} strokeWidth={34} strokeLinecap="round" />
      <circle cx={126} cy={430} r={20} fill={C.skin} />

      {/* head */}
      <g>
        <circle cx={200} cy={170} r={78} fill={C.skin} />
        <circle cx={125} cy={176} r={14} fill={C.skin} />
        <circle cx={275} cy={176} r={14} fill={C.skin} />
        {/* hair */}
        <path
          d="M124 150 Q130 82 200 86 Q272 82 276 150 Q250 112 200 118 Q150 112 124 150 Z"
          fill={C.hair}
        />
        {/* glasses */}
        <circle cx={172} cy={172} r={25} fill="#fff" fillOpacity={0.18} stroke={C.ink} strokeWidth={5} />
        <circle cx={230} cy={172} r={25} fill="#fff" fillOpacity={0.18} stroke={C.ink} strokeWidth={5} />
        <line x1={197} y1={172} x2={205} y2={172} stroke={C.ink} strokeWidth={5} />
        {smirk && (
          <>
            <line x1={160} y1={160} x2={174} y2={150} stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
            <line x1={218} y1={160} x2={232} y2={150} stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
          </>
        )}
        {/* eyes behind glasses */}
        {blinking ? (
          <>
            <line x1={162} y1={174} x2={182} y2={174} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
            <line x1={220} y1={174} x2={240} y2={174} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={178} cy={174} r={7} fill={C.ink} />
            <circle cx={236} cy={174} r={7} fill={C.ink} />
          </>
        )}
        {/* brows: one raised for smug */}
        <line x1={150} y1={138} x2={190} y2={140} stroke={C.hair} strokeWidth={7} strokeLinecap="round" />
        <line x1={214} y1={smirk ? 124 : 138} x2={254} y2={smirk ? 130 : 140} stroke={C.hair} strokeWidth={7} strokeLinecap="round" />
        {/* mouth */}
        <path
          d={smirk ? "M168 214 Q205 244 242 202" : "M175 216 Q205 228 235 210"}
          stroke={C.ink}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        {/* judge wig */}
        {judge && (
          <g fill="#F4F0E8" stroke="#CFC8BA" strokeWidth={3}>
            {[
              [140, 108], [168, 90], [200, 84], [232, 90], [260, 108],
              [122, 150], [278, 150], [118, 190], [282, 190],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={24} />
            ))}
          </g>
        )}
      </g>

      {/* swing arm (+ motion trail ghosts) */}
      {ghosts}
      {renderArm(angle, 1, "arm")}

      {/* water drops falling from a wet hand */}
      {wet &&
        [0, 1, 2].map((k) => {
          const p = ((frame * 3 + k * 25) % 75) / 75;
          return (
            <ellipse
              key={k}
              cx={hand.x + (k - 1) * 16}
              cy={hand.y + 30 + p * 70}
              rx={5}
              ry={8}
              fill={C.water}
              opacity={1 - p}
            />
          );
        })}
    </CharacterFrame>
  );
};

/* ------------------------------------------------------------------ */
/* RECEIVER                                                            */
/* ------------------------------------------------------------------ */

export type ReceiverProps = {
  state?: ReceiverState;
  /** Impact amount from useImpactWobble(). Whips the head and squishes the hit cheek. */
  hit?: number;
  /** 0..1 red hand-mark on the cheek. Defaults to 0.45 after a hit, 0 before. */
  mark?: number;
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  appearAtSec?: number;
};

const EL = { x: 158, y: 215 };
const ER = { x: 242, y: 215 };

const OpenEye: React.FC<{ cx: number; cy: number; lid?: number }> = ({
  cx,
  cy,
  lid = 0,
}) => (
  <g>
    <ellipse cx={cx} cy={cy} rx={20} ry={24} fill="#fff" stroke={C.ink} strokeWidth={4} />
    <circle cx={cx + 2} cy={cy + 3} r={9} fill={C.ink} />
    {lid > 0 && (
      <>
        <rect x={cx - 23} y={cy - 27} width={46} height={54 * lid} fill={C.skinPink} />
        <line
          x1={cx - 22}
          y1={cy - 27 + 54 * lid}
          x2={cx + 22}
          y2={cy - 27 + 54 * lid}
          stroke={C.ink}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </>
    )}
  </g>
);

export const Receiver: React.FC<ReceiverProps> = ({
  state = "neutral",
  hit = 0,
  mark,
  x = SLAP_LAYOUT.receiver.x,
  y = SLAP_LAYOUT.receiver.y,
  scale = 1,
  flip = false,
  appearAtSec,
}) => {
  const frame = useCurrentFrame();

  const blinking = (frame + 55) % 110 < 4;
  const squish = Math.max(0, hit);
  const whip = hit; // can go negative on rebound
  const handMark = mark ?? (["hit", "crying", "dazed"].includes(state) ? 0.45 : 0);

  // nervous cheek jiggle while bracing
  const jiggle = state === "brace" ? 1 + 0.05 * Math.sin(frame * 0.9) : 1;

  /* arm end points per state */
  const arms: Record<ReceiverState, [[number, number], [number, number]]> = {
    neutral: [[100, 510], [300, 510]],
    unimpressed: [[100, 510], [300, 510]],
    brace: [[125, 335], [275, 335]],
    hit: [[70, 470], [330, 470]],
    crying: [[135, 355], [265, 355]],
    dazed: [[90, 505], [310, 485]],
  };
  const [aL, aR] = arms[state];

  const eyes = () => {
    if (state === "hit") {
      return (
        <g stroke={C.ink} strokeWidth={7} strokeLinecap="round">
          <line x1={EL.x - 16} y1={EL.y - 14} x2={EL.x + 16} y2={EL.y + 14} />
          <line x1={EL.x + 16} y1={EL.y - 14} x2={EL.x - 16} y2={EL.y + 14} />
          <line x1={ER.x - 16} y1={ER.y - 14} x2={ER.x + 16} y2={ER.y + 14} />
          <line x1={ER.x + 16} y1={ER.y - 14} x2={ER.x - 16} y2={ER.y + 14} />
        </g>
      );
    }
    if (state === "brace") {
      return (
        <g stroke={C.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d={`M${EL.x - 10} ${EL.y - 14} L${EL.x + 14} ${EL.y} L${EL.x - 10} ${EL.y + 14}`} />
          <path d={`M${ER.x + 10} ${ER.y - 14} L${ER.x - 14} ${ER.y} L${ER.x + 10} ${ER.y + 14}`} />
          <line x1={EL.x - 26} y1={EL.y - 38} x2={EL.x + 14} y2={EL.y - 48} />
          <line x1={ER.x + 26} y1={ER.y - 38} x2={ER.x - 14} y2={ER.y - 48} />
        </g>
      );
    }
    if (state === "crying") {
      return (
        <g>
          {[
            { c: EL, s: -1 },
            { c: ER, s: 1 },
          ].map(({ c, s }, idx) => (
            <g key={idx}>
              <ellipse cx={c.x} cy={c.y} rx={25} ry={30} fill="#fff" stroke={C.ink} strokeWidth={4} />
              <circle cx={c.x} cy={c.y + 3} r={16} fill={C.ink} />
              <circle cx={c.x - 5} cy={c.y - 4} r={5} fill="#fff" />
              <circle cx={c.x + 6} cy={c.y + 8} r={3} fill="#fff" />
              <ellipse cx={c.x} cy={c.y + 22} rx={22} ry={8} fill={C.water} opacity={0.7} />
              <line
                x1={c.x - s * 26}
                y1={c.y - 48}
                x2={c.x + s * 18}
                y2={c.y - 40 - 10}
                stroke={C.ink}
                strokeWidth={6}
                strokeLinecap="round"
                transform={`rotate(${s * -14} ${c.x} ${c.y - 44})`}
              />
              {[0, 1, 2].map((k) => {
                const p = ((frame * 5 + k * 38) % 110) / 110;
                return (
                  <ellipse
                    key={k}
                    cx={c.x + s * p * 16}
                    cy={c.y + 30 + p * 130}
                    rx={7 * (1 - 0.3 * p)}
                    ry={10 * (1 - 0.3 * p)}
                    fill={C.water}
                    opacity={1 - p}
                  />
                );
              })}
            </g>
          ))}
        </g>
      );
    }
    if (state === "dazed") {
      const spin = frame * 14;
      return (
        <g>
          {[EL, ER].map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={26} fill="#fff" stroke={C.ink} strokeWidth={4} />
              <g transform={`rotate(${i === 0 ? spin : -spin} ${c.x} ${c.y})`}>
                <path
                  d={spiralPath(c.x, c.y, 22)}
                  stroke={C.ink}
                  strokeWidth={4}
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            </g>
          ))}
        </g>
      );
    }
    // neutral / unimpressed
    if (blinking) {
      return (
        <g stroke={C.ink} strokeWidth={6} strokeLinecap="round" fill="none">
          <path d={`M${EL.x - 20} ${EL.y} Q${EL.x} ${EL.y + 8} ${EL.x + 20} ${EL.y}`} />
          <path d={`M${ER.x - 20} ${ER.y} Q${ER.x} ${ER.y + 8} ${ER.x + 20} ${ER.y}`} />
        </g>
      );
    }
    const lid = state === "unimpressed" ? 0.5 : 0;
    return (
      <g>
        <OpenEye cx={EL.x} cy={EL.y} lid={lid} />
        <OpenEye cx={ER.x} cy={ER.y} lid={lid} />
      </g>
    );
  };

  const mouth = () => {
    switch (state) {
      case "brace":
        return (
          <path
            d="M160 296 q10 -10 20 0 t20 0 t20 0 t20 0"
            stroke={C.ink}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
        );
      case "hit":
        return (
          <g>
            <ellipse cx={200} cy={302} rx={26} ry={32} fill={C.mouth} stroke={C.ink} strokeWidth={4} />
            <ellipse cx={200} cy={318} rx={15} ry={9} fill="#FF7A8A" />
          </g>
        );
      case "crying": {
        const w = Math.sin(frame * 0.9) * 6;
        return (
          <path
            d={`M165 314 Q200 ${280 + w} 235 314 Q200 336 165 314 Z`}
            fill={C.mouth}
            stroke={C.ink}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        );
      }
      case "dazed":
        return (
          <path
            d="M160 298 q10 12 20 0 t20 0 t20 0 t20 0"
            stroke={C.ink}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <line x1={178} y1={294} x2={222} y2={294} stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
        );
    }
  };

  return (
    <CharacterFrame x={x} y={y} scale={scale} flip={flip} appearAtSec={appearAtSec}>
      {/* shadow */}
      <ellipse cx={200} cy={622} rx={100} ry={14} fill="#000" opacity={0.3} />

      {/* legs */}
      <rect x={156} y={540} width={38} height={64} rx={16} fill={C.pants} />
      <rect x={206} y={540} width={38} height={64} rx={16} fill={C.pants} />
      <ellipse cx={170} cy={606} rx={30} ry={13} fill={C.ink} />
      <ellipse cx={230} cy={606} rx={30} ry={13} fill={C.ink} />

      {/* body */}
      <ellipse cx={200} cy={470} rx={90} ry={118} fill={C.blue} />

      {/* arms */}
      {[
        { from: [122, 410], to: aL },
        { from: [278, 410], to: aR },
      ].map((a, i) => (
        <g key={i}>
          <line
            x1={a.from[0]}
            y1={a.from[1]}
            x2={a.to[0]}
            y2={a.to[1]}
            stroke={C.blue}
            strokeWidth={30}
            strokeLinecap="round"
          />
          <circle cx={a.to[0]} cy={a.to[1]} r={19} fill={C.skinPink} />
        </g>
      ))}

      {/* head (whips on impact) */}
      <g transform={`translate(${whip * 18} 0) rotate(${whip * 20} 200 345)`}>
        <circle cx={92} cy={238} r={20} fill={C.skinPink} />
        <circle cx={308} cy={238} r={20} fill={C.skinPink} />
        <circle cx={200} cy={230} r={108} fill={C.skinPink} />
        {/* hair tuft */}
        <path
          d="M178 128 Q184 84 214 98 Q214 116 224 126"
          stroke={C.hair}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
        />
        {/* cheeks */}
        <g
          transform={`translate(96 270) scale(${(1 - 0.45 * squish) * jiggle} ${
            1 + 0.15 * squish
          }) translate(-96 -270)`}
        >
          <ellipse cx={130} cy={272} rx={36} ry={27} fill={C.blush} opacity={0.7} />
          {handMark > 0 && (
            <ellipse cx={130} cy={272} rx={32} ry={23} fill={C.red} opacity={handMark} />
          )}
        </g>
        <ellipse cx={270} cy={272} rx={36 * jiggle} ry={27} fill={C.blush} opacity={0.7} />

        {eyes()}
        {mouth()}

        {/* sweat drop (brace) */}
        {state === "brace" && (
          <g transform={`translate(304 ${178 + Math.sin(frame / 5) * 5})`}>
            <path d="M0 -18 Q14 4 0 14 Q-14 4 0 -18 Z" fill={C.water} stroke="#fff" strokeWidth={2} />
          </g>
        )}

        {/* orbiting stars (dazed) */}
        {state === "dazed" &&
          [0, 1, 2].map((k) => {
            const a = ((frame * 6 + k * 120) * Math.PI) / 180;
            return (
              <polygon
                key={k}
                points={star(200 + 135 * Math.cos(a), 108 + 30 * Math.sin(a), 16)}
                fill={C.gold}
                stroke="#fff"
                strokeWidth={2}
              />
            );
          })}
      </g>
    </CharacterFrame>
  );
};
