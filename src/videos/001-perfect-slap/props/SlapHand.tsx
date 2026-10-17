import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

export type HandPhase='freeze'|'windup'|'triple'|'impact';
export const SlapHand: React.FC<{phase?:HandPhase;frameOffset?:number;position?:{x:number;y:number};rotation?:number;speed?:number;wet?:boolean}> = ({phase='freeze',frameOffset=0,position,rotation,speed=1,wet=false}) => {
  const f=(useCurrentFrame()+frameOffset)*speed;
  let x=0,y=0,angle=0;
  if(phase==='windup'){x=interpolate(f,[0,35,85,145,185,225],[0,-74,-74,67,67,0],{extrapolateRight:'clamp'});angle=interpolate(f,[0,35,85,145,185,225],[0,-15,-15,13,13,0],{extrapolateRight:'clamp'});}
  if(phase==='triple'){
    if(f<70){x=interpolate(f,[0,16,46,70],[0,-68,-68,4],{extrapolateRight:'clamp'});angle=interpolate(f,[0,16,46,70],[0,-16,-16,0],{extrapolateRight:'clamp'});}
    else if(f<126){const n=f-70;x=interpolate(n,[0,11,34,56],[4,-68,-68,8],{extrapolateRight:'clamp'});angle=interpolate(n,[0,11,34,56],[0,-17,-17,1],{extrapolateRight:'clamp'});}
    else{const n=f-126;x=interpolate(n,[0,7,22,35],[8,-70,-70,112],{extrapolateRight:'clamp'});angle=interpolate(n,[0,7,22,35],[0,-18,-18,12],{extrapolateRight:'clamp'});}
  }
  if(phase==='impact'){x=interpolate(f,[0,8,20],[0,116,116],{extrapolateRight:'clamp'});angle=interpolate(f,[0,8,20],[0,12,12],{extrapolateRight:'clamp'});}
  return <div style={{position:'absolute',left:`calc(36% + ${position?.x??0}px)`,top:`calc(49% + ${position?.y??0}px)`,width:520,height:225,transform:`translate(${x}px,${y}px) rotate(${rotation??angle}deg)`,transformOrigin:'35% 50%',zIndex:3,filter:'drop-shadow(0 10px 12px rgba(0,0,0,.35))'}}>
    <svg width="520" height="225" viewBox="0 0 440 190" role="img" aria-label="Simple geometric hand">
      <path d="M23 111 Q21 90 40 83 L113 60 L125 24 Q129 10 142 12 Q156 14 153 31 L148 53 L163 17 Q169 3 182 9 Q195 15 187 32 L173 61 L202 27 Q212 15 224 24 Q237 34 225 47 L193 79 L244 57 Q260 51 266 65 Q271 80 255 88 L198 119 L146 151 L69 162 Q40 158 29 140Z" fill={wet?'#ffe991':'#f1c94d'} stroke="#fff0ae" strokeWidth="7" strokeLinejoin="round"/>
      <path d="M39 105 Q73 114 87 143 M126 58 Q150 61 169 75" fill="none" stroke={wet?'#fffef0':'#a87529'} strokeWidth="6" strokeLinecap="round"/>
      {wet&&<g fill="#85e8f1" stroke="#e7ffff" strokeWidth="3"><path d="M111 27 Q98 46 111 50 Q124 46 111 27Z"/><path d="M228 42 Q214 61 228 65 Q241 61 228 42Z"/><circle cx="278" cy="88" r="7"/></g>}
      {wet&&<path d="M103 72 Q166 38 237 62" fill="none" stroke="#fff" strokeWidth="7" opacity=".7"/>}
    </svg>
  </div>;
};
