import React from 'react';
import {B, SANS, SERIF, mix} from '../engine/motion';
import {BananaBunch, Sparkle} from './ScienceProps';

/** Zoom/pan about a focal point in the 1080×1000 world. Identity at (540,500,1). */
export const CameraRig: React.FC<{cx?: number; cy?: number; zoom?: number; children: React.ReactNode}> = ({cx=540, cy=500, zoom=1, children}) => (
  <g transform={`translate(540 500) scale(${zoom}) translate(${-cx} ${-cy})`}>{children}</g>
);

const Steam: React.FC<{x:number; y:number; t:number}> = ({x, y, t}) => (
  <g>{[0,1,2].map(i=>{const cyc=((t*0.45)+(i/3))%1;return <ellipse key={i} cx={x+Math.sin((t+i)*1.6)*7} cy={y-cyc*70} rx={6+cyc*9} ry={6+cyc*9} fill={B.paper} opacity={(1-cyc)*0.5}/>;})}</g>
);

/** Warm kitchen corner for the hook: counter, fruit bowl, a steaming mug. */
export const Kitchen: React.FC<{t:number}> = ({t}) => <>
  <defs>
    <linearGradient id="bb-wall" x2="0" y2="1"><stop stopColor="#FBF3E2"/><stop offset="1" stopColor={B.cream}/></linearGradient>
    <linearGradient id="bb-sky" x2="0" y2="1"><stop stopColor="#BFE3DA"/><stop offset="1" stopColor="#E7F3E6"/></linearGradient>
  </defs>
  <rect x="-200" y="-200" width="1480" height="1400" fill="url(#bb-wall)"/>
  <g><rect x="120" y="120" width="250" height="200" rx="14" fill="url(#bb-sky)" stroke="#D8C7A6" strokeWidth="8"/><path d="M245 120V320M120 220H370" stroke="#D8C7A6" strokeWidth="6"/></g>
  <g opacity=".85"><rect x="800" y="150" width="150" height="150" rx="10" fill="#EAD9B8"/><path d="M820 150v150M870 150v150M920 150v150" stroke="#D3BE97" strokeWidth="6"/></g>
  <rect x="-200" y="640" width="1480" height="60" fill="#C99B63"/>
  <rect x="-200" y="700" width="1480" height="400" fill="#E4C79C"/>
  <path d="M-200 640H1280" stroke="#B8874F" strokeWidth="6"/>
  <g transform="translate(760 560)">
    <path d="M-70 0 Q-70 70 0 70 Q70 70 70 0 Z" fill={B.mint} stroke={B.ink} strokeWidth="4"/>
    <rect x="-84" y="-14" width="168" height="20" rx="10" fill="#8FBFA6" stroke={B.ink} strokeWidth="3"/>
    <BananaBunch x={0} y={-26} scale={.72} count={4}/>
  </g>
  <g transform="translate(300 560)"><path d="M-30 0 H30 L24 60 Q0 70 -24 60Z" fill={B.paper} stroke={B.ink} strokeWidth="3.5"/><path d="M30 12 q26 4 20 26 q-6 16 -26 8" fill="none" stroke={B.ink} strokeWidth="4"/><Steam x={0} y={-6} t={t}/></g>
  <text x="540" y="250" textAnchor="middle" fontFamily={SERIF} fontSize="30" fill={B.muted}>the innocent snack</text>
</>;

/** Deep-space vignette the camera zooms into for the potassium-40 reveal. */
export const AtomicField: React.FC<{t:number}> = ({t}) => <>
  <defs><radialGradient id="bb-atom" cx="50%" cy="46%" r="70%"><stop stopColor={B.boardSoft}/><stop offset="1" stopColor={B.board}/></radialGradient></defs>
  <rect x="-200" y="-200" width="1480" height="1400" fill="url(#bb-atom)"/>
  {[160,260,360].map((r,i)=><circle key={r} cx="540" cy="470" r={r+Math.sin(t*1.2+i)*6} fill="none" stroke={B.glow} strokeWidth="2" opacity={.12+.05*i}/>)}
  <text x="540" y="120" textAnchor="middle" fontFamily={SANS} fontSize="22" letterSpacing="3" fill={B.glow} opacity=".8">INSIDE THE BANANA</text>
</>;

/** Security-checkpoint forecourt for the truck / alarm scenes. */
export const Street: React.FC<{t:number; night?: number}> = ({t, night=0}) => <>
  <defs><linearGradient id="bb-street" x2="0" y2="1"><stop stopColor={mixHex('#BFE3DA', '#20404A', night)}/><stop offset="1" stopColor={mixHex(B.cream, '#2C3A44', night)}/></linearGradient></defs>
  <rect x="-200" y="-200" width="1480" height="1000" fill="url(#bb-street)"/>
  <g opacity=".5" transform={`translate(${Math.sin(t/20)*16} 0)`}><ellipse cx="220" cy="180" rx="90" ry="34" fill={B.paper}/><ellipse cx="860" cy="140" rx="110" ry="38" fill={B.paper}/></g>
  <rect x="-200" y="640" width="1480" height="360" fill="#B7B4AC"/>
  <rect x="-200" y="620" width="1480" height="24" fill="#9C9A92"/>
  <g stroke="#E9E4D6" strokeWidth="10" strokeDasharray="60 46"><path d="M-200 812H1280"/></g>
  <rect x="360" y="600" width="360" height="40" rx="6" fill="#8FA0A6" opacity=".6"/>
  <text x="540" y="596" textAnchor="middle" fontFamily={SANS} fontSize="20" letterSpacing="2" fill={B.muted}>SECURITY CHECKPOINT</text>
</>;

/** Clean studio backdrop for the closing "you're a walking banana" gag. */
export const Studio: React.FC<{t:number}> = ({t}) => <>
  <defs><radialGradient id="bb-studio" cx="50%" cy="42%" r="72%"><stop stopColor="#FFF6DF"/><stop offset="1" stopColor="#F0E4C8"/></radialGradient></defs>
  <rect x="-200" y="-200" width="1480" height="1400" fill="url(#bb-studio)"/>
  <ellipse cx="540" cy="820" rx="420" ry="60" fill="#00000010"/>
  {[120,300,520,760,940].map((x,i)=><Sparkle key={i} x={x} y={180+((i*53)%160)} t={t} seed={i*1.7} size={.8}/>)}
</>;

function mixHex(a:string, b:string, p:number){
  if(p<=0)return a; if(p>=1)return b;
  const pa=hex(a), pb=hex(b);
  return `#${[0,1,2].map(i=>Math.round(mix(pa[i],pb[i],p)).toString(16).padStart(2,'0')).join('')}`;
}
const hex=(h:string)=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
