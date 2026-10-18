import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CutoutCharacter, SELLER_A, SELLER_B, Mood, ArmPose} from '../../curious/Character';
import {FONT_BODY, FONT_HEAD, PALETTE} from '../../curious/theme';
import {Coin, Display, Pill, ProductBox, Storefront, TermCard, fade, pop} from '../../curious/primitives';
import timestampData from './word-timestamps.json';

const FPS = 30;
const DURATION = 61.25275;
const BLACK_FLASH_START = 17.325;
const BLACK_FLASH_END = BLACK_FLASH_START + 6 / FPS;

/**
 * LAYOUT RULES (1080 x 1920)
 *  - Title band:   y 140 - 455
 *  - Content band: y 500 - 1330 (everything explanatory lives here)
 *  - Caption box:  y 1480 - 1650
 *  - Host stands at x=148 (left) or x=950 (right, flipped). His pointing hand lands near x=336 / x=762 at y~1024,
 *    so keep important content right of x=390 when he is on the left, and left of x=830 when he is on the right.
 *  - Long strings go through fit()/FitDisplay so they can never run off the 1080px canvas.
 */

const beats = [
  {a:0,b:4.4,title:'MORE MONEY.',red:'MORE SALES.'},
  {a:4.4,b:9.04,title:'MORE MONEY.',red:'MORE SALES.'},
  {a:9.04,b:11.52,title:'NOT',red:'CONFUSED.'},
  {a:11.52,b:14.525,title:'NOT',red:'CONFUSED.'},
  {a:14.525,b:18.205,title:'THREE',red:'PRICES.'},
  {a:18.205,b:21.325,title:'THREE',red:'PRICES.'},
  {a:21.325,b:24.125,title:'THREE',red:'PRICES.'},
  {a:24.125,b:28.75,title:'THE NINE.',red:'IS THE PRICE.'},
  {a:28.75,b:31.23,title:'THE NINE.',red:'IS THE PRICE.'},
  {a:31.23,b:35.15,title:'THE NINE.',red:'IS THE PRICE.'},
  {a:35.15,b:42.775,title:'THE NINE.',red:'IS THE PRICE.'},
  {a:42.775,b:47.495,title:'THE TAG.',red:'LIES.'},
  {a:47.495,b:52.695,title:'THE TAG.',red:'LIES.'},
  {a:52.695,b:56.37275,title:'DISCOUNT?',red:'DISGUISE?'},
  {a:56.37275,b:DURATION,title:'DISCOUNT?',red:'DISGUISE?'},
];

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (t: number, a: number, d = .42) => {const p = clamp((t - a) / d); return 1 - Math.pow(1 - p, 3);};

/** Conservative width estimate for heavy display fonts, and a font size that never exceeds maxW. */
const estW = (text: string, size: number, k = .66) => text.length * size * k;
const fit = (text: string, size: number, maxW = 900, k = .66) => Math.min(size, maxW / (text.length * k));

type DisplayProps = React.ComponentProps<typeof Display>;
const FitDisplay: React.FC<DisplayProps & {maxW?: number}> = ({maxW = 900, text, size = 60, ...rest}) => (
  <Display text={text} size={fit(text, size, maxW)} {...rest}/>
);

type TsWord = {start: number; end: number; punctuated_word: string};
const words = timestampData.words as unknown as TsWord[];

const findWord = (re: RegExp, after: number, fallback: number) => {
  const w = words.find(x => x.start >= after && re.test(x.punctuated_word.replace(/[^\w']/g, '')));
  return w ? w.start : fallback;
};
const WERENT_AT = findWord(/^weren'?t$/i, 9, 10.0);
const TEN_AT = findWord(/^ten$/i, 24, 26.9);

/** Caption phrases: max 4 words / 24 characters, never crossing a sentence end. */
type Chunk = {from: number; to: number};
const chunks: Chunk[] = (() => {
  const out: Chunk[] = [];
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
/* building blocks                                                     */
/* ------------------------------------------------------------------ */

const Host: React.FC<{x: number; mood: Mood; pose: ArmPose; flip?: boolean; green?: boolean; t?: number}> = ({x, mood, pose, flip = false, green = false, t = 0}) => (
  <CutoutCharacter x={x} y={1330} scale={.8} mood={mood} pose={pose} flip={flip} bob={Math.sin(t * 2.5) * .12}
    {...(green ? SELLER_B : SELLER_A)}/>
);

/** Pops a child (drawn around 0,0) in at x,y. */
const PopIn: React.FC<{t: number; at: number; x: number; y: number; s?: number; children: React.ReactNode}> = ({t, at, x, y, s = 1, children}) => (
  t < at ? null : <g transform={`translate(${x} ${y}) scale(${s * pop(t, at, .45)})`} opacity={fade(t, at, .16)}>{children}</g>
);

/** Pops children (drawn in absolute coords) in, scaling around cx,cy. */
const PopAround: React.FC<{t: number; at: number; cx: number; cy: number; children: React.ReactNode}> = ({t, at, cx, cy, children}) => (
  t < at ? null : <g transform={`translate(${cx} ${cy}) scale(${pop(t, at, .4)}) translate(${-cx} ${-cy})`} opacity={fade(t, at, .15)}>{children}</g>
);

const PriceTag: React.FC<{
  x: number; y: number; price: string; s?: number; dim?: boolean; ghost?: boolean; highlight?: boolean;
  rotation?: number; tailSmall?: boolean; tailOpacity?: number; strike?: boolean;
}> = ({x, y, price, s = 1, dim = false, ghost = false, highlight = false, rotation = 0, tailSmall = false, tailOpacity = 1, strike = false}) => {
  const match = price.match(/^(\$?)(\d+)(.*)$/);
  const prefix = match?.[1] ?? ''; const left = match?.[2] ?? price; const tail = match?.[3] ?? '';
  return <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${s})`} opacity={dim ? .24 : 1}>
    <path d="M-168 -108H112L168 -52V108H-168Z" fill={ghost ? '#F5F2EA' : '#CE3044'} stroke={PALETTE.ink} strokeWidth="14" strokeLinejoin="round"/>
    <path d="M112 -108V-52H168" fill={ghost ? '#DED8CC' : '#9E2035'} stroke={PALETTE.ink} strokeWidth="10" strokeLinejoin="round"/>
    <circle cx="-132" cy="-72" r="13" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="7"/>
    <text x="0" y="31" textAnchor="middle" fontFamily={FONT_HEAD} fontWeight="900" fontSize={tailSmall ? 126 : 105} fill={ghost ? PALETTE.slate : '#FFFDF6'} stroke={PALETTE.ink} strokeWidth="4" paintOrder="stroke">
      {prefix}<tspan fill={highlight ? PALETTE.gold : '#FFFDF6'}>{left}</tspan><tspan fontSize={tailSmall ? 35 : 58} fill={highlight ? '#FFEAB0' : '#FFD6D9'} opacity={tailOpacity}>{tail}</tspan>
    </text>
    {(strike || ghost) && <path d="M-112 8L112 -12" stroke={PALETTE.red} strokeWidth="15" strokeLinecap="round"/>}
    {highlight && <ellipse cx="10" cy="-4" rx="67" ry="84" fill="none" stroke={PALETTE.gold} strokeWidth="11"/>}
  </g>;
};

/** Arrow drawn from (x,y). rotate 0 = up, -90 = left, 90 = right, 180 = down. */
const RedArrow: React.FC<{x: number; y: number; scale?: number; rotate?: number}> = ({x, y, scale = 1, rotate = -18}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <path d="M0 0V-150M0 -150L-43 -91M0 -150L43 -91" stroke={PALETTE.red} strokeWidth="24" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
);

const SalesBars: React.FC<{t: number; winner?: number}> = ({t, winner = 1}) => {
  const starts = [6.1, 6.3]; const values = [150, 230];
  return <g>{[0, 1].map(i => {
    const h = values[i] * ease(t, starts[i], .9); const x = 430 + i * 220;
    if (h < 8) return null;
    return <g key={i}>
      <rect x={x} y={1280 - h} width="126" height={h} rx="16" fill={i === winner ? PALETTE.green : PALETTE.red} stroke={PALETTE.ink} strokeWidth="8"/>
      <circle cx={x + 63} cy={1272 - h} r="25" fill={PALETTE.cream} stroke={PALETTE.ink} strokeWidth="7"/>
      <text x={x + 63} y="1318" textAnchor="middle" fontFamily={FONT_HEAD} fontSize="30" fill={PALETTE.ink}>{i ? '$39' : '$34'}</text>
    </g>;
  })}</g>;
};

const MiniCrowd: React.FC<{t: number}> = ({t}) => <g>{Array.from({length: 5}, (_, i) => {
  const x = 330 + i * 105, green = i % 2 === 1;
  return <g key={i}>
    <CutoutCharacter x={x} y={1284} scale={.27 * pop(t, 9.05 + i * .08, .35)} mood="calm" pose="down" {...(green ? SELLER_B : SELLER_A)}/>
    <g transform={`translate(${x} 1042)`} opacity={ease(t, 9.1 + i * .08, .25)}>
      <path d="M-32 -40Q-32 -62 0 -62H33Q50 -62 50 -44V-11Q50 4 33 4H3L-13 20V4H-32Q-47 4-47 -12V-40Z" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="6"/>
      <text x="1" y="-19" textAnchor="middle" fontFamily={FONT_HEAD} fontSize="38" fontWeight="900" fill={PALETTE.red}>?</text>
    </g>
  </g>;
})}</g>;

const ThoughtBrain: React.FC<{t: number}> = ({t}) => {
  const turn = t * 125;
  return <g>
    {/* bubble trail from his head to the brain */}
    {[[255, 885, 8], [312, 848, 11], [378, 815, 14]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r * pop(t, 11.5 + i * .12, .3)} fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth={5}/>
    ))}
    <g transform={`translate(545 ${825 - 65 * ease(t, 11.6, .6)})`} opacity={ease(t, 11.55, .45)}>
      <circle cx="0" cy="105" r="14" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="6"/>
      <circle cx="-24" cy="72" r="10" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="5"/>
      <g transform="translate(0 -15)">
        <path d="M0 -125C-44 -166 -105 -131 -91 -78C-145 -43 -116 23 -77 27C-68 78 -20 82 0 52C26 86 82 73 79 28C130 8 118 -56 89 -67C101 -120 47 -156 0 -125Z" fill="#EC9FB2" stroke={PALETTE.ink} strokeWidth="12"/>
        <path d="M0 -120V54M-57 -105Q-20 -75 -51 -48M61 -104Q24 -71 60 -48M-84 -10Q-41 -29 -55 24M78 -14Q43 -2 59 34" fill="none" stroke="#A94C68" strokeWidth="9" strokeLinecap="round"/>
        <g transform={`rotate(${turn} 0 -8)`} fill="none" stroke={PALETTE.goldDeep} strokeWidth="7"><circle cx="0" cy="-8" r="21"/><path d="M0 -42V26M-34 -8H34"/></g>
        <g transform={`rotate(${-turn * 1.25} 52 21)`} fill="none" stroke={PALETTE.goldDeep} strokeWidth="6"><circle cx="52" cy="21" r="14"/><path d="M52 -2V44M29 21H75"/></g>
      </g>
    </g>
  </g>;
};

/** A vertical scan beam sweeps across the tag and stops on the first digit; the eye follows it. */
const EyeScan: React.FC<{t: number; from: number; to: number}> = ({t, from, to}) => {
  const p = ease(t, 28.75, 1.0);
  const bx = from + (to - from) * p;
  return <g>
    <rect x={bx - 30} y={800} width={60} height={310} fill={PALETTE.red} opacity={.14}/>
    <rect x={bx - 6} y={800} width={12} height={310} rx={6} fill={PALETTE.red} opacity={.9}/>
    <g transform={`translate(${bx} 735)`}>
      <ellipse rx="56" ry="31" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="8"/>
      <circle cx={(1 - p) * -14} cy="4" r="14" fill={PALETTE.blue} stroke={PALETTE.ink} strokeWidth="6"/>
    </g>
  </g>;
};

const StorefrontTag: React.FC<{x: number; y: number; price: string; lit: boolean}> = ({x, y, price, lit}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-66" y="-40" width="132" height="80" rx="9" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="6"/>
    <text textAnchor="middle" y="11" fontFamily={FONT_HEAD} fontWeight="900" fontSize={fit(price, 32, 118, .62)}>
      <tspan fill={PALETTE.ink}>{price.charAt(0)}</tspan><tspan fill={lit ? PALETTE.red : PALETTE.ink}>{price.charAt(1)}</tspan><tspan fill={PALETTE.slate}>{price.slice(2)}</tspan>
    </text>
  </g>
);

const SplitTag: React.FC<{t: number}> = ({t}) => {
  const flip = t > 54 ? Math.sin((t - 54) * 8) : 0;
  return <g transform={`translate(580 960) rotate(${flip * 4}) scale(${pop(t, 52.7, .5)})`}>
    <path d="M-300 -122H0V122H-300Z" fill="#D64545" stroke={PALETTE.ink} strokeWidth="12"/>
    <path d="M0 -122H300V122H0Z" fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth="12"/>
    {/* left: discount badge */}
    <circle cx="-150" cy="-28" r="46" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="8"/>
    <text x="-150" y="-10" textAnchor="middle" fontFamily={FONT_HEAD} fontSize="56" fontWeight="900" fill={PALETTE.red}>%</text>
    <text x="-150" y="84" textAnchor="middle" fontFamily={FONT_HEAD} fontSize="40" fontWeight="900" fill={PALETTE.paper}>DISCOUNT?</text>
    {/* right: glasses + mustache, kept above the label */}
    <circle cx="112" cy="-44" r="28" fill="none" stroke={PALETTE.ink} strokeWidth="8"/>
    <circle cx="188" cy="-44" r="28" fill="none" stroke={PALETTE.ink} strokeWidth="8"/>
    <path d="M140 -44H160" stroke={PALETTE.ink} strokeWidth="8" strokeLinecap="round"/>
    <path d="M110 6Q150 -14 190 6Q170 32 150 20Q130 32 110 6Z" fill={PALETTE.ink}/>
    <text x="150" y="84" textAnchor="middle" fontFamily={FONT_HEAD} fontSize="40" fontWeight="900" fill={PALETTE.ink}>DISGUISE?</text>
  </g>;
};

const CommentCTA: React.FC<{t: number}> = ({t}) => <g>
  <PopAround t={t} at={56.5} cx={520} cy={830}>
    <g transform="translate(520 810) scale(.95)">
      <path d="M-240 -105H240Q270 -105 270 -75V55Q270 85 240 85H-120L-196 147V85H-240Q-270 85-270 55V-75Q-270 -105-240 -105Z" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="12"/>
      <circle cx="-120" cy="-15" r="11" fill={PALETTE.ink}/><circle cx="-65" cy="-15" r="11" fill={PALETTE.ink}/>
      <path d={`M-8 -15H${t % 1 < .5 ? 128 : 156}`} stroke={PALETTE.ink} strokeWidth="11"/>
    </g>
  </PopAround>
  <PopAround t={t} at={57.6} cx={540} cy={1114}>
    <g transform={`translate(540 1114) scale(${1 + .04 * Math.sin(t * 13)})`}>
      <rect x="-192" y="-67" width="384" height="125" rx="34" fill={t > 59 ? PALETTE.red : PALETTE.green} stroke={PALETTE.ink} strokeWidth="11"/>
      <text y="15" textAnchor="middle" fontFamily={FONT_HEAD} fontSize="66" fontWeight="900" fill={PALETTE.paper}>FOLLOW</text>
    </g>
  </PopAround>
  {t >= 58.4 && <FitDisplay x={540} y={1262} text="ODDLY LOGICAL" size={46} fill={PALETTE.gold} opacity={fade(t, 58.4, .3)}/>}
</g>;

/* ------------------------------------------------------------------ */
/* backgrounds: a shop-aisle room (replaces SkyScene) and a rotating burst */
/* ------------------------------------------------------------------ */

const THEMES = {
  teal: {wall: '#2F8C99', wall2: '#1D6270', floor: '#D79A5B', floor2: '#B57A40', seam: '#8F5C2B', base: '#E9C99A'},
  plum: {wall: '#7B52B5', wall2: '#4F3282', floor: '#D9A76A', floor2: '#B98448', seam: '#8F5C2B', base: '#EBD0A3'},
};
type ThemeName = keyof typeof THEMES;

/** Soft spotlight behind the content + edge vignette. Drawn under the characters and props. */
const Atmos: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="spotG" cx="50%" cy="48%" r="55%">
        <stop offset="0" stopColor="#fff" stopOpacity=".28"/>
        <stop offset="1" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="vigG" cx="50%" cy="50%" r="75%">
        <stop offset=".55" stopColor="#000" stopOpacity="0"/>
        <stop offset="1" stopColor="#000" stopOpacity=".38"/>
      </radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#spotG)"/>
    <rect width="1080" height="1920" fill="url(#vigG)"/>
  </g>
);

/** Wooden floor with perspective seams, starting at y=1330 where the characters stand. */
const Floor: React.FC<{theme: ThemeName}> = ({theme}) => {
  const c = THEMES[theme];
  const xs = [-420, -120, 150, 345, 540, 735, 930, 1200, 1500];
  return <g>
    <defs>
      <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c.floor}/>
        <stop offset="1" stopColor={c.floor2}/>
      </linearGradient>
    </defs>
    <rect x="0" y="1330" width="1080" height="590" fill="url(#floorG)"/>
    {xs.map(x => <path key={x} d={`M${540 + (x - 540) * .3} 1330L${x} 1920`} stroke={c.seam} strokeWidth="4" opacity=".35"/>)}
    {[1405, 1500, 1620, 1770].map(y => <path key={y} d={`M0 ${y}H1080`} stroke={c.seam} strokeWidth="4" opacity=".3"/>)}
    <rect x="0" y="1330" width="1080" height="22" fill="#000" opacity=".16"/>
  </g>;
};

/** Standard background: colored wall with slowly drifting dots, wainscot, baseboard, wooden floor. */
const Room: React.FC<{t: number; theme?: ThemeName; children?: React.ReactNode}> = ({t, theme = 'teal', children}) => {
  const c = THEMES[theme];
  const drift = (t * 8) % 64;
  return <g>
    <defs>
      <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c.wall2}/>
        <stop offset="1" stopColor={c.wall}/>
      </linearGradient>
      <pattern id="dotsP" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform={`translate(${drift} ${drift})`}>
        <circle cx="32" cy="32" r="6" fill="#fff" opacity=".1"/>
      </pattern>
    </defs>
    <rect width="1080" height="1330" fill="url(#wallG)"/>
    <rect width="1080" height="1330" fill="url(#dotsP)"/>
    <rect x="0" y="1190" width="1080" height="120" fill={c.wall2} opacity=".45"/>
    <path d="M0 1190H1080" stroke="#fff" strokeWidth="5" opacity=".18"/>
    <rect x="0" y="1306" width="1080" height="26" fill={c.base}/>
    <Floor theme={theme}/>
    <Atmos/>
    {children}
  </g>;
};

/** Rotating sunburst for the big "wins / term" moments (replaces Sunburst). */
const Burst: React.FC<{t: number; base: string; ray: string; cx?: number; cy?: number; children?: React.ReactNode}> = ({t, base, ray, cx = 540, cy = 820, children}) => {
  const n = 18, seg = Math.PI * 2 / n, spin = t * .05, r = 1800;
  return <g>
    <rect width="1080" height="1330" fill={base}/>
    {Array.from({length: n}, (_, i) => {
      const a = i * seg + spin;
      return <path key={i} d={`M${cx} ${cy}L${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}L${cx + Math.cos(a + seg * .5) * r} ${cy + Math.sin(a + seg * .5) * r}Z`} fill={ray} opacity=".45"/>;
    })}
    <Floor theme="teal"/>
    <Atmos/>
    {children}
  </g>;
};

/* ------------------------------------------------------------------ */
/* stage                                                               */
/* ------------------------------------------------------------------ */

const Stage: React.FC<{t: number}> = ({t}) => {
  const host = (x: number, mood: Mood, pose: ArmPose, flip = false, green = false) => <Host x={x} mood={mood} pose={pose} flip={flip} green={green} t={t}/>;

  /* 0 - 9.04: the hook, then +$5 and sales bars */
  if (t < 9.04) {
    const k = ease(t, 4.4, .5);
    const L = (a: number, b: number) => a + (b - a) * k;
    return <Room t={t}>
      <ProductBox x={540} y={890} s={1.15} label="SWEATER" tag="" tint="#7B96B5"/>
      <PopIn t={t} at={2.08} x={540} y={L(790, 716)} s={L(.95, .78)}><PriceTag x={0} y={0} price="$39"/></PopIn>
      <PopIn t={t} at={3.52} x={540} y={L(1020, 1010)} s={L(.86, .56)}><PriceTag x={0} y={0} price="$34"/></PopIn>
      <PopAround t={t} at={4.6} cx={860} cy={716}><RedArrow x={860} y={716} rotate={-90}/></PopAround>
      <PopAround t={t} at={4.9} cx={540} cy={859}><Pill x={435} y={818} text="+$5" fill={PALETTE.red} w={210} size={48}/></PopAround>
      {t >= 6.1 && <SalesBars t={t}/>}
      {host(148, 'shocked', 'point')}
    </Room>;
  }

  /* 9.04 - 11.52: not confused */
  if (t < 11.52) {
    return <Room t={t}>
      <MiniCrowd t={t}/>
      <PopAround t={t} at={WERENT_AT} cx={540} cy={1130}>
        <path d="M300 1000L780 1260M780 1000L300 1260" stroke={PALETTE.red} strokeWidth="44" strokeLinecap="round"/>
      </PopAround>
      {host(148, 'smug', 'down')}
    </Room>;
  }

  /* 11.52 - 14.525: brains (label moved above the brain so they no longer overlap) */
  if (t < 14.525) {
    return <Room t={t}>
      <ThoughtBrain t={t}/>
      <PopAround t={t} at={11.7} cx={540} cy={525}><FitDisplay x={540} y={545} text="JUST BRAINS" size={62} fill={PALETTE.greenDark}/></PopAround>
      {host(148, 'thinking', 'up')}
    </Room>;
  }

  /* 14.525 - 21.325: three prices */
  if (t < 21.325) {
    const xs = [310, 520, 730];
    const at = [18.205, 19.245, 20.205];
    return <Room t={t}>
      <FitDisplay x={540} y={560} text="SAME SWEATER" size={58} fill={PALETTE.greenDark}/>
      {xs.map((x, i) => <g key={x}>
        <g transform={`translate(${x} 835) scale(${.48 + .52 * ease(t, 14.525 + i * .15, .5)})`}><ProductBox x={0} y={0} s={.95} label="SWEATER" tag="" tint="#7B96B5"/></g>
        {t < at[i]
          ? <PriceTag x={x} y={1080} price="?" s={.56} ghost/>
          : <PopIn t={t} at={at[i]} x={x} y={1080} s={.56}><PriceTag x={0} y={0} price={['$34', '$39', '$44'][i]}/></PopIn>}
      </g>)}
      {host(950, 'shocked', 'down', true)}
    </Room>;
  }

  /* 21.325 - 24.125: $39 wins (bars moved below the tags so they no longer cover them) */
  if (t < 24.125) {
    const xs = [300, 510, 720];
    return <Burst t={t} base="#F29B2E" ray="#FFD46A" cy={820}>
      {xs.map((x, i) => {
        const bh = (i === 1 ? 220 : 145) * ease(t, 21.5 + i * .12, .75);
        return <g key={x} opacity={i === 1 ? 1 : .45}>
          <ProductBox x={x} y={790} s={.66} label="SWEATER" tag="" tint="#7B96B5"/>
          <PriceTag x={x} y={940} price={['$34', '$39', '$44'][i]} s={.47} dim={i !== 1}/>
          <rect x={x - 54} y={1290 - bh} width="108" height={bh} rx="13" fill={i === 1 ? PALETTE.green : PALETTE.slate} stroke={PALETTE.ink} strokeWidth="7"/>
        </g>;
      })}
      {[0, 1, 2, 3, 4].map(i => <g key={i} transform={`translate(${440 + i * 54} ${690 + ((t * 160 + i * 95) % 330)})`} opacity={ease(t, 22 + i * .1, .25)}><Coin x={0} y={0} r={25} label="$"/></g>)}
      <FitDisplay x={540} y={620} text="$39 WINS" size={68} fill={PALETTE.paper}/>
      {host(950, 'happy', 'up', true)}
    </Burst>;
  }

  /* 24.125 - 31.23: nine ninety-nine is not ten dollars, then the eyes stop on the nine */
  if (t < 31.23) {
    const TAG_X = 575, TAG_Y = 960, TAG_S = 1.3;
    const scanFrom = TAG_X - 168 * TAG_S + 20;
    const scanTo = TAG_X + 10 * TAG_S; // lands on the gold ring around the 9
    const stopped = t >= 29.9;
    return <Room t={t} theme="plum">
      <PopIn t={t} at={24.125} x={TAG_X} y={TAG_Y} s={TAG_S}><PriceTag x={0} y={0} price="$9.99" highlight={stopped}/></PopIn>
      {t >= TEN_AT && t < 28.75 && <PopIn t={t} at={TEN_AT} x={TAG_X} y={650} s={.6}><PriceTag x={0} y={0} price="$10.00" ghost strike/></PopIn>}
      {t >= 28.75 && <EyeScan t={t} from={scanFrom} to={scanTo}/>}
      {host(148, t < 28.75 ? 'thinking' : 'calm', 'point')}
    </Room>;
  }

  /* 31.23 - 35.15: the nine is the price, the .99 is decoration */
  if (t < 35.15) {
    const progress = ease(t, 31.23, 1.5);
    return <Room t={t} theme="plum">
      <PriceTag x={600} y={940} price="$9.99" s={1.45} highlight tailSmall={progress > .35} tailOpacity={1 - progress * .75}/>
      {t >= 32.11 && <>
        <PopAround t={t} at={32.11} cx={400} cy={690}><FitDisplay x={400} y={700} text="THE PRICE" size={47} fill={PALETTE.greenDark} maxW={420}/></PopAround>
        <path d="M430 722Q500 760 560 800" fill="none" stroke={PALETTE.ink} strokeWidth="7" strokeLinecap="round" opacity={fade(t, 32.3, .3)}/>
      </>}
      {t >= 33.2 && <>
        <PopAround t={t} at={33.2} cx={810} cy={690}><FitDisplay x={810} y={700} text="DECORATION" size={40} fill={PALETTE.slate} maxW={420}/></PopAround>
        <path d="M790 722Q740 760 700 800" fill="none" stroke={PALETTE.ink} strokeWidth="7" strokeLinecap="round" opacity={fade(t, 33.4, .3)}/>
      </>}
      {host(148, 'smug', 'point')}
    </Room>;
  }

  /* 35.15 - 42.775: the left-digit effect (card was off-screen before; now centered and fitted) */
  if (t < 42.775) {
    const term = 'LEFT-DIGIT EFFECT';
    return <Burst t={t} base="#5B3FA8" ray="#8A6BDA" cy={830}>
      <PopAround t={t} at={35.15} cx={540} cy={700}>
        <TermCard x={90} y={620} w={900} term={term} definition="One digit gets your attention" size={fit(term, 92, 820)}/>
      </PopAround>
      <g transform={`translate(570 1060) scale(${1 + .04 * Math.sin(t * 6)})`}>
        <PriceTag x={0} y={0} price="$9.99" s={.7} highlight tailSmall/>
      </g>
      {/* tiny .99 sitting on a little stool */}
      <g transform="translate(880 1090)">
        <FitDisplay x={0} y={-6} text=".99" size={46} fill={PALETTE.slate}/>
        <rect x="-62" y="10" width="124" height="38" rx="8" fill={PALETTE.wood} stroke={PALETTE.ink} strokeWidth="7"/>
        <rect x="-46" y="48" width="16" height="46" fill={PALETTE.wood} stroke={PALETTE.ink} strokeWidth="6"/>
        <rect x="30" y="48" width="16" height="46" fill={PALETTE.wood} stroke={PALETTE.ink} strokeWidth="6"/>
      </g>
      {host(148, 'smug', 'point')}
    </Burst>;
  }

  /* 42.775 - 47.495: every store (stores narrowed so the host no longer stands on the third one) */
  if (t < 47.495) {
    const lit = Math.floor((t - 42.775) * 2.4 + 1);
    const xs = [40, 320, 600];
    return <Room t={t}>
      <PopAround t={t} at={42.9} cx={540} cy={590}><FitDisplay x={540} y={610} text="EVERY STORE" size={56} fill={PALETTE.greenDark}/></PopAround>
      {xs.map((x, i) => (
        <PopAround key={x} t={t} at={42.775 + i * .15} cx={x + 120} cy={960}>
          <Storefront x={x} y={770} w={240} h={380} awning={i === 1 ? PALETTE.green : PALETTE.red}/>
          <StorefrontTag x={x + 120} y={955} price={['$4.99', '$19.99', '$49.99'][i]} lit={i < lit}/>
        </PopAround>
      ))}
      {host(950, 'shocked', 'up', true)}
    </Room>;
  }

  /* 47.495 - 52.695: what it costs vs which number to look at */
  if (t < 52.695) {
    const second = t >= 50.5;
    const costs = 'WHAT IT COSTS';
    const cs = fit(costs, 58, 840);
    const hw = estW(costs, cs) / 2 + 14;
    const strike = ease(t, 49.2, .35);
    return <Room t={t} theme="plum">
      <PriceTag x={540} y={940} price="$9.99" s={1.15} highlight/>
      {second
        ? <>
            <FitDisplay x={540} y={570} text="WHICH NUMBER" size={58} fill={PALETTE.greenDark}/>
            <FitDisplay x={540} y={645} text="TO LOOK AT" size={58} fill={PALETTE.greenDark}/>
            <PopAround t={t} at={50.7} cx={551} cy={690}><RedArrow x={551} y={690} scale={.55} rotate={180}/></PopAround>
          </>
        : <>
            <Display x={540} y={600} text={costs} size={cs} fill={PALETTE.slate}/>
            {strike > 0 && <path d={`M${540 - hw} 584L${540 - hw + 2 * hw * strike} ${584 - 10 * strike}`} stroke={PALETTE.red} strokeWidth="16" strokeLinecap="round"/>}
          </>}
      {host(950, second ? 'smug' : 'calm', 'point', true)}
    </Room>;
  }

  /* 52.695 - 56.37: discount or disguise */
  if (t < 56.37275) {
    return <Room t={t} theme="plum"><SplitTag t={t}/>{host(148, 'thinking', 'down')}</Room>;
  }

  /* 56.37 - end: comment + follow */
  return <Room t={t} theme="plum">
    <PopAround t={t} at={56.4} cx={540} cy={595}><FitDisplay x={540} y={615} text="COMMENT" size={58} fill={PALETTE.greenDark}/></PopAround>
    <CommentCTA t={t}/>
    {host(148, 'happy', 'up')}
  </Room>;
};

/* ------------------------------------------------------------------ */
/* composition                                                         */
/* ------------------------------------------------------------------ */

export const LeftDigitEffect: React.FC = () => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const rawT = frame / fps;
  const loop = rawT >= 61.15; const t = loop ? 3.9 : rawT;
  const beat = beats.find(b => t >= b.a && t < b.b) ?? beats[beats.length - 1];
  const titleScale = .76 + .24 * pop(t, beat.a, .35);

  const current = words.findIndex(w => t >= w.start && t < w.end);
  const active = current >= 0 ? current : words.reduce((last, w, i) => w.end <= t ? i : last, -1);
  const chunk = chunks.find(c => active >= c.from && active <= c.to) ?? chunks[0];
  const chunkWords = words.slice(chunk.from, chunk.to + 1);
  const phrase = chunkWords.map(w => w.punctuated_word).join(' ');
  const capSize = fit(phrase, 50, 900, .6);
  const capIn = ease(t, words[chunk.from].start, .18);

  const isFlash = !loop && rawT >= BLACK_FLASH_START && rawT < BLACK_FLASH_END;

  return <AbsoluteFill style={{backgroundColor: '#1D6270'}}>
    <Audio src={staticFile('videos/left-digit-effect/narration.mp3')}/>
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

      {/* title (soft fade band instead of a hard rectangle; both lines auto-fit) */}
      <rect x="0" y="110" width="1080" height="390" fill="url(#titleFade)"/>
      <g transform={`translate(540 282) scale(${titleScale})`}>
        <text y="0" textAnchor="middle" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth="13" paintOrder="stroke" fontFamily={FONT_HEAD} fontSize={fit(beat.title, 70, 940)} fontWeight="900">{beat.title}</text>
        <text y="88" textAnchor="middle" fill={PALETTE.red} stroke={PALETTE.ink} strokeWidth="12" paintOrder="stroke" fontFamily={FONT_HEAD} fontSize={fit(beat.red, 72, 940)} fontWeight="900">{beat.red}</text>
      </g>

      {/* captions: one short phrase at a time, font auto-fits the box */}
      <rect x="48" y="1480" width="984" height="170" rx="26" fill={PALETTE.ink} opacity=".87" stroke={PALETTE.paper} strokeWidth="5"/>
      <text x="540" y={1585 + (1 - capIn) * 10} opacity={capIn} textAnchor="middle" fontFamily={FONT_BODY} fontSize={capSize} fontWeight="800" fill={PALETTE.paper}>
        {chunkWords.map((w, i) => (
          <tspan key={`${w.start}-${i}`} fill={chunk.from + i === active ? PALETTE.gold : PALETTE.paper}>
            {w.punctuated_word}{i < chunkWords.length - 1 ? ' ' : ''}
          </tspan>
        ))}
      </text>

      <rect x="0" y="0" width={1080 * t / DURATION} height="12" fill={PALETTE.gold}/>
      {isFlash && <rect width="1080" height="1920" fill="#000"/>}
    </svg>
  </AbsoluteFill>;
};

export const LEFT_DIGIT_DURATION = Math.ceil(DURATION * FPS);