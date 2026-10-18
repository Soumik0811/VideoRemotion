import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Mode = 'hook'|'plate'|'approach'|'forces'|'stretch'|'spaghetti'|'twist'|'split'|'you'|'horizon'|'finale';
type Props = {mode: Mode; offsetSeconds: number};

const FPS = 30;
/** Only three text sizes inside scenes, so nothing jumps between big and small. */
const SMALL = 26;
const LABEL = 32;
const BIG = 76;
const font = (px: number) => `900 ${px}px Arial Black, sans-serif`;

const clamp = (t: number, a: number, b: number, x: number, y: number) => interpolate(t, [a, b], [x, y], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const ease = (t: number, a: number, b: number, x: number, y: number) => interpolate(t, [a, b], [x, y], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
const pop = (time: number, at: number, damping = 10, stiffness = 160) => spring({frame: Math.max(0, Math.round((time - at) * FPS)), fps: FPS, config: {damping, stiffness}});

/** Impact moments: [time, strength]. Content (not the title) shakes and settles after each one. */
const IMPACTS: Array<[number, number]> = [[4.48, 10], [17.415, 18], [20.135, 12], [32.944187, 12], [38.384, 8]];
const kick = (time: number, at: number, amp: number, dur = 0.45) => {
  const t = time - at;
  return t < 0 || t > dur ? 0 : Math.exp(-t * 9) * amp;
};

const TITLE_BANDS = [
  {start: 0, end: 5, one: 'BLACK HOLE.', two: 'SPAGHETTI?!'},
  {start: 5, end: 14, one: 'FEET FIRST.', two: 'PULLED HARD.'},
  {start: 14, end: 24, one: 'STRETCHES.', two: 'TEARS.'},
  {start: 24, end: 36, one: 'OUTSIDE: SLOW.', two: 'YOU: NORMAL.'},
  {start: 36, end: 99, one: 'NO RETURN.', two: 'NOODLE.'},
];

const Title: React.FC<{time: number; fps: number}> = ({time, fps}) => {
  const band = TITLE_BANDS.find((item) => time >= item.start && time < item.end) ?? TITLE_BANDS[0];
  const enter = spring({frame: Math.max(0, Math.round((time - band.start) * fps)), fps, config: {damping: 14, stiffness: 120}});
  const long = band.one.length > 12;
  return (
    <div style={{position: 'absolute', zIndex: 10, top: '6.1%', left: '4%', width: '92%', textAlign: 'center', fontFamily: 'Arial Black, Impact, sans-serif', lineHeight: 0.98, letterSpacing: 2, textShadow: '0 5px 20px #000b', transform: `translateY(${(1 - enter) * -24}px) scale(${0.94 + enter * 0.06})`, opacity: enter}}>
      <div style={{color: '#fff8e8', fontSize: long ? 45 : 53}}>{band.one}</div>
      <div style={{color: '#ff5361', fontSize: long ? 52 : 70, marginTop: 5}}>{band.two}</div>
    </div>
  );
};

type AstronautProps = {left?: string; top?: string; width?: number; height?: number; stretch?: number; sx?: number; scale?: number; opacity?: number; rotation?: number; bob?: number; shakeX?: number; origin?: string};
const Astronaut: React.FC<AstronautProps> = ({left = '50%', top = '47%', width = 260, height = 390, stretch = 1, sx = 1, scale = 1, opacity = 1, rotation = 0, bob = 0, shakeX = 0, origin = '50% 50%'}) => (
  <div style={{position: 'absolute', left, top, width, height, zIndex: 5, opacity, transform: `translate(-50%, -50%) translate(${shakeX}px, ${bob}px) rotate(${rotation}deg) scale(${scale * sx}, ${scale * stretch})`, transformOrigin: origin, filter: 'drop-shadow(0 12px 20px #0008)'}}>
    <svg viewBox="0 0 320 480" width="100%" height="100%" overflow="visible">
      <g stroke="#20293c" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M120 302 C93 326 82 362 72 406 Q70 426 88 429 Q104 430 111 410 L139 354Z" fill="#e8eef5" />
        <path d="M198 302 C224 326 236 361 246 405 Q248 426 230 429 Q214 430 207 410 L179 354Z" fill="#e8eef5" />
        <path d="M75 401 Q69 421 79 432 Q92 441 111 429 L108 407Z" fill="#ffb35d" />
        <path d="M243 401 Q251 421 241 432 Q227 441 208 429 L211 407Z" fill="#ffb35d" />
        <path d="M114 201 C133 184 188 183 207 202 Q226 226 218 317 Q213 351 184 366 L137 360 Q106 343 101 309 Q96 226 114 201Z" fill="#edf3f7" />
        <path d="M109 225 Q72 228 62 273 L52 319 Q49 336 65 341 Q81 345 87 328 L113 288Z" fill="#f8fafb" />
        <path d="M211 225 Q248 228 258 273 L268 319 Q271 336 255 341 Q239 345 233 328 L207 288Z" fill="#f8fafb" />
        <path d="M66 313 Q49 322 52 339 Q57 354 78 349 L91 333Z" fill="#ffb35d" />
        <path d="M254 313 Q271 322 268 339 Q263 354 242 349 L229 333Z" fill="#ffb35d" />
        <ellipse cx="160" cy="132" rx="91" ry="91" fill="#dce8f1" />
        <ellipse cx="160" cy="133" rx="69" ry="67" fill="#182338" stroke="#8aa1b5" strokeWidth="8" />
        <path d="M115 127 Q157 85 207 110" fill="none" stroke="#a6e5f3" strokeWidth="8" opacity="0.52" />
        <path d="M108 247 Q160 261 212 247" fill="none" stroke="#8ea2b5" strokeWidth="8" />
        <rect x="143" y="286" width="34" height="26" rx="9" fill="#ff786d" stroke="none" />
        <circle cx="125" cy="316" r="8" fill="#93d8ec" stroke="none" />
        <circle cx="195" cy="316" r="8" fill="#93d8ec" stroke="none" />
        <path d="M104 75 Q83 50 99 37 Q115 29 127 53 M215 76 Q238 52 224 39 Q209 30 196 54" fill="none" stroke="#f7fafc" strokeWidth="9" />
      </g>
    </svg>
  </div>
);

const Fork: React.FC<{left?: string; top?: string; size?: number; tilt?: number}> = ({left = '62%', top = '39%', size = 112, tilt = 16}) => (
  <div style={{position: 'absolute', left, top, width: size, height: size * 1.55, zIndex: 6, transform: `translate(-50%, -50%) rotate(${tilt}deg)`, filter: 'drop-shadow(0 8px 12px #0008)'}}>
    <svg viewBox="0 0 120 190" width="100%" height="100%">
      <path d="M59 50 C33 26 33 13 43 11 C52 9 60 32 60 43 C59 25 63 8 73 10 C84 12 74 36 64 49 M60 49 C57 92 61 130 64 179" fill="none" stroke="#d8e6f3" strokeWidth="8" strokeLinecap="round" />
      <path d="M60 52 C48 38 39 30 32 34" fill="none" stroke="#ffcf78" strokeWidth="7" strokeLinecap="round" />
      <path d="M58 56 Q40 67 53 75 Q66 81 72 66 Q79 50 91 60 Q101 68 86 78" fill="none" stroke="#f4c66a" strokeWidth="5" strokeLinecap="round" />
    </svg>
  </div>
);

const Plate: React.FC<{time: number; crossed: boolean}> = ({time, crossed}) => {
  const drop = pop(time, 2.96, 8, 155);
  const y = interpolate(drop, [0, 1], [-210, 0]);
  const wob = time > 2.96 ? 1 + 0.035 * Math.sin(Math.max(0, time - 2.96) * 18) : 1;
  const slam = pop(time, 4.48, 9, 190);
  return <div style={{position: 'absolute', left: '76%', top: '47%', width: 218, height: 145, zIndex: 7, opacity: Math.min(1, drop), transform: `translate(-50%, ${y}px) scale(${wob}) rotate(-5deg)`}}>
    <svg viewBox="0 0 250 160" width="100%" height="100%">
      <ellipse cx="125" cy="111" rx="111" ry="34" fill="#dae8f1" stroke="#74859b" strokeWidth="8" />
      <ellipse cx="125" cy="99" rx="76" ry="24" fill="#f4eee0" stroke="#fff" strokeWidth="5" />
      <path d="M73 91 Q99 65 126 91 Q153 114 180 86 M80 98 Q102 118 129 93 Q153 71 174 99 M86 81 Q109 103 137 80 Q153 67 169 77" fill="none" stroke="#e9a84f" strokeWidth="7" strokeLinecap="round" />
      {crossed && <g opacity={Math.min(1, slam * 2)} transform={`translate(125 92) rotate(-8) scale(${2.4 - 1.4 * slam}) translate(-125 -92)`}><path d="M86 54 L163 127 M163 54 L86 127" stroke="#ff4657" strokeWidth="17" strokeLinecap="round" /><path d="M86 54 L163 127 M163 54 L86 127" stroke="#fff1e6" strokeWidth="4" strokeLinecap="round" /></g>}
    </svg>
  </div>;
};

const Clock: React.FC<{left: string; top: string; size?: number; speed?: number; time: number; tone?: string}> = ({left, top, size = 118, speed = 1, time, tone = '#8fd9ee'}) => {
  const rotation = time * speed * 210;
  return <div style={{position: 'absolute', left, top, width: size, height: size, transform: 'translate(-50%, -50%)', zIndex: 7}}>
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <circle cx="60" cy="60" r="50" fill="#11192c" stroke={tone} strokeWidth="5" />
      {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => <line key={i} x1="60" y1="15" x2="60" y2="23" stroke="#e7f1ff" strokeWidth="3" transform={`rotate(${i * 30} 60 60)`} />)}
      <path d="M60 60 L60 31" stroke="#f4f0de" strokeWidth="5" strokeLinecap="round" transform={`rotate(${rotation} 60 60)`} />
      <path d="M60 60 L83 65" stroke="#ff6672" strokeWidth="4" strokeLinecap="round" transform={`rotate(${rotation * 0.12} 60 60)`} />
      <circle cx="60" cy="60" r="5" fill="#ffcb73" />
    </svg>
  </div>;
};

const Arrow: React.FC<{x: number; y: number; height: number; color: string; width?: number; label: string; time: number}> = ({x, y, height, color, width = 12, label, time}) => (
  <div style={{position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 6, width: 170, height, transform: `translateX(-50%) scale(${1 + 0.04 * Math.sin(time * 11)})`, transformOrigin: '50% 0%', color, fontFamily: 'Arial Black, sans-serif', fontSize: LABEL, textAlign: 'center', textShadow: '0 2px 10px #000'}}>
    <div>{label}</div>
    <svg viewBox="0 0 80 300" width="80" height="calc(100% - 38px)" preserveAspectRatio="none">
      <path d="M40 10 L40 260 M14 233 L40 272 L66 233" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const ClockPanel: React.FC<{left: string; title: string; subtitle: string; time: number; fast: boolean; fade: number; trail: number; enter: number; dir: number}> = ({left, title, subtitle, time, fast, fade, trail, enter, dir}) => (
  <div style={{position: 'absolute', left, top: '39%', width: '42%', height: '25%', transform: `translateX(-50%) translateX(${(1 - enter) * dir * 260}px)`, opacity: Math.min(1, enter * 1.5), zIndex: 5, borderRadius: 22, background: 'linear-gradient(145deg, #10192bdc, #131a2ab8)', border: `2px solid ${fast ? '#58d7ee88' : '#ff9a7288'}`, boxShadow: `0 10px 30px #0007, 0 0 ${fast ? 18 + 10 * Math.sin(time * 14) : 0}px #58d7ee55`}}>
    <div style={{position: 'absolute', top: 14, width: '100%', textAlign: 'center', fontFamily: 'Arial Black, sans-serif', color: fast ? '#87e8f4' : '#ffc099', fontSize: LABEL, letterSpacing: 2}}>{title}</div>
    <div style={{position: 'absolute', top: 56, width: '100%', textAlign: 'center', fontFamily: 'Arial,sans-serif', color: '#dbe5f1', fontSize: SMALL, letterSpacing: 2}}>{subtitle}</div>
    {!fast && <div style={{position: 'absolute', left: '7%', top: '54%', width: `${25 + trail * 28}%`, height: 4, borderRadius: 4, background: 'linear-gradient(90deg, transparent, #ffae7a88)'}} />}
    <Astronaut left={fast ? '61%' : `${ease(time, 23.735, 28.3, 54, 69)}%`} top="57%" width={118} height={174} stretch={fast ? 1 : 1.04} opacity={fast ? 1 : fade} rotation={fast ? -5 : -12} bob={fast ? Math.sin(time * 9) * 6 : Math.sin(time * 1.5) * 2} />
    <Clock left="50%" top="91%" size={80} speed={fast ? 6 : 0.28} time={time} tone={fast ? '#64ddec' : '#ffa778'} />
  </div>
);

const FormulaBuilder: React.FC<{time: number}> = ({time}) => {
  const letters = Array.from('SPAGHETTIFICATION');
  const pulse = 0.55 + 0.45 * Math.sin(time * 18);
  return <div style={{position: 'absolute', left: '50%', top: '36%', width: '90%', transform: 'translateX(-50%)', zIndex: 8, textAlign: 'center'}}>
    <svg viewBox="0 0 850 170" width="88%" height="125" style={{position: 'absolute', left: '6%', top: -31, opacity: 0.35 + pulse * 0.25}}>
      <path d="M60 85 Q120 8 180 85 T300 85 T420 85 T540 85 T660 85 T780 85" fill="none" stroke="#ffba66" strokeWidth="8" />
      <path d="M28 85 Q100 38 172 85 T316 85 T460 85 T604 85 T748 85 T820 85" fill="none" stroke="#8ae6f3" strokeWidth="4" />
      <path d="M90 85 Q142 53 194 85 T298 85 T402 85 T506 85 T610 85 T714 85" fill="none" stroke="#ffa45c" strokeWidth="3" />
    </svg>
    <div style={{position: 'relative', display: 'inline-block', padding: '16px 22px', borderRadius: 15, background: '#0b1124dd', border: '1px solid #89dff377', color: '#fff3db', font: font(40), letterSpacing: 1, textShadow: '0 0 18px #56deed66'}}>
      {letters.map((letter, index) => {
        const p = pop(time, 20.135 + index / 25, 12, 220);
        return <span key={index} style={{display: 'inline-block', color: index % 3 === 0 ? '#ffd17c' : '#fff3db', transform: `translateY(${(1 - p) * 26}px) scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 1.5)}}>{letter}</span>;
      })}
    </div>
  </div>;
};

const Shockwave: React.FC<{time: number; start: number; top?: string; color?: string; size?: number}> = ({time, start, top = '48%', color = '#ff806c', size = 270}) => {
  const scale = clamp(time, start, start + 0.55, 0.3, 2.5);
  const opacity = clamp(time, start, start + 0.55, 0.9, 0);
  return <div style={{position: 'absolute', left: '50%', top, width: size, height: size, border: `8px solid ${color}`, borderRadius: '50%', boxShadow: `0 0 35px ${color}`, transform: `translate(-50%, -50%) scale(${scale})`, opacity, zIndex: 6}} />;
};

/** Short vertical streaks falling toward the hole; gives strain / speed to a hovering astronaut. */
const StrainLines: React.FC<{time: number; intensity: number}> = ({time, intensity}) => (
  <div style={{position: 'absolute', inset: 0, zIndex: 3, opacity: intensity}}>
    {[12, 22, 31, 69, 78, 88].map((x, i) => {
      const y = 520 + ((time * (520 + i * 60) + i * 190) % 760);
      return <div key={x} style={{position: 'absolute', left: `${x}%`, top: y, width: 4, height: 90 + i * 10, borderRadius: 4, background: 'linear-gradient(180deg, transparent, #bcd8ff99)', opacity: 0.55}} />;
    })}
  </div>
);

/** Slow rings drifting out of the hole: the "something is off" beat for the twist. */
const Ripples: React.FC<{time: number}> = ({time}) => <>
  {[0, 1, 2].map((i) => {
    const p = (time * 0.7 + i / 3) % 1;
    return <div key={i} style={{position: 'absolute', left: '50%', top: '54.6%', width: 475, height: 475, boxSizing: 'border-box', borderRadius: '50%', border: '3px solid #b9a4ff', transform: `translate(-50%, -50%) scale(${0.45 + p})`, opacity: (1 - p) * 0.55, zIndex: 3}} />;
  })}
</>;

const Confetti: React.FC<{time: number}> = ({time}) => {
  const bits = [
    [11, 35, '#ff6471'], [22, 31, '#ffd16e'], [34, 38, '#79dced'], [46, 30, '#c38cff'], [60, 34, '#f1f1e8'], [73, 29, '#ff986d'], [87, 37, '#82e0c5'],
    [16, 48, '#ffc966'], [31, 51, '#ff7d79'], [70, 47, '#83dff2'], [84, 53, '#ce91ff'], [8, 58, '#7be0c3'], [92, 60, '#ffc96a'],
  ];
  const active = clamp(time, 34.224, 34.9, 0, 1);
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 8, pointerEvents: 'none', opacity: active}}>
    {bits.map(([x, y, color], i) => {
      const fall = ((time - 34.224) * (54 + i * 4)) % 720;
      const wobble = Math.sin(time * 4 + i) * 18;
      return <div key={i} style={{position: 'absolute', left: `${Number(x) + wobble / 12}%`, top: `${Number(y) + fall / 19.2}%`, width: 13, height: 24, borderRadius: 4, background: String(color), transform: `rotate(${time * 130 + i * 37}deg)`, boxShadow: `0 0 12px ${String(color)}66`}} />;
    })}
  </div>;
};

const Noodle: React.FC<{time: number; loop?: boolean}> = ({time}) => {
  const pulled = ease(time, 38.384, 38.76, 0.28, 1);
  const loopFade = clamp(time, 38.879, 39.0791836734698, 0, 1);
  const sway = Math.sin(time * 6) * 6;
  return <div style={{position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none'}}>
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <g opacity={1 - loopFade} transform={`translate(${sway} 0) skewX(${Math.sin(time * 5) * 2})`}>
        <path d="M 542 1060 C 475 1003, 634 980, 584 914 S 488 848, 562 805 S 693 755, 655 696 S 620 670, 640 634" fill="none" stroke="#cf8d39" strokeWidth={20 * pulled} strokeLinecap="round" />
        <path d="M 542 1060 C 475 1003, 634 980, 584 914 S 488 848, 562 805 S 693 755, 655 696 S 620 670, 640 634" fill="none" stroke="#ffe1a0" strokeWidth={8 * pulled} strokeLinecap="round" />
      </g>
      <g opacity={loopFade}>
        <path d="M 644 680 C 622 654 637 633 658 643 C 683 656 670 683 649 675 C 627 667 641 646 665 655 C 688 666 689 691 670 701 C 650 711 638 727 644 752" fill="none" stroke="#cf8d39" strokeWidth="20" strokeLinecap="round" />
        <path d="M 644 680 C 622 654 637 633 658 643 C 683 656 670 683 649 675 C 627 667 641 646 665 655 C 688 666 689 691 670 701 C 650 711 638 727 644 752" fill="none" stroke="#ffe1a0" strokeWidth="8" strokeLinecap="round" />
      </g>
    </svg>
    <Fork left="62%" top="37%" size={119} tilt={10 + Math.sin(time * 5) * 4} />
  </div>;
};

/** Scene-local action layer; the supplied word timestamps drive every beat. */
export const BlackHoleBeat: React.FC<Props> = ({mode, offsetSeconds}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = offsetSeconds + frame / fps;
  const bob = Math.sin(time * 4.4) * 8;
  const stretch = mode === 'stretch' ? (time < 17.415 ? clamp(time, 14, 16.855, 1, 1.76) : 0.01) : 1;
  const snap = mode === 'stretch' && time >= 17.415;
  const fading = mode === 'twist' ? clamp(time, 21.655, 23.3, 1, 0.46) : 1;
  const noReturn = time >= 32.944187;
  const horizonFlash = time >= 31.824188 ? clamp(time, 31.824188, 32.2, 1, 0.4) : 0;
  const cut = time >= 22.895 && time < 23.095;
  const power = IMPACTS.reduce((sum, [at, amp]) => sum + kick(time, at, amp), 0);
  const shakeX = Math.sin(time * 85) * power;
  const shakeY = Math.cos(time * 71) * power * 0.7;
  const enter = mode === 'hook' ? pop(time, 0.1, 9, 140) : 1;

  const hover = mode === 'hook' || mode === 'plate' || mode === 'approach' || mode === 'forces' || mode === 'twist' || mode === 'horizon';
  const hoverSize = mode === 'horizon' ? clamp(time, 30.944, 34.144, 1, 0.55) : 1;
  const hoverBase = mode === 'twist' ? [220, 330] : [260, 390];
  const hoverRotation = mode === 'twist' ? Math.sin(time * 2) * 4
    : mode === 'horizon' ? clamp(time, 30.944, 34.144, -8, 42)
    : mode === 'approach' ? clamp(time, 7.2, 10.4, -6, 12) + Math.sin(time * 3) * 3
    : mode === 'forces' ? Math.sin(time * 9) * 1.6
    : 0;
  const hoverBob = mode === 'hook' || mode === 'plate' ? bob : mode === 'forces' ? bob * 0.5 : 0;
  const hoverOpacity = mode === 'horizon' ? clamp(time, 33.5, 34.15, 1, 0.15) : fading;

  const strand = (n: number, base: number) => {
    const w = Math.sin(time * 5 + n * 1.3) * 20;
    return `M ${base + n * 18} 920 C ${300 + n * 28 + w} 827, ${590 - n * 24 - w} 768, ${472 + n * 25 + w} 679 S ${390 + n * 30 - w} 587, ${532 + n * 20 + w * 0.5} 545`;
  };

  // snap pieces: [dx, dy, rotation, pivot x, pivot y]
  const sp = pop(time, 17.415, 12, 130);
  const since = Math.max(0, time - 17.415);
  const piece = (dx: number, dy: number, rot: number, cx: number, cy: number, k: number, driftY: number) =>
    `translate(${dx * sp} ${dy * sp + since * driftY}) rotate(${rot * sp + Math.sin(since * 6 + k) * 3} ${cx} ${cy})`;

  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
    <Title time={time} fps={fps} />

    <div style={{position: 'absolute', inset: 0, transform: `translate(${shakeX}px, ${shakeY}px)`}}>

    {mode === 'approach' && <StrainLines time={time} intensity={0.35} />}
    {mode === 'stretch' && <StrainLines time={time} intensity={clamp(time, 14, 17.4, 0.2, 1)} />}
    {mode === 'twist' && <Ripples time={time} />}

    {hover && <Astronaut
      left={mode === 'hook' || mode === 'plate' ? '47%' : mode === 'twist' ? '28%' : '50%'}
      top={mode === 'approach' ? `${clamp(time, 7.2, 10.4, 43.5, 47.4)}%` : mode === 'horizon' ? `${clamp(time, 30.944, 34.144, 43.7, 57.4)}%` : '47%'}
      width={hoverBase[0] * hoverSize}
      height={hoverBase[1] * hoverSize}
      scale={enter}
      opacity={hoverOpacity}
      bob={hoverBob}
      shakeX={mode === 'forces' ? Math.sin(time * 50) * clamp(time, 10.56, 13.3, 0, 4) : 0}
      rotation={hoverRotation}
    />}

    {(mode === 'hook' || mode === 'plate') && <>
      <Fork left="62%" top="37%" size={119} tilt={10 + Math.sin(time * 6) * 5} />
      {mode === 'plate' && <Plate time={time} crossed={time >= 4.48} />}
      {mode === 'hook' && time >= 2.96 && <Plate time={time} crossed={false} />}
    </>}

    {mode === 'approach' && time >= 8.08 && <div style={{position: 'absolute', left: '50%', top: '57%', zIndex: 7, color: '#ffca73', font: font(LABEL), letterSpacing: 3, whiteSpace: 'nowrap', transform: `translate(-50%, ${(1 - pop(time, 8.08, 11, 170)) * 30}px) scale(${0.7 + 0.3 * Math.min(1, pop(time, 8.08, 11, 170))})`, textShadow: '0 3px 12px #000'}}>↓  FEET FIRST  ↓</div>}

    {mode === 'forces' && <>
      <div style={{position: 'absolute', left: '50%', top: '30%', transform: `translateX(-50%) scale(${0.8 + 0.2 * Math.min(1, pop(time, 10.7, 11, 170))})`, zIndex: 7, color: '#fff2d6', font: font(LABEL), letterSpacing: 2, whiteSpace: 'nowrap', textShadow: '0 2px 12px #000'}}>FEET  ≫  HEAD</div>
      <Arrow time={time} x={37} y={40} height={ease(time, 10.56, 12.7, 125, 288)} color="#ff5f61" width={15} label="FEET" />
      <Arrow time={time} x={65} y={42} height={ease(time, 10.56, 12.7, 80, 175)} color="#e2eaf4" width={6} label="HEAD" />
      <div style={{position: 'absolute', left: '85%', top: '40%', width: 44, height: 340, zIndex: 7, padding: 7, borderRadius: 24, background: '#11192dcc', border: '2px solid #ffffff55', transform: `translateX(${Math.sin(time * 60) * clamp(time, 12.6, 13.3, 0, 3)}px)`}}>
        <div style={{position: 'absolute', left: 12, right: 12, bottom: 11, height: `${ease(time, 10.56, 13.28, 5, 94)}%`, borderRadius: 18, background: 'linear-gradient(0deg, #ff5662, #ffbc64)', boxShadow: '0 0 22px #ff695f'}} />
        <div style={{position: 'absolute', top: -44, left: -58, width: 160, color: '#fff3da', font: `bold ${SMALL}px Arial,sans-serif`, textAlign: 'center', letterSpacing: 2, whiteSpace: 'nowrap'}}>TUG METER</div>
      </div>
    </>}

    {mode === 'stretch' && !snap && <Astronaut
      top={`${clamp(time, 13.36, 14.4, 47, 40)}%`}
      width={264}
      height={390}
      stretch={stretch}
      sx={1 / Math.sqrt(stretch)}
      origin="50% 0%"
      shakeX={Math.sin(time * 55) * clamp(time, 14, 17.4, 0, 7)}
      rotation={Math.sin(time * 8) * 2.4}
    />}
    {snap && <>
      <Shockwave time={time} start={17.415} />
      <div style={{position: 'absolute', left: '50%', top: '42%', width: 440, height: 430, transform: 'translate(-50%, -50%)', zIndex: 7}}>
        <svg viewBox="0 0 440 430" width="100%" height="100%" overflow="visible">
          <g transform={piece(0, -55, -14, 219, 70, 0, -10)}>
            <path d="M219 20 Q251 45 232 111 Q204 146 184 111 Q168 70 219 20Z" fill="#e5edf3" stroke="#20293c" strokeWidth="8" />
            <ellipse cx="213" cy="75" rx="26" ry="32" fill="#192338" stroke="#8ba0b4" strokeWidth="6" />
          </g>
          <g transform={piece(58, -5, 16, 235, 195, 2, 0)}>
            <path d="M203 142 Q241 127 265 163 L281 225 Q249 248 207 223 Q183 189 203 142Z" fill="#edf3f7" stroke="#20293c" strokeWidth="8" />
            <circle cx="287" cy="193" r="12" fill="#f6eee1" />
          </g>
          <g transform={piece(-52, 62, -20, 215, 285, 4, 14)}>
            <path d="M173 238 Q211 225 240 258 L257 314 Q226 339 187 316 Q161 283 173 238Z" fill="#edf3f7" stroke="#20293c" strokeWidth="8" />
            <circle cx="146" cy="204" r="16" fill="#f6eee1" />
          </g>
          <path d="M168 177 l22 -14 M270 244 l24 10 M190 337 l-17 21 M263 334 l20 17" stroke="#ff9876" strokeWidth="6" strokeLinecap="round" opacity={clamp(time, 17.415, 18.1, 1, 0)} />
        </svg>
      </div>
      <div style={{position: 'absolute', left: '50%', top: '33%', zIndex: 8, color: '#fff1db', font: font(BIG), textShadow: '0 0 24px #ff5d62', transform: `translate(-50%, -50%) rotate(-8deg) scale(${pop(time, 17.45, 9, 200)})`}}>POP!</div>
    </>}

    {mode === 'spaghetti' && <>
      <Astronaut left="43%" top="48%" width={135} height={200} stretch={1.5} rotation={-18 + Math.sin(time * 3) * 4} bob={Math.sin(time * 5) * 6} scale={pop(time, 18.9, 9, 160)} />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0, zIndex: 6}}>
        {[0, 1, 2, 3, 4].map((n) => <path key={n} d={strand(n, 385)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(time, 18.775 + n * 0.1, 19.6 + n * 0.1, 0, 1)} fill="none" stroke={n % 2 === 0 ? '#f4c467' : '#df9e4d'} strokeWidth={n === 0 ? 10 : 7} strokeLinecap="round" opacity={0.9} />)}
      </svg>
      <FormulaBuilder time={time} />
      {time >= 20.135 && <>
        <Shockwave time={time} start={20.135} top="51%" color="#ffd17c" size={300} />
        <div style={{position: 'absolute', left: '50%', top: '51%', zIndex: 8, whiteSpace: 'nowrap', transform: `translate(-50%, -50%) rotate(-5deg) scale(${pop(time, 20.135, 9, 160)})`, padding: '11px 26px', border: '5px solid #f04a54', color: '#ff5963', background: '#fff3e4', font: font(LABEL), letterSpacing: 3, boxShadow: '0 10px 24px #0009'}}>STAMPED: COSMIC NOODLE</div>
      </>}
    </>}

    {mode === 'twist' && <>
      <div style={{position: 'absolute', left: '18%', top: '45%', zIndex: 7, opacity: 0.82}}><Clock left="50%" top="50%" size={100} speed={0.2} time={time} tone="#a88ae6" /></div>
      <div style={{position: 'absolute', left: '50%', top: '59%', width: 420, height: 110, transform: `translate(-50%,-50%) rotate(${time * 14}deg)`, zIndex: 4, border: '1px dashed #b0bad36a', borderRadius: '50%', opacity: 0.55}} />
    </>}

    {mode === 'split' && <>
      <div style={{position: 'absolute', left: '50%', top: '37%', width: 4, height: '28%', transform: `translateX(-50%) scaleY(${Math.min(1, pop(time, 23.735, 11, 150))})`, background: '#dae4f4aa', zIndex: 6, boxShadow: '0 0 18px #b7d9ef'}} />
      <ClockPanel left="26%" title="FAR" subtitle="AWAY" time={time} fast={false} fade={ease(time, 23.735, 28.295, 1, 0.14)} trail={ease(time, 23.735, 28.295, 0, 1)} enter={pop(time, 23.735, 11, 150)} dir={-1} />
      <ClockPanel left="74%" title="YOU" subtitle="NORMAL TIME" time={time} fast fade={1} trail={0} enter={pop(time, 23.9, 11, 150)} dir={1} />
    </>}

    {mode === 'you' && <>
      <div style={{position: 'absolute', left: '16%', top: '39%', width: '68%', height: '25%', zIndex: 4, border: '2px solid #65d8ef88', borderRadius: 28, background: 'linear-gradient(135deg,#101a2bdf,#15172bbc)', boxShadow: `0 0 ${40 + 14 * Math.sin(time * 14)}px #47cce655`}} />
      <Astronaut left="40%" top="50%" width={225} height={336} bob={Math.sin(time * 7) * 8} rotation={5 + Math.sin(time * 5) * 3} />
      <Clock left="68%" top="51%" size={158} speed={8} time={time} tone="#75e5f3" />
      <div style={{position: 'absolute', left: '68%', top: '62%', transform: 'translateX(-50%)', zIndex: 7, color: '#8de7f3', font: font(SMALL), letterSpacing: 3, whiteSpace: 'nowrap', opacity: Math.sin(time * 16) > 0 ? 1 : 0.4}}>TICK  TICK  TICK</div>
    </>}

    {mode === 'horizon' && <>
      <div style={{position: 'absolute', left: '50%', top: '54.6%', width: 475, height: 475, boxSizing: 'border-box', borderRadius: '50%', border: `4px solid ${time >= 31.824188 ? '#ff5a5f' : '#f2f5fa'}`, transform: `translate(-50%, -50%) scale(${1 + Math.sin(time * 5) * 0.015 + horizonFlash * 0.04})`, opacity: 0.88, zIndex: 4, boxShadow: `0 0 ${18 + horizonFlash * 34}px ${time >= 31.824188 ? '#ff4c55' : '#d9ecff'}66`}} />
      <div style={{position: 'absolute', left: '50%', top: '31%', zIndex: 7, transform: 'translateX(-50%)', color: '#fff3dc', font: font(LABEL), letterSpacing: 3, whiteSpace: 'nowrap', textShadow: '0 3px 12px #000'}}>EVENT HORIZON</div>
      <div style={{position: 'absolute', left: '69%', top: '52%', zIndex: 7, color: '#ffb866', font: font(SMALL), whiteSpace: 'nowrap', transform: 'rotate(90deg)', textShadow: '0 2px 12px #000'}}>ONE WAY →</div>
      {noReturn && <div style={{position: 'absolute', left: '69%', top: '52%', zIndex: 8, color: '#ff4759', font: font(BIG), transform: `translate(-50%, -50%) rotate(-9deg) scale(${pop(time, 32.944187, 8, 200)})`, textShadow: '0 2px 12px #000'}}>✕</div>}
    </>}

    {mode === 'finale' && <>
      <Confetti time={time} />
      {time < 38.384 ? <>
        <Astronaut left="50%" top="45%" width={140} height={210} stretch={1.8} rotation={-18 + Math.sin(time * 4) * 3} opacity={0.94} scale={pop(time, 34.3, 9, 150)} />
        <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{position: 'absolute', inset: 0, zIndex: 6}}>
          <g transform={`translate(${Math.sin(time * 5) * 5} 0)`}>
            <path d="M539 1044 C480 980 615 925 565 850 S448 774 544 707 S703 659 640 599" fill="none" stroke="#f0bb63" strokeWidth="13" strokeLinecap="round" />
            <path d="M539 1044 C480 980 615 925 565 850 S448 774 544 707 S703 659 640 599" fill="none" stroke="#ffe4a2" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </> : <Noodle time={time} loop={false} />}
      {time >= 37.984 && <div style={{position: 'absolute', left: '50%', top: '60.5%', zIndex: 8, whiteSpace: 'nowrap', opacity: 1 - clamp(time, 38.879, 39.0791836734698, 0, 1), transform: `translateX(-50%) rotate(-3deg) scale(${pop(time, 37.984, 10, 155)})`, border: '4px solid #ff5662', padding: '10px 24px', background: '#fff0dc', color: '#f14955', font: font(LABEL), letterSpacing: 3}}>LONGEST NOODLE</div>}
    </>}

    </div>

    {cut && <div style={{position: 'absolute', inset: 0, zIndex: 9, background: '#020207'}} />}
  </div>;
};