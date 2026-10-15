import React from 'react';
import {GiftEpisode} from '../types';
import {G,SANS,SERIF,ease,appear,mix,money} from '../theme';
import {Panel,Label,NumberBoard,Counter,Arrow,ChalkTag,Note} from './Boards';
import {GiftCard,CoffeeCup,Drawer} from './Assets';
import {MoneyTransfer} from '../../bakery/components/Props';

const Hero:React.FC<{t:number;episode:GiftEpisode;reveal?:boolean}>=({t,episode,reveal=false})=>{
 const f=episode.financials;
 return <>
  <Panel x={65} y={415} width={950} height={reveal?440:485} dark>
   <Label x={475} y={61} center color="#CBDBC9">STARBUCKS · FISCAL {f.fiscalYear}</Label>
   <Counter x={475} y={269} t={t} start={.5} duration={1.7} to={f.reportedBreakageFloorMillions} suffix="M+" size={163} color={G.gold}/>
   <Label x={475} y={340} center color={G.white} size={30}>BREAKAGE REVENUE</Label>
   <text x="475" y="389" fill="#CBDCCB" textAnchor="middle" fontSize="23" fontFamily={SANS}>Expected unused gift-card balances</text>
   {!reveal&&<path d="M222 417Q475 436 728 417" stroke="#8EB696" strokeWidth="4" fill="none" strokeLinecap="round"/>}
  </Panel>
  {reveal?<g opacity={appear(t,6.8,.5)}><Panel x={145} y={882} width={790} height={161}><CoffeeCup x={87} y={71} scale={.57}/><Label x={165} y={51} size={21}>EXTRA LATTES FOR UNUSED BALANCES</Label><text x="680" y="125" textAnchor="middle" fontFamily={SANS} fontWeight="bold" fontSize="82" fill={G.green}>0</text><text x="165" y="104" fontFamily={SANS} fontSize="25" fill={G.muted}>No additional redemption.</text></Panel></g>:<g opacity={appear(t,5,.6)}><GiftCard x={353} y={995} scale={.58} amount="$6" rotate={-8}/><Arrow x={480} y={997} width={90}/><ChalkTag x={769} y={997} width={305} text="REVENUE"/></g>}
 </>;
};
const Practice:React.FC<{t:number}>=({t})=><>
 <Panel x={65} y={421} width={950} height={537} dark>
  <Label x={475} y={60} center color="#BCD3C2">RECOGNIZED ACCOUNTING PRACTICE</Label>
  <path d="M414 134l42 43 88-99" stroke={G.gold} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={appear(t,.4,.6)}/>
  <text x="475" y="262" textAnchor="middle" fill={G.white} fontFamily={SERIF} fontWeight="600" fontSize="58">A gift card creates</text><text x="475" y="333" textAnchor="middle" fill={G.gold} fontFamily={SERIF} fontWeight="600" fontSize="67">a promise to deliver.</text>
  <Label x={475} y={421} center size={21} color="#CFDDCC">CASH AND REVENUE FOLLOW DIFFERENT CLOCKS</Label>
  <path d="M175 463H775" stroke="#52715F" strokeWidth="3"/>
 </Panel>
 <g opacity={appear(t,7,.6)}><ChalkTag x={285} y={1030} text="CASH NOW" width={360}/><Arrow x={493} y={1030} width={94}/><ChalkTag x={797} y={1030} text="REVENUE LATER" width={360}/></g>
</>;
const Purchase:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=><>
 <NumberBoard x={65} y={415} width={450} height={255} label="CUSTOMER PAYS" value={episode.financials.purchase} t={t} start={.4} note="A gift for a friend"/>
 <NumberBoard x={565} y={415} width={450} height={255} label="CASH RECEIVED" value={episode.financials.purchase} t={t} start={5.6} dark note="Collected immediately"/>
 <Panel x={165} y={726} width={750} height={300}><Label x={375} y={47} center>THE GIFT CARD</Label><GiftCard x={375} y={177} scale={.82} amount={money(episode.financials.purchase)}/></Panel>
 <MoneyTransfer t={t} start={5.6} from={[313,694]} to={[790,694]} count={4}/>
 <Arrow x={489} y={570} width={83} progress={appear(t,5.6,.5)}/>
</>;
const Liability:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=><>
 <NumberBoard x={65} y={430} width={295} height={250} label="CASH RECEIVED" value={episode.financials.purchase} from={episode.financials.purchase} t={t} start={0} note="The money is in"/>
 <NumberBoard x={393} y={430} width={295} height={250} label="LIABILITY" value={episode.financials.purchase} t={t} start={.6} dark note="Coffee still owed"/>
 <NumberBoard x={720} y={430} width={295} height={250} label="REVENUE" value={0} t={t} start={.3} color={G.terra} note="Not earned yet"/>
 <Panel x={115} y={736} width={850} height={285} dark>
  <GiftCard x={178} y={152} scale={.67} amount={money(episode.financials.purchase)}/><Arrow x={324} y={153} width={100} color={G.gold}/><CoffeeCup x={506} y={132} scale={.87} steam={t}/>
  <Label x={675} y={100} center color={G.white} size={23}>A PROMISE</Label><Label x={675} y={145} center color={G.gold} size={23}>TO DELIVER</Label><text x="675" y="208" fontSize="20" fontFamily={SANS} textAnchor="middle" fill="#CDDDCD">Deferred revenue</text>
 </Panel>
</>;
const Redeem:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
 const f=episode.financials,p=ease(t,1.1,2.2),spent=Math.round(f.redeemed*p),left=f.purchase-spent;
 return <>
  <Panel x={65} y={410} width={950} height={159}><Label x={44} y={54}>ORIGINAL CARD VALUE</Label><text x="885" y="112" textAnchor="end" fontSize="77" fontFamily={SANS} fontWeight="bold" fill={G.green}>{money(f.purchase)}</text></Panel>
  <Panel x={65} y={610} width={450} height={266}><Label x={225} y={50} center>REDEEMED</Label><text x="225" y="173" textAnchor="middle" fontFamily={SANS} fontWeight="bold" fontSize="107" fill={G.green}>{money(spent)}</text><Label x={225} y={231} center size={19}>REVENUE FROM COFFEE</Label></Panel>
  <Panel x={565} y={610} width={450} height={266} dark><Label x={225} y={50} center color="#D4DDC9">REMAINING BALANCE</Label><text x="225" y="173" textAnchor="middle" fontFamily={SANS} fontWeight="bold" fontSize="107" fill={G.gold}>{money(left)}</text><Label x={225} y={231} center size={19} color="#D4DDC9">STILL A LIABILITY</Label></Panel>
  <g opacity={appear(t,3.4,.5)}><ChalkTag x={540} y={953} text="CASH RECEIVED REMAINS $20" width={621}/><Note y={1016}>Single-card illustration · aggregate breakage omitted here</Note></g>
 </>;
};
const Forgotten:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=><>
 <Panel x={65} y={414} width={950} height={225} dark><Label x={475} y={53} center color="#C9DCCB">THE UNUSED BALANCE</Label><text x="475" y="170" textAnchor="middle" fontFamily={SANS} fontSize="103" fontWeight="bold" fill={G.gold}>{money(episode.financials.balance)}</text></Panel>
 <Drawer x={540} y={803} t={t} close={ease(t,3.5,1)}/>
 <g opacity={appear(t,.3,.4)}><ChalkTag x={232} y={699} text={t>1.65?'MONTHS PASS':'WEEKS PASS'} width={290}/></g>
 <g opacity={appear(t,4.7,.5)}><ChalkTag x={540} y={1041} text="FORGOTTEN ≠ EXPIRED" width={525}/></g>
</>;
const Scale:React.FC<{t:number}>=({t})=><>
 <Panel x={65} y={413} width={950} height={620} dark>
  <Label x={475} y={63} center size={28} color={G.white}>MILLIONS OF GIFT CARDS</Label>
  <Label x={475} y={104} center size={17} color="#B5CDBD">ILLUSTRATIVE CUSTOMER BALANCES</Label>
  {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{const balance=[0,1,2,6][i%4],p=appear(t,.3+i*.16,.5);return <g key={i} transform={`translate(${138+i%4*225} ${184+Math.floor(i/4)*102+16*(1-p)})`} opacity={p}><rect x="-89" y="-38" width="178" height="78" rx="12" fill={balance?'#42755B':'#CADCC9'}/><text x="0" y="16" textAnchor="middle" fontFamily={SANS} fontWeight="bold" fontSize="45" fill={balance?G.gold:G.dark}>${t<3?Math.round(balance*ease(t,.4+i*.12,1)):balance}</text></g>})}
  <g opacity={appear(t,7.5,.7)}><path d="M120 443H830" stroke="#63836A" strokeWidth="2"/><Label x={475} y={486} center size={22} color={G.gold}>HISTORICAL REDEMPTIONS</Label><path d="M475 508v32m-13-13 13 13 13-13" stroke={G.gold} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><Label x={475} y={580} center size={23} color={G.white}>ESTIMATE EXPECTED UNUSED BALANCES</Label></g>
 </Panel>
</>;
const Rules:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
 const p=ease(t,3.2,6.3),amount=Math.round(100*episode.financials.illustrativeRedemptionFraction*p);
 return <>
  <Panel x={65} y={414} width={950} height={615} dark>
   <Label x={475} y={56} center size={24} color={G.white}>RECOGNIZE BREAKAGE PROPORTIONALLY</Label>
   {[0,1].map(i=><g key={i} transform={`translate(${i?700:250} 0)`}><Label x={0} y={119} center size={19} color="#CBDCC7">{i?'BREAKAGE RECOGNIZED':'REDEMPTIONS MADE'}</Label><text x="0" y="253" textAnchor="middle" fontFamily={SANS} fontSize="109" fontWeight="bold" fill={i?G.gold:G.white}>{amount}%</text><rect x="-132" y="300" width="264" height="25" rx="12" fill="#476A55"/><rect x="-132" y="300" width={264*amount/100} height="25" rx="12" fill={i?G.gold:'#BBD1AC'}/><text x="0" y="368" fontSize="21" fontFamily={SANS} textAnchor="middle" fill="#D1DDC7">{i?'of estimated breakage':'of expected redemptions'}</text></g>)}
   <Arrow x={436} y={232} width={81} color={G.gold}/>
   <g opacity={appear(t,12.7,.45)}><rect x="63" y="422" width="824" height="112" rx="14" fill={G.gold}/><text x="475" y="495" textAnchor="middle" fill={G.dark} fontSize="55" fontFamily={SANS} fontWeight="bold">GIFT-CARD BREAKAGE</text></g>
   <text x="475" y="582" textAnchor="middle" fill="#BECCBA" fontFamily={SANS} fontSize="18">Illustrative proportions · not Starbucks’ estimated breakage rate</text>
  </Panel>
 </>;
};
const Truth:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=><>
 <Panel x={65} y={415} width={950} height={615} dark>
  <Label x={475} y={59} center size={25} color={G.white}>TWO DIFFERENT MOMENTS</Label>
  <g opacity={appear(t,.4,.5)}><rect x="45" y="106" width="860" height="167" rx="17" fill="#315E49"/><Label x={75} y={154} size={24} color={G.gold}>THEN · CASH RECEIVED</Label><text x="75" y="222" fontFamily={SERIF} fontSize="37" fill={G.white}>The customer paid for the card.</text></g>
  <path d="M475 287v45m-15-15 15 15 15-15" stroke={G.gold} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={appear(t,3.4,.5)}/>
  <g opacity={appear(t,3.6,.6)}><rect x="45" y="354" width="860" height="167" rx="17" fill="#DFE4BF"/><Label x={75} y={402} size={24} color={G.dark}>LATER · REVENUE RECOGNIZED</Label><text x="75" y="462" fontFamily={SERIF} fontSize="34" fill={G.ink}>Coffee redeemed, or qualifying breakage.</text></g>
  <Label x={475} y={580} center size={19} color="#C7D9C5">RECOGNITION DOES NOT CREATE A SECOND CASH PAYMENT</Label>
 </Panel>
</>;
const Question:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
 const outro=appear(t,13.4,.7);
 return <>
  <g opacity={1-outro}>
   <Panel x={65} y={418} width={950} height={606} dark><Label x={475} y={61} center color="#D0DECB">WHO RECEIVES THE GIFT?</Label><GiftCard x={475} y={215} scale={1.03} amount={money(episode.financials.purchase)}/><path d="M475 326v44M244 370H705M244 370v42M705 370v42" stroke={G.gold} strokeWidth="6" fill="none" strokeLinecap="round"/>
    <g opacity={appear(t,6.6,.6)}><rect x="69" y="438" width="363" height="102" rx="17" fill="#D3E2C4"/><Label x={250} y={499} center size={28} color={G.ink}>YOUR FRIEND</Label></g>
    <g opacity={appear(t,10,.6)}><rect x="518" y="438" width="363" height="102" rx="17" fill={G.gold}/><Label x={699} y={499} center size={28} color={G.ink}>THE COMPANY</Label></g>
   </Panel>
  </g>
  <g opacity={outro}><Panel x={65} y={418} width={950} height={606} dark><Label x={475} y={78} center size={23} color={G.gold}>BUSINESS SECRETS HIDING IN PLAIN SIGHT</Label><text x="475" y="253" fontFamily={SERIF} fontSize="92" fontWeight="600" textAnchor="middle" fill={G.white}>Oddly</text><text x="475" y="354" fontFamily={SERIF} fontSize="92" fontWeight="600" textAnchor="middle" fill={G.white}>Logical.</text><rect x="256" y="420" width="438" height="101" rx="50" fill={G.gold}/><Label x={475} y={484} center size={33} color={G.dark}>FOLLOW FOR MORE</Label></Panel></g>
 </>;
};
export const StoryBoards:React.FC<{id:string;t:number;episode:GiftEpisode}>=({id,t,episode})=>{
 switch(id){case'hook':return <Hero t={t} episode={episode}/>;case'practice':return <Practice t={t}/>;case'purchase':return <Purchase t={t} episode={episode}/>;case'liability':return <Liability t={t} episode={episode}/>;case'redeem':return <Redeem t={t} episode={episode}/>;case'forgotten':return <Forgotten t={t} episode={episode}/>;case'scale':return <Scale t={t}/>;case'rules':return <Rules t={t} episode={episode}/>;case'reveal':return <Hero t={t} episode={episode} reveal/>;case'truth':return <Truth t={t} episode={episode}/>;case'question':return <Question t={t} episode={episode}/>;default:throw new Error(`Unknown gift-card scene: ${id}`);}
};
