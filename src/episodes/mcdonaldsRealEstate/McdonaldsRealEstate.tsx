import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timing from '../../../public/videos/mcdonalds-real-estate/timing.json';
import {CutoutCharacter, SELLER_A, SELLER_B} from '../../curious/Character';
import {FONT_BODY, FONT_HEAD, PALETTE} from '../../curious/theme';
import {Coin, Display, Pill, pop} from '../../curious/primitives';

/* ───────────────────────── timing ───────────────────────── */

const words = timing.words as {start: number; end: number; punctuated_word: string}[];
const FPS = 30;
export const MCDONALDS_REAL_ESTATE_DURATION = Math.ceil((words.at(-1)?.end ?? 48.81) + 0.6) * FPS;
const DURATION = MCDONALDS_REAL_ESTATE_DURATION / FPS;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const idx = (re: RegExp, from = 0) => words.findIndex((w, i) => i >= from && re.test(norm(w.punctuated_word)));
// cue: start time of first matching word. If not found, fall back to a share of the total
// duration (NOT 0, which used to make every scene stack on top of each other).
const cue = (re: RegExp, fallback: number, from = 0, offset = 0) => {
  const i = idx(re, Math.max(0, from));
  return i >= 0 ? Math.max(0, words[i].start + offset) : fallback * DURATION;
};

const iFranchise = idx(/^franchisees$/);
const iPay = idx(/^pay$/, Math.max(0, iFranchise));
const iBuys = idx(/^buys$/);
const iLeases = idx(/^leases$/, Math.max(0, iBuys));
const iThrives = idx(/^thrives$/);

// Scene start times (14 scenes). Enforced to be strictly increasing with a minimum length.
const RAW_BOUNDS = [
  0,
  cue(/^restaurant$/, 0.07),
  cue(/^(ninety|ninetyfive|95)$/, 0.14),
  cue(/^franchisees$/, 0.22),
  cue(/^pay$/, 0.29, iFranchise),
  cue(/^model$/, 0.36, iPay, -1.0),
  cue(/^buys$/, 0.41),
  cue(/^leases$/, 0.48, iBuys),
  cue(/^royalties$/, 0.55, iLeases),
  cue(/^clever$/, 0.62),
  cue(/^thrives$/, 0.7, 0, -1.0),
  cue(/^before$/, 0.78, Math.max(0, iThrives)),
  cue(/^arches$/, 0.85, 0, -0.8),
  cue(/^walking$/, 0.92),
];
const MIN_SCENE = 1.0;
const B = RAW_BOUNDS.reduce<number[]>((acc, v, i) => {
  acc.push(i === 0 ? 0 : Math.max(v, acc[i - 1] + MIN_SCENE));
  return acc;
}, []);
// If late cues got pushed past the end, squeeze them back.
for (let i = B.length - 1; i > 0; i--) B[i] = Math.min(B[i], DURATION - MIN_SCENE * (B.length - i));
const N = B.length;

const COMMENTS = cue(/^comments$/, 0.97);

/* ───────────────────────── captions ───────────────────────── */

type Caption = {start: number; end: number; text: string};
const captions: Caption[] = (() => {
  const groups: Caption[] = [];
  let cur: typeof words = [];
  const flush = () => {
    if (cur.length) groups.push({start: cur[0].start, end: cur[cur.length - 1].end, text: cur.map(w => w.punctuated_word).join(' ')});
    cur = [];
  };
  for (const w of words) {
    if (cur.length >= 4 || (cur.length && cur.map(x => x.punctuated_word).join(' ').length + w.punctuated_word.length + 1 > 25)) flush();
    cur.push(w);
    if (/[.!?]$/.test(w.punctuated_word)) flush();
  }
  flush();
  return groups;
})();

const HILITE = /^(rent|royalties|royalty|95|ninetyfive|profit|property|land|fries|franchisees|landlords?|leases|top)$/i;

/* ───────────────────────── helpers ───────────────────────── */

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
const bounce = (x: number) => {
  const p = clamp(x);
  return 1 - Math.abs(Math.cos(p * Math.PI * 2.5)) * (1 - p);
};
const INK = PALETTE.ink;
const GOLD = PALETTE.gold;
const PAPER = PALETTE.paper;

const Txt: React.FC<{x: number; y: number; size?: number; fill?: string; head?: boolean; ls?: number; children: React.ReactNode; opacity?: number}> = ({
  x, y, size = 36, fill = INK, head = true, ls = 0, children, opacity = 1,
}) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={head ? FONT_HEAD : FONT_BODY} fontWeight={900} fontSize={size} letterSpacing={ls} fill={fill} opacity={opacity}>
    {children}
  </text>
);

/* ───────────────────────── backgrounds ───────────────────────── */

const SurveyMapBg: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect width="1080" height="1920" fill="#A9C39A"/>
    {[0, 1, 2, 3].map(i => <path key={i} d={`M${-40 + i * 300} 0L${200 + i * 300} 1920`} stroke="#8DAE82" strokeWidth="6" fill="none"/>)}
    <g stroke="#5E7F57" strokeWidth="5" strokeDasharray="22 16" fill="none" strokeDashoffset={-t * 10}>
      <rect x="60" y="430" width="420" height="300"/><rect x="560" y="520" width="460" height="260"/>
      <rect x="90" y="860" width="360" height="240"/><rect x="600" y="900" width="400" height="300"/>
    </g>
    {[[130, 480], [420, 690], [610, 560], [960, 740], [150, 900], [400, 1060], [640, 940], [940, 1150], [280, 1180]].map(([x, y], i) => (
      <g key={i}><circle cx={x} cy={y} r="22" fill="#6C9560" stroke="#4D7046" strokeWidth="4"/><circle cx={x - 6} cy={y - 6} r="7" fill="#86AE79"/></g>
    ))}
    <rect y="1300" width="1080" height="150" fill="#5A5B5E"/>
    <path d="M0 1375H1080" stroke="#F9E7B1" strokeWidth="7" strokeDasharray="34 26" strokeDashoffset={-t * 90}/>
    <rect y="1290" width="1080" height="14" fill="#8F8F90"/>
  </g>
);

const LedgerBg: React.FC = () => (
  <g>
    <rect width="1080" height="1920" fill="#F4EBD3"/>
    {Array.from({length: 38}, (_, i) => <path key={i} d={`M0 ${120 + i * 48}H1080`} stroke="#BFD3DE" strokeWidth="3"/>)}
    <path d="M118 0V1920" stroke="#D9564A" strokeWidth="5"/><path d="M130 0V1920" stroke="#D9564A" strokeWidth="2"/>
    {[260, 620, 980, 1340, 1700].map(y => <circle key={y} cx="52" cy={y} r="16" fill="#D8CDB2" stroke="#B8AC8E" strokeWidth="3"/>)}
    <g transform="translate(930 150) rotate(12)" fill="none" stroke="#9AA3AA" strokeWidth="7" strokeLinecap="round">
      <path d="M0 0V80a18 18 0 0 0 36 0V-20a12 12 0 0 0-24 0V70"/>
    </g>
  </g>
);

const DuskBg: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2B2A66"/><stop offset=".55" stopColor="#B4506A"/><stop offset="1" stopColor="#F29A52"/>
      </linearGradient>
      <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#FFD58A" stopOpacity=".85"/><stop offset="1" stopColor="#FFD58A" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#dusk)"/>
    {[[40, 760, 130], [170, 640, 150], [320, 820, 120], [450, 700, 160], [620, 800, 140], [770, 660, 170], [930, 780, 150]].map(([x, y, w], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={1300 - y} fill="#1D1B45"/>
        {Array.from({length: 6}, (_, r) => Array.from({length: Math.floor(w / 40)}, (_, c) => (r + c + i) % 3 !== 0 && (
          <rect key={`${r}-${c}`} x={x + 12 + c * 38} y={y + 24 + r * 54} width="16" height="24" fill="#FFD58A"/>
        )))}
      </g>
    ))}
    <ellipse cx="540" cy="1280" rx="520" ry="260" fill="url(#glow)"/>
    <rect y="1300" width="1080" height="170" fill="#E8D9C0"/>
    <rect y="1296" width="1080" height="12" fill="#B9A98E"/>
  </g>
);

/* ───────────────────────── props ───────────────────────── */

const Burger: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="8" strokeLinejoin="round">
    <path d="M-105 4Q-103-71 0-76Q103-71 105 4Z" fill="#E9A747"/>
    <path d="M-113 13H113V43Q110 58 94 58H-94Q-113 58-113 43Z" fill="#77A649"/>
    <path d="M-105 64H105V88Q102 103 86 103H-86Q-105 103-105 88Z" fill="#D57745"/>
    <path d="M-102 8H102" stroke="#F5D889" strokeWidth="10"/>
    {[-52, -10, 36, 69].map((dx, i) => <ellipse key={i} cx={dx} cy={-43 + (i % 2) * 8} rx="5" ry="9" fill="#FFF1C5" stroke="none"/>)}
  </g>
);

const Fries: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="7" strokeLinejoin="round">
    {[-50, -25, 0, 25, 50].map((dx, i) => <rect key={i} x={dx - 11} y={-90 - (i % 3) * 14} width="22" height="100" rx="4" fill="#F5CF5A"/>)}
    <path d="M-70 -10H70L56 90H-56Z" fill="#D7443B"/>
  </g>
);

const Restaurant: React.FC<{x?: number; y?: number; s?: number; sign?: string}> = ({x = 540, y = 1120, s = 1, sign = 'RESTAURANT'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-255" y="-370" width="510" height="376" rx="28" fill={PAPER} stroke={INK} strokeWidth="12"/>
    <path d="M-260-280H260L222-382H-222Z" fill="#D7654E" stroke={INK} strokeWidth="12" strokeLinejoin="round"/>
    <path d="M-220-280V-330H-145V-280M-95-280V-330H-20V-280M30-280V-330H105V-280M155-280V-330H220V-280" fill="#F6E6C8" stroke={INK} strokeWidth="8"/>
    <rect x="-185" y="-220" width="118" height="154" rx="12" fill="#9ED8E8" stroke={INK} strokeWidth="8"/>
    <rect x="-39" y="-220" width="112" height="214" rx="12" fill="#B8764B" stroke={INK} strokeWidth="8"/>
    <rect x="100" y="-220" width="120" height="154" rx="12" fill="#9ED8E8" stroke={INK} strokeWidth="8"/>
    <rect x="-210" y="-252" width="420" height="52" rx="22" fill={GOLD} stroke={INK} strokeWidth="8"/>
    <text x="0" y="-216" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={900} fontSize="26" letterSpacing="2" fill={INK}>{sign}</text>
    <path d="M-242 13H242" stroke={INK} strokeWidth="13" strokeLinecap="round"/>
    <text x="0" y="78" textAnchor="middle" fontFamily={FONT_BODY} fontWeight={900} fontSize="23" fill={INK}>DRIVE THRU</text>
  </g>
);

const OfficeFront: React.FC<{x?: number; y?: number; s?: number}> = ({x = 0, y = 0, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-255" y="-370" width="510" height="376" rx="28" fill="#CFD6E4" stroke={INK} strokeWidth="12"/>
    <path d="M-260-300H260L222-382H-222Z" fill="#26324F" stroke={INK} strokeWidth="12" strokeLinejoin="round"/>
    <rect x="-200" y="-260" width="220" height="190" rx="10" fill="#9ED8E8" stroke={INK} strokeWidth="8"/>
    {[0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M-196 ${-250 + i * 30}H16`} stroke="#F4EBD3" strokeWidth="9"/>)}
    <rect x="50" y="-230" width="170" height="224" rx="12" fill="#26324F" stroke={INK} strokeWidth="8"/>
    <rect x="-80" y="-120" width="120" height="48" fill="#8C5B3A" stroke={INK} strokeWidth="7"/>
    <rect x="-210" y="-345" width="420" height="40" rx="12" fill={GOLD} stroke={INK} strokeWidth="7"/>
    <text x="0" y="-315" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={900} fontSize="23" letterSpacing="2" fill={INK}>LANDLORD'S OFFICE</text>
  </g>
);

const Building: React.FC<{x: number; y: number; s?: number; roof?: string}> = ({x, y, s = 1, roof = '#B6674E'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-150-165L0-245 150-165V70H-150Z" fill="#E8D8BA" stroke={INK} strokeWidth="10" strokeLinejoin="round"/>
    <path d="M-172-162L0-260 172-162" fill="none" stroke={roof} strokeWidth="22" strokeLinejoin="round"/>
    {[-90, 0, 90].map((dx, i) => <g key={i}><rect x={dx - 24} y="-133" width="48" height="60" rx="6" fill="#8EC8DC" stroke={INK} strokeWidth="7"/><rect x={dx - 24} y="-42" width="48" height="60" rx="6" fill="#8EC8DC" stroke={INK} strokeWidth="7"/></g>)}
    <rect x="-36" y="26" width="72" height="44" fill="#B8764B" stroke={INK} strokeWidth="7"/>
  </g>
);

const HQTower: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="9" strokeLinejoin="round">
    <rect x="-90" y="-330" width="180" height="330" rx="10" fill="#7FA8C9"/>
    <rect x="-60" y="-380" width="120" height="60" rx="8" fill="#6A93B5"/>
    {Array.from({length: 6}, (_, r) => [-55, -5, 40].map((dx, c) => <rect key={`${r}${c}`} x={dx} y={-300 + r * 48} width="30" height="30" rx="4" fill="#E6F4FA" strokeWidth="5"/>))}
    <rect x="-24" y="-60" width="48" height="60" fill="#26324F"/>
  </g>
);

const Plot: React.FC<{x: number; y: number; s?: number; sign?: string}> = ({x, y, s = 1, sign = 'RESTAURANT'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-330 -10L-270 80H270L330 -10Z" fill="#79B05C" stroke={INK} strokeWidth="10" strokeLinejoin="round"/>
    {[[-320, -6], [320, -6], [-262, 74], [262, 74]].map(([sx, sy], i) => (
      <g key={i}><path d={`M${sx} ${sy}V${sy - 46}`} stroke={INK} strokeWidth="8" strokeLinecap="round"/><path d={`M${sx} ${sy - 46}l26 8-26 8Z`} fill="#E5533D" stroke={INK} strokeWidth="4"/></g>
    ))}
    <Restaurant x={0} y={0} s={0.82} sign={sign}/>
  </g>
);

const Stamp: React.FC<{x: number; y: number; text: string; p: number; color?: string; rot?: number; size?: number}> = ({x, y, text, p, color = '#D9382B', rot = -10, size = 92}) => {
  const k = 1 + (1 - ease(p)) * 1.6;
  const shake = p > 0.6 && p < 0.9 ? Math.sin(p * 120) * 4 : 0;
  return (
    <g opacity={clamp(p * 6)} transform={`translate(${x + shake} ${y}) rotate(${rot}) scale(${k})`}>
      <rect x={-text.length * size * 0.36} y={-size * 0.75} width={text.length * size * 0.72} height={size * 1.3} rx="16" fill="none" stroke={color} strokeWidth="12"/>
      <text x="0" y={size * 0.3} textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={900} fontSize={size} fill={color} letterSpacing="4">{text}</text>
    </g>
  );
};

const Padlock: React.FC<{x: number; y: number; label: string; open: number}> = ({x, y, label, open}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-18 0V-22a18 18 0 0 1 36 0V0" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" transform={`translate(${open * 12} ${-open * 16})`}/>
    <rect x="-34" y="0" width="68" height="54" rx="10" fill={GOLD} stroke={INK} strokeWidth="8"/>
    <text x="0" y="36" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={900} fontSize="15" fill={INK}>{label}</text>
  </g>
);

const MoneyAlong: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; t: number; label?: string; color?: string; bend?: number}> = ({x1, y1, x2, y2, at, t, label = '$', color = GOLD, bend = 0}) => {
  const p = ease(mix(t, at, at + 1.0));
  const cx = (x1 + x2) / 2 + bend, cy = (y1 + y2) / 2;
  const x = (1 - p) * (1 - p) * x1 + 2 * (1 - p) * p * cx + p * p * x2;
  const y = (1 - p) * (1 - p) * y1 + 2 * (1 - p) * p * cy + p * p * y2;
  return (
    <g opacity={clamp((t - at) * 8)}>
      <path d={`M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth="8" strokeDasharray="15 13" opacity=".6"/>
      <Coin x={x} y={y} r={30} label={label}/>
    </g>
  );
};

const RedX: React.FC<{x: number; y: number; p: number; s?: number}> = ({x, y, p, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s * (0.6 + 0.4 * ease(p))})`} opacity={clamp(p * 5)} stroke="#D9382B" strokeWidth="20" strokeLinecap="round">
    <path d="M-70 -70L70 70M70 -70L-70 70"/>
  </g>
);

const MiniShop: React.FC<{x: number; y: number; color: string; flipP?: number}> = ({x, y, color, flipP = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${Math.max(0.05, Math.abs(Math.cos(flipP * Math.PI))) || 1} 1)`} stroke={INK} strokeWidth="5" strokeLinejoin="round">
    <rect x="-52" y="-44" width="104" height="70" rx="8" fill={PAPER}/>
    <path d="M-58-44H58L46-72H-46Z" fill={color}/>
    <rect x="-14" y="-10" width="28" height="36" fill="#B8764B"/>
  </g>
);

/* ───────────────────────── main ───────────────────────── */

type Who = 'host' | 'owner' | 'landlord';

export const McdonaldsRealEstate: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const progress = clamp(t / DURATION);
  const wob = (k: number) => Math.sin(t * k) * 0.1;

  const Char = ({who, x, mood, pose, y = 1352}: {who: Who; x: number; mood: any; pose: any; y?: number}) => (
    <CutoutCharacter
      x={x} y={y} scale={0.72} mood={mood} pose={pose}
      flip={x < 540}
      bob={wob(who === 'host' ? 2.1 : who === 'owner' ? 2.4 : 1.9)}
      {...(who === 'host' ? SELLER_A : SELLER_B)}
    />
  );
  const NameTag = ({x, text, fill}: {x: number; text: string; fill: string}) => (
    <Pill x={x - 130} y={1372} text={text} fill={fill} w={260} size={26}/>
  );

  // Scene helper: renders only the active scene with short fades; the last scene has no fade-out
  // so the final frame hard-cuts back to the opening burger.
  const scene = (i: number, render: (lt: number) => React.ReactNode) => {
    const a = B[i];
    const z = i === N - 1 ? DURATION + 1 : B[i + 1];
    if (t < a || t >= z) return null;
    const lt = t - a;
    const o = Math.min(i === 0 ? 1 : clamp(lt / 0.14), i === N - 1 ? 1 : clamp((z - t) / 0.1));
    return <g key={i} opacity={o}>{render(lt)}</g>;
  };

  // Titles (two lines, under 13 chars each)
  const TITLES: {from: number; l1: string; l2: string}[] = [
    {from: 0, l1: 'RENT BEATS', l2: 'BURGERS.'},
    {from: 2, l1: '95% RUN BY', l2: 'FRANCHISEES.'},
    {from: 5, l1: 'REAL ESTATE', l2: 'MODEL.'},
    {from: 9, l1: 'RENT FIRST.', l2: 'PROFIT LAST.'},
    {from: 12, l1: 'RESTAURANT?', l2: 'OR LANDLORD?'},
  ];
  const activeScene = B.reduce((acc, b, i) => (t >= b ? i : acc), 0);
  const title = [...TITLES].reverse().find(x => activeScene >= x.from) ?? TITLES[0];
  const titleStart = B[title.from];
  const tq = pop(t, titleStart, 0.4);
  const blackCut = t > B[5] - 0.1 && t < B[5] + 0.1;

  const bgKind = activeScene < 5 ? 'survey' : activeScene < 12 ? 'ledger' : 'dusk';

  return (
    <AbsoluteFill style={{background: PAPER}}>
      <Audio src={staticFile('audio/mcdonalds-real-estate/narration.mp3')}/>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <marker id="arrowhead" markerWidth="13" markerHeight="13" refX="8" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke={INK} strokeWidth="2"/></marker>
          <clipPath id="clipL"><rect x="40" y="420" width="480" height="980" rx="30"/></clipPath>
          <clipPath id="clipR"><rect x="560" y="420" width="480" height="980" rx="30"/></clipPath>
        </defs>

        {bgKind === 'survey' && <SurveyMapBg t={t}/>}
        {bgKind === 'ledger' && <LedgerBg/>}
        {bgKind === 'dusk' && <DuskBg/>}

        {/* Title (readable on all three backgrounds via stroke-like shadow plate) */}
        <g opacity={clamp((t - titleStart) * 8)} transform={`translate(0 ${30 * (1 - tq)}) scale(${0.93 + 0.07 * tq})`} style={{transformOrigin: '540px 280px'}}>
          <rect x="70" y="160" width="940" height="230" rx="36" fill="rgba(15,22,31,.82)"/>
          <Display x={540} y={265} text={title.l1} size={86} fill="#fff"/>
          <Display x={540} y={355} text={title.l2} size={86} fill={PALETTE.red}/>
        </g>

        {/* 0 · HOOK: burger flips into FOR SALE, RENT stamps over it */}
        {scene(0, lt => {
          const f = Math.cos(mix(lt, 0.3, 1.0) * Math.PI);
          return <g>
            <Plot x={540} y={1250} s={0.55} sign=""/>
            <g transform={`translate(540 900) scale(${Math.max(0.03, Math.abs(f))} 1)`}>
              {f >= 0
                ? <Burger x={0} y={0} s={1.5}/>
                : <g stroke={INK} strokeWidth="9">
                    <path d="M0 -20V220" strokeWidth="14"/>
                    <rect x="-200" y="-150" width="400" height="190" rx="20" fill="#fff"/>
                    <text x="0" y="-60" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={900} fontSize="68" fill="#D9382B" stroke="none">FOR</text>
                    <text x="0" y="14" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={900} fontSize="68" fill="#D9382B" stroke="none">SALE</text>
                  </g>}
            </g>
            <Stamp x={540} y={900} text="RENT" p={mix(lt, 1.0, 1.35)}/>
            <Char who="host" x={850} mood="shocked" pose="up"/>
          </g>;
        })}

        {/* 1 · PROPERTY DEAL + DRIVE-THRU */}
        {scene(1, lt => {
          const zoom = 1.5 - 0.6 * ease(mix(lt, 0, 0.7));
          const dY = 520 + 380 * ease(mix(lt, 0.7, 1.2));
          const car = mix(lt, 1.5, 3.2);
          return <g>
            <Plot x={640} y={1200} s={zoom * 0.85}/>
            <g opacity={clamp((lt - 0.7) * 6)} transform={`translate(640 ${dY}) rotate(-4)`}>
              <rect x="-150" y="-110" width="300" height="220" rx="12" fill="#FFF8E4" stroke={INK} strokeWidth="8"/>
              <Txt x={0} y={-50} size={40}>DEED</Txt>
              {[0, 1, 2].map(i => <path key={i} d={`M-100 ${-10 + i * 28}H100`} stroke="#B9A98E" strokeWidth="6"/>)}
              <rect x="110" y="70" width="64" height="26" rx="5" fill="#9AA3AA" stroke={INK} strokeWidth="5" transform={`rotate(${-8 * ease(mix(lt, 1.2, 1.4))} 140 82)`}/>
            </g>
            <g opacity={clamp((lt - 1.4) * 6)} transform={`translate(${380 + car * 520} 1330)`}>
              <rect x="-40" y="-30" width="80" height="34" rx="10" fill="#E5533D" stroke={INK} strokeWidth="6"/>
              <circle cx="-22" cy="6" r="10" fill={INK}/><circle cx="22" cy="6" r="10" fill={INK}/>
            </g>
            <Pill x={440} y={1420} text="PROPERTY DEAL + DRIVE-THRU" fill={PALETTE.greenDark} w={600} size={30}/>
            <Char who="host" x={200} mood="smug" pose="point"/>
          </g>;
        })}

        {/* 2 · 19 of 20 flip from red to green → ~95% */}
        {scene(2, lt => {
          const cols = 4;
          const flipAt = (k: number) => 0.9 + 2.3 * ((1 - Math.pow(0.9, k)) / (1 - Math.pow(0.9, 19)));
          return <g>
            {Array.from({length: 20}, (_, k) => {
              const r = Math.floor(k / cols), c = k % cols;
              const x = 470 + (c - 1.5) * 150, y = 640 + r * 130;
              const appear = clamp((lt - (r + c) * 0.06) * 8);
              const at = flipAt(k);
              const fp = k === 0 ? 0 : mix(lt, at, at + 0.22);
              const green = k !== 0 && fp > 0.5;
              return <g key={k} opacity={appear}><MiniShop x={x} y={y} color={green ? '#4E9A4E' : '#D7443B'} flipP={fp > 0 && fp < 1 ? fp : 1}/></g>;
            })}
            <g opacity={clamp((lt - 1) * 4)}>
              <Pill x={50} y={1300} text="COMPANY" fill="#D7443B" w={240} size={26}/>
            </g>
            <Txt x={540} y={1260} size={120} fill={GOLD}>{`~${Math.round(95 * ease(mix(lt, 0.9, 3.3)))}%`}</Txt>
            <Txt x={540} y={1330} size={26} head={false} fill={INK} opacity={0.85}>ABOUT 19 OF 20 · REPORTED IN COMPANY FILINGS</Txt>
            <Char who="host" x={140} mood="thinking" pose="point"/>
          </g>;
        })}

        {/* 3 · FRANCHISEES */}
        {scene(3, lt => {
          const hop = Math.abs(Math.sin(lt * 5)) * 70;
          return <g>
            {[0, 1, 2, 3, 4].map(i => <g key={i} opacity=".85"><MiniShop x={140 + i * 200} y={700 + (i % 2) * 20} color="#4E9A4E"/></g>)}
            <Plot x={650} y={1190} s={0.85}/>
            <g transform={`translate(430 ${960 - hop})`}><Burger x={0} y={0} s={0.34}/></g>
            <Char who="owner" x={330} mood="happy" pose="up"/>
            <Char who="host" x={850} mood="calm" pose="point"/>
            <NameTag x={330} text="FRANCHISEE" fill={PALETTE.greenDark}/>
          </g>;
        })}

        {/* 4 · TWO PIPES: ROYALTY + RENT → HQ */}
        {scene(4, lt => {
          const p1 = clamp((lt - 0.4) * 5), p2 = clamp((lt - 1.6) * 5);
          return <g>
            <HQTower x={640} y={820} s={0.9}/>
            <Plot x={640} y={1260} s={0.6}/>
            {[[560, '#8BC47E'], [720, '#E58C5F']].map(([px, c], i) => (
              <path key={i} d={`M${px} 1150V830`} stroke={c as string} strokeWidth="26" opacity=".9" strokeLinecap="round"/>
            ))}
            <g opacity={p1}>
              <circle cx="470" cy="1000" r="30" fill={PALETTE.greenDark} stroke={INK} strokeWidth="6"/><Txt x={470} y={1012} size={34} fill="#fff">1</Txt>
              <MoneyAlong x1={560} y1={1150} x2={560} y2={850} at={lt} t={lt} color="#8BC47E"/>
              <Pill x={300} y={1060} text="% OF SALES" fill={PALETTE.greenDark} w={240} size={24}/>
            </g>
            <g opacity={p2}>
              <circle cx="810" cy="1000" r="30" fill={PALETTE.red} stroke={INK} strokeWidth="6"/><Txt x={810} y={1012} size={34} fill="#fff">2</Txt>
              <g transform={`translate(${720 + 160} ${1130 - 260 * ease(mix(lt, 1.7, 2.7))})`}>
                <rect x="-60" y="-40" width="120" height="80" rx="8" fill="#FFF8E4" stroke={INK} strokeWidth="6"/>
                <Txt x={0} y={8} size={26}>LEASE</Txt>
              </g>
            </g>
            <Pill x={360} y={1400} text="① ROYALTY   ② RENT" fill={INK} w={600} size={30}/>
            <Char who="host" x={190} mood="thinking" pose="point"/>
          </g>;
        })}

        {/* 5 · THE REAL ESTATE MODEL (after black cut) */}
        {scene(5, lt => {
          const p = mix(lt, 0.05, 0.55);
          const ring = mix(lt, 0.4, 1.2);
          return <g>
            <circle cx="540" cy="900" r={120 + ring * 420} fill="none" stroke={GOLD} strokeWidth="12" opacity={(1 - ring) * 0.8}/>
            <g transform={`translate(540 900) scale(${0.4 + 0.6 * bounce(p)})`} opacity={clamp(p * 6)}>
              <rect x="-370" y="-210" width="740" height="420" rx="36" fill="#fff" stroke={INK} strokeWidth="10"/>
              <rect x="-200" y="-260" width="400" height="70" rx="35" fill={PALETTE.red} stroke={INK} strokeWidth="8"/>
              <Txt x={0} y={-212} size={34} fill="#fff" ls={2}>BUSINESS MODEL</Txt>
              <Txt x={0} y={20} size={72}>THE REAL ESTATE</Txt>
              <Txt x={0} y={110} size={72} fill={PALETTE.red}>MODEL</Txt>
              <g transform="translate(290 -130) scale(.28)"><Plot x={0} y={0} s={1} sign=""/></g>
            </g>
            <Char who="host" x={870} mood="smug" pose="point"/>
          </g>;
        })}

        {/* 6 · COMPANY BUYS THE LAND, OWNS THE BUILDING */}
        {scene(6, lt => {
          const drop = 1 - ease(mix(lt, 1.3, 1.9));
          return <g>
            <rect x="330" y="1000" width="560" height="260" rx="14" fill="none" stroke={INK} strokeWidth="8" strokeDasharray="24 16"/>
            <Stamp x={610} y={1130} text="BOUGHT" p={mix(lt, 0.8, 1.15)} rot={-8} size={70}/>
            <g opacity={clamp((lt - 1.3) * 6)} transform={`translate(0 ${-drop * 600})`}>
              <Restaurant x={610} y={1240} s={0.7}/>
              <g opacity={mix(lt, 1.9, 2.1)}><Pill x={500} y={1255} text="OWNED" fill={PALETTE.greenDark} w={220} size={30}/></g>
            </g>
            <Txt x={610} y={620} size={56} fill={PALETTE.greenDark} opacity={clamp((lt - 2.0) * 4)}>LAND ✓</Txt>
            <Txt x={610} y={700} size={56} fill={PALETTE.greenDark} opacity={clamp((lt - 2.4) * 4)}>BUILDING ✓</Txt>
            <Char who="landlord" x={180} mood="smug" pose="down"/>
            <NameTag x={180} text="LANDLORD" fill="#26324F"/>
            <Char who="host" x={920} mood="thinking" pose="point"/>
          </g>;
        })}

        {/* 7 · LEASES IT BACK */}
        {scene(7, lt => {
          const p = ease(mix(lt, 0.4, 1.6));
          const kx = 240 + (840 - 240) * p, ky = 940 - Math.sin(p * Math.PI) * 220;
          const swing = Math.sin(lt * 6) * 14;
          const back = mix(lt, 1.8, 2.8);
          return <g>
            <Plot x={540} y={1230} s={0.5}/>
            <g transform={`translate(${kx} ${ky})`}>
              <circle cx="0" cy="0" r="22" fill={GOLD} stroke={INK} strokeWidth="7"/><rect x="18" y="-6" width="60" height="12" fill={GOLD} stroke={INK} strokeWidth="5"/>
              <g transform={`translate(0 24) rotate(${swing})`}>
                <path d="M0 0V20" stroke={INK} strokeWidth="5"/>
                <rect x="-48" y="20" width="96" height="52" rx="8" fill={PALETTE.red} stroke={INK} strokeWidth="6"/>
                <Txt x={0} y={56} size={26} fill="#fff">RENT</Txt>
              </g>
            </g>
            <path d="M840 1000Q540 1120 240 1000" fill="none" stroke={INK} strokeWidth="7" strokeDasharray="12 12" opacity={back} markerEnd="url(#arrowhead)"/>
            <Pill x={380} y={1090} text="LEASE" fill="#26324F" w={320} size={30}/>
            <Char who="landlord" x={190} mood="smug" pose="point"/>
            <Char who="owner" x={890} mood="calm" pose="up"/>
            <Txt x={540} y={540} size={60} fill={PALETTE.red} opacity={clamp((lt - 0.5) * 4)}>LEASED BACK</Txt>
          </g>;
        })}

        {/* 8 · RENT + ROYALTIES, NOT THE FOOD */}
        {scene(8, lt => {
          const grow = ease(mix(lt, 0.2, 2.4));
          const slide = ease(mix(lt, 1.8, 3.0));
          const pile = (x: number, label: string, col: string) => (
            <g>
              <circle cx={x} cy="1120" r={90 + grow * 50} fill={GOLD} opacity={0.25 + 0.2 * Math.sin(t * 5)}/>
              {Array.from({length: 2 + Math.floor(grow * 7)}, (_, i) => <ellipse key={i} cx={x + (i % 2) * 12} cy={1300 - i * 26} rx="82" ry="22" fill={GOLD} stroke={INK} strokeWidth="6"/>)}
              <Pill x={x - 130} y={1330} text={label} fill={col} w={260} size={28}/>
            </g>
          );
          return <g>
            {pile(500, 'ROYALTY', PALETTE.greenDark)}
            {pile(820, 'RENT', PALETTE.red)}
            <g transform={`translate(${650 + slide * 700} 700)`}><Burger x={-120} y={0} s={0.5}/><Fries x={120} y={20} s={0.7}/></g>
            <RedX x={650} y={720} p={mix(lt, 2.2, 2.6)} s={1.4}/>
            <Txt x={650} y={560} size={58} fill={GOLD}>RENT + ROYALTIES</Txt>
            <Txt x={650} y={625} size={34} fill={INK} opacity={clamp((lt - 2) * 4)}>NOT THE FOOD</Txt>
            <Char who="host" x={170} mood="happy" pose="point"/>
          </g>;
        })}

        {/* 9 · OFF THE TOP: cleaver chops slice RENT then ROYALTY off the coin tower */}
        {scene(9, lt => {
          const slabs = [
            {label: 'PROFIT', col: '#F6EBC8', at: 99, to: [0, 0]},
            {label: 'SALES', col: GOLD, at: 99, to: [0, 0]},
            {label: 'SALES', col: GOLD, at: 99, to: [0, 0]},
            {label: 'SALES', col: GOLD, at: 99, to: [0, 0]},
            {label: 'ROYALTY', col: '#8BC47E', at: 2.0, to: [-420, -560]},
            {label: 'RENT', col: '#E58C5F', at: 1.2, to: [-420, -560]},
          ];
          const chop = (at: number, y: number) => {
            const p = mix(lt, at - 0.25, at);
            return <g opacity={clamp(p * 5) * (1 - mix(lt, at + 0.3, at + 0.5))} transform={`translate(660 ${y - 180 * (1 - p)}) rotate(20)`}>
              <path d="M0 0H110L90 60H0Z" fill="#C9D1D6" stroke={INK} strokeWidth="6"/><rect x="-60" y="14" width="64" height="26" fill="#8C5B3A" stroke={INK} strokeWidth="5"/>
            </g>;
          };
          return <g>
            <HQTower x={170} y={880} s={0.55}/>
            {slabs.map((s, i) => {
              const fly = ease(mix(lt, s.at, s.at + 0.7));
              const y = 1280 - i * 66;
              return <g key={i} transform={`translate(${540 + s.to[0] * fly} ${y + s.to[1] * fly})`}>
                <rect x="-170" y="-30" width="340" height="60" rx="12" fill={s.col} stroke={INK} strokeWidth="7"/>
                <Txt x={0} y={11} size={28}>{s.label}</Txt>
              </g>;
            })}
            {chop(1.2, 905)}{chop(2.0, 840)}
            <Txt x={540} y={560} size={64} fill={GOLD} opacity={clamp((lt - 1) * 4)}>OFF THE TOP</Txt>
            <Char who="host" x={900} mood="shocked" pose="up"/>
          </g>;
        })}

        {/* 10 · SPLIT SCREEN: same bill, thriving vs struggling */}
        {scene(10, lt => {
          const bill = ease(mix(lt, 0.8, 1.4));
          const equals = pop(t, B[10] + 1.6, 0.3);
          const panel = (cx: number, sunny: boolean) => (
            <g>
              <rect x={cx - 240} y="420" width="480" height="980" rx="30" fill={sunny ? '#BFE6F5' : '#8E99A6'}/>
              {sunny
                ? <g><circle cx={cx + 120} cy="540" r="60" fill="#FFD84D" stroke={INK} strokeWidth="6"/>
                    {[0, 1, 2].map(i => <g key={i} transform={`translate(${cx - 150 + i * 70} 1180)`}><circle cy="-90" r="22" fill="#F2C9A0" stroke={INK} strokeWidth="5"/><rect x="-20" y="-66" width="40" height="70" rx="12" fill={['#E5533D', '#4E9A4E', '#4A7FC0'][i]} stroke={INK} strokeWidth="5"/></g>)}
                    <Txt x={cx} y="1050" size={44} fill={PALETTE.greenDark}>KA-CHING!</Txt></g>
                : <g><path d={`M${cx - 130} 540q-50 0-50-40t60-40q20-50 80-30t60 60q60 0 40 50z`} fill="#5C6672" stroke={INK} strokeWidth="6"/>
                    {Array.from({length: 10}, (_, i) => <path key={i} d={`M${cx - 120 + i * 28} ${590 + ((t * 300 + i * 70) % 300)}l-8 24`} stroke="#DCEBFA" strokeWidth="5"/>)}
                    <g transform={`translate(${cx - 220 + ((t * 80) % 440)} 1230) rotate(${t * 300})`}><circle r="28" fill="none" stroke="#7A5C3A" strokeWidth="6" strokeDasharray="10 6"/></g>
                    <Txt x={cx} y="1050" size={40} fill="#3C4650">EMPTY QUEUE</Txt></g>}
              <g clipPath={`url(#${sunny ? 'clipL' : 'clipR'})`}>
                <g transform={`translate(${cx} ${700 + (1 - bill) * -400})`}>
                  <rect x="-130" y="-70" width="260" height="140" rx="12" fill="#FFF8E4" stroke={INK} strokeWidth="7"/>
                  <Txt x={0} y={-10} size={38} fill={PALETTE.red}>RENT DUE</Txt>
                  <Txt x={0} y={42} size={30}>SAME BILL</Txt>
                </g>
              </g>
              <Stamp x={cx} y={820} text="PAID" p={mix(lt, 2.2, 2.55)} color="#2E8B4A" rot={-8} size={64}/>
            </g>
          );
          return <g>
            {panel(280, true)}{panel(800, false)}
            <g transform={`translate(540 760) scale(${equals})`}><circle r="44" fill={GOLD} stroke={INK} strokeWidth="7"/><Txt x={0} y={22} size={64}>=</Txt></g>
            <Char who="owner" x={290} mood="happy" pose="up"/>
            <Char who="owner" x={790} mood="sad" pose="down"/>
          </g>;
        })}

        {/* 11 · BEFORE ANY PROFIT: locked jar, $0.00 */}
        {scene(11, lt => {
          const o1 = ease(mix(lt, 1.0, 1.3)), o2 = ease(mix(lt, 1.8, 2.1));
          const plink = ease(mix(lt, 2.4, 2.9));
          const mx = 540 + Math.sin(lt * 2.4) * 160;
          return <g>
            <g transform="translate(660 1020)" stroke={INK} strokeWidth="9">
              <path d="M-130 -190H130V120Q130 190 60 190H-60Q-130 190 -130 120Z" fill="rgba(255,255,255,.55)"/>
              <rect x="-150" y="-230" width="300" height="46" rx="14" fill="#B8764B"/>
              <Txt x={0} y={20} size={48} fill={INK}>PROFIT</Txt>
              <g opacity={plink > 0 ? 1 : 0} transform={`translate(0 ${-260 + plink * 320})`}><Coin x={0} y={0} r={26} label="¢"/></g>
            </g>
            <path d="M510 880L810 1160" stroke="#6B7075" strokeWidth="16" strokeLinecap="round" opacity={1 - o2}/>
            <path d="M810 880L510 1160" stroke="#6B7075" strokeWidth="16" strokeLinecap="round" opacity={1 - o1}/>
            <Padlock x={600} y={960} label="RENT" open={o1}/>
            <Padlock x={720} y={1060} label="ROYALTY" open={o2}/>
            <Txt x={660} y={620} size={110} fill={PALETTE.red} opacity={Math.floor(lt * 3) % 2 === 0 || lt > 2.4 ? 1 : 0.25}>{plink > 0.9 ? '$0.01' : '$0.00'}</Txt>
            <Txt x={660} y={690} size={34} fill={INK}>BEFORE PROFIT</Txt>
            <g transform={`translate(${mx} 820)`} opacity={1 - plink}><circle r="38" fill="rgba(200,230,245,.5)" stroke={INK} strokeWidth="8"/><path d="M28 28L70 70" stroke={INK} strokeWidth="12" strokeLinecap="round"/></g>
            <Char who="host" x={190} mood="thinking" pose="point"/>
          </g>;
        })}

        {/* 12 · COUNT THE PROPERTY, NOT THE FRIES (dusk) */}
        {scene(12, lt => {
          const f = Math.cos(mix(lt, 0.6, 1.2) * Math.PI);
          const n = Math.min(3, Math.floor(mix(lt, 1.3, 2.6) * 3) + (lt > 1.3 ? 1 : 0));
          const mx = 380 + 260 * ease(mix(lt, 1.2, 2.4));
          return <g>
            <g transform="translate(850 1180)" stroke={INK} strokeWidth="9" strokeLinecap="round">
              <path d="M0 0V-340" strokeWidth="14"/><path d="M-110 -330Q0 -470 110 -330" fill="none" stroke={GOLD} strokeWidth="22"/>
              <rect x="-90" y="-250" width="180" height="60" rx="10" fill="#fff"/><text x="0" y="-208" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={900} fontSize="30" fill={INK} stroke="none">DRIVE-THRU</text>
            </g>
            <g transform={`translate(560 1020) scale(${Math.max(0.03, Math.abs(f))} 1)`}>
              {f >= 0 ? <Fries x={0} y={0} s={1.5}/> : <g stroke={INK} strokeWidth="8"><rect x="-130" y="-70" width="260" height="140" rx="16" fill="#fff"/><text x="0" y="22" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={900} fontSize="72" fill={INK} stroke="none">LOT</text></g>}
            </g>
            <RedX x={560} y={1020} p={mix(lt, 2.6, 3.0)} s={1.2}/>
            <g transform={`translate(${mx} 800)`}><circle r="38" fill="rgba(255,255,255,.25)" stroke="#fff" strokeWidth="8"/><path d="M28 28L70 70" stroke="#fff" strokeWidth="12" strokeLinecap="round"/></g>
            <Txt x={540} y={1250} size={64} fill={GOLD}>{`${n > 0 ? n : ''}`}</Txt>
            <Txt x={540} y={1430} size={36} head={false} fill="#fff">COUNT THE PROPERTY · NOT THE FRIES</Txt>
            <Char who="host" x={190} mood="smug" pose="point"/>
          </g>;
        })}

        {/* 13 · FACADE FLIP + COMMENT (loops to opening) */}
        {scene(13, lt => {
          const period = 1.0;
          const k = Math.floor(lt / period);
          const ph = (lt % period) / period;
          const sc = Math.max(0.03, Math.abs(Math.cos(mix(ph, 0.75, 1) * Math.PI)));
          const showOffice = k % 2 === 1;
          const bubble = pop(t, Math.max(B[13] + 2.2, COMMENTS - 0.2), 0.35);
          return <g>
            <g transform={`translate(540 1000) scale(${sc} 1)`}>
              {showOffice ? <OfficeFront x={0} y={150} s={0.95}/> : <Restaurant x={0} y={150} s={0.95}/>}
            </g>
            <Char who="landlord" x={170} mood="smug" pose="up"/>
            <Char who="host" x={910} mood="thinking" pose="point"/>
            <Txt x={540} y={520} size={54} fill="#fff">{showOffice ? 'LANDLORD?' : 'RESTAURANT?'}</Txt>
            <g transform={`translate(540 1400) scale(${bubble})`} opacity={bubble}>
              <rect x="-300" y="-50" width="600" height="100" rx="30" fill="#fff" stroke={INK} strokeWidth="8"/>
              <Txt x={-20} y={14} size={34}>TELL ME IN THE COMMENTS</Txt>
              <rect x="262" y="-26" width="8" height="52" fill={INK} opacity={Math.floor(t * 2.5) % 2 === 0 ? 1 : 0}/>
            </g>
            <Txt x={910} y={1470} size={22} head={false} fill="#fff" opacity={0.8}>ODDLY LOGICAL</Txt>
          </g>;
        })}

        {/* 6-frame black cut on the hand-off to the ledger scene */}
        {blackCut && <rect width="1080" height="1920" fill="#000"/>}
      </svg>

      {/* progress bar */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: '#172026'}}>
        <div style={{height: '100%', width: `${progress * 100}%`, background: GOLD}}/>
      </div>
      <CaptionPanel t={t}/>
    </AbsoluteFill>
  );
};

const CaptionPanel: React.FC<{t: number}> = ({t}) => {
  const c = captions.find(item => t >= item.start && t <= item.end + 0.03);
  if (!c) return null;
  const pieces = c.text.split(' ');
  return (
    <div style={{position: 'absolute', left: 74, right: 74, top: 1500, minHeight: 126, padding: '26px 28px', boxSizing: 'border-box', borderRadius: 24, background: 'rgba(15,22,31,.9)', border: `3px solid ${GOLD}`, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#fff', fontFamily: FONT_BODY, fontSize: 38, fontWeight: 900, lineHeight: 1.22, textShadow: '0 2px 1px #000'}}>
      {pieces.map((word, i) => (
        <span key={i} style={{color: HILITE.test(norm(word)) ? GOLD : '#fff', marginRight: i === pieces.length - 1 ? 0 : '.27em'}}>{word}</span>
      ))}
    </div>
  );
};