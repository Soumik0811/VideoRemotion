import React from 'react';
import {GiftEpisode} from '../types';
import {G,SANS,ease} from '../theme';
import {Label,Arrow} from '../components/Boards';

export const LedgerMonitor:React.FC<{t:number;episode:GiftEpisode;mode:'patterns'|'recognition'|'timing'}>=({t,episode,mode})=>{
  const f=episode.financials;
  const fraction=f.illustrativeRedemptionFraction*ease(t,81.3,8.4),percent=Math.round(fraction*100);
  const cursorX=mode==='patterns'?147+Math.sin(t*.5)*83:mode==='recognition'?260:191;
  return <g transform="translate(903 739)">
    <path d="M-35 146H35L53 239H-53Z" fill="#426557"/><ellipse cy="243" rx="173" ry="17" fill="#486A59"/>
    <rect x="-347" y="-292" width="694" height="448" rx="15" fill="#314E42"/><rect x="-329" y="-274" width="658" height="406" rx="6" fill="#F4EFD9"/>
    <rect x="-329" y="-274" width="658" height="51" rx="5" fill="#DAE2C3"/>{[-307,-288,-269].map((x,i)=><circle key={x} cx={x} cy="-249" r="5" fill={['#BE8669','#DBB565','#8AA778'][i]}/>)}
    <Label x={35} y={-242} center size={15} color={G.ink}>{mode==='patterns'?'STORED-VALUE CARD LEDGER':mode==='recognition'?'RECOGNITION SCHEDULE':'CASH & REVENUE TIMELINE'}</Label>
    {mode==='patterns'?<>
      <Label x={-300} y={-190} size={16} color={G.green}>HISTORICAL REDEMPTIONS</Label>
      {[0,1,2,3].map(i=><g key={i}><path d={`M-300 ${-138+i*45}H292`} stroke="#CBD3B6"/><Label x={-287} y={-151+i*45} size={13}>COHORT 0{i+1}</Label><rect x="-160" y={-168+i*45} width={257*ease(t,71+i*.27,1.7)} height="17" rx="3" fill="#769D79"/><Label x={145} y={-153+i*45} size={12} color={G.muted}>{['REDEEMED','REDEEMED','REDEEMED','REDEEMED'][i]}</Label></g>)}
      <g opacity={ease(t,74,.8)}><path d="M-300 44H296" stroke="#C1CBAB"/><Label x={-293} y={82} size={14} color={G.green}>ESTIMATED UNUSED BALANCES</Label><path d="M139 62h146v36H139Z" fill="#E6CF8F"/><Label x={212} y={87} center size={14}>EXPECTED</Label></g>
      <Label x={-300} y={118} size={10}>Patterns inform an estimate; individual cards are not forfeited.</Label>
    </>:mode==='recognition'?<>
      <Label x={0} y={-186} center size={17} color={G.green}>RECOGNITION FOLLOWS REDEMPTIONS</Label>
      {[0,1].map(i=><g key={i} transform={`translate(${i?166:-165} 0)`}>
        <Label x={0} y={-144} center size={12}>{i?'BREAKAGE RECOGNIZED':'REDEMPTIONS MADE'}</Label>
        <text y="-56" textAnchor="middle" fontFamily={SANS} fontSize="70" fontWeight="bold" fill={i?'#A77D32':G.green}>{percent}%</text>
        <rect x="-121" y="-28" width="242" height="19" rx="5" fill="#DDE1C7"/><rect x="-121" y="-28" width={242*fraction} height="19" rx="5" fill={i?G.gold:G.green}/>
        <Label x={0} y={22} center size={12}>{i?'of estimated breakage':'of expected redemptions'}</Label>
      </g>)}
      <Arrow x={-26} y={-82} width={52} color="#79947A"/>
      <g opacity={ease(t,91.4,.65)}><rect x="-300" y="44" width="600" height="48" rx="4" fill={G.green}/><Label x={0} y={76} center size={23} color={G.white}>GIFT-CARD BREAKAGE</Label></g>
      <Label x={0} y={119} center size={10}>Illustrative proportions · not Starbucks’ estimated breakage rate</Label>
    </>:<>
      <Label x={-297} y={-181} size={15} color={G.green}>THEN · CARD PURCHASE</Label>
      <Label x={-297} y={-138} size={14}>CASH RECEIVED</Label><text x="287" y="-131" textAnchor="end" fontFamily={SANS} fontSize="44" fill={G.green} fontWeight="bold">${f.purchase}</text>
      <path d="M-294-104H291" stroke="#BCCBAB"/>
      <Label x={-297} y={-70} size={15} color={G.green}>LATER · ACCOUNTING RECOGNITION</Label>
      <Label x={-297} y={-30} size={14}>QUALIFYING BREAKAGE</Label><path d="M225-48l20 22 39-44" fill="none" stroke={G.green} strokeWidth="7" strokeLinecap="round"/>
      <rect x="-301" y="0" width="600" height="71" rx="6" fill="#E8D29B"/><Label x={-283} y={42} size={14} color={G.ink}>ADDITIONAL CASH COLLECTED</Label><text x="278" y="53" textAnchor="end" fontFamily={SANS} fontSize="45" fontWeight="bold" fill={G.ink}>$0</text>
      <Label x={0} y={112} center size={11}>Revenue recognition does not create a second payment.</Label>
    </>}
    <path d={`M${cursorX} 34l7 22 5-10 12-3Z`} fill="#3F604C" stroke="#F0F0D6" strokeWidth="1.4"/>
    <path d="M-163 271H156L177 301H-180Z" fill="#71907A"/>{Array.from({length:24},(_,i)=><rect key={i} x={-145+i%12*25} y={277+Math.floor(i/12)*11} width="18" height="6" rx="1" fill="#C9D6BA"/>)}
  </g>;
};
