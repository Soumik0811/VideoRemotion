import React from 'react';
import {FONT_BODY, FONT_HEAD, OUTLINE, PALETTE} from './theme';

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
export const pop = (t: number, at: number, dur = 0.45) => {
  const p = clamp01((t - at) / dur);
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2);
};
export const fade = (t: number, at: number, dur = 0.35) => clamp01((t - at) / dur);

export const Display: React.FC<{
  x: number; y: number; text: string; size?: number; fill?: string;
  anchor?: 'start' | 'middle' | 'end'; rotate?: number; spacing?: number;
  shadow?: string; stroke?: string; opacity?: number;
}> = ({x, y, text, size = 60, fill = PALETTE.paper, anchor = 'middle', rotate = 0, spacing = 1, shadow = PALETTE.ink, stroke = PALETTE.ink, opacity = 1}) => {
  const off = Math.max(3, size * 0.09);
  const sw = Math.max(4, size * 0.16);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      <text x={off} y={off} textAnchor={anchor} fontFamily={FONT_HEAD} fontSize={size} fontWeight={900}
        letterSpacing={spacing} fill={shadow}>{text}</text>
      <text x={0} y={0} textAnchor={anchor} fontFamily={FONT_HEAD} fontSize={size} fontWeight={900}
        letterSpacing={spacing} fill={fill} stroke={stroke} strokeWidth={sw} paintOrder="stroke">{text}</text>
    </g>
  );
};

export const Sunburst: React.FC<{
  base: string; ray: string; cx?: number; cy?: number; rays?: number; pulse?: number; children?: React.ReactNode;
}> = ({base, ray, cx = 540, cy = 780, rays = 26, pulse = 0, children}) => {
  const seg = (Math.PI * 2) / rays;
  const paths = Array.from({length: rays}, (_, i) => {
    const a = i * seg + pulse * 0.02;
    const r0 = 620;
    const r1 = 1900;
    const gap = seg * 0.42;
    return (
      <path key={i}
        d={`M${cx} ${cy}L${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0}L${cx + Math.cos(a + gap) * r1} ${cy + Math.sin(a + gap) * r1}L${cx + Math.cos(a + seg) * r0} ${cy + Math.sin(a + seg) * r0}Z`}
        fill={ray} opacity={i % 2 ? 0.5 : 0.28}/>
    );
  });
  return <g><rect width="1080" height="1920" fill={base}/>{paths}{children}</g>;
};

export const Coin: React.FC<{x: number; y: number; r?: number; label?: string}> = ({x, y, r = 34, label = '$'}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth={Math.max(5, r * 0.16)}/>
    <circle r={r * 0.68} fill="none" stroke={PALETTE.goldDeep} strokeWidth={Math.max(3, r * 0.08)}/>
    <text y={r * 0.38} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={r * 1.05} fontWeight={900} fill={PALETTE.goldDeep}>{label}</text>
  </g>
);

export const ProductBox: React.FC<{
  x: number; y: number; s?: number; rotate?: number; tag?: string; label?: string; tint?: string;
}> = ({x, y, s = 1, rotate = 0, tag = '$20', label = 'PRODUCT', tint = PALETTE.wood}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
    <rect x="-82" y="-92" width="164" height="184" rx="14" fill={tint} stroke={PALETTE.ink} strokeWidth={OUTLINE}/>
    <path d="M-82 -18H82M0 -92V92" stroke="#F2D3A0" strokeWidth={16}/>
    <rect x="-54" y="-64" width="108" height="58" rx="9" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth={5}/>
    <text y={-22} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={36} fontWeight={900} fill={PALETTE.greenDark}>{tag}</text>
    <text y={56} textAnchor="middle" fontFamily={FONT_BODY} fontSize={19} fontWeight={800} letterSpacing={3} fill="#5C452A">{label}</text>
  </g>
);

export const StatChip: React.FC<{
  x: number; y: number; w: number; label: string; value: string; color?: string; valueSize?: number; h?: number;
}> = ({x, y, w, label, value, color = PALETTE.highlight, valueSize = 56, h = 118}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={7} y={9} width={w} height={h} rx={20} fill={PALETTE.ink} opacity={0.35}/>
    <rect width={w} height={h} rx={20} fill={PALETTE.chipBg} stroke={PALETTE.ink} strokeWidth={6}/>
    <text x={w / 2} y={40} textAnchor="middle" fontFamily={FONT_BODY} fontSize={24} fontWeight={800} letterSpacing={4} fill={PALETTE.chipLabel}>{label}</text>
    <text x={w / 2} y={40 + valueSize} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={valueSize} fontWeight={900} fill={color}>{value}</text>
  </g>
);

export const Pill: React.FC<{
  x: number; y: number; text: string; fill: string; w?: number; size?: number; textFill?: string;
}> = ({x, y, text, fill, w = 260, size = 44, textFill = PALETTE.paper}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={6} y={7} width={w} height={size * 1.7} rx={size} fill={PALETTE.ink} opacity={0.3}/>
    <rect width={w} height={size * 1.7} rx={size} fill={fill} stroke={PALETTE.ink} strokeWidth={6}/>
    <text x={w / 2} y={size * 1.16} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={size} fontWeight={900} fill={textFill}>{text}</text>
  </g>
);

export const TermCard: React.FC<{
  x: number; y: number; w: number; term: string; definition: string; termColor?: string; size?: number;
}> = ({x, y, w, term, definition, termColor = PALETTE.red, size = 92}) => {
  const h = size * 2.2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={10} y={12} width={w} height={h} rx={24} fill={PALETTE.ink} opacity={0.35}/>
      <rect width={w} height={h} rx={24} fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth={8}/>
      <rect x={w / 2 - 132} y={-30} width={264} height={60} rx={30} fill={PALETTE.chipBg} stroke={PALETTE.ink} strokeWidth={6}/>
      <text x={w / 2} y={10} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={30} fontWeight={900} letterSpacing={4} fill={PALETTE.highlight}>MONEY TERM</text>
      <text x={w / 2} y={h / 2 + size * 0.28} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={size} fontWeight={900} fill={termColor}>{term}</text>
      <text x={w / 2} y={h / 2 + size * 0.95} textAnchor="middle" fontFamily={FONT_BODY} fontSize={Math.max(26, size * 0.34)} fontWeight={700} fill={PALETTE.slate}>{definition}</text>
    </g>
  );
};

export const AdBill: React.FC<{x: number; y: number; rotate?: number; s?: number}> = ({x, y, rotate = 0, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
    <rect x="-70" y="-46" width="140" height="92" rx="10" fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth={6}/>
    <text y={-14} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={27} fontWeight={900} fill={PALETTE.slate}>AD</text>
    <text y={22} textAnchor="middle" fontFamily={FONT_HEAD} fontSize={27} fontWeight={900} fill={PALETTE.red}>$15</text>
  </g>
);

export const SkyScene: React.FC<{ground?: string; children?: React.ReactNode}> = ({ground = PALETTE.ground, children}) => (
  <g>
    <defs>
      <linearGradient id="curious-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={PALETTE.skyTop}/>
        <stop offset="1" stopColor={PALETTE.skyBottom}/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#curious-sky)"/>
    <circle cx={905} cy={240} r={92} fill={PALETTE.sun} stroke={PALETTE.ink} strokeWidth={6}/>
    <path d={`M0 1330H1080V1920H0Z`} fill={ground}/>
    <path d="M0 1330H1080" stroke={PALETTE.groundLine} strokeWidth={8}/>
    {children}
  </g>
);

export const Storefront: React.FC<{x: number; y: number; w?: number; h?: number; awning?: string}> = ({x, y, w = 470, h = 520, awning = PALETTE.red}) => {
  const stripes = 6;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={8} y={10} width={w} height={h} rx={16} fill={PALETTE.ink} opacity={0.22}/>
      <rect width={w} height={h} rx={16} fill={PALETTE.paper} stroke={PALETTE.ink} strokeWidth={7}/>
      <g>
        {Array.from({length: stripes}, (_, i) => (
          <path key={i} d={`M${i * (w / stripes)} 0h${w / stripes}l-14 74h${-(w / stripes - 28)}Z`} transform="translate(0 -74)"
            fill={i % 2 ? PALETTE.paper : awning} stroke={PALETTE.ink} strokeWidth={4}/>
        ))}
      </g>
      <rect x={w * 0.12} y={h * 0.22} width={w * 0.76} height={h * 0.3} rx={10} fill="#BFE3F2" stroke={PALETTE.ink} strokeWidth={6}/>
      <path d={`M${w * 0.5} ${h * 0.22}v${h * 0.3}M${w * 0.12} ${h * 0.37}h${w * 0.76}`} stroke={PALETTE.ink} strokeWidth={5}/>
      <rect x={w * 0.16} y={h * 0.62} width={w * 0.68} height={h * 0.26} rx={12} fill={PALETTE.wood} stroke={PALETTE.ink} strokeWidth={6}/>
    </g>
  );
};
