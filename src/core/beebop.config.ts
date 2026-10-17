/**
 * beebop.config.ts — FIXED. The single source of truth for Beebop's rig.
 *
 * Beebop is ONE vector character (see Beebop.tsx). There are no pose images.
 * A "gesture" is just where his two HANDS go (an IK solver bends the arms),
 * plus an expression and a little body motion. To add a gesture, add an entry
 * to GESTURES. Nothing else needs to change.
 */

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ───────────────────────── Theme ─────────────────────────
export const BEEBOP_THEME = {
  ink: "#1B1B1B",
  skin: "#F9C93B",
  skinLight: "#FFDD6E",
  band: "#4A2F1B", // abdomen stripes
  bandana: "#B98B5E",
  wing: "#BFE3F5",
  leaf: "#6DA544",
  sticker: "#F4EFE6", // off-white outline so he pops on dark backgrounds
  hand: "#FBF6EA",
  mouth: "#4A1F1F",
  tongue: "#E8667A",
  blush: "#F28B6B",
} as const;

// ───────────────────────── Rig geometry (rig units, 400 x 700) ─────────────────────────
export const RIG = {
  width: 400,
  height: 700,
  feetY: 660, // y of the ground line inside the rig
  shoulders: { left: { x: 174, y: 352 }, right: { x: 226, y: 352 } }, // "left" = viewer's left
  upperArm: 70,
  foreArm: 70,
} as const;

// ───────────────────────── Hands ─────────────────────────
export type HandShape = "open" | "point" | "fist";
export type Hand = {
  x: number; // target in rig units. Out of reach? The arm just straightens.
  y: number;
  shape: HandShape;
  /** Elbow direction. -1 = elbow points outward/back (arm hanging, hand on hip), +1 = elbow points down/in (raised arm). */
  bend: number;
  /** 0..1 waving amplitude */
  wave: number;
};
export type Hands = { left: Hand; right: Hand };

const h = (x: number, y: number, shape: HandShape = "open", bend = -1, wave = 0): Hand => ({
  x,
  y,
  shape,
  bend,
  wave,
});

// ───────────────────────── Expressions ─────────────────────────
export type ExpressionName =
  | "neutral"
  | "happy"
  | "joy"
  | "thinking"
  | "surprised"
  | "sad"
  | "determined";

export type Mouth = "smile" | "grin" | "flat" | "frown" | "o" | "side";

export type ExprState = {
  browL: { y: number; rot: number };
  browR: { y: number; rot: number };
  eye: number; // eye scale
  lookX: number; // -1..1
  lookY: number; // -1..1
  tilt: number; // head tilt, degrees
  cheeks: number; // 0..1 blush
};
export type Expression = { state: ExprState; eyes: "round" | "arc"; mouth: Mouth };

const S = (p: Partial<ExprState>): ExprState => ({
  browL: { y: 0, rot: 0 },
  browR: { y: 0, rot: 0 },
  eye: 1,
  lookX: 0,
  lookY: 0,
  tilt: 0,
  cheeks: 0.2,
  ...p,
});

export const EXPRESSIONS: Record<ExpressionName, Expression> = {
  neutral: { eyes: "round", mouth: "smile", state: S({ cheeks: 0 }) },
  happy: {
    eyes: "round",
    mouth: "smile",
    state: S({ browL: { y: -3, rot: 0 }, browR: { y: -3, rot: 0 }, cheeks: 0.6 }),
  },
  joy: {
    eyes: "arc",
    mouth: "grin",
    state: S({ browL: { y: -9, rot: 6 }, browR: { y: -9, rot: -6 }, tilt: 4, cheeks: 1 }),
  },
  thinking: {
    eyes: "round",
    mouth: "side",
    state: S({
      browL: { y: -10, rot: -10 },
      browR: { y: 3, rot: 8 },
      lookX: 0.7,
      lookY: -0.8,
      tilt: -7,
      cheeks: 0.1,
    }),
  },
  surprised: {
    eyes: "round",
    mouth: "o",
    state: S({ browL: { y: -15, rot: -4 }, browR: { y: -15, rot: 4 }, eye: 1.1, cheeks: 0.3 }),
  },
  sad: {
    eyes: "round",
    mouth: "frown",
    state: S({ browL: { y: -2, rot: -14 }, browR: { y: -2, rot: 14 }, lookY: 0.5, tilt: -4, cheeks: 0 }),
  },
  determined: {
    eyes: "round",
    mouth: "flat",
    state: S({ browL: { y: 3, rot: 12 }, browR: { y: 3, rot: -12 }, cheeks: 0 }),
  },
};

export type RigExpression = Expression;

/** Blend two expressions. Numbers glide; discrete parts (eye style, mouth) switch at the midpoint. */
export function blendExpression(a: ExpressionName, b: ExpressionName, t: number): RigExpression {
  const A = EXPRESSIONS[a];
  const B = EXPRESSIONS[b];
  const pick = t < 0.5 ? A : B;
  return {
    eyes: pick.eyes,
    mouth: pick.mouth,
    state: {
      browL: { y: lerp(A.state.browL.y, B.state.browL.y, t), rot: lerp(A.state.browL.rot, B.state.browL.rot, t) },
      browR: { y: lerp(A.state.browR.y, B.state.browR.y, t), rot: lerp(A.state.browR.rot, B.state.browR.rot, t) },
      eye: lerp(A.state.eye, B.state.eye, t),
      lookX: lerp(A.state.lookX, B.state.lookX, t),
      lookY: lerp(A.state.lookY, B.state.lookY, t),
      tilt: lerp(A.state.tilt, B.state.tilt, t),
      cheeks: lerp(A.state.cheeks, B.state.cheeks, t),
    },
  };
}

// ───────────────────────── Mouth shapes for lip-sync ─────────────────────────
export type Viseme = "closed" | "small" | "wide" | "o" | "ee";
export const VISEMES: Record<Viseme, { w: number; h: number }> = {
  closed: { w: 18, h: 0 },
  small: { w: 15, h: 10 },
  wide: { w: 23, h: 19 },
  o: { w: 10, h: 19 },
  ee: { w: 24, h: 7 },
};

// ───────────────────────── Gestures = hand targets ─────────────────────────
export type GestureName =
  | "idle"
  | "wave"
  | "explain"
  | "think"
  | "point-left"
  | "point-right"
  | "point-up"
  | "celebrate"
  | "fly"
  | "shock";

export type Gesture = {
  hands: Hands;
  expression: ExpressionName;
  /** 0..1 how much the legs tuck up (jumping / flying) */
  tuck: number;
  /** 0..1 wing flap speed */
  flap: number;
  /** rig units he floats above the ground */
  hover: number;
  /** repeating little jumps */
  jump: boolean;
};

const G = (hands: Hands, expression: ExpressionName, extra: Partial<Gesture> = {}): Gesture => ({
  tuck: 0,
  flap: 0.15,
  hover: 0,
  jump: false,
  ...extra,
  hands,
  expression,
});

// Remember: "left"/"right" are SCREEN sides (left = viewer's left).
export const GESTURES: Record<GestureName, Gesture> = {
  idle: G({ left: h(148, 474), right: h(252, 474) }, "happy"),

  wave: G({ left: h(148, 474), right: h(312, 240, "open", 1, 1) }, "happy"),

  explain: G({ left: h(62, 400, "open", 1), right: h(338, 400, "open", 1) }, "happy"),

  think: G({ left: h(158, 428, "fist", -1), right: h(254, 318, "fist", 1) }, "thinking"),

  "point-left": G({ left: h(40, 332, "point", 1), right: h(238, 428, "fist", -1) }, "happy"),
  "point-right": G({ left: h(162, 428, "fist", -1), right: h(360, 332, "point", 1) }, "happy"),
  "point-up": G({ left: h(162, 428, "fist", -1), right: h(290, 170, "point", 1) }, "happy"),

  celebrate: G({ left: h(70, 150, "open", 1), right: h(330, 150, "open", 1) }, "joy", {
    jump: true,
    tuck: 0.6,
    flap: 0.8,
  }),

  fly: G({ left: h(104, 440, "open", -1), right: h(296, 440, "open", -1) }, "happy", {
    tuck: 0.35,
    flap: 1,
    hover: 110,
  }),

  shock: G({ left: h(122, 312, "open", 1), right: h(278, 312, "open", 1) }, "surprised"),
};

// ───────────────────────── Placement ─────────────────────────
export type Position = "left" | "center" | "right" | "hidden";
export type BeebopSize = "small" | "normal" | "large";

export const SIZE_FRAC: Record<BeebopSize, number> = { small: 0.27, normal: 0.34, large: 0.46 }; // of frame height
export const POSITION_X: Record<Exclude<Position, "hidden">, number> = { left: 0.27, center: 0.5, right: 0.73 }; // of frame width
export const FEET_Y_FRAC = 0.65; // ground line, as a fraction of frame height (keeps him clear of the captions)

/** What a scene says about Beebop. This is all an AI has to write per scene. */
export type BeebopScene = {
  gesture: GestureName;
  position: Position;
  size?: BeebopSize;
  /** override the gesture's default expression */
  expression?: ExpressionName;
  /**
   * Point at a spot on the screen (0..1 of width / height). Use with a point-* gesture:
   * the correct arm and angle are computed automatically, so Beebop points AT the prop.
   */
  pointAt?: { x: number; y: number };
};
