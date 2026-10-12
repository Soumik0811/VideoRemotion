import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C,FONT} from '../engine/theme';
export const Stage:React.FC<{brand:string;series:string;eyebrow:string;children:React.ReactNode;progress:number}> = ({brand,series,eyebrow,children,progress})=>{
 const f=useCurrentFrame(); const {width}=useVideoConfig();
 const rise=interpolate(f,[0,18],[24,0],{extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:C.paper,fontFamily:FONT,overflow:'hidden',color:C.dark}}>
   <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
    <circle cx="1010" cy="385" r="185" fill={C.cream} opacity="0.48"/>
    <circle cx="120" cy="1040" r="190" fill={C.cream} opacity="0.45"/>
    <path d="M0 1190 Q280 1100 510 1200 Q780 1100 1080 1182 L1080 1485 L0 1485Z" fill="#E3EDDA"/>
    <path d="M0 1308 Q300 1232 560 1320 Q820 1241 1080 1312 L1080 1496 L0 1496Z" fill="#C8DDBE"/>
    <path d="M0 1445 Q550 1390 1080 1430 L1080 1584 L0 1584Z" fill="#B7CEA8"/>
    <g fill={C.green} opacity="0.55"><circle cx="130" cy="1145" r="9"/><circle cx="920" cy="1070" r="10"/><circle cx="970" cy="1045" r="6"/><circle cx="330" cy="1260" r="5"/></g>
   </svg>
   <div style={{position:'absolute',left:65,right:65,top:95,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span style={{fontSize:28,letterSpacing:'0.13em',fontWeight:900}}>{brand}</span>
      <span style={{fontSize:24,letterSpacing:'0.09em',color:C.green,fontWeight:900}}>● EXPLAINED</span>
   </div>
   <div style={{position:'absolute',top:184,left:70,right:70,fontSize:27,color:C.green,letterSpacing:'0.11em',fontWeight:900,transform:`translateY(${rise}px)`}}>{eyebrow}</div>
   {children}
   <div style={{position:'absolute',left:0,right:0,bottom:0,height:355,background:C.dark,borderTop:`13px solid ${C.gold}`}}>
    <div style={{position:'absolute',top:22,left:68,fontSize:25,letterSpacing:'0.12em',color:C.gold,fontWeight:900}}>{series}</div>
    <div style={{position:'absolute',bottom:40,left:70,right:70,height:7,borderRadius:8,background:'#6D5B50'}}><div style={{height:'100%',width:`${Math.max(0,Math.min(1,progress))*100}%`,background:C.gold,borderRadius:8}}/></div>
   </div>
 </AbsoluteFill>;
};
