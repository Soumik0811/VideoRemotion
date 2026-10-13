import React from 'react';
import {interpolate, spring} from 'remotion';
import {clamp01, curve, ease} from './motion';

type P2 = [number, number];
type Kind = 'pop' | 'slide' | 'float' | 'dissolve';

/** Deterministic object choreography so story objects — not hands — carry the motion.
 *  Child renders centered at its own origin; `at` is its resting position, `from` is the
 *  start offset (slide/float travel from there to `at` and stay), `end` bounds dissolve. */
export const ObjectMotion: React.FC<{
  t: number;
  at: P2;
  kind?: Kind;
  start: number;
  dur?: number;
  end?: number;
  from?: P2;
  origin?: P2;
  dx?: number;
  dy?: number;
  children: React.ReactNode;
}> = ({t, at, kind = 'pop', start, dur = .6, end, from, origin, dx = 140, dy = 120, children}) => {
  let op = 1, sc = 1, blur = 0, tx = at[0], ty = at[1], rot = 0, bob = true;
  if (kind === 'pop') {
    const p = spring({fps: 30, frame: Math.max(0, (t - start) * 30), config: {damping: 14, stiffness: 170, mass: .8}});
    sc = p; op = clamp01((t - start) * 8);
  } else if (kind === 'slide') {
    const [ox, oy] = from ?? [-dx, -dy];
    const p = ease(t, start, dur);
    tx = at[0] + ox * (1 - p); ty = at[1] + oy * (1 - p);
    sc = .7 + .3 * p; op = clamp01((t - start) * 6);
  } else if (kind === 'float') {
    bob = false;
    const a = ease(t, start, dur);
    const [ox, oy] = from ?? [-dx, -dy];
    const sx = at[0] + ox, sy = at[1] + oy;
    const c: P2 = origin ?? [(sx + at[0]) / 2, Math.min(sy, at[1]) - 160];
    const v = curve(a, [sx, sy], c, [at[0], at[1]]);
    tx = v.x; ty = v.y; rot = Math.sin(a * Math.PI) * 10; op = clamp01((t - start) * 6);
  } else {
    // dissolve: hold solid until the window's last fraction, then shrink, drift up and blur away.
    bob = false;
    const w = Math.max(.001, (end ?? start + dur) - start);
    const k = clamp01((t - start) / w);
    op = 1 - ease(t, start + w * .6, w * .4);
    sc = .6 + .4 * k; blur = (1 - k) * 8; ty = at[1] - (1 - k) * 10;
  }
  if (bob) ty += Math.sin(t * 2.2) * 2;
  return <g transform={`translate(${tx} ${ty}) rotate(${rot}) scale(${sc})`} opacity={op}
    filter={blur > .1 ? `blur(${blur.toFixed(1)}px)` : undefined}>{children}</g>;
};

/** Animated numeric reveal for figures shown on in-world surfaces. */
export const NumberCount: React.FC<{
  t: number; start: number; dur?: number; to: number; x?: number; y?: number;
  color?: string; font?: number; label?: string; format?: (n: number) => string;
}> = ({t, start, dur = 1, to, x = 0, y = 0, color, font = 40, label, format}) => {
  const p = interpolate(t, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const text = (format ?? ((n: number) => String(Math.round(n))))(to * p);
  return <g transform={`translate(${x} ${y})`}>
    {label && <text y={-font * .6} textAnchor="middle" fontSize={font * .4} fill="#84756C" letterSpacing="1.2">{label}</text>}
    <text textAnchor="middle" dominantBaseline="central" fontSize={font} fontWeight="bold" fill={color}>{text}</text>
  </g>;
};
