import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timing from '../../../public/videos/wawa-esop/timing.json';
import {CutoutCharacter, SELLER_A, SELLER_B, Mood, ArmPose} from '../../curious/Character';
import {FONT_BODY, FONT_HEAD, PALETTE} from '../../curious/theme';
import {Coin, Display, Pill, Storefront, fade, pop} from '../../curious/primitives';
import {FitDisplay, PopAround, PopIn, Room, ease, fit} from '../../curious/Backdrop';

/**
 * LAYOUT RULES (1080 x 1920), same as the other Oddly Logical videos
 *  - Title band 140-455 | content band 500-1330 | caption box 1480-1650
 *  - Host stands at x=148 (left) or x=950+ (right, flipped). His pointing hand lands near x=336 / x=762, y~1024,
 *    so keep key content right of x=390 when he is on the left.
 *  - The RetireVault (hero prop) lives at (730,1020) from scene 3 to scene 7 so the viewer always knows where
 *    "the account" is. Every certificate, lock and level change happens on it.
 *
 * TIMING: nothing is hard-coded to seconds. Every scene boundary is a CUE found in timing.json
 * (the start time of a spoken word), so the animation follows whatever audio you generate.
 */

/* ------------------------------------------------------------------ */
/* timing: cues from the word timestamps                               */
/* ------------------------------------------------------------------ */

type TsWord = {start: number; end: number; punctuated_word: string};
const words = timing.words as unknown as TsWord[];
const LAST_END = words[words.length - 1].end;
const DURATION = LAST_END + .5;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
let cursor = -1;
let lastT = 0;
/** Start time of the next word (after the previous cue) whose normalized text matches `re`. */
const cue = (re: RegExp, gap = 1.5) => {
  for (let i = cursor + 1; i < words.length; i++) {
    if (re.test(norm(words[i].punctuated_word))) {cursor = i; lastT = words[i].start; return lastT;}
  }
  lastT += gap; // word not found: keep the timeline moving
  return lastT;
};

// Order matters: each cue searches after the previous one, following the script.
const C = {
  lottery: cue(/^no$/),                        // "And NO, they didn't win the lottery"
  worked: cue(/^worked$/),                     // "They WORKED at Wawa"
  benefit: cue(/^surprising$/),
  eligible: cue(/^eligible$/),
  noBuy: cue(/^no$/),                          // "NO stock purchase required"
  contrib: cue(/^for$/),                       // "FOR contributions, workers..."
  age: cue(/^(eighteen|18)$/),
  hours: cue(/^(thousand|1000)$/),
  y2003: cue(/^(two|2003)$/),
  nine: cue(/^(nine|900)$/),
  y2020: cue(/^(twenty|2020)$/),
  fourteen: cue(/^(fourteen|14000)$/),
  s6: cue(/^employees$/),                      // "And EMPLOYEES weren't just waiting"
  annual: cue(/^annual$/),
  s7: cue(/^over$/),                           // "OVER long careers"
  million: cue(/^(milliondollar|1000000)$/),
  s8: cue(/^its$/),                            // "IT'S called an employee stock ownership plan"
  wEmp: cue(/^employee$/),
  wStock: cue(/^stock$/),
  wOwn: cue(/^ownership$/),
  wPlan: cue(/^plan$/),
  esop: cue(/^esop$/),
  s9: cue(/^wawa$/),                           // "WAWA stayed private"
  shared: cue(/^shared$/),
};
const lock2At = C.hours + .72 * (C.y2003 - C.hours);   // second padlock clicks open
const shutterAt = lock2At + .35;                        // vault door rolls up
const lock1At = C.age + .9;                              // first padlock clicks open

const beats = [
  {a: 0, b: C.worked, title: 'MILLIONAIRE', red: 'CASHIERS?!'},
  {a: C.worked, b: C.contrib, title: 'WAWA’S', red: 'SECRET PERK.'},
  {a: C.contrib, b: C.y2003, title: 'TWO KEYS.', red: 'TO UNLOCK.'},
  {a: C.y2003, b: C.s6, title: '$900 TO', red: '$14,000.'},
  {a: C.s6, b: C.s7, title: 'GROWTH +', red: 'NEW SHARES.'},
  {a: C.s7, b: C.s8, title: 'YEARS OF', red: 'OWNERSHIP.'},
  {a: C.s8, b: C.s9, title: 'THE NAME:', red: 'ESOP.'},
  {a: C.s9, b: DURATION, title: 'WORK HERE.', red: 'OWN A STAKE.'},
];

/** Caption phrases: max 4 words / 24 characters, never crossing a sentence end. */
const chunks = (() => {
  const out: {from: number; to: number}[] = [];
  let from = 0; let chars = 0; let n = 0;
  words.forEach((w, i) => {
    const len = w.punctuated_word.length + (n ? 1 : 0);
    if (n > 0 && (chars + len > 24 || n >= 4)) {out.push({from, to: i - 1}); from = i; chars = 0; n = 0;}
    chars += w.punctuated_word.length + (n ? 1 : 0); n++;
    if (/[.?!]$/.test(w.punctuated_word)) {out.push({from, to: i}); from = i + 1; chars = 0; n = 0;}
  });
  if (n > 0) out.push({from, to: words.length - 1});
  return out;
})();

/* ------------------------------------------------------------------ */
/* small helpers                                                       */
/* ------------------------------------------------------------------ */

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Point at fraction p along a polyline. */
const polyAt = (pts: [number, number][], p: number): [number, number] => {
  const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = clamp01(p) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const k = lens[i] ? Math.min(1, d / lens[i]) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
};

/** Padlock state: closed at `closeAt`, clicks open at `openAt`. 0 = closed, 1 = open. */
const lockState = (t: number, closeAt: number, openAt: number) =>
  t < closeAt ? 1 : t < openAt ? 1 - ease(t, closeAt, .3) : ease(t, openAt, .3);

/* ------------------------------------------------------------------ */
/* characters                                                          */
/* ------------------------------------------------------------------ */

const Host: React.FC<{x: number; mood: Mood; pose: ArmPose; flip?: boolean; t: number}> = ({x, mood, pose, flip = false, t}) => (
  <CutoutCharacter x={x} y={1330} scale={.8} mood={mood} pose={pose} flip={flip} bob={Math.sin(t * 2.5) * .12} {...SELLER_A}/>
);

const Glasses: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={PALETTE.ink} strokeWidth="6">
    <circle cx="-29" cy="-514" r="24"/><circle cx="29" cy="-514" r="24"/><path d="M-5 -514H5"/>
  </g>
);

/* ------------------------------------------------------------------ */
/* props                                                               */
/* ------------------------------------------------------------------ */

const Certificate: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-95" y="-64" width="190" height="128" rx="10" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="7"/>
    <rect x="-79" y="-48" width="158" height="96" rx="4" fill="none" stroke={PALETTE.gold} strokeWidth="6"/>
    <text y="-20" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight="900" fontSize="24" letterSpacing="3" fill={PALETTE.ink}>STOCK</text>
    <path d="M-52 6H52M-34 28H20" stroke={PALETTE.ink} strokeWidth="6" strokeLinecap="round"/>
    <circle cx="58" cy="30" r="15" fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth="5"/>
  </g>
);

/** Falls from y0 to y1 and disappears (it "lands" inside the vault). */
const FallCert: React.FC<{t: number; at: number; x: number; y0: number; y1: number; s?: number; dur?: number}> = ({t, at, x, y0, y1, s = .4, dur = .55}) => {
  const p = (t - at) / dur;
  if (p < 0 || p >= 1) return null;
  return <Certificate x={x} y={y0 + (y1 - y0) * p * p} s={s}/>;
};

const Padlock: React.FC<{x: number; y: number; open: number; s?: number}> = ({x, y, open, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`translate(0 ${-open * 14}) rotate(${-open * 30} 22 -28)`}>
      <path d="M-22 -28V-48A22 22 0 0 1 22 -48V-28" fill="none" stroke={PALETTE.ink} strokeWidth="14" strokeLinecap="round"/>
      <path d="M-22 -28V-48A22 22 0 0 1 22 -48V-28" fill="none" stroke="#B9C2C9" strokeWidth="6" strokeLinecap="round"/>
    </g>
    <rect x="-38" y="-30" width="76" height="62" rx="12" fill={open > .5 ? PALETTE.green : PALETTE.gold} stroke={PALETTE.ink} strokeWidth="8"/>
    <circle cy="-4" r="8" fill={PALETTE.ink}/><rect x="-3" y="-4" width="6" height="18" fill={PALETTE.ink}/>
  </g>
);

type VaultProps = {
  x: number; y: number; s?: number; label: string; badge?: string;
  locks?: [number, number]; open?: number; gold?: number; green?: number; certs?: number; opacity?: number;
};
/** The hero prop: a glass-front vault with a shutter door, two padlocks, a level gauge and certificates. */
const RetireVault: React.FC<VaultProps> = ({x, y, s = 1, label, badge, locks, open = 1, gold = 0, green = 0, certs = 0, opacity = 1}) => {
  const gh = Math.min(230, gold * 230);
  const vh = Math.min(230 - gh, green * 230);
  const shutterH = 250 * (1 - open);
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <rect x="-250" y="278" width="60" height="26" rx="8" fill={PALETTE.ink}/>
    <rect x="190" y="278" width="60" height="26" rx="8" fill={PALETTE.ink}/>
    <rect x="-260" y="-280" width="520" height="560" rx="38" fill="#D9E6E4" stroke={PALETTE.ink} strokeWidth="14"/>
    <rect x="-230" y="-250" width="460" height="84" rx="18" fill="#1E2B2A"/>
    <FitDisplay x={0} y={-190} text={label} size={50} maxW={420} fill={PALETTE.gold}/>
    <rect x="-230" y="-150" width="460" height="250" rx="14" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="8"/>
    <rect x="-226" y={96 - gh} width="452" height={gh} fill={PALETTE.gold}/>
    <rect x="-226" y={96 - gh - vh} width="452" height={vh} fill={PALETTE.green}/>
    {Array.from({length: Math.min(6, certs)}, (_, i) => (
      <Certificate key={i} x={-130 + (i % 3) * 130} y={30 - Math.floor(i / 3) * 85} s={.5} rot={(i % 3 - 1) * 5}/>
    ))}
    {open < 1 && <g>
      <rect x="-230" y="-150" width="460" height={shutterH} rx="14" fill="#8E9AA3" stroke={PALETTE.ink} strokeWidth="8"/>
      {[0, 1, 2, 3, 4, 5].map(i => {
        const yy = -150 + i * 42 + 21;
        return yy < -150 + shutterH - 8 ? <path key={i} d={`M-220 ${yy}H220`} stroke="#6E7A83" strokeWidth="6"/> : null;
      })}
      <circle cx="0" cy={-150 + shutterH - 6} r="16" fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth="6"/>
    </g>}
    {locks && <>
      <rect x="-210" y="156" width="420" height="22" rx="11" fill="#8E9AA3" stroke={PALETTE.ink} strokeWidth="6"/>
      <Padlock x={-100} y={170} open={locks[0]} s={.85}/>
      <Padlock x={100} y={170} open={locks[1]} s={.85}/>
    </>}
    {badge && <>
      <rect x="-150" y="208" width="300" height="56" rx="12" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="6"/>
      <text y="246" textAnchor="middle" fontFamily={FONT_BODY} fontWeight="800" fontSize="26" fill={PALETTE.ink}>{badge}</text>
    </>}
  </g>;
};

/** Digits spin like a slot machine until `lockAt`, then lock left to right. */
const SlotText: React.FC<{t: number; text: string; lockAt: number; x: number; y: number; size: number; fill?: string}> = ({t, text, lockAt, x, y, size, fill = PALETTE.gold}) => {
  const out = text.split('').map((ch, i) => /\d/.test(ch) && t < lockAt + i * .09 ? String((Math.floor(t * 22) + i * 3 + (i * 7) % 5) % 10) : ch).join('');
  return <FitDisplay x={x} y={y} text={out} size={size} maxW={820} fill={fill}/>;
};

const ReceiptTape: React.FC<{t: number; x: number; y: number; w: number; h: number; grow: number}> = ({t, x, y, w, h, grow}) => {
  const items = ['COFFEE   1.99', 'HOAGIE   8.49', 'GAS   41.20', 'SODA   2.19', 'CHIPS   3.09', 'TOTAL   56.96'];
  const top = y - h * grow;
  const zig = Array.from({length: 11}, (_, i) => `${x - w / 2 + (i * w) / 10},${top + (i % 2 ? 0 : 12)}`).join(' ');
  if (grow <= 0.01) return null;
  return <g>
    <defs><clipPath id="rcptClip"><rect x={x - w / 2} y={top} width={w} height={y - top}/></clipPath></defs>
    <polygon points={`${zig} ${x + w / 2},${y} ${x - w / 2},${y}`} fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="7" strokeLinejoin="round"/>
    <g clipPath="url(#rcptClip)">
      {Array.from({length: 9}, (_, i) => {
        const ry = y - ((t * 90 + i * 54) % 486);
        return <g key={i}>
          <text x={x - w / 2 + 18} y={ry} fontFamily="Courier New, monospace" fontWeight="bold" fontSize="22" fill={PALETTE.ink}>{items[i % items.length]}</text>
          <path d={`M${x - w / 2 + 14} ${ry + 12}H${x + w / 2 - 14}`} stroke={PALETTE.ink} strokeWidth="2" strokeDasharray="3 6" opacity=".5"/>
        </g>;
      })}
    </g>
  </g>;
};

const Register: React.FC<{x: number; y: number; pulse: number}> = ({x, y, pulse}) => (
  <g transform={`translate(${x} ${y}) scale(${1 + .08 * pulse})`}>
    <rect x="-110" y="-100" width="220" height="100" rx="14" fill="#4A5560" stroke={PALETTE.ink} strokeWidth="9"/>
    <rect x="-80" y="-135" width="160" height="50" rx="8" fill="#1D2B2A" stroke={PALETTE.ink} strokeWidth="7"/>
    <text y="-98" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight="900" fontSize="36" fill={PALETTE.green}>$$$</text>
    <rect x="-90" y="-62" width="180" height="22" rx="6" fill="#6B7783"/>
  </g>
);

const LotteryTicket: React.FC<{x: number; y: number; rot: number; scratch: number}> = ({x, y, rot, scratch}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x="-150" y="-85" width="300" height="170" rx="16" fill="#9FD6A8" stroke={PALETTE.ink} strokeWidth="9"/>
    <text y="-35" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight="900" fontSize="42" fill={PALETTE.ink}>LOTTERY</text>
    <rect x="-110" y="-8" width="220" height="68" rx="10" fill="#C9CED3" stroke={PALETTE.ink} strokeWidth="6" opacity={1 - scratch}/>
    <text y="44" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight="900" fontSize="30" fill={PALETTE.red} opacity={scratch}>NOT A WINNER</text>
    {scratch > 0 && scratch < 1 && <Coin x={-100 + 200 * scratch} y={30} r={20} label=""/>}
  </g>
);

const StoreBlock: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Storefront x={0} y={0} w={470} h={520} awning={PALETTE.red}/>
    <Display x={235} y={88} text="WAWA" size={64} fill={PALETTE.gold}/>
  </g>
);

const GasPump: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-60" y="-250" width="120" height="250" rx="14" fill={PALETTE.red} stroke={PALETTE.ink} strokeWidth="9"/>
    <rect x="-42" y="-225" width="84" height="56" rx="8" fill="#1D2B2A" stroke={PALETTE.ink} strokeWidth="6"/>
    <text y="-185" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight="900" fontSize="30" fill={PALETTE.green}>GAS</text>
    <path d="M60 -140Q105 -140 105 -90V-30" fill="none" stroke={PALETTE.ink} strokeWidth="14" strokeLinecap="round"/>
    <rect x="-70" y="-10" width="140" height="18" rx="6" fill={PALETTE.ink}/>
  </g>
);

const CoffeeCup: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-34 -70H34L26 0H-26Z" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="8" strokeLinejoin="round"/>
    <rect x="-31" y="-46" width="62" height="26" fill={PALETTE.red}/>
    <rect x="-38" y="-84" width="76" height="16" rx="6" fill="#6B4A32" stroke={PALETTE.ink} strokeWidth="6"/>
  </g>
);

const Sandwich: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`} stroke={PALETTE.ink} strokeWidth="7" strokeLinejoin="round">
    <ellipse cx="0" cy="-14" rx="70" ry="16" fill="#E8B96A"/>
    <rect x="-66" y="-36" width="132" height="14" rx="6" fill={PALETTE.green}/>
    <rect x="-66" y="-50" width="132" height="14" rx="6" fill={PALETTE.red}/>
    <path d="M-72 -56Q0 -100 72 -56Z" fill="#E8B96A"/>
  </g>
);

const GiftBox: React.FC<{t: number; at: number; x: number; y: number}> = ({t, at, x, y}) => {
  const p = clamp01((t - at) / .5);
  const gy = y - 760 * (1 - p) * (1 - p);
  const lid = ease(t, at + .9, .35);
  const rise = ease(t, at + 1.0, .6);
  return <g>
    {lid > 0 && <g transform={`translate(${x} ${y - 60})`} opacity={lid}>
      {Array.from({length: 10}, (_, i) => {
        const a = (i * 36 + t * 40) * Math.PI / 180;
        return <path key={i} d={`M0 0L${Math.cos(a - .12) * 210} ${Math.sin(a - .12) * 210}L${Math.cos(a + .12) * 210} ${Math.sin(a + .12) * 210}Z`} fill={PALETTE.gold} opacity=".35"/>;
      })}
    </g>}
    <g transform={`translate(${x} ${gy})`}>
      <rect x="-70" y="-40" width="140" height="100" rx="8" fill={PALETTE.red} stroke={PALETTE.ink} strokeWidth="8"/>
      <rect x="-14" y="-40" width="28" height="100" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="6"/>
      <text y="38" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight="900" fontSize="60" fill={PALETTE.paper} opacity={1 - lid}>?</text>
      <g transform={`translate(0 ${-lid * 80}) rotate(${-lid * 28} -70 -40)`}>
        <rect x="-80" y="-76" width="160" height="38" rx="8" fill="#B02A3A" stroke={PALETTE.ink} strokeWidth="8"/>
        <rect x="-14" y="-76" width="28" height="38" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="6"/>
      </g>
    </g>
    {lid > 0 && <Certificate x={x} y={y - 50 - 130 * rise} s={.8 * pop(t, at + 1.0, .5)}/>}
  </g>;
};

const Pipe: React.FC<{pts: [number, number][]}> = ({pts}) => {
  const d = 'M' + pts.map(p => p.join(' ')).join('L');
  return <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={PALETTE.ink} strokeWidth="46"/>
    <path d={d} stroke="#C9D3D8" strokeWidth="28"/>
  </g>;
};

const IDCard: React.FC<{x: number; y: number; s: number; flip: number; ok: boolean}> = ({x, y, s, flip, ok}) => {
  const sx = Math.max(.04, Math.abs(Math.cos(Math.PI * flip)));
  const back = flip > .5;
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`scale(${sx} 1)`}>
      <rect x="-150" y="-95" width="300" height="190" rx="18" fill={back ? PALETTE.gold : PALETTE.paper} stroke={PALETTE.ink} strokeWidth="10"/>
      {back
        ? <Display x={0} y={36} text="18+" size={120} fill={PALETTE.paper}/>
        : <>
            <text y="-52" x="0" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight="900" fontSize="26" fill={PALETTE.ink}>EMPLOYEE ID</text>
            <circle cx="-80" cy="12" r="46" fill="#F3BD8A" stroke={PALETTE.ink} strokeWidth="7"/>
            <path d="M-20 -6H120M-20 26H100M-20 56H70" stroke={PALETTE.ink} strokeWidth="9" strokeLinecap="round" opacity=".55"/>
          </>}
    </g>
    {ok && <g transform="translate(135 -85)">
      <circle r="32" fill={PALETTE.green} stroke={PALETTE.ink} strokeWidth="7"/>
      <path d="M-14 0L-4 11L15 -10" stroke={PALETTE.paper} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>}
  </g>;
};

const ClockRing: React.FC<{x: number; y: number; r: number; p: number}> = ({x, y, r, p}) => {
  const rr = r - 6; const circ = 2 * Math.PI * rr;
  return <g transform={`translate(${x} ${y})`}>
    <circle r={r + 10} fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="9"/>
    <circle r={rr} fill="none" stroke="#D6DCE0" strokeWidth="18"/>
    <circle r={rr} fill="none" stroke={PALETTE.green} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${circ * p} ${circ}`} transform="rotate(-90)"/>
    <Display x={0} y={14} text={fmt(1000 * p)} size={50} fill={PALETTE.gold}/>
    <text y="48" textAnchor="middle" fontFamily={FONT_BODY} fontWeight="800" fontSize="22" letterSpacing="3" fill={PALETTE.ink}>HOURS</text>
    {p >= 1 && <g transform={`translate(${r * .75} ${-r * .75})`}>
      <circle r="30" fill={PALETTE.green} stroke={PALETTE.ink} strokeWidth="7"/>
      <path d="M-13 0L-4 10L14 -9" stroke={PALETTE.paper} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>}
  </g>;
};

const CalendarPage: React.FC<{x: number; y: number; year: number; flip?: number}> = ({x, y, year, flip = 0}) => (
  <g transform={`translate(${x} ${y}) scale(1 ${1 - .3 * Math.sin(flip * Math.PI)})`}>
    <rect x="-88" y="-98" width="176" height="196" rx="16" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="9"/>
    <rect x="-88" y="-98" width="176" height="52" rx="16" fill={PALETTE.red} stroke={PALETTE.ink} strokeWidth="9"/>
    <circle cx="-44" cy="-98" r="9" fill={PALETTE.ink}/><circle cx="44" cy="-98" r="9" fill={PALETTE.ink}/>
    <text y="54" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight="900" fontSize="58" fill={PALETTE.ink}>{year}</text>
  </g>
);

const Statement: React.FC<{x: number; y: number; stamp: number}> = ({x, y, stamp}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-180" y="-150" width="360" height="300" rx="20" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="12"/>
    <text y="-100" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight="900" fontSize={fit('RETIREMENT STATEMENT', 28, 320)} fill={PALETTE.ink}>RETIREMENT STATEMENT</text>
    <path d="M-140 -70H140M-140 -40H80M-140 -10H110" stroke={PALETTE.ink} strokeWidth="6" strokeLinecap="round" opacity=".35"/>
    <g transform={`translate(0 62) rotate(-6) scale(${stamp})`}>
      <rect x="-150" y="-50" width="300" height="100" rx="14" fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth="9"/>
      <FitDisplay x={0} y={22} text="$1,000,000+" size={56} maxW={270} fill={PALETTE.paper}/>
    </g>
  </g>
);

const Ring: React.FC<{t: number; at: number; cx: number; cy: number}> = ({t, at, cx, cy}) => {
  const d = t - at;
  if (d < 0 || d > .9) return null;
  return <circle cx={cx} cy={cy} r={60 + d * 380} fill="none" stroke={PALETTE.gold} strokeWidth="14" opacity={1 - d / .9}/>;
};

const piePath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const f = (a: number) => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
  const [x0, y0] = f(a0); const [x1, y1] = f(a1);
  return `M${cx} ${cy}L${x0} ${y0}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}Z`;
};

/* ------------------------------------------------------------------ */
/* stage                                                               */
/* ------------------------------------------------------------------ */

const VX = 730, VY = 1020, VS = .72;   // the RetireVault's home

const Stage: React.FC<{t: number}> = ({t}) => {
  const host = (x: number, mood: Mood, pose: ArmPose, flip = false) => <Host x={x} mood={mood} pose={pose} flip={flip} t={t}/>;

  /* SCENE 1: hook. Receipt that never stops printing + slot-machine counter, then the lottery gag */
  if (t < C.worked) {
    const lottery = t >= C.lottery;
    const lockAt = Math.max(1, C.lottery - .3);
    const flickAt = Math.max(C.lottery + 2, C.worked - .6);
    const flick = Math.max(0, t - flickAt);
    return <Room t={t}>
      {host(300, lottery ? 'smug' : 'happy', lottery ? 'point' : 'up')}
      <rect x="90" y="1150" width="610" height="180" rx="14" fill={PALETTE.wood} stroke={PALETTE.ink} strokeWidth="9"/>
      <rect x="90" y="1150" width="610" height="26" rx="12" fill="#F2D3A0" stroke={PALETTE.ink} strokeWidth="9"/>
      <ReceiptTape t={t} x={570} y={1015} w={200} h={235} grow={ease(t, .35, .9)}/>
      <Register x={570} y={1150} pulse={ease(t, .25, .2) * (1 - ease(t, .45, .3))}/>
      <g opacity={fade(t, .1, .25)}>
        <rect x="90" y="560" width="900" height="170" rx="26" fill="#1E2B2A" stroke={PALETTE.gold} strokeWidth="10"/>
        <SlotText t={t} text="$1,000,000+" lockAt={lockAt} x={540} y={680} size={104}/>
      </g>
      {lottery && <g transform={`translate(${flick * 1300} ${-flick * 200})`}>
        <LotteryTicket x={830 + (1 - pop(t, C.lottery, .5)) * 450} y={900} rot={-8 + flick * 140} scratch={ease(t, C.lottery + .7, .7)}/>
        <PopAround t={t} at={C.lottery + 1.5} cx={830} cy={900}>
          <path d="M700 820L960 980M960 820L700 980" stroke={PALETTE.red} strokeWidth="26" strokeLinecap="round"/>
        </PopAround>
        <PopAround t={t} at={C.lottery + .9} cx={830} cy={770}>
          <FitDisplay x={830} y={770} text="NOT THE LOTTERY" size={44} maxW={360} fill={PALETTE.paper} rotate={-4}/>
        </PopAround>
      </g>}
    </Room>;
  }

  /* SCENE 2: the world (store, pump, coffee, sandwich) then the gift box with the surprise benefit */
  if (t < C.eligible) {
    const k = 1 - ease(t, C.worked + .05, .8);
    const after = t >= C.benefit;
    return <Room t={t}>
      <g transform={`translate(600 1000) scale(${1 + .5 * k}) translate(-600 -1000)`}><StoreBlock x={400} y={780} s={.85}/></g>
      <PopIn t={t} at={C.worked + .8} x={930} y={1235}><GasPump x={0} y={0}/></PopIn>
      <PopIn t={t} at={C.worked + 1.4} x={470} y={1262}><CoffeeCup x={0} y={0}/></PopIn>
      <PopIn t={t} at={C.worked + 2.0} x={640} y={1268}><Sandwich x={0} y={0}/></PopIn>
      {after && <GiftBox t={t} at={C.benefit} x={600} y={640}/>}
      {host(148, after ? 'shocked' : 'calm', after ? 'up' : 'point')}
    </Room>;
  }

  /* SCENE 3: the mechanism. Company -> pipe -> vault, then "you pay $0" */
  if (t < C.contrib) {
    const pts: [number, number][] = [[245, 610], [730, 610], [730, 825]];
    const launches = [0, 1, 2].map(k => C.eligible + .5 + k * .9);
    const landed = launches.filter(l => t >= l + 1.5).length;
    const noBuy = t >= C.noBuy;
    return <Room t={t}>
      <StoreBlock x={60} y={500} s={.38}/>
      <PopAround t={t} at={C.eligible} cx={150} cy={730}><Pill x={65} y={710} text="COMPANY" fill={PALETTE.green} w={170} size={24}/></PopAround>
      <PopAround t={t} at={C.eligible + .2} cx={640} cy={545}>
        <FitDisplay x={640} y={548} text="COMPANY → STOCK → YOUR ACCOUNT" size={40} maxW={700} fill={PALETTE.paper}/>
      </PopAround>
      <Pipe pts={pts}/>
      {launches.map((l, k) => {
        const p = (t - l) / 1.5;
        if (p < 0 || p >= 1) return null;
        const [px, py] = polyAt(pts, p);
        return <Certificate key={k} x={px} y={py} s={.36}/>;
      })}
      <RetireVault x={VX} y={VY} s={VS} label={`SHARES: ${landed}`} badge="SAM · CASHIER" certs={landed}/>
      {noBuy && <>
        <PopAround t={t} at={C.noBuy + .1} cx={420} cy={1235}>
          <g transform="translate(420 1235)">
            <rect x="-48" y="-62" width="96" height="26" rx="6" fill={PALETTE.green} stroke={PALETTE.ink} strokeWidth="6"/>
            <rect x="-72" y="-45" width="144" height="92" rx="16" fill="#8B5A2B" stroke={PALETTE.ink} strokeWidth="9"/>
            <circle cx="46" cy="0" r="12" fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth="6"/>
          </g>
        </PopAround>
        <PopAround t={t} at={C.noBuy + .2} cx={420} cy={1145}><Pill x={345} y={1120} text="BUY" fill={PALETTE.gold} w={150} size={30} textFill={PALETTE.ink}/></PopAround>
        <PopAround t={t} at={C.noBuy + .6} cx={420} cy={1145}>
          <path d="M360 1125L480 1168M480 1125L360 1168" stroke={PALETTE.red} strokeWidth="14" strokeLinecap="round"/>
        </PopAround>
        <PopAround t={t} at={C.noBuy + .9} cx={485} cy={610}>
          <circle cx="485" cy="610" r="58" fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth="8"/>
          <Display x={485} y={632} text="$0" size={68} fill={PALETTE.paper}/>
        </PopAround>
      </>}
      {host(148, noBuy ? 'smug' : 'thinking', noBuy ? 'down' : 'point')}
    </Room>;
  }

  /* SCENE 4: two keys. 18+ opens lock 1, 1,000 hours opens lock 2 and the door */
  if (t < C.y2003) {
    const inB = t >= C.hours;
    const vOpen = t < C.contrib ? 1 : t < shutterAt ? 1 - ease(t, C.contrib, .4) : ease(t, shutterAt, .6);
    const slide = ease(t, C.hours, .5);
    const cardX = 640 - 140 * slide, cardY = 660 - 20 * slide, cardS = 1 - .4 * slide;
    const clockP = ease(t, C.hours + .2, Math.max(.6, (lock2At - C.hours) * .85));
    return <Room t={t}>
      <PopAround t={t} at={C.contrib} cx={cardX} cy={cardY}>
        <IDCard x={cardX} y={cardY} s={cardS} flip={clamp01((t - (C.age - .2)) / .5)} ok={t >= lock1At}/>
      </PopAround>
      {inB && <PopAround t={t} at={C.hours} cx={770} cy={650}><ClockRing x={770} y={650} r={95} p={clockP}/></PopAround>}
      <RetireVault x={VX} y={VY} s={VS} label="SHARES: 3" badge="SAM · CASHIER" certs={3 + (t > shutterAt + .9 ? 1 : 0)}
        locks={[lockState(t, C.contrib, lock1At), lockState(t, C.contrib, lock2At)]} open={vOpen}/>
      <FallCert t={t} at={shutterAt + .35} x={VX} y0={700} y1={1010}/>
      {inB && <PopAround t={t} at={C.hours + .6} cx={730} cy={1272}>
        <FitDisplay x={730} y={1278} text="Other plan rules apply" size={30} maxW={560} fill={PALETTE.paper}/>
      </PopAround>}
      {host(148, inB ? 'happy' : 'calm', inB ? 'up' : 'point')}
    </Room>;
  }

  /* SCENE 5: one share, 2003 -> 2020. Everything else dims; calendar flips fast; coins burst */
  if (t < C.s6) {
    const inB = t >= C.y2020;
    const endB = Math.max(.6, C.fourteen + .3 - C.y2020);
    const p5 = clamp01((t - C.y2020) / endB);
    const val = inB
      ? 900 + (14000 - 900) * Math.pow(p5, 2.2)
      : 900 * ease(t, C.y2003 + .3, Math.max(.4, C.nine + .4 - C.y2003 - .3));
    const year = inB ? Math.min(2020, 2003 + Math.floor(17 * p5)) : 2003;
    const flipFrac = inB && p5 < 1 ? (17 * p5) % 1 : 0;
    const dt = t - C.fourteen;
    const shake = dt > 0 && dt < .5 ? Math.sin(t * 90) * 6 * (1 - dt / .5) : 0;
    const certS = 1.6 + (inB ? .5 * ease(t, C.y2020, endB) : 0);
    const angles = [-150, -120, -90, -60, -30, -10, -170];
    return <Room t={t}>
      <RetireVault x={VX} y={VY} s={VS} label="SHARES: 4" certs={4} opacity={.22}/>
      <Certificate x={700 + shake} y={930} s={certS}/>
      {dt > .1 && angles.map((a, i) => {
        const d = dt - .1, v = 380 + (i % 3) * 70, r = a * Math.PI / 180;
        return <g key={i} opacity={Math.max(0, 1 - d / 1.1)}><Coin x={700 + Math.cos(r) * v * d} y={930 + Math.sin(r) * v * d + 700 * d * d} r={24} label="$"/></g>;
      })}
      <PopAround t={t} at={C.y2003} cx={480} cy={650}><CalendarPage x={480} y={650} year={year} flip={flipFrac}/></PopAround>
      <PopAround t={t} at={C.y2003 + .2} cx={795} cy={648}>
        <Pill x={630} y={605} text={`~$${fmt(val)}`} fill="#1E2B2A" w={330} size={50} textFill={PALETTE.gold}/>
      </PopAround>
      {dt > .9 && <PopAround t={t} at={C.fourteen + .9} cx={880} cy={780}>
        <Display x={880} y={800} text="~15×" size={100} fill={PALETTE.gold} rotate={-8}/>
      </PopAround>}
      {t >= C.fourteen + 1.3 && <>
        <PopAround t={t} at={C.fourteen + 1.3} cx={580} cy={1140}><Pill x={430} y={1110} text="2003 · ~$900" fill={PALETTE.slate} w={300} size={34}/></PopAround>
        <PopAround t={t} at={C.fourteen + 1.5} cx={900} cy={1140}><Pill x={750} y={1110} text="2020 · ~$14,000" fill={PALETTE.green} w={300} size={32}/></PopAround>
      </>}
      <PopAround t={t} at={C.y2003 + .3} cx={640} cy={1240}>
        <FitDisplay x={640} y={1245} text="Reported historical share value" size={30} maxW={600} fill={PALETTE.paper}/>
      </PopAround>
      {host(148, inB ? 'shocked' : 'thinking', inB ? 'up' : 'point')}
    </Room>;
  }

  /* SCENE 6: not just waiting. Annual batches of certificates pile in, gold + green levels stack */
  if (t < C.s7) {
    const waiting = t < C.annual;
    const span = Math.max(2, C.s7 - C.annual);
    const dtB = Math.max(.5, (span - .9) / 5);
    const tks = [0, 1, 2, 3, 4].map(k => C.annual + .15 + k * dtB);
    const landed = tks.filter(tk => t >= tk + .55).length;
    const year = 2004 + Math.min(4, Math.max(0, Math.floor((t - C.annual) / dtB)));
    const flipFrac = ((t - C.annual) / dtB) % 1;
    const xAt = C.s6 + .55 * Math.max(.5, C.annual - C.s6);
    return <Room t={t}>
      {waiting ? <>
        <PopAround t={t} at={C.s6 + .1} cx={640} cy={555}><FitDisplay x={640} y={565} text="NOT JUST WAITING" size={56} maxW={640} fill={PALETTE.paper}/></PopAround>
        <g transform="translate(480 720)">
          <circle r="80" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="10"/>
          {Array.from({length: 12}, (_, i) => <path key={i} d="M0 -68V-56" stroke={PALETTE.ink} strokeWidth="5" transform={`rotate(${i * 30})`}/>)}
          <path d="M0 0V-52" stroke={PALETTE.ink} strokeWidth="8" strokeLinecap="round" transform={`rotate(${Math.floor(t * 2) * 30})`}/>
          <circle r="8" fill={PALETTE.ink}/>
        </g>
        <PopAround t={t} at={xAt} cx={480} cy={720}><path d="M385 625L575 815M575 625L385 815" stroke={PALETTE.red} strokeWidth="22" strokeLinecap="round"/></PopAround>
        <path d="M985 960V820M985 820L955 862M985 820L1015 862" stroke={PALETTE.green} strokeWidth="22" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={fade(t, C.s6 + .3, .3)}/>
      </> : <>
        <CalendarPage x={470} y={650} year={year} flip={flipFrac}/>
        <PopAround t={t} at={C.annual + .2} cx={790} cy={585}><Pill x={600} y={560} text="CONTRIBUTIONS" fill={PALETTE.gold} w={380} size={28} textFill={PALETTE.ink}/></PopAround>
        <PopAround t={t} at={C.annual + .5} cx={790} cy={655}><Pill x={600} y={630} text="SHARE GROWTH" fill={PALETTE.green} w={380} size={28}/></PopAround>
        {tks.map((tk, k) => <FallCert key={k} t={t} at={tk} x={VX - 40 + (k % 3) * 40} y0={560} y1={840} s={.38}/>)}
      </>}
      <RetireVault x={VX} y={VY} s={VS} label={`SHARES: ${4 + landed}`} certs={4 + landed}
        gold={waiting ? 0 : Math.min(.62, landed * .124)}
        green={waiting ? .12 * ease(t, C.s6 + .3, 1) : .12 + .3 * clamp01((t - C.annual) / span)}/>
      {host(148, waiting ? 'calm' : 'happy', waiting ? 'down' : 'up')}
    </Room>;
  }

  /* SCENE 7: long careers (age time-lapse), then the payoff statement */
  if (t < C.s8) {
    if (t < C.million) {
      const ages = [
        {x: 200, hair: SELLER_A.hair, label: '20s', fill: .25, glasses: false},
        {x: 520, hair: '#9A8576', label: '40s', fill: .6, glasses: false},
        {x: 840, hair: '#DAD7D2', label: '60s', fill: 1, glasses: true},
      ];
      return <Room t={t}>
        {ages.map((a, i) => {
          const at = C.s7 + .1 + i * .6;
          const sc = .42 * pop(t, at, .4);
          return <g key={a.label}>
            <CutoutCharacter x={a.x} y={1330} scale={sc} mood={i === 2 ? 'smug' : 'calm'} pose="down" {...SELLER_A} hair={a.hair} bob={Math.sin(t * 2.5 + i) * .12}/>
            {a.glasses && <Glasses x={a.x} y={1330} s={sc}/>}
            <PopAround t={t} at={at} cx={a.x} cy={1025}><Pill x={a.x - 60} y={1000} text={a.label} fill={PALETTE.red} w={120} size={28}/></PopAround>
            <rect x={a.x + 72} y={1100} width="56" height="220" rx="12" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="7" opacity={fade(t, at, .3)}/>
            <rect x={a.x + 76} y={1316 - 212 * a.fill * ease(t, at + .2, .8)} width="48" height={212 * a.fill * ease(t, at + .2, .8)} rx="8" fill={PALETTE.gold}/>
          </g>;
        })}
      </Room>;
    }
    const stamp = pop(t, C.million + .7, .4);
    return <Room t={t}>
      <RetireVault x={330} y={980} s={.78} label={`$${fmt(1000000 * ease(t, C.million, 1.2))}${t > C.million + 1.2 ? '+' : ''}`} certs={6}
        gold={.62} green={.38} badge="SAM · CASHIER"/>
      <g transform={`translate(${(1 - ease(t, C.million, .5)) * 700} 0)`}><Statement x={730} y={900} stamp={stamp}/></g>
      <Ring t={t} at={C.million + .7} cx={730} cy={960}/>
      <PopAround t={t} at={C.million + 1.0} cx={730} cy={1115}>
        <FitDisplay x={730} y={1120} text="Some long-serving employees" size={30} maxW={480} fill={PALETTE.paper}/>
      </PopAround>
      {host(990, 'happy', 'up', true)}
    </Room>;
  }

  /* SCENE 8: the name. Four blocks drop in, first letters fly together into ESOP */
  if (t < C.s9) {
    const blocks = [
      {w: 'EMPLOYEE', at: C.wEmp, fill: PALETTE.red},
      {w: 'STOCK', at: C.wStock, fill: PALETTE.green},
      {w: 'OWNERSHIP', at: C.wOwn, fill: PALETTE.blue},
      {w: 'PLAN', at: C.wPlan, fill: '#E8763A'},
    ];
    const fy = (i: number) => 690 + i * 115;
    const fly = ease(t, C.esop, .55);
    const blockFade = 1 - ease(t, C.esop + .15, .4);
    const letterX = (i: number) => 640 + (i - 1.5) * 140;
    return <Room t={t} theme="plum">
      {blocks.map((b, i) => {
        const y = fy(i) - (1 - pop(t, b.at, .45)) * 620;
        return t < b.at ? null : <g key={b.w} opacity={blockFade}>
          <rect x="400" y={y - 50} width="480" height="100" rx="18" fill={b.fill} stroke={PALETTE.ink} strokeWidth="9"/>
          <text x="434" y={y + 20} fontFamily={FONT_HEAD} fontWeight="900" fontSize="56" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="5" paintOrder="stroke">
            <tspan fill="#FFE08A">{b.w.charAt(0)}</tspan>{b.w.slice(1)}
          </text>
        </g>;
      })}
      {t >= C.esop && blocks.map((b, i) => {
        const sx = 452, sy = fy(i);
        const x = sx + (letterX(i) - sx) * fly, y = sy + (900 - sy) * fly;
        return <Display key={b.w} x={x} y={y + 50 * fly + 20 * (1 - fly)} text={b.w.charAt(0)} size={56 + 114 * fly} fill={PALETTE.gold}/>;
      })}
      <Ring t={t} at={C.esop + .55} cx={640} cy={880}/>
      <PopIn t={t} at={C.esop + .9} x={640} y={1110} s={1.1}><Certificate x={0} y={0}/></PopIn>
      {host(148, t < C.esop ? 'thinking' : 'smug', 'point')}
    </Room>;
  }

  /* SCENE 9: the closing image. Ownership disc, then the employee slice splits to three workers */
  const shared = t >= C.shared;
  const cx = 640, cy = 660, R = 125;
  const bis = -62.5 * Math.PI / 180;
  const out = 26 * ease(t, C.s9 + .9, .4);
  const start: [number, number] = [cx + Math.cos(bis) * 96, cy + Math.sin(bis) * 96];
  const targets = [240, 540, 840];
  const workers = [
    {x: 240, role: 'CASHIER', fill: PALETTE.green, look: {...SELLER_A}},
    {x: 540, role: 'MANAGER', fill: PALETTE.blue, look: {...SELLER_B, shirt: '#2D4A7A', pants: '#2B2F3A'}},
    {x: 840, role: 'OFFICE', fill: PALETTE.red, look: {...SELLER_B, shirt: '#B7497B', hair: '#4A2E2A', pants: '#3B3F4F'}},
  ];
  return <Room t={t}>
    <g opacity={1 - ease(t, C.shared, .4)}>
      <StoreBlock x={444} y={870} s={.8}/>
    </g>
    <path d={piePath(cx, cy, R, -25, 260)} fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth="10" strokeLinejoin="round"/>
    {!shared && <path d={piePath(cx + Math.cos(bis) * out, cy + Math.sin(bis) * out, R, -100, -25)} fill={PALETTE.green} stroke={PALETTE.ink} strokeWidth="10" strokeLinejoin="round"/>}
    <PopAround t={t} at={C.s9 + .3} cx={cx} cy={cy}><FitDisplay x={cx - 40} y={cy + 50} text="FAMILY" size={34} maxW={180} fill={PALETTE.paper}/></PopAround>
    {!shared && <PopAround t={t} at={C.s9 + 1.0} cx={870} cy={590}>
      <Display x={775} y={590} text="EMPLOYEE PLAN" size={28} anchor="start" fill={PALETTE.paper}/>
      <Display x={775} y={632} text="SCHEMATIC," size={22} anchor="start" fill={PALETTE.paper}/>
      <Display x={775} y={662} text="NOT TO SCALE" size={22} anchor="start" fill={PALETTE.paper}/>
    </PopAround>}
    {!shared && host(148, 'thinking', 'point')}
    {shared && <>
      {workers.map((w, i) => {
        const arrive = C.shared + i * .3 + .8;
        const happy = t >= arrive;
        return <g key={w.role}>
          <PopIn t={t} at={C.shared + .2 + i * .1} x={w.x} y={900} s={.32}>
            <RetireVault x={0} y={0} label="ESOP" gold={.45 * ease(t, arrive, .5)} green={.2 * ease(t, arrive, .5)} certs={0} open={1}/>
          </PopIn>
          <CutoutCharacter x={w.x} y={1330} scale={.46 * pop(t, C.shared + .1 + i * .1, .4)} mood={happy ? 'happy' : 'calm'} pose={happy ? 'up' : 'down'} bob={Math.sin(t * 2.5 + i) * .12} {...w.look}/>
          <PopAround t={t} at={C.shared + .4 + i * .1} cx={w.x} cy={1372}><Pill x={w.x - 95} y={1352} text={w.role} fill={w.fill} w={190} size={24}/></PopAround>
        </g>;
      })}
      {workers.map((w, i) => {
        const at = C.shared + i * .3, p = clamp01((t - at) / .8);
        if (t < at || p >= 1) return null;
        const px = start[0] + (targets[i] - start[0]) * p;
        const py = start[1] + (900 - start[1]) * p - 120 * Math.sin(Math.PI * p);
        return <path key={i} d="M0 0L38 0A38 38 0 0 0 11.7 -36.1Z" transform={`translate(${px} ${py})`} fill={PALETTE.green} stroke={PALETTE.ink} strokeWidth="6" strokeLinejoin="round"/>;
      })}
      {t >= C.shared + 2.2 && <Display x={1030} y={1440} text="ODDLY LOGICAL" size={32} anchor="end" fill={PALETTE.gold} opacity={fade(t, C.shared + 2.2, .3)}/>}
    </>}
  </Room>;
};

/* ------------------------------------------------------------------ */
/* composition                                                         */
/* ------------------------------------------------------------------ */

export const WawaEsop: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const rawT = frame / fps;
  const loop = rawT >= LAST_END + .1;       // last moments: hard cut back to the opening shot so the Short loops
  const t = loop ? 1.0 : rawT;
  const beat = beats.find(b => t >= b.a && t < b.b) ?? beats[beats.length - 1];
  const titleScale = .76 + .24 * pop(t, beat.a, .35);

  const current = words.findIndex(w => t >= w.start && t < w.end);
  const active = current >= 0 ? current : words.reduce((last, w, i) => w.end <= t ? i : last, -1);
  const chunk = chunks.find(c => active >= c.from && active <= c.to) ?? chunks[0];
  const chunkWords = words.slice(chunk.from, chunk.to + 1);
  const phrase = chunkWords.map(w => w.punctuated_word).join(' ');
  const capSize = fit(phrase, 50, 900, .6);
  const capIn = ease(t, words[chunk.from].start, .18);
  const isFlash = !loop && rawT >= C.worked && rawT < C.worked + 6 / 30;   // pattern interrupt: 6 black frames

  return <AbsoluteFill style={{backgroundColor: '#1D6270'}}>
    <Audio src={staticFile('videos/wawa-esop/narration.mp3')}/>
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="titleFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0"/>
          <stop offset=".2" stopColor="#000" stopOpacity=".34"/>
          <stop offset=".8" stopColor="#000" stopOpacity=".34"/>
          <stop offset="1" stopColor="#000" stopOpacity="0"/>
        </linearGradient>
      </defs>

      <Stage t={t}/>

      <rect x="0" y="110" width="1080" height="390" fill="url(#titleFade)"/>
      <g transform={`translate(540 282) scale(${titleScale})`}>
        <text y="0" textAnchor="middle" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="13" paintOrder="stroke" fontFamily={FONT_HEAD} fontSize={fit(beat.title, 70, 940)} fontWeight="900">{beat.title}</text>
        <text y="88" textAnchor="middle" fill={PALETTE.red} stroke={PALETTE.ink} strokeWidth="12" paintOrder="stroke" fontFamily={FONT_HEAD} fontSize={fit(beat.red, 72, 940)} fontWeight="900">{beat.red}</text>
      </g>

      <rect x="48" y="1480" width="984" height="170" rx="26" fill={PALETTE.ink} opacity=".87" stroke={PALETTE.paper} strokeWidth="5"/>
      <text x="540" y={1585 + (1 - capIn) * 10} opacity={capIn} textAnchor="middle" fontFamily={FONT_BODY} fontSize={capSize} fontWeight="800" fill={PALETTE.paper}>
        {chunkWords.map((w, i) => (
          <tspan key={`${w.start}-${i}`} fill={chunk.from + i === active ? PALETTE.gold : PALETTE.paper}>
            {w.punctuated_word}{i < chunkWords.length - 1 ? ' ' : ''}
          </tspan>
        ))}
      </text>

      <rect x="0" y="0" width={1080 * Math.min(1, rawT / DURATION)} height="12" fill={PALETTE.gold}/>
      {isFlash && <rect width="1080" height="1920" fill="#000"/>}
    </svg>
  </AbsoluteFill>;
};

export const WAWA_ESOP_DURATION = Math.ceil(DURATION * 30);