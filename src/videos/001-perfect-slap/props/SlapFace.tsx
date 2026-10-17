import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type FacePhase='neutral'|'bracing'|'hit'|'dazed';
export const SlapFace: React.FC<{phase?:FacePhase;hitAt?:number;frameOffset?:number;size?:number}> = ({phase='neutral',hitAt=0,frameOffset=0,size=1}) => {
  const f=useCurrentFrame()+frameOffset;
  const hit=phase==='hit'&&f>=hitAt;
  const impact=hit?interpolate(f,[hitAt,hitAt+4,hitAt+18],[0,18,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):0;
  const dazed=phase==='dazed'||hit&&f>hitAt+18;
  const bracing=phase==='bracing';
  const squash=hit?interpolate(f,[hitAt,hitAt+4,hitAt+18],[1,.84,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):1;
  return <div style={{position:'absolute',left:'50%',top:'39%',width:480,height:300,transform:`translateX(${impact}px) scale(${size})`,transformOrigin:'45% 54%',zIndex:2}}>
    <svg width="480" height="300" viewBox="0 0 480 300" role="img" aria-label="Simple cartoon face">
      <g transform={`translate(480 0) scale(-1 1) translate(${impact*.15} 0) scale(${squash} 1)`}>
        <path d="M133 267 Q109 232 100 190 Q76 103 121 54 Q160 13 234 22 Q316 20 350 79 Q373 120 357 175 Q344 226 300 251 L287 286 Q211 308 133 267Z" fill="#efbd91" stroke="#fff0d6" strokeWidth="7"/>
        <path d="M137 85 Q155 28 230 29 Q312 25 348 79 Q320 59 287 70 Q244 84 204 63 Q178 91 137 103Z" fill="#334154"/>
        {bracing?<g stroke="#253347" strokeWidth="8" strokeLinecap="round"><path d="M202 131l27 2"/><path d="M272 133l26-3"/></g>:dazed?<g stroke="#253347" strokeWidth="6" fill="none"><path d="M199 133c0-17 25-17 25 0s-25 17-25 0z"/><path d="M271 133c0-17 25-17 25 0s-25 17-25 0z"/></g>:<g fill="#253347"><ellipse cx="212" cy="133" rx="8" ry="13"/><ellipse cx="284" cy="133" rx="8" ry="13"/></g>}
        <path d="M181 113q24-17 45-3M263 109q23-14 45 1" fill="none" stroke="#334154" strokeWidth="7" strokeLinecap="round"/>
        <path d="M207 180 Q235 190 260 179" fill="none" stroke="#9a514b" strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="164" cy="175" rx={hit?interpolate(f,[hitAt,hitAt+4],[18,40],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):24} ry={hit&&f<hitAt+8?17:14} fill="#f07972" opacity={bracing ? .34 : .62}/>
        {dazed&&<g fill="#f5d36e"><path d="M146 33l8 18 20 2-16 12 5 20-17-11-17 11 6-20-16-12 20-2z"/><path d="M356 53l6 13 15 1-11 9 4 15-14-8-13 8 4-15-12-9 15-1z"/></g>}
      </g>
    </svg>
  </div>;
};
