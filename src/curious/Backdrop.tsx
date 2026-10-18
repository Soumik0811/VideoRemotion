/**
 * Backdrop.tsx: shared backgrounds and layout helpers for the Oddly Logical videos.
 * Place at src/curious/Backdrop.tsx. LeftDigitEffect can import from here too
 * (it currently has its own copies of Room / Burst / helpers).
 */
import React from 'react';
import {Display, fade, pop} from './primitives';

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** 0 -> 1 ease-out, starting at `a` seconds and lasting `d` seconds. */
export const ease = (t: number, a: number, d = .42) => {
  const p = clamp((t - a) / d);
  return 1 - Math.pow(1 - p, 3);
};

/** Conservative width estimate for heavy display fonts, and a size that never exceeds maxW. */
export const estW = (text: string, size: number, k = .66) => text.length * size * k;
export const fit = (text: string, size: number, maxW = 900, k = .66) => Math.min(size, maxW / (text.length * k));

type DisplayProps = React.ComponentProps<typeof Display>;
export const FitDisplay: React.FC<DisplayProps & {maxW?: number}> = ({maxW = 900, text, size = 60, ...rest}) => (
  <Display text={text} size={fit(text, size, maxW)} {...rest}/>
);

/** Pops a child (drawn around 0,0) in at x,y. */
export const PopIn: React.FC<{t: number; at: number; x: number; y: number; s?: number; children: React.ReactNode}> = ({t, at, x, y, s = 1, children}) => (
  t < at ? null : <g transform={`translate(${x} ${y}) scale(${s * pop(t, at, .45)})`} opacity={fade(t, at, .16)}>{children}</g>
);

/** Pops children (drawn in absolute coords) in, scaling around cx,cy. */
export const PopAround: React.FC<{t: number; at: number; cx: number; cy: number; children: React.ReactNode}> = ({t, at, cx, cy, children}) => (
  t < at ? null : <g transform={`translate(${cx} ${cy}) scale(${pop(t, at, .4)}) translate(${-cx} ${-cy})`} opacity={fade(t, at, .15)}>{children}</g>
);

/* ------------------------------------------------------------------ */
/* backgrounds                                                         */
/* ------------------------------------------------------------------ */

export const THEMES = {
  teal: {wall: '#2F8C99', wall2: '#1D6270', floor: '#D79A5B', floor2: '#B57A40', seam: '#8F5C2B', base: '#E9C99A'},
  plum: {wall: '#7B52B5', wall2: '#4F3282', floor: '#D9A76A', floor2: '#B98448', seam: '#8F5C2B', base: '#EBD0A3'},
};
export type ThemeName = keyof typeof THEMES;

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
export const Room: React.FC<{t: number; theme?: ThemeName; children?: React.ReactNode}> = ({t, theme = 'teal', children}) => {
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

/** Rotating sunburst for the big "reveal" moments. */
export const Burst: React.FC<{t: number; base: string; ray: string; cx?: number; cy?: number; children?: React.ReactNode}> = ({t, base, ray, cx = 540, cy = 820, children}) => {
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