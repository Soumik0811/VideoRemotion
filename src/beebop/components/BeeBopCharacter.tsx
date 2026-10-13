import React, {useId} from 'react';
import {BeebopCue, BeebopExpression, BeebopLook, BeebopPose} from '../types';

/**
 * BeeBop — all-vector, shape-only bee mascot ported from the approved character sheet.
 * Rendered as a positioned <g> so it composes inside the single StoryWorld SVG + CameraRig.
 * The provided standalone design drew into a 440x550 box (head center 220,216; feet baseline 518);
 * here (x, y) is the FEET CENTER and `scale` sizes the whole box. All motion is frame-driven.
 */
const C = {
  ink: '#30201D',
  gold: '#FFD04A',
  goldLight: '#FFE077',
  brown: '#513024',
  wing: '#D6F2FF',
  wingVein: '#8BC0D7',
  scarf: '#B88954',
  scarfLight: '#E1B677',
  blush: '#FFA875',
};

const BODY_PATH =
  'M175 313 C155 322 147 352 152 389 C156 422 181 449 220 457 C259 449 284 422 289 389 C295 352 285 322 265 313 Z';

const ARMS: Record<BeebopPose, {left: string; right: string; lHand: [number, number]; rHand: [number, number]}> = {
  idle:    {left: 'M166 347 Q129 360 118 405', right: 'M274 347 Q311 361 323 405', lHand: [118, 408], rHand: [323, 408]},
  wave:    {left: 'M166 347 Q130 359 118 405', right: 'M275 345 Q337 325 360 244 Q370 198 374 163', lHand: [118, 408], rHand: [374, 163]},
  point:   {left: 'M166 347 Q130 359 118 405', right: 'M276 345 Q329 337 387 334', lHand: [118, 408], rHand: [387, 334]},
  explain: {left: 'M166 347 Q119 362 87 342',  right: 'M274 347 Q318 362 356 339', lHand: [87, 342], rHand: [356, 339]},
  think:   {left: 'M166 347 Q131 360 117 408', right: 'M276 347 Q311 329 306 284', lHand: [117, 408], rHand: [306, 284]},
  fly:     {left: 'M166 347 Q118 359 91 374',  right: 'M274 347 Q324 354 352 374', lHand: [91, 374], rHand: [352, 374]},
};

export const BeeBopCharacter: React.FC<{
  t: number;
  x?: number;
  y?: number;
  scale?: number;
  pose?: BeebopPose;
  expression?: BeebopExpression;
  look?: BeebopLook;
  talking?: boolean;
  actions?: BeebopCue[];
}> = ({t, x = 0, y = 0, scale = 1, pose = 'idle', expression = 'happy', look = 'center', talking = false, actions = []}) => {
  const uid = useId().replace(/:/g, '');

  // Resolve the current state from the latest active cue (at <= t). Poses are discrete SVG paths,
  // so we step between them rather than morph geometry.
  let curPose: BeebopPose = pose;
  let curExpr: BeebopExpression = expression;
  let curLook: BeebopLook = look;
  let curTalking = talking;
  for (const cue of actions) {
    if (t >= cue.at) {
      if (cue.pose) curPose = cue.pose;
      if (cue.expression) curExpr = cue.expression;
      if (cue.look) curLook = cue.look;
      if (cue.talking !== undefined) curTalking = cue.talking;
    }
  }

  const frame = t * 30;
  const bob = Math.sin(frame * 0.11) * (curPose === 'fly' ? 9 : 3);
  const wingAngle = Math.sin(frame * 0.72) * 13;
  const blink = Math.floor(frame) % 113 >= 109 && Math.floor(frame) % 113 <= 111;
  const mouthPulse = curTalking && Math.floor(frame / 5) % 2 === 0;
  const pupilShift = curLook === 'left' ? -8 : curLook === 'right' ? 8 : 0;
  const hoverTilt = curPose === 'fly' ? Math.sin(frame * 0.06) * 5 : 0;
  const waveTilt = curPose === 'wave' ? Math.sin(frame * 0.32) * 11 : 0;
  const stroke = {stroke: C.ink, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  const arms = ARMS[curPose];

  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) translate(-220 -518)`}>
      <defs>
        <clipPath id={`${uid}-body`}>
          <path d={BODY_PATH} />
        </clipPath>
      </defs>
      <g transform={`translate(0 ${bob.toFixed(2)}) rotate(${hoverTilt.toFixed(2)} 220 310)`}>
        {/* Four pale-blue wings behind the mascot, two animated pairs. */}
        <g transform={`rotate(${-wingAngle} 157 326)`}>
          <path d="M156 333 C115 276 58 275 56 315 C54 348 108 367 157 345 Z" fill={C.wing} stroke={C.ink} strokeWidth="4" />
          <path d="M146 334 Q106 316 80 314" fill="none" stroke={C.wingVein} strokeWidth="3" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${wingAngle} 283 326)`}>
          <path d="M284 333 C325 276 382 275 384 315 C386 348 332 367 283 345 Z" fill={C.wing} stroke={C.ink} strokeWidth="4" />
          <path d="M294 334 Q334 316 359 314" fill="none" stroke={C.wingVein} strokeWidth="3" strokeLinecap="round" />
        </g>
        <g transform={`rotate(${(wingAngle * 0.6).toFixed(2)} 153 352)`}>
          <path d="M152 347 C107 327 77 348 91 378 C105 400 132 380 162 365 Z" fill={C.wing} stroke={C.ink} strokeWidth="4" />
          <path d="M149 356 Q123 356 105 374" fill="none" stroke={C.wingVein} strokeWidth="3" />
        </g>
        <g transform={`rotate(${(-wingAngle * 0.6).toFixed(2)} 287 352)`}>
          <path d="M288 347 C333 327 363 348 349 378 C335 400 308 380 278 365 Z" fill={C.wing} stroke={C.ink} strokeWidth="4" />
          <path d="M291 356 Q317 356 335 374" fill="none" stroke={C.wingVein} strokeWidth="3" />
        </g>

        {/* Legs and oval feet. */}
        <path d="M188 432 Q184 466 184 506 M251 432 Q255 466 257 506" stroke={C.ink} strokeWidth="9" strokeLinecap="round" fill="none" />
        <ellipse cx="167" cy="509" rx="29" ry="9" fill={C.ink} />
        <ellipse cx="276" cy="509" rx="29" ry="9" fill={C.ink} />

        {/* Small striped abdomen. */}
        <path d={BODY_PATH} fill={C.gold} {...stroke} />
        <g clipPath={`url(#${uid}-body)`}>
          <path d="M145 361 Q220 381 295 361 L295 385 Q220 405 145 385 Z" fill={C.brown} />
          <path d="M145 412 Q220 435 295 412 L295 441 Q220 461 145 441 Z" fill={C.brown} />
        </g>

        {/* Arms as rounded pen strokes; simple poses avoid hand-artifact issues. */}
        <path d={arms.left} fill="none" stroke={C.ink} strokeWidth="10" strokeLinecap="round" />
        <g transform={curPose === 'wave' ? `rotate(${waveTilt.toFixed(2)} 275 345)` : undefined}>
          <path d={arms.right} fill="none" stroke={C.ink} strokeWidth="10" strokeLinecap="round" />
          <ellipse cx={arms.rHand[0]} cy={arms.rHand[1]} rx={curPose === 'point' ? 9 : 12} ry={curPose === 'point' ? 7 : 13} fill={C.ink} />
          {curPose === 'point' && <path d="M387 332 L415 321" stroke={C.ink} strokeWidth="8" strokeLinecap="round" />}
          {curPose === 'wave' && <path d="M370 149 L360 132 M384 153 L395 133 M389 169 L408 165" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />}
        </g>
        <ellipse cx={arms.lHand[0]} cy={arms.lHand[1]} rx="11" ry="13" fill={C.ink} />

        {/* Antennae behind the face. */}
        <path d="M181 119 Q168 66 139 62 M258 119 Q276 64 310 61" fill="none" stroke={C.ink} strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="135" cy="60" rx="13" ry="9" transform="rotate(24 135 60)" fill={C.brown} stroke={C.ink} strokeWidth="3" />
        <ellipse cx="314" cy="60" rx="13" ry="9" transform="rotate(-24 314 60)" fill={C.brown} stroke={C.ink} strokeWidth="3" />

        {/* Giant round golden head. */}
        <circle cx="220" cy="216" r="126" fill={C.gold} {...stroke} />
        <path d="M151 134 Q177 113 198 116" fill="none" stroke={C.goldLight} strokeWidth="13" strokeLinecap="round" opacity="0.65" />

        {/* Brows carry the emotion even when the mouth is closed. */}
        {curExpr === 'angry' ? (
          <g stroke={C.ink} strokeWidth="6" strokeLinecap="round"><path d="M142 164 L192 186" /><path d="M298 164 L248 186" /></g>
        ) : curExpr === 'worried' ? (
          <g stroke={C.ink} strokeWidth="5" fill="none" strokeLinecap="round"><path d="M143 174 Q165 153 188 164" /><path d="M250 164 Q273 152 297 174" /></g>
        ) : (
          <g stroke={C.ink} strokeWidth="5" fill="none" strokeLinecap="round"><path d="M145 167 Q163 151 184 160" /><path d="M257 160 Q278 151 295 167" /></g>
        )}

        {/* Eyes with controlled gaze / blink. */}
        {blink ? (
          <g fill="none" stroke={C.ink} strokeWidth="6" strokeLinecap="round">
            <path d="M132 223 Q170 248 207 223" />
            <path d="M233 223 Q270 248 307 223" />
          </g>
        ) : (
          <>
            <ellipse cx="170" cy="224" rx="43" ry="54" fill="#fffdf8" stroke={C.ink} strokeWidth="4" />
            <ellipse cx="270" cy="224" rx="43" ry="54" fill="#fffdf8" stroke={C.ink} strokeWidth="4" />
            <ellipse cx={179 + pupilShift} cy="230" rx="21" ry="29" fill={C.ink} />
            <ellipse cx={261 + pupilShift} cy="230" rx="21" ry="29" fill={C.ink} />
            <circle cx={170 + pupilShift} cy="216" r="9" fill="white" />
            <circle cx={252 + pupilShift} cy="216" r="9" fill="white" />
          </>
        )}
        <ellipse cx="128" cy="278" rx="17" ry="9" fill={C.blush} opacity="0.48" />
        <ellipse cx="313" cy="278" rx="17" ry="9" fill={C.blush} opacity="0.48" />

        {/* Emotion-specific mouth; talking animates an open/closed mouth. */}
        {curExpr === 'surprised' || mouthPulse ? (
          <ellipse cx="221" cy="290" rx="17" ry="24" fill={C.brown} stroke={C.ink} strokeWidth="3" />
        ) : curExpr === 'worried' || curExpr === 'angry' ? (
          <path d="M197 301 Q220 277 244 301" fill="none" stroke={C.ink} strokeWidth="6" strokeLinecap="round" />
        ) : curExpr === 'neutral' || (curTalking && !mouthPulse) ? (
          <path d="M209 288 Q220 296 232 288" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
        ) : (
          <>
            <path d="M190 282 Q218 294 250 282 Q250 315 221 318 Q195 318 190 282 Z" fill={C.brown} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
            <path d="M202 305 Q221 292 240 305 Q228 319 217 318 Q209 318 202 305" fill="#F57B81" />
          </>
        )}

        {/* Scarf in front of lower head/body. */}
        <path d="M160 326 Q222 352 283 327 L251 375 Q221 384 188 369 Z" fill={C.scarf} {...stroke} />
        <path d="M177 335 Q220 359 266 338 L245 358 Q218 366 194 355 Z" fill={C.scarfLight} opacity="0.58" />
        <path d="M274 334 Q308 315 319 340 Q303 343 292 352 L311 369 Q285 368 273 347 Z" fill={C.scarf} {...stroke} />
        <path d="M213 356 L221 374 L230 355" fill="none" stroke={C.ink} strokeWidth="3" opacity="0.7" />
        {curPose === 'think' && (
          <>
            <path d="M316 373 Q345 330 303 304" fill="none" stroke={C.ink} strokeWidth="9" strokeLinecap="round" />
            <ellipse cx="301" cy="304" rx="12" ry="12" fill={C.ink} />
          </>
        )}
      </g>
    </g>
  );
};

export default BeeBopCharacter;
