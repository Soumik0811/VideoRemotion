import React from 'react';
import {B,SANS,ease,curve,windowAt,money} from '../engine/motion';

export const BreadLoaf:React.FC<{x?:number;y?:number;scale?:number;rotate?:number}>=({x=0,y=0,scale=1,rotate=0})=><g transform={`translate(${x} ${y}) scale(${scale}) rotate(${rotate})`}>
 <path d="M-49 8 C-55-29-24-45 9-39 C41-37 57-12 48 9 Q0 25-49 8Z" fill="#E9B96E" stroke="#A7774F" strokeWidth="3"/>
 <path d="M-26-22 l9 16 M-6-28 l10 17 M15-25 l10 16" stroke="#FFF0BB" strokeWidth="7" strokeLinecap="round"/>
 <path d="M-43 8 Q0 20 43 8" stroke="#CD9555" strokeWidth="4" fill="none"/>
</g>;
export const BreadTray:React.FC<{x?:number;y?:number;scale?:number;count?:number}>=({x=0,y=0,scale=1,count=3})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 {Array.from({length:count},(_,i)=><BreadLoaf key={i} x={(i-(count-1)/2)*54} scale={.6}/>)}
 <path d="M-104 15 H104 L94 32 H-94Z" fill="#856F60"/><path d="M-100 16H100" stroke="#B9A494" strokeWidth="5"/>
</g>;
export const MoneyBill:React.FC<{x?:number;y?:number;scale?:number;rotate?:number}>=({x=0,y=0,scale=1,rotate=0})=><g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
 <rect x="-48" y="-27" width="96" height="54" rx="7" fill="#BDD4A1" stroke={B.green} strokeWidth="3"/><rect x="-40" y="-20" width="80" height="40" rx="3" fill="none" stroke={B.green} opacity=".4" strokeWidth="2"/><ellipse rx="15" ry="20" fill="#E1EBC5"/><text y="10" textAnchor="middle" fontSize="27" fill={B.green} fontFamily={SANS} fontWeight="bold">$</text><path d="M-31 0h8M24 0h8" stroke={B.green} strokeWidth="3"/>
</g>;
export const MoneyStack:React.FC<{x?:number;y?:number;scale?:number}>=({x=0,y=0,scale=1})=><g transform={`translate(${x} ${y}) scale(${scale})`}>{[2,1,0].map(i=><MoneyBill key={i} y={i*8} x={i*3}/>)}</g>;
export const FlourSack:React.FC<{x?:number;y?:number;scale?:number}>=({x=0,y=0,scale=1})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <path d="M-30-54 L-21-69 Q0-61 21-69 L31-54 L24-43 Q67 20 39 46 Q0 59-39 46 Q-62 24-24-43Z" fill="#F3DFB5" stroke="#B79569" strokeWidth="3"/><path d="M-29-47Q0-41 28-47" fill="none" stroke="#B79569" strokeWidth="5"/><rect x="-32" y="-17" width="64" height="49" rx="9" fill={B.white}/><text y="3" textAnchor="middle" fontFamily={SANS} fontSize="13" fontWeight="bold" fill={B.muted}>FLOUR</text><path d="M0 23V8m0 11l-8-5m8 1l8-5" stroke={B.sage} strokeWidth="3"/>
</g>;
export const CashRegister:React.FC<{x?:number;y?:number;scale?:number;open?:number}>=({x=0,y=0,scale=1,open=0})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <path d="M-59 6 L-45-56 H31 L48 6" fill="#BAC7B3" stroke="#627564" strokeWidth="3"/><rect x="-29" y="-47" width="49" height="24" rx="3" fill="#3C5147"/><text x="-4" y="-30" fontSize="14" textAnchor="middle" fill="#D7EDC8" fontFamily={SANS}>{open>.5?'0.00':'CASH'}</text>
 {[0,1,2].map(i=><g key={i}>{[0,1,2,3].map(j=><rect key={j} x={-33+j*14} y={-16+i*7} width="9" height="4" rx="1" fill={B.white}/>)}</g>)}
 <rect x="-68" y="6" width="126" height="32" rx="6" fill="#779181" stroke="#546D5B" strokeWidth="3"/>
 <g transform={`translate(0 ${open*22})`}><path d="M-60 18H50V43H-60Z" fill="#D4C2A6" stroke="#546D5B" strokeWidth="3"/><path d="M-46 22H38V34H-46Z" fill="#5F6259"/><path d="M-17 22v12M11 22v12" stroke="#D4C2A6" strokeWidth="3"/></g>
</g>;
export const IngredientShelf:React.FC<{x?:number;y?:number;scale?:number;stock?:number}>=({x=0,y=0,scale=1,stock=3})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <rect x="-110" y="-135" width="220" height="195" rx="4" fill="#CAAE88"/><rect x="-99" y="-125" width="198" height="170" fill="#E4CFAB"/>
 {[0,1,2].slice(0,stock).map(i=><FlourSack key={i} x={(i-1)*64} y={-22} scale={.56}/>)}<path d="M-110 13H110 M-110 63H110" stroke="#AB865F" strokeWidth="13"/><path d="M-98 64v24M98 64v24" stroke="#AB865F" strokeWidth="14"/>
</g>;
export const MoneyTransfer:React.FC<{t:number;start:number;from:[number,number];to:[number,number];count?:number}>=({t,start,from,to,count=3})=><g>{Array.from({length:count},(_,i)=>{const st=start+i*.22,p=ease(t,st,1.25),v=curve(p,from,[(from[0]+to[0])/2,Math.min(from[1],to[1])-120],to);return <g key={i} opacity={windowAt(t,st,st+1.5,.2)}><MoneyBill x={v.x} y={v.y} scale={.75} rotate={-15+30*p}/></g>})}</g>;
export const FlowArrow:React.FC<{x?:number;y?:number;width?:number;color?:string}>=({x=0,y=0,width=130,color=B.green})=><g transform={`translate(${x} ${y})`} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"><path d={`M0 0 Q${width*.5} -25 ${width} 0l-18-15m18 15l-22 6`}/></g>;
export const InvoiceCard:React.FC<{x?:number;y?:number;scale?:number;amount:number;days:number}>=({x=0,y=0,scale=1,amount,days})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <rect x="-158" y="-176" width="316" height="352" rx="14" fill="#B8907220" transform="translate(8 12)"/>
 <path d="M-150-180 H105 L155-130 V165 Q155 180 140 180H-135Q-150 180-150 165Z" fill={B.white} stroke="#CFB79A" strokeWidth="3"/><path d="M105-180V-130H155" fill="#EAD7B9"/>
 <text x="-119" y="-118" fontSize="23" fontFamily={SANS} fontWeight="bold" fill={B.muted}>INVOICE</text><text x="-119" y="-55" fontSize="51" fontFamily={SANS} fontWeight="bold" fill={B.dark}>{money(amount)}</text><path d="M-119-23H119" stroke="#E4D6C0" strokeWidth="3"/>
 <text x="-119" y="13" fontSize="16" fontFamily={SANS} fill={B.muted}>PAYMENT TERMS</text><text x="-119" y="53" fontSize="32" fontFamily={SANS} fontWeight="bold" fill={B.terra}>{days} DAYS</text><rect x="-119" y="91" width="238" height="47" rx="6" fill="#F3E6D2"/><text y="121" textAnchor="middle" fontSize="18" fontFamily={SANS} fill={B.muted}>OWED · NOT RECEIVED</text>
</g>;
export const CalendarFlip:React.FC<{x?:number;y?:number;scale?:number;progress:number;days:number}>=({x=0,y=0,scale=1,progress,days})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <rect x="-94" y="-92" width="188" height="192" rx="15" fill={B.white} stroke="#CFB79A" strokeWidth="3"/><path d="M-94-76Q-94-92-78-92H78Q94-92 94-76V-39H-94Z" fill={B.terra}/><path d="M-53-105v29M53-105v29" stroke={B.muted} strokeWidth="9" strokeLinecap="round"/><text y="-55" fontSize="15" textAnchor="middle" fontFamily={SANS} fill={B.white} fontWeight="bold">PAYMENT DUE</text>
 <g transform={`translate(0 8) scale(1 ${1-.18*Math.sin(progress*Math.PI*12)**2})`}><text y="38" fontSize="68" fontFamily={SANS} fontWeight="bold" textAnchor="middle" fill={B.dark}>{Math.max(1,Math.round(days*progress))}</text></g><text y="78" fontSize="15" textAnchor="middle" fontFamily={SANS} fill={B.muted}>DAYS FROM SALE</text>
</g>;
