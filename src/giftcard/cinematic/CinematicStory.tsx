import React from 'react';
import {GiftEpisode} from '../types';
import {G,SANS,ease,mix} from '../theme';
import {GiftCard,CoffeeCup} from '../components/Assets';
import {Label} from '../components/Boards';
import {CharacterAction,CharacterState,handPosition} from './CharacterAction';
import {EnvironmentCamera} from './EnvironmentCamera';
import {CafeEnvironment,HomeEnvironment,OfficeEnvironment,OfficeDesk,ExteriorEnvironment} from './Environments';
import {HandObjectInteraction,ObjectTransfer,RegisterDisplay,PaymentTerminal,DrawerInteraction,FinancialReveal} from './Interactions';
import {LedgerMonitor} from './LedgerMonitor';
import {purchaseAction,giftAction,redemptionAction,homeAction} from './choreography';
import {Camera,point,blendCamera,lerpPoint} from './motion';

const framed=(x:number,y:number,zoom:number):Camera=>({x,y,zoom});
const Held:React.FC<{state:CharacterState;hand:'left'|'right';t:number;kind:'card'|'cash'|'cup'|'wallet';amount?:number}>=({state,hand,t,kind,amount})=><HandObjectInteraction at={handPosition(state,hand,t)} kind={kind} amount={amount} scale={1.12} t={t}/>;

const Opening:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
  const explainer:CharacterState={role:'explainer',x:615,y:1300,scale:1.5,right:point(115,-267),left:point(-76,-180),expression:t<5?'surprised':'thinking',tilt:mix(-5,3,ease(t,5.5,1))};
  const h=handPosition(explainer,'right',t);
  const camera=t<5.6?blendCamera(framed(800,760,.86),framed(800,747,.93),ease(t,0,5.6)):blendCamera(framed(725,865,1.4),framed(730,858,1.57),ease(t,5.6,5.4));
  return <EnvironmentCamera camera={camera}><CafeEnvironment t={t} camera={camera} episode={episode} dark/>
    {t<5.6&&<FinancialReveal t={t} start={.2} amount={episode.financials.reportedBreakageMillions} year={episode.financials.fiscalYear}/>}
    <CharacterAction state={explainer} t={t} episode={episode}/><HandObjectInteraction at={h} kind="card" amount={episode.financials.balance} scale={1.15} rotate={-10} t={t}/>
    {t>5.6&&<g opacity={ease(t,5.7,.6)}><path d={`M${h.x+90} ${h.y-7}q97-4 94-100`} fill="none" stroke={G.gold} strokeWidth="3" strokeDasharray="8 6"/><Label x={h.x+75} y={h.y-140} center size={22} color={G.white}>UNUSED BALANCE</Label><Label x={h.x+75} y={h.y-107} center size={20} color={G.gold}>$6 ON THE CARD</Label></g>}
  </EnvironmentCamera>;
};

const ShopIntroduction:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
  const entering=t>20;
  const camera=entering?blendCamera(framed(500,780,.9),framed(765,815,1.02),ease(t,20,7)):blendCamera(framed(825,760,.8),framed(860,792,.88),ease(t,11,9));
  const explainer:CharacterState={role:'explainer',x:590,y:1280,scale:1.5,right:point(mix(76,123,ease(t,13,.8)),-241),expression:'happy',look:3};
  const cashier:CharacterState={role:'barista',x:1100,y:1120,scale:1.35,left:point(-92+Math.sin(t*1.7)*12,-192),expression:'happy'};
  const {buyer}=purchaseAction(t);
  return <EnvironmentCamera camera={camera}><CafeEnvironment t={t} camera={camera} episode={episode} door={ease(t,21,.6)*(1-ease(t,25,.65))}/>
    <CharacterAction state={cashier} t={t} episode={episode}/><CafeEnvironment t={t} camera={camera} episode={episode} layer="front"/>
    <RegisterDisplay x={1290} y={819} cash={0}/><CoffeeCup x={933} y={892} scale={.63} steam={t}/>
    {entering?<CharacterAction state={{...buyer,x:mix(60,470,ease(t,20,7)),walk:1}} t={t} episode={episode}/>:<>
      <CharacterAction state={explainer} t={t} episode={episode}/><Held state={explainer} hand="right" t={t} kind="card"/>
      <g transform="translate(774 597) rotate(-4)"><path d="M-141-52H141V55H-141Z" fill="#F1DDA7"/><Label x={0} y={-8} center size={16} color={G.ink}>RECOGNIZED</Label><Label x={0} y={22} center size={16} color={G.ink}>ACCOUNTING PRACTICE</Label></g>
    </>}
  </EnvironmentCamera>;
};

const Purchase:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
  const {buyer,cashier}=purchaseAction(t),f=episode.financials;
  const camera=t<29?blendCamera(framed(760,830,1),framed(830,872,1.1),ease(t,27,2)):
    t<31.3?blendCamera(framed(684,895,1.85),framed(711,876,1.98),ease(t,29,2.3)):
    t<36.7?blendCamera(framed(1020,870,1.14),framed(1015,863,1.19),ease(t,31.3,5.4)):
    blendCamera(framed(1240,756,1.72),framed(1234,751,1.86),ease(t,36.7,4.3));
  const cashFrom=handPosition(buyer,'right',t),cashTo=handPosition(cashier,'left',t);
  return <EnvironmentCamera camera={camera}><CafeEnvironment t={t} camera={camera} episode={episode}/>
    <CharacterAction state={cashier} t={t} episode={episode}/><CafeEnvironment t={t} camera={camera} episode={episode} layer="front"/>
    <RegisterDisplay x={1290} y={819} cash={Math.round(f.purchase*ease(t,33.15,.6))} deferred={f.purchase} revenue={0} mode={t>=36?'ledger':'cash'}/>
    <CharacterAction state={buyer} t={t} episode={episode}/>
    {t<39.6&&<Held state={buyer} hand="left" kind="wallet" t={t}/>}
    {t>=29.9&&t<34.15&&<ObjectTransfer from={cashFrom} to={cashTo} t={t} start={32.5} duration={.45} kind="cash" amount={f.purchase} scale={1.12} lift={5}/>}
    {t>=34.65&&<ObjectTransfer from={cashTo} to={cashFrom} t={t} start={35.6} duration={.45} kind="card" amount={f.purchase} scale={1.12} lift={5}/>}
    {t>=36.7&&<g transform="translate(1265 1030)"><rect x="-204" y="-31" width="408" height="85" rx="4" fill="#F9EBD1"/><Label x={0} y={1} center size={19} color={G.green}>DEFERRED REVENUE</Label><Label x={0} y={33} center size={16}>Coffee still owed: ${f.purchase}</Label></g>}
  </EnvironmentCamera>;
};

const GiftHandoff:React.FC<{t:number;episode:GiftEpisode;closing?:boolean}>=({t,episode,closing=false})=>{
  const clock=closing?41+(t-126)*.8:t,{buyer,friend}=giftAction(clock);
  const camera=closing?blendCamera(framed(815,955,1.05),framed(974,792,.93),ease(t,129,3)):
    t<45.5?blendCamera(framed(800,965,1.03),framed(807,942,1.14),ease(t,41,4.5)):blendCamera(framed(870,860,1.5),framed(866,850,1.6),ease(t,45.5,3.5));
  const from=handPosition(buyer,'right',clock),to=handPosition(friend,'left',clock);
  return <EnvironmentCamera camera={camera}><ExteriorEnvironment t={t} camera={camera}/>
    <CharacterAction state={buyer} t={clock} episode={episode}/><CharacterAction state={friend} t={clock} episode={episode}/>
    <ObjectTransfer from={from} to={to} t={clock} start={43} duration={.35} kind="card" amount={episode.financials.purchase} scale={1.12} lift={0}/>
    {!closing&&t>45.5&&<g transform="translate(965 542)"><path d="M-126-48H126V50H-126Z" fill={G.white}/><Label x={0} y={-10} center size={14}>OUTSTANDING PROMISE</Label><Label x={0} y={28} center size={29} color={G.green}>${episode.financials.purchase}</Label><path d="M-90 51l-65 38" stroke={G.white} strokeWidth="3"/></g>}
    {closing&&<g transform={`translate(${t<129?975:1052} ${t<129?559:365})`}><rect x="-160" y="-42" width="320" height="68" rx="5" fill={G.white}/><Label x={0} y={2} center size={24} color={G.green}>{t<129?'YOUR FRIEND?':'THE COMPANY?'}</Label></g>}
  </EnvironmentCamera>;
};

const Redeem:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
  const {friend,cashier}=redemptionAction(t),f=episode.financials;
  const spent=Math.round(f.redeemed*ease(t,50.45,2.2));
  const camera=t<50.7?blendCamera(framed(961,870,1.05),framed(943,895,1.15),ease(t,49,1.7)):
    t<53.4?blendCamera(framed(930,846,2.3),framed(933,850,2.44),ease(t,50.7,2.7)):
    blendCamera(framed(931,960,1.38),framed(867,936,1.35),ease(t,53.4,2.6));
  const cupFrom=handPosition(cashier,'left',t),cupOnCounter=point(850,930),cupTo=handPosition(friend,'left',t);
  const cupAt=t<53?lerpPoint(cupFrom,cupOnCounter,ease(t,52.55,.45)):lerpPoint(cupOnCounter,cupTo,ease(t,54.15,.3));
  return <EnvironmentCamera camera={camera}><CafeEnvironment t={t} camera={camera} episode={episode}/>
    <CharacterAction state={cashier} t={t} episode={episode}/><CafeEnvironment t={t} camera={camera} episode={episode} layer="front"/>
    <RegisterDisplay x={1290} y={819} cash={f.purchase}/>
    <PaymentTerminal x={951} y={852} spent={spent} purchase={f.purchase} scale={.63}/>
    <CharacterAction state={friend} t={t} episode={episode}/>
    <Held state={friend} hand="right" kind="card" amount={f.purchase-spent} t={t}/>
    <HandObjectInteraction at={cupAt} kind="cup" scale={1.12} t={t}/>
    <g transform="translate(1134 918)"><ellipse rx="85" ry="18" fill="#E1CFAB"/><path d="M-57-15q10-66 55-37q47-31 62 37Z" fill="#CB9652"/><path d="M-34-29l11 11m29-27 7 21m22-6 9 15" stroke="#F2C980" strokeWidth="5"/><rect x="-60" y="26" width="120" height="41" fill={G.white}/><Label x={0} y={54} center size={15} color={G.green}>ORDER ${f.redeemed}</Label></g>
  </EnvironmentCamera>;
};

const Home:React.FC<{t:number;episode:GiftEpisode;later?:boolean}>=({t,episode,later=false})=>{
  const {friend,open,cardInDrawer}=homeAction(t);
  const camera=later?blendCamera(framed(970,1000,1.5),framed(813,813,.84),ease(t,105,7)):
    t<58.8?blendCamera(framed(820,775,.88),framed(876,834,1),ease(t,56,2.8)):
    t<61.4?blendCamera(framed(965,989,1.73),framed(967,1008,1.81),ease(t,58.8,2.6)):
    blendCamera(framed(906,948,1.28),framed(924,861,1.06),ease(t,61.4,1.6));
  const at=lerpPoint(handPosition(friend,'left',t),point(970,1010),cardInDrawer);
  return <EnvironmentCamera camera={camera}><HomeEnvironment t={t} camera={camera} calendarStart={56.35} night={ease(t,57,5)}/>
    {!later&&<CharacterAction state={friend} t={t} episode={episode}/>}
    <DrawerInteraction x={970} y={1020} open={later?0:open} layer="back"/>
    {(later||t>=59.6)&&<HandObjectInteraction at={later?point(970,1010):at} kind="card" amount={episode.financials.balance} scale={1.12} t={t}/>}
    <DrawerInteraction x={970} y={1020} open={later?0:open} layer="front"/>
    {!later&&<CharacterAction state={friend} t={t} episode={episode} armsOnly/>}
    {!later&&t<59.6&&<HandObjectInteraction at={at} kind="card" amount={episode.financials.balance} scale={1.12} t={t}/>}
    {(t>61||later)&&<g transform="translate(973 808)" opacity={later?1:ease(t,61,.5)}><path d="M0 60v46" stroke={G.white} strokeWidth="3" strokeDasharray="6 5"/><rect x="-151" y="-17" width="302" height="75" rx="5" fill={G.white}/><Label x={0} y={14} center size={18} color={G.green}>${episode.financials.balance} STILL ON THE CARD</Label><Label x={0} y={42} center size={12}>FORGOTTEN ≠ FORFEITED</Label></g>}
  </EnvironmentCamera>;
};

const ManyBalances:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
  const camera=blendCamera(framed(800,780,.65),framed(800,794,.67),ease(t,63,8));
  const balances=[0,1,2,6,0,2];
  return <EnvironmentCamera camera={camera}>
    <rect x="-1400" y="-1200" width="4400" height="4200" fill="#CAD8B8"/>
    <path d="M-1000 1350H2500V2500H-1000Z" fill="#D6BD98"/>
    <rect x="35" y="150" width="1530" height="1210" fill="#DCBE98"/><path d="M0 139H1600V177H0Z" fill="#EED5AC"/>
    {balances.map((balance,i)=>{
      const cx=277+i%3*525,cy=480+Math.floor(i/3)*548;
      const active=t>63+i*.28,display=t<66?6:balance;
      return <g key={i} transform={`translate(${cx} ${cy})`}>
        <rect x="-181" y="-219" width="362" height="414" fill={i%2?'#A5B795':'#9AADA0'} stroke="#F1DCB8" strokeWidth="14"/>
        <path d="M-168-203L166 121v60H80L-168-82Z" fill="#E9E3BD30"/>
        <CharacterAction state={{role:i%2?'customer':'friend',x:-4,y:194,scale:.74,left:point(-76,-242),expression:display?'thinking':'happy'}} t={t+i} episode={episode}/>
        <path d="M-172 99H175v90H-172Z" fill="#BA8D66"/><rect x="-31" y="129" width="62" height="9" rx="4" fill="#765F45"/>
        <GiftCard x={0} y={61} scale={.47*ease(t,63+i*.28,.65)} amount={`$${display}`}/>
        <rect x="-146" y="-193" width="292" height="66" rx="5" fill={G.white}/><Label x={0} y={-151} center size={21} color={G.green}>{!active?'…':display?`$${display} LEFT BEHIND`:'EVERY CENT USED'}</Label>
        <path d="M-198 210H199" stroke="#B0926C" strokeWidth="20"/>
      </g>;
    })}
    <g transform="translate(800 45)"><Label x={0} y={0} center size={32} color={G.ink}>NOW, MILLIONS OF CUSTOMERS.</Label><Label x={0} y={44} center size={16} color={G.muted}>ILLUSTRATIVE BALANCES</Label></g>
  </EnvironmentCamera>;
};

const Office:React.FC<{t:number;episode:GiftEpisode;timing?:boolean}>=({t,episode,timing=false})=>{
  const mode=timing?'timing':t<78?'patterns':'recognition';
  const camera=timing?blendCamera(framed(851,724,1.27),framed(870,709,1.34),ease(t,112,7)):
    t<73.5?blendCamera(framed(801,747,.91),framed(857,723,1.05),ease(t,71,2.5)):
    t<78?blendCamera(framed(864,690,1.29),framed(870,690,1.33),ease(t,73.5,4.5)):
    t<81.3?blendCamera(framed(696,774,1.07),framed(751,757,1.13),ease(t,78,3.3)):
    blendCamera(framed(858,690,1.27),framed(870,690,1.34),ease(t,81.3,12.7));
  const analyst:CharacterState={role:'analyst',x:495,y:1207,scale:1.44,expression:'thinking',look:4,
    right:point(117+Math.sin(t*5)*2,-151+Math.sin(t*7)*2),left:point(-49,-193),tilt:3,back:t>73.5};
  const explainer:CharacterState={role:'explainer',x:1368,y:1210,scale:1.35,left:point(-139,-267),expression:'happy',look:-4};
  return <EnvironmentCamera camera={camera}><OfficeEnvironment t={t} camera={camera}/>
    <CharacterAction state={analyst} t={t} episode={episode}/><OfficeDesk t={t}><LedgerMonitor t={t} episode={episode} mode={mode}/></OfficeDesk>
    {t>=78&&t<81.3&&<CharacterAction state={explainer} t={t} episode={episode}/>}
    <g transform={`translate(${handPosition(analyst,'right',t).x} ${handPosition(analyst,'right',t).y})`}><ellipse rx="23" ry="13" fill="#BCC8AD" stroke="#698570" strokeWidth="3"/><path d="M0-10V0" stroke="#698570" strokeWidth="2"/></g>
  </EnvironmentCamera>;
};

const Reveal:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
  const camera=blendCamera(framed(800,749,.86),framed(800,718,.98),ease(t,94,7));
  const explainer:CharacterState={role:'explainer',x:544,y:1298,scale:1.39,right:point(97,-305),expression:t<98?'surprised':'happy',tilt:-4};
  const cashier:CharacterState={role:'barista',x:1127,y:1298,scale:1.39,left:point(-108,-286),expression:'happy',look:-3};
  return <EnvironmentCamera camera={camera}><CafeEnvironment t={t} camera={camera} episode={episode} dark/>
    <FinancialReveal t={t} start={94.3} amount={episode.financials.reportedBreakageMillions} year={episode.financials.fiscalYear}/>
    <CharacterAction state={explainer} t={t} episode={episode}/><CharacterAction state={cashier} t={t} episode={episode}/>
    <HandObjectInteraction at={handPosition(explainer,'right',t)} kind="card" amount={episode.financials.balance} scale={1.25} rotate={-8} t={t}/>
    <g transform="translate(800 1170)"><path d="M-89-17H89L111 9H-109Z" fill="#D9B875"/><path d="M-109 10H111" stroke="#997C48" strokeWidth="5"/>
      {t>=101&&<g opacity={ease(t,101,.55)}><Label x={0} y={-96} center color={G.white} size={28}>0 EXTRA LATTES</Label><Label x={0} y={-56} center color={G.gold} size={16}>FOR THOSE UNUSED BALANCES</Label></g>}
    </g>
  </EnvironmentCamera>;
};

const Ending:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
  const ending=t>=132.4,camera=ending?blendCamera(framed(793,916,.94),framed(801,882,.86),ease(t,132.4,5.6)):blendCamera(framed(796,867,1.06),framed(797,841,1.16),ease(t,119,7));
  const explainer:CharacterState={role:'explainer',x:800,y:1335,scale:1.5,expression:ending?'happy':'thinking',tilt:ending?-2:5,
    right:ending?point(108,-301+Math.sin(t*5)*9):point(103,-259),left:point(-83,-191)};
  return <EnvironmentCamera camera={camera}><ExteriorEnvironment t={t} camera={camera} ending={ending}/>
    <CharacterAction state={explainer} t={t} episode={episode}/>{!ending&&<Held state={explainer} hand="right" t={t} kind="card" amount={episode.financials.purchase}/>}
    {ending?<g transform="translate(795 300)"><rect x="-266" y="-65" width="532" height="97" rx="48" fill={G.gold}/><Label x={0} y={-3} center size={32} color={G.dark}>FOLLOW FOR MORE</Label></g>:
      <g transform="translate(800 335)"><Label x={0} y={0} center size={37} color={G.ink}>WHO’S REALLY</Label><Label x={0} y={57} center size={42} color={G.ink}>RECEIVING THE GIFT?</Label></g>}
  </EnvironmentCamera>;
};

export const CinematicStory:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=>{
  if(t<11)return <Opening t={t} episode={episode}/>;
  if(t<27)return <ShopIntroduction t={t} episode={episode}/>;
  if(t<41)return <Purchase t={t} episode={episode}/>;
  if(t<49)return <GiftHandoff t={t} episode={episode}/>;
  if(t<56)return <Redeem t={t} episode={episode}/>;
  if(t<63)return <Home t={t} episode={episode}/>;
  if(t<71)return <ManyBalances t={t} episode={episode}/>;
  if(t<94)return <Office t={t} episode={episode}/>;
  if(t<105)return <Reveal t={t} episode={episode}/>;
  if(t<112)return <Home t={t} episode={episode} later/>;
  if(t<119)return <Office t={t} episode={episode} timing/>;
  if(t<126)return <Ending t={t} episode={episode}/>;
  if(t<132.4)return <GiftHandoff t={t} episode={episode} closing/>;
  return <Ending t={t} episode={episode}/>;
};
