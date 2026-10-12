import React from 'react';
import {G,SANS,ease,appear} from '../theme';

export const Panel:React.FC<{x:number;y:number;width:number;height:number;dark?:boolean;children:React.ReactNode;accent?:string}>=({x,y,width,height,dark=false,children,accent=G.gold})=><g transform={`translate(${x} ${y})`}>
 <rect x="0" y="10" width={width} height={height} rx="25" fill="#183D3112"/>
 <rect width={width} height={height} rx="25" fill={dark?G.dark:G.white} stroke={dark?'#315648':G.line} strokeWidth="3"/>
 <path d={`M26 1H${Math.min(width-26,150)}`} stroke={accent} strokeWidth="5" strokeLinecap="round"/>
 {children}
</g>;
export const Label:React.FC<{x:number;y:number;children:React.ReactNode;size?:number;color?:string;center?:boolean}>=({x,y,children,size=22,color=G.muted,center=false})=><text x={x} y={y} textAnchor={center?'middle':'start'} fontFamily={SANS} fontSize={size} fontWeight="bold" letterSpacing="1.1" fill={color}>{children}</text>;
export const Counter:React.FC<{x:number;y:number;t:number;start:number;duration?:number;from?:number;to:number;prefix?:string;suffix?:string;size?:number;color?:string}>=({x,y,t,start,duration=1.2,from=0,to,prefix='$',suffix='',size=96,color=G.ink})=><text x={x} y={y} textAnchor="middle" fontFamily={SANS} fontSize={size} fontWeight="bold" letterSpacing="-3" fill={color} style={{fontVariantNumeric:'tabular-nums'}}>{prefix}{Math.round(from+(to-from)*ease(t,start,duration)).toLocaleString('en-US')}{suffix}</text>;
export const NumberBoard:React.FC<{x:number;y:number;width?:number;height?:number;label:string;value:number;from?:number;t:number;start:number;prefix?:string;suffix?:string;dark?:boolean;note?:string;color?:string}>=({x,y,width=450,height=245,label,value,from=0,t,start,prefix='$',suffix='',dark=false,note,color})=>{
 const p=appear(t,start,.55);
 return <g opacity={p} transform={`translate(0 ${18*(1-p)})`}><Panel x={x} y={y} width={width} height={height} dark={dark}>
  <Label x={width/2} y={51} center color={dark?'#BED5C5':G.muted} size={width<350?17:21}>{label}</Label>
  <Counter x={width/2} y={height*.69} t={t} start={start+.1} duration={1.1} from={from} to={value} prefix={prefix} suffix={suffix} size={width<350?76:98} color={color??(dark?G.gold:G.green)}/>
  {note&&<text x={width/2} y={height-23} textAnchor="middle" fill={dark?'#C9D6C7':G.muted} fontSize={17} fontFamily={SANS}>{note}</text>}
 </Panel></g>;
};
export const Arrow:React.FC<{x:number;y:number;width?:number;color?:string;progress?:number}>=({x,y,width=130,color=G.green,progress=1})=><g transform={`translate(${x} ${y})`} opacity={progress} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"><path d={`M0 0H${width}m-20-17 20 17-20 17`}/></g>;
export const ChalkTag:React.FC<{x:number;y:number;text:string;width?:number;color?:string}>=({x,y,text,width=330,color=G.dark})=><g transform={`translate(${x} ${y})`}><rect x={-width/2} y="-33" width={width} height="65" rx="11" fill={color}/><path d={`M${-width/2+14} 22Q0 19 ${width/2-14} 22`} fill="none" stroke="#FFFFFF25" strokeWidth="2"/><Label x={0} y={9} center color={G.white} size={21}>{text}</Label></g>;
export const Note:React.FC<{y:number;children:React.ReactNode;color?:string}>=({y,children,color=G.muted})=><text x="540" y={y} fontFamily={SANS} fontSize="20" textAnchor="middle" fill={color}>{children}</text>;
