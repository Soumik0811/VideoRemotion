import React from 'react';
import {B, SANS, mix} from '../engine/motion';

type Placed = {x?:number; y?:number; scale?:number; rotate?:number};

export const Banana: React.FC<Placed & {bitten?: boolean}> = ({x=0, y=0, scale=1, rotate=0, bitten=false}) => (
  <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${rotate})`}>
    <path d={bitten
      ? "M-6 -16 C-2 30 20 44 46 38 C54 36 52 24 44 27 C22 35 6 22 4 -14 C3 -24 -7 -25 -6 -16Z"
      : "M-44 -14 C-40 34 4 56 46 40 C54 37 52 25 43 28 C10 40 -24 20 -28 -16 C-29 -27 -45 -25 -44 -14Z"}
      fill={B.banana} stroke={B.ink} strokeWidth="3.5" strokeLinejoin="round"/>
    <path d={bitten ? "M0 -14 q6 -6 10 0 q5 -5 9 1" : "M-38 -12 q-6 -8 4 -12"} fill="none" stroke={B.ink} strokeWidth="3" strokeLinecap="round"/>
    {!bitten && <path d="M40 30 q10 2 8 -8" fill="none" stroke={B.ink} strokeWidth="3" strokeLinecap="round"/>}
    <path d="M-30 -6 C-24 22 2 38 30 34" fill="none" stroke="#FFF3C4" strokeWidth="4" strokeLinecap="round" opacity=".8"/>
  </g>
);

export const BananaBunch: React.FC<Placed & {count?: number}> = ({x=0, y=0, scale=1, count=4}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {Array.from({length: count}, (_, i) => <Banana key={i} x={(i-(count-1)/2)*10} y={Math.abs(i-(count-1)/2)*6} rotate={-26 + i*(52/(count-1))} scale={.82}/>)}
  </g>
);

export const RadiationSymbol: React.FC<Placed & {color?: string}> = ({x=0, y=0, scale=1, rotate=0, color=B.terra}) => {
  const wedge = (a:number) => <path key={a} transform={`rotate(${a})`} d="M0 0 L-26 -45 A52 52 0 0 1 26 -45 Z" fill={color}/>;
  return <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${rotate})`}>
    {[0,120,240].map(wedge)}<circle r="12" fill={color}/><circle r="30" fill="none" stroke={color} strokeWidth="0" opacity="0"/>
  </g>;
};

/** Stylised K-40 atom: orbiting electrons + a repeating decay particle. */
export const Atom: React.FC<{x:number; y:number; scale?:number; t:number; label?: string; decay?: number}> = ({x, y, scale=1, t, label='K-40', decay=1}) => {
  const orbits = [0, 60, 120];
  const rx = 78, ry = 30;
  const electron = (phase:number, tilt:number) => {
    const a = t*2.2 + phase;
    const px = Math.cos(a)*rx, py = Math.sin(a)*ry;
    const r = tilt*Math.PI/180;
    return {x: px*Math.cos(r) - py*Math.sin(r), y: px*Math.sin(r) + py*Math.cos(r)};
  };
  const dp = (t % 1.6) / 1.6;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {orbits.map((o,i)=><g key={o} transform={`rotate(${o})`}><ellipse rx={rx} ry={ry} fill="none" stroke={B.glow} strokeWidth="2.5" opacity=".5"/></g>)}
    {orbits.map((o,i)=>{const e=electron(i*2.1,o);return <circle key={`e${i}`} cx={e.x} cy={e.y} r="7" fill={B.mint} stroke={B.ink} strokeWidth="2"/>;})}
    <circle r="26" fill={B.amber} stroke={B.ink} strokeWidth="3"/>
    <circle cx="-8" cy="-6" r="7" fill={B.terra} opacity=".85"/><circle cx="8" cy="4" r="7" fill={B.green} opacity=".85"/><circle cx="-2" cy="12" r="6" fill={B.terra} opacity=".85"/>
    <text y="46" textAnchor="middle" fontFamily={SANS} fontSize="18" fontWeight="bold" fill={B.paper}>{label}</text>
    {decay>0 && dp<0.75 && <g opacity={(1-dp/0.75)*decay}><RadiationSymbol x={Math.cos(-0.9)*mix(26,120,dp)} y={Math.sin(-0.9)*mix(26,120,dp)} scale={.28} color={B.glow}/></g>}
  </g>;
};

/** Small floating radiation particle for ambient emission. */
export const Particle: React.FC<{x:number; y:number; seed:number; t:number; color?: string}> = ({x, y, seed, t, color=B.glow}) => {
  const cyc = (t*0.5 + seed) % 1;
  return <g opacity={Math.sin(cyc*Math.PI)}><circle cx={x + Math.sin((t+seed)*3)*10} cy={y - cyc*90} r={3.5} fill={color}/></g>;
};

/** Security checkpoint gantry. `alarm` 0..1 drives the flashing light stacks. */
export const Detector: React.FC<{x:number; y:number; scale?:number; t:number; alarm?: number; label?: string}> = ({x, y, scale=1, t, alarm=0, label='RADIATION SCAN'}) => {
  const blink = (Math.sin(t*10) > 0 ? 1 : .25) * alarm;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x="-150" y="-230" width="300" height="20" rx="6" fill={B.boardSoft}/>
    <rect x="-150" y="-230" width="26" height="250" rx="6" fill={B.board}/>
    <rect x="124" y="-230" width="26" height="250" rx="6" fill={B.board}/>
    <rect x="-120" y="-214" width="240" height="40" rx="6" fill={B.paper} stroke={B.ink} strokeWidth="2"/>
    <text x="0" y="-188" textAnchor="middle" fontFamily={SANS} fontSize="19" fontWeight="bold" fill={B.ink} letterSpacing="1.5">{label}</text>
    {[0,1,2].map(i=><g key={`l${i}`}>
      <circle cx="-137" cy={-120+i*46} r="12" fill={B.red} opacity={.2+blink*(i===Math.floor((t*4)%3)?1:.35)}/>
      <circle cx="137" cy={-120+i*46} r="12" fill={B.red} opacity={.2+blink*(i===Math.floor((t*4)%3)?1:.35)}/>
    </g>)}
    <g opacity={alarm}><RadiationSymbol x={0} y={-100} scale={.9} color={B.red}/></g>
  </g>;
};

export const Truck: React.FC<{x:number; y:number; scale?:number; t:number; load?: number}> = ({x, y, scale=1, t, load=1}) => {
  const spin = t*3;
  const wheel = (wx:number) => <g transform={`translate(${wx} 40)`}><circle r="22" fill={B.ink}/><circle r="10" fill={B.muted}/><g transform={`rotate(${spin*40})`} stroke={B.paper} strokeWidth="3"><line y1="-9" y2="9"/><line x1="-9" x2="9"/></g></g>;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x="-150" y="-70" width="150" height="90" rx="8" fill={B.green} stroke={B.ink} strokeWidth="3"/>
    <rect x="-140" y="-58" width="60" height="40" rx="4" fill={B.sky}/>
    <path d="M0 -40 H120 Q140 -40 140 -18 V20 H0Z" fill={B.terra} stroke={B.ink} strokeWidth="3"/>
    <rect x="6" y="-34" width="128" height="48" rx="4" fill="#00000018"/>
    {load>0 && <g opacity={load}><BananaBunch x={70} y={-58} scale={.5} count={4}/><BananaBunch x={30} y={-64} scale={.42} count={3}/></g>}
    <rect x="-150" y="18" width="290" height="16" fill={B.board}/>
    {wheel(-108)}{wheel(96)}
    <circle cx="146" cy="-2" r="6" fill={B.gold}/>
  </g>;
};

/** Simple security guard. `arms` 0..1 raises them in surprise. */
export const Guard: React.FC<{x:number; y:number; scale?:number; t:number; arms?: number; skin?: string}> = ({x, y, scale=1, t, arms=0, skin='#E5B893'}) => {
  const a = arms*Math.PI*0.42;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="0" cy="150" rx="46" ry="8" fill="#826D5122"/>
    <g transform={`translate(0 ${Math.sin(t*2)*1.5})`}>
      <path d="M-16 96 L-18 150 M16 96 L18 150" stroke="#3C4A5A" strokeWidth="20" strokeLinecap="round"/>
      <path d="M-40 40 Q0 26 40 40 L34 104 Q0 116 -34 104Z" fill="#4C6A86" stroke={B.ink} strokeWidth="3"/>
      <path d="M-30 46 q-30 20 -34 44" fill="none" stroke="#4C6A86" strokeWidth="16" strokeLinecap="round"/>
      <g transform={`translate(30 46) rotate(${-(30+arms*70)})`}><line y2="46" stroke="#4C6A86" strokeWidth="16" strokeLinecap="round"/><g transform={`translate(0 46) rotate(${a*40})`}><line y2="34" stroke={skin} strokeWidth="13" strokeLinecap="round"/><circle cy="38" r="7" fill={skin}/></g></g>
      <g transform={`translate(-30 46) rotate(${30+arms*70})`}><line y2="46" stroke="#4C6A86" strokeWidth="16" strokeLinecap="round"/><g transform={`translate(0 46) rotate(${-a*40})`}><line y2="34" stroke={skin} strokeWidth="13" strokeLinecap="round"/><circle cy="38" r="7" fill={skin}/></g></g>
      <rect x="-12" y="18" width="24" height="26" rx="8" fill={skin}/>
      <circle cx="0" cy="-2" r="30" fill={skin} stroke={B.ink} strokeWidth="3"/>
      <path d="M-30 -6 Q0 -40 30 -6 L30 -12 Q0 -30 -30 -12Z" fill="#3C4A5A"/>
      <rect x="-32" y="-12" width="64" height="10" rx="4" fill="#31404F"/>
      <circle cx="-10" cy="0" r="3.4" fill={B.ink}/><circle cx="10" cy="0" r="3.4" fill={B.ink}/>
      <path d={arms>.5 ? "M-8 14 Q0 22 8 14" : "M-8 16 Q0 12 8 16"} fill="none" stroke={B.ink} strokeWidth="3" strokeLinecap="round"/>
    </g>
  </g>;
};

/** Semicircular radiation meter. value 0..1. */
export const Gauge: React.FC<{x:number; y:number; scale?:number; value:number; label:string; valueText:string; tone?: string}> = ({x, y, scale=1, value, label, valueText, tone=B.green}) => {
  const ang = mix(-90, 90, Math.max(0, Math.min(1, value)));
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-90 0 A90 90 0 0 1 90 0 Z" fill={B.paper} stroke={B.ink} strokeWidth="3"/>
    <path d="M-90 0 A90 90 0 0 1 -45 -78" fill="none" stroke={B.green} strokeWidth="12"/>
    <path d="M-45 -78 A90 90 0 0 1 45 -78" fill="none" stroke={B.gold} strokeWidth="12"/>
    <path d="M45 -78 A90 90 0 0 1 90 0" fill="none" stroke={B.red} strokeWidth="12"/>
    <g transform={`rotate(${ang})`}><line y2="-78" stroke={tone} strokeWidth="6" strokeLinecap="round"/><circle r="8" fill={B.ink}/></g>
    <text y="-104" textAnchor="middle" fontFamily={SANS} fontSize="17" letterSpacing="1.5" fill={B.muted}>{label}</text>
    <text y="34" textAnchor="middle" fontFamily={SANS} fontSize="26" fontWeight="bold" fill={tone}>{valueText}</text>
  </g>;
};

export const Sparkle: React.FC<{x:number; y:number; t:number; seed?:number; color?:string; size?:number}> = ({x, y, t, seed=0, color=B.gold, size=1}) => {
  const s = (Math.sin(t*3 + seed)*0.5+0.5);
  return <path transform={`translate(${x} ${y}) scale(${(0.5+s)*size})`} d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3Z" fill={color} opacity={0.4+s*0.6}/>;
};
