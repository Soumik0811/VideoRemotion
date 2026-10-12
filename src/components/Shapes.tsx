import React from 'react';
import {C,FONT} from '../engine/theme';

export const Person:React.FC<{shirt?:string;skin?:string;eyes?:'happy'|'normal';size?:number;wave?:number}> =
({shirt=C.blue,skin='#E4A36D',eyes='normal',size=310,wave=0})=>(
  <svg width={size} height={size*1.38} viewBox="0 0 300 416" style={{overflow:'visible',filter:'drop-shadow(0px 10px 0px #C9BA9B33)'}}>
    <path d="M95 334 L79 403 M207 334 L225 403" stroke={C.dark} strokeWidth="23" strokeLinecap="round"/>
    <path d="M82 402 L48 402 M225 402 L255 402" stroke={C.dark} strokeWidth="17" strokeLinecap="round"/>
    <path d="M75 195 Q48 232 44 282" stroke={C.dark} strokeWidth="21" fill="none" strokeLinecap="round"/>
    <path d={`M224 198 Q${247+wave*0.25} ${217-wave*0.35} ${248+wave*0.32} ${270-wave}`} stroke={C.dark} strokeWidth="21" fill="none" strokeLinecap="round"/>
    <path d="M75 207 Q105 170 150 178 Q202 170 230 209 L246 345 Q150 367 60 344Z" fill={shirt} stroke={C.dark} strokeWidth="8" strokeLinejoin="round"/>
    <rect x="125" y="145" width="50" height="50" rx="18" fill={skin} stroke={C.dark} strokeWidth="7"/>
    <circle cx="150" cy="96" r="89" fill={skin} stroke={C.dark} strokeWidth="8"/>
    <path d="M66 67 Q82 -8 164 6 Q242 13 241 81 Q193 48 161 38 Q118 81 66 67" fill={C.dark}/>
    {eyes==='happy' ? <><path d="M101 109 Q117 92 131 108 M172 107 Q188 93 202 107" fill="none" stroke={C.dark} strokeWidth="8" strokeLinecap="round"/></> : <><circle cx="119" cy="105" r="7" fill={C.dark}/><circle cx="185" cy="105" r="7" fill={C.dark}/></>}
    <path d="M129 139 Q150 157 173 139" stroke={C.dark} strokeWidth="6" fill="none" strokeLinecap="round"/>
  </svg>
);

export const Shirt:React.FC<{size?:number;color?:string;rotation?:number}> = ({size=150,color=C.gold,rotation=0})=>(
  <svg width={size} height={size} viewBox="0 0 160 160" style={{transform:`rotate(${rotation}deg)`,filter:'drop-shadow(0px 7px 0px #00000015)'}}>
    <path d="M47 20 L63 13 Q80 35 97 13 L113 20 L155 57 L128 88 L115 76 L115 149 L45 149 L45 76 L32 88 L5 57Z" fill={color} stroke={C.dark} strokeWidth="7" strokeLinejoin="round"/>
    <path d="M63 13 Q80 42 97 13" stroke={C.dark} strokeWidth="6" fill="none" strokeLinecap="round"/>
    <path d="M67 91 L93 91" stroke={C.white} strokeWidth="6" strokeLinecap="round"/>
  </svg>
);

export const Cash:React.FC<{size?:number; rotation?:number}> = ({size=170,rotation=0})=>(
  <svg width={size} height={size*0.61} viewBox="0 0 180 110" style={{transform:`rotate(${rotation}deg)`}}>
    <rect x="6" y="7" width="168" height="94" rx="11" fill={C.mint} stroke={C.dark} strokeWidth="7"/>
    <rect x="20" y="20" width="140" height="69" rx="7" fill="none" stroke={C.green} strokeWidth="3"/>
    <circle cx="90" cy="55" r="28" fill={C.leaf} stroke={C.green} strokeWidth="3"/>
    <text x="90" y="68" fontSize="40" fontWeight="900" textAnchor="middle" fontFamily={FONT} fill={C.dark}>$</text>
  </svg>
);

export const Pill:React.FC<{children:React.ReactNode; color?:string;large?:boolean}> = ({children,color=C.white,large=false})=>(
  <div style={{display:'inline-flex',background:color,border:`4px solid ${C.dark}`,borderRadius:24,padding:large?'20px 31px':'13px 24px',boxShadow:'0 8px 0 #33292216',fontSize:large?50:35,color:C.dark,fontWeight:900,fontFamily:FONT,justifyContent:'center'}}>{children}</div>
);
