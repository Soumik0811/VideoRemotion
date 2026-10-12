import React from 'react';
import {BakeryEpisode} from '../types';
import {B,SANS,SERIF,appear,ease,money} from '../engine/motion';
import {BakerCharacter} from './BakerCharacter';

export const ComparisonPanel:React.FC<{t:number;episode:BakeryEpisode}>=({t,episode})=>{
 const f=episode.financials;
 return <g fontFamily={SANS}>
  <rect x="42" y="0" width="996" height="990" rx="26" fill={B.cream}/>
  <text x="540" y="49" textAnchor="middle" fontSize="20" fill={B.muted} letterSpacing="2">THE FIRST BATCH · END OF DAY ONE</text>
  {(['oliver','noah'] as const).map((id,i)=>{const x=70+i*485,col=episode.characters[id].color;return <g key={id} transform={`translate(${x} 82)`}>
   <rect width="455" height="697" rx="23" fill={B.white} stroke="#DBCEB7" strokeWidth="2"/><path d="M23 0H432Q455 0 455 23V69H0V23Q0 0 23 0Z" fill={col}/>
   <text x="227" y="46" textAnchor="middle" fontSize="29" fontWeight="bold" fill={B.white}>{episode.characters[id].name.toUpperCase()}</text>
   <BakerCharacter id={id} characters={episode.characters} t={t} x={180} y={83} scale={.39} actions={[{at:0,action:id==='oliver'?'happy':'worried'}]}/>
   {[{label:'SALES',value:f.sales,at:60.8},{label:'PRODUCTION COST',value:f.productionCost,at:61.7},{label:'GROSS PROFIT',value:f.grossProfit,at:63.2}].map((r,j)=><g key={r.label} opacity={appear(t,r.at,.5)}>
    {j===2&&<rect x="18" y={263+j*96} width="419" height="89" rx="10" fill="#E6ECD9"/>}
    <text x="35" y={287+j*96} fontSize="17" letterSpacing="1" fill={B.muted}>{r.label}</text>
    <text x="420" y={328+j*96} textAnchor="end" fontSize="42" fontWeight="bold" fill={j===2?B.green:B.dark}>{money(r.value*ease(t,r.at,.7))}</text>
    {j<2&&<path d={`M35 ${349+j*96}H420`} stroke="#E7DCCA" strokeWidth="2"/>}
   </g>)}
   <g opacity={appear(t,67.2,.7)}><rect x="18" y="568" width="419" height="110" rx="12" fill={i?'#F2DFD2':'#55775E'}/><text x="37" y="598" fontSize="18" fill={i?B.muted:B.white}>CASH RECEIVED</text><text x="420" y="656" textAnchor="end" fontSize="50" fontWeight="bold" fill={i?B.terra:B.white}>{money((i?f.noahCashReceived:f.oliverCashReceived)*ease(t,67.2,.75))}</text></g>
  </g>})}
  <g opacity={appear(t,70,.65)}><rect x="554" y="800" width="456" height="114" rx="17" fill="#F2E3CD"/><text x="579" y="830" fontSize="17" fill={B.muted}>UNPAID INVOICE</text><text x="580" y="883" fontSize="40" fontWeight="bold" fill={B.dark}>{money(f.unpaidInvoice)}</text><text x="982" y="881" fontSize="22" textAnchor="end" fill={B.terra}>DUE IN {f.paymentDays} DAYS</text>
  <text x="292" y="850" textAnchor="middle" fontSize="25" fontFamily={SERIF} fill={B.green}>Cash to fund</text><text x="292" y="884" textAnchor="middle" fontSize="25" fontFamily={SERIF} fill={B.green}>the next batch.</text></g>
  <text x="540" y="959" textAnchor="middle" fontSize="20" fill={B.muted}>Production cost deducted once. Other operating expenses excluded.</text>
 </g>;
};
