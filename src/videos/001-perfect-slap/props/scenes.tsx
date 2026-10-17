import type {Scene} from '../../../core/types';
import {SpotlightBg, BlueprintGridBg, WaterBg, CourtroomBg, SpeedLinesBg} from '../backgrounds/SlapBackgrounds';
import {Slapper, Receiver, SLAP_LAYOUT, useSwingProgress, useImpactWobble} from './Characters';
import {Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import React from 'react';

/**
 * TEXT LANES (fraction of the 1920px frame height). Everything is horizontally centered.
 *   Title zone     0%  - 22%   (core TopTitle, do not use)
 *   L1            26%          stamps / headline text, just under the title
 *   L2            33%          secondary text (sound waves), above the characters' heads
 *   Characters    35%  - 69%
 *   Caption       68%  - 72%   (core Captions, do not use)
 *   MID           42%          big formulas in scenes WITHOUT characters
 *   LOW           79%          meters, below the captions, clear of the bottom 14%
 * Rule: two things in the same lane must never be on screen at the same time.
 * Use `duration` (seconds) on a prop to remove it before the next one arrives.
 */
const L1 = '26%';
const L2 = '33%';
const MID = '42%';
const LOW = '79%';

const base: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  width: '84%',
  fontFamily: 'Arial,sans-serif',
  fontWeight: 900,
  color: '#fff3d7',
  letterSpacing: 2,
  textShadow: '0 4px 18px #000',
  textAlign: 'center',
  whiteSpace: 'pre-line',
  zIndex: 5,
};

const usePop = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - 5, fps, config: {damping: 10, stiffness: 160}});
};

const Stamp: React.FC<{text: string; color?: string; top?: string}> = ({text, color = '#e4483b', top = L1}) => {
  const s = usePop();
  return (
    <div style={{...base, top, fontSize: 56, color, transform: `translate(-50%,-50%) rotate(-4deg) scale(${s})`}}>
      {text}
    </div>
  );
};

const Formula: React.FC<{text: string; sub?: string; top?: string}> = ({text, sub, top = MID}) => {
  const s = usePop();
  return (
    <div style={{...base, top, fontSize: 58, color: '#9deaff', transform: `translate(-50%,-50%) scale(${s})`}}>
      {text}
      {sub && <div style={{fontSize: 19, color: '#f5e6b8', marginTop: 10, letterSpacing: 1}}>{sub}</div>}
    </div>
  );
};

const Meter: React.FC<{title: string; value: number; max?: number; top?: string}> = ({title, value, max = 100, top = LOW}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 24], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        ...base,
        top,
        width: '56%',
        boxSizing: 'border-box',
        fontSize: 25,
        padding: '10px 14px',
        border: '2px solid #fff8',
        borderRadius: 18,
        background: '#121820dd',
        transform: 'translate(-50%,-50%)',
      }}
    >
      {title}
      <div style={{height: 18, marginTop: 8, borderRadius: 20, background: '#ffffff30', overflow: 'hidden'}}>
        <div style={{width: `${Math.min(100, (value / max) * 100) * k}%`, height: '100%', background: '#ff6557'}} />
      </div>
    </div>
  );
};

const Wave: React.FC<{big?: boolean; top?: string}> = ({big, top = L2}) => (
  <div style={{...base, top, fontSize: big ? 82 : 28, color: '#ffcf74', transform: 'translate(-50%,-50%)'}}>〰〰〰</div>
);

const Ring: React.FC = () => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 24], [0.4, 2.4], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: '53%',
        top: '46%',
        width: 180,
        height: 180,
        border: '8px solid #ffe49a',
        borderRadius: '50%',
        transform: `translate(-50%,-50%) scale(${s})`,
        opacity: Math.max(0, 1 - f / 27),
      }}
    />
  );
};

const Sfx: React.FC<{file: string; at?: number}> = ({file}) => (
  <Audio src={staticFile(`videos/001-perfect-slap/sfx/${file}`)} startFrom={0} volume={0.45} />
);

/** Static pair of characters. `noSlap` hides the Slapper (used for the Receiver close-up). */
const Cast: React.FC<{slap?: any; recv?: any; noSlap?: boolean}> = ({slap = {}, recv = {}, noSlap}) => (
  <>
    {!noSlap && <Slapper x={SLAP_LAYOUT.slapper.x} y={SLAP_LAYOUT.slapper.y} {...slap} />}
    <Receiver x={SLAP_LAYOUT.receiver.x} y={SLAP_LAYOUT.receiver.y} {...recv} />
  </>
);

const SlapAction: React.FC<{impact: number; speed?: boolean}> = ({impact, speed}) => {
  const swing = useSwingProgress(0.5, 1);
  const hit = useImpactWobble(impact);
  return (
    <>
      <Slapper
        x={SLAP_LAYOUT.slapper.x}
        y={SLAP_LAYOUT.slapper.y}
        pose="windup"
        swing={swing}
        limp={!speed}
        trail={speed ? 1 : 0}
        twist={swing < 0.5 ? -0.7 : 0.5}
      />
      <Receiver
        x={SLAP_LAYOUT.receiver.x}
        y={SLAP_LAYOUT.receiver.y}
        state={useCurrentFrame() / 30 >= impact ? 'hit' : 'unimpressed'}
        hit={hit}
      />
    </>
  );
};

const LoopEnd: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 300], [0, 1], {extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', inset: 0, opacity: k, background: '#15151b'}} />;
};

export const scenes: Scene[] = [
  // 1. Hook: limp slap. Cast only holds the first 0.25s, then SlapAction takes over (no duplicate characters).
  {start: 0, end: 2.5, background: SpotlightBg, beebop: {gesture: 'shock', position: 'right', size: 'small', expression: 'surprised'}, props: [
    {component: Cast, at: 0, duration: 0.25, props: {slap: {pose: 'windup'}, recv: {state: 'unimpressed'}}},
    {component: SlapAction, at: 0.25, props: {impact: 1.55}},
    {component: Stamp, at: 1.55, props: {text: 'NOT ANGER'}},
    {component: Sfx, at: 1.45, props: {file: 'limp-tap.wav'}},
  ]},
  // 2. Physics stamp
  {start: 2.5, end: 5.76, background: BlueprintGridBg, beebop: {gesture: 'think', position: 'left', size: 'small'}, props: [
    {component: Cast, at: 2.5, props: {slap: {pose: 'smirk'}, recv: {state: 'unimpressed'}}},
    {component: Stamp, at: 3.36, props: {text: 'PHYSICS', color: '#52c7ee'}},
    {component: Sfx, at: 3.3, props: {file: 'pop.wav'}},
  ]},
  // 3. Angular momentum formula (no characters, so it can sit in the middle)
  {start: 5.76, end: 7.6, background: BlueprintGridBg, beebop: {gesture: 'point-left', position: 'right', size: 'small', pointAt: {x: 0.6, y: 0.4}}, props: [
    {component: Formula, at: 5.8, props: {text: 'L = I × ω', sub: 'I = INERTIA     ω = ROTATION SPEED'}},
    {component: Sfx, at: 5.9, props: {file: 'tick.wav'}},
  ]},
  // 4. Arm only vs torso: the X stamp leaves before the check arrives (same lane, never together)
  {start: 7.6, end: 11.04, background: SpotlightBg, beebop: {gesture: 'think', position: 'right', size: 'small'}, props: [
    {component: Cast, at: 7.6, props: {slap: {pose: 'windup', twist: -0.8}, recv: {state: 'neutral'}}},
    {component: Stamp, at: 8.2, duration: 1.25, props: {text: '✕ ARM ONLY'}},
    {component: Stamp, at: 9.45, props: {text: '✓ TORSO TWIST', color: '#74d89a'}},
  ]},
  // 5. Trebuchet
  {start: 11.04, end: 12.575, background: BlueprintGridBg, beebop: {gesture: 'celebrate', position: 'left', size: 'small', expression: 'joy'}, props: [
    {component: Formula, at: 11.1, props: {text: '⚙ TREBUCHET', sub: 'ROTATE. RELEASE.'}},
    {component: Sfx, at: 11.4, props: {file: 'whoosh.wav'}},
  ]},
  // 6. Chain builds downwards, each step in its own row, so nothing overlaps
  {start: 12.575, end: 17.615, background: SpeedLinesBg, beebop: {gesture: 'shock', position: 'right', size: 'small'}, props: [
    {component: Formula, at: 12.6, props: {text: 'ω ↑', top: '33%'}},
    {component: Formula, at: 13.7, props: {text: 'KE = ½ I ω² ↑', top: '45%'}},
    {component: Formula, at: 15.1, props: {text: 'REGRET ↑', sub: 'ROTATION → ENERGY → FACE', top: '57%'}},
    {component: Sfx, at: 12.7, props: {file: 'riser.wav'}},
  ]},
  // 7. Receiver close-up crying (Slapper hidden, Receiver centered)
  {start: 17.615, end: 19.215, background: SpotlightBg, beebop: {gesture: 'think', position: 'left', size: 'small', expression: 'sad'}, props: [
    {component: Cast, at: 17.62, props: {noSlap: true, recv: {state: 'crying', scale: 1.3, x: 540, y: 960}}},
    {component: Stamp, at: 17.8, props: {text: 'REGRET'}},
    {component: Sfx, at: 17.8, props: {file: 'tears.wav'}},
  ]},
  // 8. F = m x a (formula up, meter down below the captions)
  {start: 19.215, end: 21.775, background: BlueprintGridBg, beebop: {gesture: 'point-right', position: 'left', size: 'small', pointAt: {x: 0.65, y: 0.4}}, props: [
    {component: Formula, at: 19.25, props: {text: 'F = m × a', sub: 'FORCE = MASS × ACCELERATION', top: '40%'}},
    {component: Meter, at: 19.3, props: {title: 'a', value: 90}},
  ]},
  // 9. Slow vs fast. SLOW·FAST leaves before SMACK; the early Cast leaves before SlapAction (no double characters)
  {start: 21.775, end: 29.86, background: SpeedLinesBg, beebop: {gesture: 'shock', position: 'right', size: 'small', expression: 'surprised'}, props: [
    {component: Stamp, at: 22.1, duration: 3.7, props: {text: 'SLOW  ·  FAST'}},
    {component: Cast, at: 22, duration: 1.7, props: {slap: {pose: 'windup'}, recv: {state: 'unimpressed'}}},
    {component: Wave, at: 22.7, duration: 3.2, props: {}},
    {component: SlapAction, at: 23.7, props: {impact: 2.1, speed: true}},
    {component: Ring, at: 25.8, props: {}},
    {component: Stamp, at: 25.9, props: {text: 'SMACK'}},
    {component: Wave, at: 25.9, props: {big: true}},
    {component: Meter, at: 26, props: {title: 'LOUDNESS', value: 100}},
    {component: Sfx, at: 25.8, props: {file: 'smack.wav'}},
  ]},
  // 10. Wet hand
  {start: 29.86, end: 32.02, background: WaterBg, beebop: {gesture: 'point-right', position: 'left', size: 'small', pointAt: {x: 0.65, y: 0.45}}, props: [
    {component: Cast, at: 29.86, props: {slap: {pose: 'dip', wet: true}, recv: {state: 'brace'}}},
    {component: Stamp, at: 30.1, props: {text: 'WET HAND?'}},
    {component: Sfx, at: 30.1, props: {file: 'drip.wav'}},
  ]},
  // 11. Surface tension
  {start: 32.02, end: 36.1, background: WaterBg, beebop: {gesture: 'think', position: 'right', size: 'small'}, props: [
    {component: Formula, at: 32.05, props: {text: 'TEMPORARY GLUE', sub: 'SURFACE TENSION  ·  CONTACT AREA ↑', top: L1}},
    {component: Meter, at: 33.4, props: {title: 'CONTACT AREA', value: 100}},
    {component: Cast, at: 32.2, props: {slap: {wet: true, scale: 1.25}, recv: {state: 'brace', scale: 1.25}}},
    {component: Sfx, at: 32.1, props: {file: 'riser.wav'}},
  ]},
  // 12. Crack
  {start: 36.1, end: 39.331, background: WaterBg, beebop: {gesture: 'shock', position: 'left', size: 'small'}, props: [
    {component: Cast, at: 36.1, props: {slap: {wet: true, trail: 1}, recv: {state: 'hit', hit: 1}}},
    {component: Ring, at: 38.6, props: {}},
    {component: Stamp, at: 38.65, props: {text: 'CRACK!'}},
    {component: Sfx, at: 38.65, props: {file: 'crack.wav'}},
  ]},
  // 13. Newtonian justice
  {start: 39.331, end: 42.771, background: CourtroomBg, beebop: {gesture: 'point-right', position: 'left', size: 'small', pointAt: {x: 0.65, y: 0.45}}, props: [
    {component: Cast, at: 39.34, props: {slap: {pose: 'judge'}, recv: {state: 'dazed'}}},
    {component: Formula, at: 41.17, props: {text: 'NEWTONIAN JUSTICE', top: L1}},
    {component: Sfx, at: 41.2, props: {file: 'gavel.wav'}},
  ]},
  // 14. 9.8 m/s² (no characters, so the stamp sits in the middle)
  {start: 42.771, end: 45.731, background: CourtroomBg, beebop: {gesture: 'think', position: 'right', size: 'small'}, props: [
    {component: Stamp, at: 42.8, props: {text: '9.8 m/s²', top: MID}},
    {component: Meter, at: 43.4, props: {title: 'GRAVITY', value: 9.8, max: 9.8}},
    {component: Sfx, at: 43.4, props: {file: 'tick.wav'}},
  ]},
  // 15. Spite + loop
  {start: 45.731, end: 47.386, background: SpotlightBg, beebop: {gesture: 'celebrate', position: 'right', size: 'small', expression: 'joy'}, props: [
    {component: Cast, at: 45.74, props: {slap: {pose: 'smirk'}, recv: {state: 'dazed'}}},
    {component: Meter, at: 45.75, props: {title: 'PURE SPITE', value: 100}},
    {component: LoopEnd, at: 47.2, props: {}},
  ]},
];