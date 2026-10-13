import React from 'react';
import {GiftCard, CoffeeCup} from '../components/Assets';
import {Label, Arrow} from '../components/Boards';
import {G,SANS,ease,mix} from '../theme';
import {Point,travel} from './motion';

export type PropKind='card'|'cash'|'cup'|'wallet';
export const Wallet:React.FC=()=><g><rect x="-48" y="-32" width="96" height="66" rx="9" fill="#79503B" stroke="#573E30" strokeWidth="3"/><path d="M-43-22H42M-42 24H42" stroke="#B88960" strokeWidth="2" strokeDasharray="4 4"/><rect x="17" y="-12" width="39" height="26" rx="6" fill="#986347"/><circle cx="34" r="4" fill={G.gold}/></g>;
export const CashNote:React.FC<{amount:number}>=({amount})=><g><rect x="-60" y="-28" width="120" height="56" rx="3" fill="#C1D6A0" stroke="#5C8965" strokeWidth="3"/><rect x="-51" y="-20" width="102" height="40" rx="8" fill="none" stroke="#6F9B72" strokeWidth="2"/><text textAnchor="middle" y="12" fontSize="31" fontWeight="bold" fill="#42734F" fontFamily={SANS}>${amount}</text></g>;
export const HandObjectInteraction:React.FC<{at:Point;kind:PropKind;amount?:number;scale?:number;rotate?:number;t:number}>=({at,kind,amount=20,scale=1,rotate=0,t})=><g transform={`translate(${at.x} ${at.y}) rotate(${rotate}) scale(${scale})`}>
  {kind==='card'?<GiftCard scale={.4} amount={`$${amount}`}/>:kind==='cup'?<CoffeeCup scale={.61} y={-25} steam={t+1}/>:kind==='cash'?<CashNote amount={amount}/>:<Wallet/>}
</g>;
export const ObjectTransfer:React.FC<{from:Point;to:Point;t:number;start:number;duration:number;kind:PropKind;amount?:number;scale?:number;lift?:number}>=({from,to,t,start,duration,kind,amount,scale,lift=12})=><HandObjectInteraction at={travel(t,start,duration,from,to,lift)} kind={kind} amount={amount} scale={scale} rotate={mix(-8,5,ease(t,start,duration))} t={t}/>;

export const RegisterDisplay:React.FC<{x:number;y:number;cash:number;deferred?:number;revenue?:number;mode?:'cash'|'ledger'}>=({x,y,cash,deferred=20,revenue=0,mode='cash'})=><g transform={`translate(${x} ${y})`}>
  <path d="M-30 13H30L40 90H-40Z" fill="#3C5147"/><rect x="-115" y="80" width="230" height="21" rx="7" fill="#33483F"/>
  <rect x="-178" y="-200" width="356" height="230" rx="17" fill="#364C42"/><rect x="-164" y="-186" width="328" height="201" rx="10" fill="#E2EDCE"/>
  <Label x={0} y={-153} center size={17} color="#466951">{mode==='cash'?'CASH RECEIVED':'AT CARD ISSUE'}</Label>
  {mode==='cash'?<><text x="0" y="-58" textAnchor="middle" fill={G.green} fontFamily={SANS} fontWeight="bold" fontSize="76">${cash}</text><Label x={0} y={-20} center size={14}>{cash?'GIFT CARD ACTIVATED':'READY FOR PAYMENT'}</Label></>:<>
    {[['CASH RECEIVED',cash],['DEFERRED REVENUE',deferred],['REVENUE',revenue]].map(([label,value],i)=><g key={label}><Label x={-148} y={-107+i*45} size={12} color={G.ink}>{label}</Label><text x="146" y={-103+i*45} textAnchor="end" fontFamily={SANS} fontWeight="bold" fontSize="33" fill={i===2?G.terra:G.green}>${value}</text></g>)}
  </>}
  <path d="M-108 105H108L144 153H-144Z" fill="#5C6C5A"/>{Array.from({length:12},(_,i)=><rect key={i} x={-92+(i%4)*49} y={112+Math.floor(i/4)*12} width="35" height="6" rx="2" fill="#C6C7AA"/>)}
</g>;

export const PaymentTerminal:React.FC<{x:number;y:number;spent:number;purchase:number;active?:boolean;scale?:number}>=({x,y,spent,purchase,active=true,scale=1})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
  <path d="M-124-177Q-127-199-107-202H105Q125-201 126-181L144 173Q142 192 120 194H-117Q-141 193-142 172Z" fill="#344E43" stroke="#213B31" strokeWidth="4"/>
  <rect x="-108" y="-177" width="216" height="234" rx="8" fill={active?'#DFEDD1':'#AEC4AB'}/>
  <Label x={0} y={-145} center size={13} color={G.green}>CARD BALANCE</Label><text x="0" y="-72" textAnchor="middle" fontFamily={SANS} fontSize="65" fontWeight="bold" fill={G.green}>${purchase-spent}</text>
  <path d="M-90-46H90" stroke="#95AF96"/><Label x={-90} y={-17} size={13}>REDEEMED</Label><Label x={90} y={-17} size={18} center color={G.green}>${spent}</Label>
  <Label x={0} y={28} center size={11} color={G.ink}>{spent?'REMAINING OBLIGATION':'TAP YOUR GIFT CARD'}</Label>
  {Array.from({length:9},(_,i)=><rect key={i} x={-86+(i%3)*61} y={82+Math.floor(i/3)*26} width="49" height="19" rx="4" fill={i===8?'#E6C36A':'#839380'}/>)}
  <path d="M-18-231q18-14 36 0M-28-242q28-22 56 0" stroke={active?G.gold:'#93A792'} strokeWidth="4" fill="none" strokeLinecap="round"/>
</g>;

export const DrawerInteraction:React.FC<{x:number;y:number;open:number;layer:'back'|'front';children?:React.ReactNode}>=({x,y,open,layer,children})=><g transform={`translate(${x} ${y})`}>
  {layer==='back'?<><rect x="-235" y="-135" width="470" height="340" rx="5" fill="#B58B68" stroke="#886C51" strokeWidth="4"/><path d="M-214 185v78M212 185v78" stroke="#7C6550" strokeWidth="24"/><rect x="-219" y="-88" width="438" height="147" rx="6" fill="#4E493B"/><g transform={`translate(0 ${open*55})`}><path d="M-213-85H213L239 45H-240Z" fill="#CDB18A"/><path d="M-180-72h93l21 83h-100Z" fill="#F5E5C6"/><path d="M-171-56h64m-59 13h61m-57 12h55" stroke="#BDB090" strokeWidth="3"/>{children}</g><rect x="-250" y="-160" width="500" height="32" rx="5" fill="#DEC096"/></>:<g transform={`translate(0 ${open*55})`}><rect x="-231" y={-88+open*45} width="462" height={147-open*35} rx="5" fill="#BD9771" stroke="#886C51" strokeWidth="4"/><path d={`M-207 ${-68+open*45}h414`} stroke="#DBB88C" strokeWidth="3"/><rect x="-53" y={-27+open*23} width="106" height="16" rx="6" fill="#765C46"/><path d="M-200 82H200" stroke="#AC835F" strokeWidth="3"/></g>}
</g>;

export const CalendarProgression:React.FC<{x:number;y:number;t:number;start:number;months?:boolean}>=({x,y,t,start,months=true})=>{
  const p=Math.max(0,t-start),page=Math.min(4,Math.floor(p/.65)),flip=(p/.65)%1;
  return <g transform={`translate(${x} ${y})`}><path d="M-47-126L0-163L47-126" stroke="#916D4C" strokeWidth="4" fill="none"/>
    <rect x="-104" y="-130" width="208" height="252" rx="7" fill="#D3B388"/><rect x="-95" y="-130" width="190" height="236" rx="4" fill={G.white}/><path d="M-95-130H95V-75H-95Z" fill={G.terra}/>
    <Label x={0} y={-94} center size={20} color={G.white}>{months?['JAN','FEB','MAR','APR','MAY'][page]:'CALENDAR'}</Label>
    {Array.from({length:28},(_,i)=><rect key={i} x={-69+i%7*21} y={-48+Math.floor(i/7)*26} width="8" height="8" rx="2" fill={i<page*6?G.terra:'#B3B8A1'}/>)}
    {p>0&&page<4&&<g transform={`translate(0 -75) scale(1 ${Math.max(0,1-flip*2)})`} opacity={1-flip}><path d="M-95 0H95V180H-95Z" fill="#F2E8D1"/><path d="M-64 40H64M-64 64H64M-64 88H64" stroke="#C7C8AA" strokeWidth="4"/></g>}
  </g>;
};

export const FinancialReveal:React.FC<{amount:number;t:number;start:number;year:number;small?:boolean}>=({amount,t,start,year,small=false})=>{
  const n=(amount*ease(t,start,2.1)).toFixed(1),p=ease(t,start,.8);
  return <g opacity={p} transform={`translate(800 ${small?470:440}) scale(${mix(.93,1,p)})`}>
    <Label x={0} y={-78} center color={G.gold} size={25}>STARBUCKS · FISCAL {year}</Label>
    <text y="65" textAnchor="middle" fill={G.white} fontFamily={SANS} fontWeight="bold" fontSize={small?123:153} letterSpacing="-6">${n}<tspan fontSize={small?70:80}>M</tspan></text>
    <Label x={0} y={130} center color={G.gold} size={28}>BREAKAGE REVENUE</Label>
    <path d="M-342 170H342" stroke="#97B39C" strokeWidth="2"/>
    <Label x={0} y={207} center color="#D8E2C9" size={18}>EXPECTED UNUSED GIFT-CARD BALANCES</Label>
  </g>;
};
