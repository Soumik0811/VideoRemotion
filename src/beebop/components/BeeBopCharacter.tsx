import React, {useId} from 'react';
import {B, ease, mix} from '../engine/motion';
import {BeebopPose, CharacterId, BeeBopEpisode} from '../types';

type Pose = {ls:number;le:number;rs:number;re:number;tilt:number;smile:number;brow:number;mouth:number;eye:number};
// Simple, reliable poses only. Arms are thin strokes ending in a round hand — no finger or object work.
const poses: Record<BeebopPose, Pose> = {
  idle:       {ls:10, le:-6, rs:-10, re:6,  tilt:0,  smile:5,  brow:0, mouth:0,  eye:1},
  shocked:    {ls:130,le:-25,rs:-130,re:25, tilt:-4, smile:0,  brow:6, mouth:11, eye:1},
  explaining: {ls:12, le:-6, rs:-70, re:-18,tilt:2,  smile:6,  brow:0, mouth:5,  eye:1},
  point:      {ls:12, le:-6, rs:-118,re:-4, tilt:5,  smile:6,  brow:0, mouth:3,  eye:1},
  thinking:   {ls:10, le:-6, rs:-34, re:-72,tilt:-6, smile:2,  brow:3, mouth:0,  eye:1},
  happy:      {ls:44, le:-10,rs:-44, re:10, tilt:2,  smile:12, brow:0, mouth:2,  eye:1},
  laughing:   {ls:96, le:-20,rs:-96, re:20, tilt:0,  smile:12, brow:0, mouth:10, eye:0},
  present:    {ls:120,le:-14,rs:-120,re:14, tilt:0,  smile:11, brow:0, mouth:4,  eye:1},
  walk:       {ls:26, le:-6, rs:-26, re:6,  tilt:0,  smile:6,  brow:0, mouth:0,  eye:1},
};

const blinks = [1.6, 4.4, 7.1, 10.3, 13.2, 16.8, 20.1, 23.6, 27.4, 31.2, 34.9, 38.6, 42.1, 45.7, 48.3];

/** One deterministic bee rig. Poses blend over 0.7 s; wings buzz, antennae sway, body breathes. */
export const BeeBopCharacter: React.FC<{
  id?: CharacterId; characters: BeeBopEpisode['character']; t: number;
  x?: number; y?: number; scale?: number; actions?: {at:number; pose:BeebopPose}[]; look?: number;
}> = ({id='beebop', characters, t, x=0, y=0, scale=1, actions=[], look=0}) => {
  const c = characters[id];
  const uid = useId().replace(/[:]/g,'');
  let p: Pose = {...poses.idle};
  let action: BeebopPose = 'idle', strength = 0;
  for (const cue of actions) {
    const a = ease(t, cue.at, .7);
    if (a > 0) { for (const key of Object.keys(p) as (keyof Pose)[]) p[key] = mix(p[key], poses[cue.pose][key], a); action = cue.pose; strength = a; }
  }
  const bob = Math.sin(t*2.1)*2 + (action==='laughing' ? Math.abs(Math.sin(t*8))*5*strength : 0);
  const flut = Math.sin(t*20)*7;
  const antSway = Math.sin(t*1.6)*3;
  const walking = action==='walk' ? strength : 0;
  let blink = 1;
  for (const at of blinks) { const d = Math.abs(t-at); if (d<.12) blink = Math.min(blink, .1+.9*(d/.12)**2); }
  const arm = (side:'left'|'right', sh:number, el:number) => {
    const sx = side==='left'?74:166;
    return <g transform={`translate(${sx} 178) rotate(${sh})`}>
      <line x1="0" y1="0" x2="0" y2="42" stroke={B.ink} strokeWidth="7" strokeLinecap="round"/>
      <g transform={`translate(0 42) rotate(${el})`}>
        <line x1="0" y1="0" x2="0" y2="30" stroke={B.ink} strokeWidth="6" strokeLinecap="round"/>
        <circle cx="0" cy="34" r="7.5" fill={c.body} stroke={B.ink} strokeWidth="3"/>
      </g>
    </g>;
  };
  const wing = (dir:number) => <g transform={`translate(${dir<0?92:148} 168) rotate(${dir*(28+flut)}) scale(${1} ${1-Math.abs(flut)*.006})`}>
    <path d={`M0 0 Q${dir*58} -34 ${dir*70} 22 Q${dir*40} 44 0 16Z`} fill={c.wing} opacity=".72" stroke="#9CC6CE" strokeWidth="2.5"/>
  </g>;
  const antenna = (dir:number, tip:'leaf'|'bone') => <g transform={`translate(${120+dir*20} 34) rotate(${dir*(6+antSway)})`}>
    <path d={`M0 0 Q${dir*6} -26 ${dir*16} -40`} fill="none" stroke={B.ink} strokeWidth="4.5" strokeLinecap="round"/>
    {tip==='leaf'
      ? <path d={`M${dir*16} -40 q${dir*16} -6 ${dir*20} 10 q-${dir*16} 6 -${dir*20} -10Z`} fill={B.sage} stroke={B.ink} strokeWidth="2.5"/>
      : <g transform={`translate(${dir*18} -44)`} fill={B.paper} stroke={B.ink} strokeWidth="2.5"><circle cx="-5" cy="0" r="5"/><circle cx="5" cy="0" r="5"/><rect x="-6" y="-2" width="12" height="4" rx="2"/></g>}
  </g>;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="120" cy="322" rx="78" ry="12" fill="#826D5122"/>
    <g transform={`translate(0 ${bob})`}>
      {wing(-1)}{wing(1)}
      {[0,1].map(i=><g key={i} transform={`rotate(${walking*Math.sin(t*7+i*Math.PI)*14} ${i?138:102} 288)`}>
        <line x1={i?138:102} y1="286" x2={i?146:94} y2="322" stroke={B.ink} strokeWidth="7" strokeLinecap="round"/>
        <path d={`M${i?146:94} 322 h${i?16:-16}`} stroke={B.ink} strokeWidth="7" strokeLinecap="round"/>
      </g>)}
      {/* abdomen */}
      <clipPath id={`bee-body-${uid}`}><ellipse cx="120" cy="228" rx="48" ry="64"/></clipPath>
      <ellipse cx="120" cy="228" rx="48" ry="64" fill={c.body}/>
      <g clipPath={`url(#bee-body-${uid})`}>
        <rect x="70" y="196" width="100" height="20" fill={c.stripe}/>
        <rect x="70" y="234" width="100" height="20" fill={c.stripe}/>
        <rect x="70" y="266" width="100" height="22" fill={c.stripe}/>
      </g>
      <ellipse cx="120" cy="228" rx="48" ry="64" fill="none" stroke={B.ink} strokeWidth="4"/>
      <path d="M120 292 l-9 16 h18Z" fill={c.stripe} stroke={B.ink} strokeWidth="2.5" strokeLinejoin="round"/>
      {arm('left', p.ls + walking*Math.sin(t*7)*14, p.le)}
      {arm('right', p.rs - walking*Math.sin(t*7)*14, p.re)}
      {/* scarf */}
      <path d="M80 150 Q120 168 160 150 L166 176 Q120 196 74 176Z" fill={c.scarf} stroke={B.ink} strokeWidth="3.5" strokeLinejoin="round"/>
      <path d="M150 176 l16 26 -22 -6Z" fill={c.scarf} stroke={B.ink} strokeWidth="3" strokeLinejoin="round"/>
      {/* head */}
      <g transform={`rotate(${p.tilt + Math.sin(t*1.3)*.8} 120 150)`}>
        {antenna(-1,'leaf')}{antenna(1,'bone')}
        <circle cx="120" cy="92" r="66" fill={c.body} stroke={B.ink} strokeWidth="5"/>
        <ellipse cx="80" cy="118" rx="11" ry="6" fill={c.cheek} opacity=".55"/>
        <ellipse cx="160" cy="118" rx="11" ry="6" fill={c.cheek} opacity=".55"/>
        <g transform={`translate(0 92) scale(1 ${blink})`}>
          {p.eye > .5
            ? <g><ellipse cx="98" cy="0" rx="19" ry="23" fill={B.paper} stroke={B.ink} strokeWidth="3.5"/>
                 <ellipse cx="142" cy="0" rx="19" ry="23" fill={B.paper} stroke={B.ink} strokeWidth="3.5"/>
                 <circle cx={98+look*4} cy="2" r="9" fill={B.ink}/><circle cx={142+look*4} cy="2" r="9" fill={B.ink}/>
                 <circle cx={95+look*4} cy="-2" r="3" fill={B.paper}/><circle cx={139+look*4} cy="-2" r="3" fill={B.paper}/></g>
            : <g stroke={B.ink} strokeWidth="5" strokeLinecap="round" fill="none">
                 <path d="M80 -2 Q98 16 116 -2"/><path d="M124 -2 Q142 16 160 -2"/></g>}
        </g>
        <g stroke={B.ink} strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d={`M82 ${66-p.brow} Q98 ${60-p.brow*1.4} 114 ${64+p.brow*0.4}`}/>
          <path d={`M126 ${64+p.brow*0.4} Q142 ${60-p.brow*1.4} 158 ${66-p.brow}`}/>
        </g>
        <path d={`M100 120 Q120 ${120+p.smile*1.7} 140 120`} fill={p.smile>7?B.paper:'none'} stroke={B.ink} strokeWidth="4" strokeLinecap="round"/>
        {p.mouth > .5 && <ellipse cx="120" cy={126+p.mouth*.3} rx={3+p.mouth*.7} ry={p.mouth*(action==='laughing'?.9:.7)} fill={B.ink}/>}
      </g>
    </g>
  </g>;
};
