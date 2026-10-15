import React from 'react';
import {AbsoluteFill, Audio, interpolate, useCurrentFrame, useVideoConfig, staticFile} from 'remotion';
import {GiftEpisode} from '../../giftcard/types';
import {CharacterAction, CharacterState} from '../../giftcard/cinematic/CharacterAction';

const DURATION = 51.64408163265306;
const STORY_END = 48.5;
const C = {ink:'#263A34', green:'#1E694E', dark:'#174536', cream:'#F7F1E4', gold:'#F6C65A', sage:'#92AE85', blue:'#4B9DB4', blueDark:'#17617B', red:'#C84945', light:'#FFF9EA', muted:'#66736B', wood:'#B99065'};
const clamp = (n:number) => Math.max(0, Math.min(1, n));
const ease = (t:number,a:number,d:number) => { const p=clamp((t-a)/d); return p*p*(3-2*p); };
const lift = (t:number,a:number,d:number=0.5) => 24*(1-ease(t,a,d));
const captionData = [
 [0,1.65,'This man sold FIVE HUNDRED products...'],
 [1.65,3.5,'and LOST money on every single sale!'],
 [3.5,5.25,'Meanwhile, his friend sold just ONE HUNDRED...'],
 [5.25,7,'and came out seven hundred dollars ahead!'],
 [7,9.5,'Same product. Same price. So what went wrong?'],
 [9.5,11.4,'Both sold a twenty-dollar product'],
 [11.4,13,'that cost eight dollars to make and ship.'],
 [13,15.1,'But the first man spent FIFTEEN dollars on ads...'],
 [15.1,17,'just to get ONE customer!'],
 [17,18,'Twenty dollars in.'],
 [18,19,'Eight dollars out.'],
 [19,20,'Fifteen for ads.'],
 [20,21.4,'That’s THREE DOLLARS LOST'],
 [21.4,23,'on every sale!'],
 [23,24.15,'Five hundred orders?'],
 [24.15,26,'MINUS FIFTEEN HUNDRED DOLLARS!'],
 [26,28,'His friend spent just five dollars'],
 [28,30,'attracting each customer.'],
 [30,32,'Seven dollars left per order.'],
 [32,34.5,'One hundred sales? PLUS SEVEN HUNDRED!'],
 [34.5,36,'That’s called unit economics.'],
 [36,39,'And repeat customers? Their lifetime value can change everything.'],
 [39,41.15,'The first man bought customers he couldn’t afford.'],
 [41.15,43,'The second built a business'],
 [43,45.45,'that could afford to keep them.'],
 [45.45,48.5,'The second built a business that could afford to keep them.']
] as const;

const Label:React.FC<{x:number;y:number;text:string;size?:number;fill?:string;weight?:number;anchor?:'start'|'middle'|'end';stroke?:string}> = ({x,y,text,size=42,fill=C.ink,weight=900,anchor='middle',stroke}) =>
 <text x={x} y={y} textAnchor={anchor} fontFamily="Arial, sans-serif" fontSize={size} fontWeight={weight} fill={fill} stroke={stroke} strokeWidth={stroke?5:0} paintOrder="stroke">{text}</text>;

const Box:React.FC<{x:number;y:number;s?:number;label?:string;fill?:string;rotate?:number}> = ({x,y,s=1,label='PRODUCT',fill='#D5A66F',rotate=0})=>
 <g transform={'translate('+x+' '+y+') rotate('+rotate+') scale('+s+')'}>
  <rect x="-77" y="-83" width="154" height="166" rx="11" fill={fill} stroke="#744D36" strokeWidth="7"/>
  <path d="M-67-61H67M0-77V77" stroke="#F7E1B2" strokeWidth="9" opacity=".85"/>
  <rect x="-48" y="-32" width="96" height="52" rx="7" fill={C.light}/>
  <Label x={0} y={-9} text="$20" size={33} fill={C.green}/>
  <Label x={0} y={57} text={label} size={12} fill="#604C3B" weight={800}/>
 </g>;

const Person:React.FC<{episode:GiftEpisode;role:'customer'|'friend';x:number;y:number;t:number;expression?:CharacterState['expression'];scale?:number}> =
 ({episode,role,x,y,t,expression='calm',scale=1}) => {
  const state:CharacterState={role,x,y,scale,expression,tilt:Math.sin(t*1.1)*1.1};
  return <CharacterAction state={state} t={t} episode={episode}/>;
};

const Office:React.FC<{t:number;green?:boolean;warehouse?:boolean}> = ({t,green=false,warehouse=false}) => {
 const wall=green?'#DCE8CE':'#D9EAF0', accent=green?C.green:C.blueDark;
 return <g>
  <rect width="1080" height="1500" fill={wall}/>
  <path d="M0 1190H1080V1500H0Z" fill="#B7A17D"/>
  <rect x="70" y="170" width="360" height="410" rx="14" fill="#B5D3D3" stroke="#F8F0DD" strokeWidth="22"/>
  <path d="M250 176V575M80 370H420" stroke="#F8F0DD" strokeWidth="17"/>
  <circle cx={100+(t*19)%220} cy="250" r="38" fill="#FFF0B4" opacity=".72"/>
  <rect x="580" y="180" width="415" height="300" rx="12" fill="#92734F"/>
  {[0,1,2].map(r=><g key={r}><rect x="600" y={270+r*77} width="375" height="13" fill="#6D573D"/>
   {[0,1,2,3,4].map(i=><rect key={i} x={616+i*70} y={195+r*77} width="51" height="70" rx="6" fill={['#D5A66F','#7EA18A','#E6D39D','#6C97A5','#C78670'][(i+r)%5]}/>)}</g>)}
  <path d="M115 1000H1010L1050 1090H80Z" fill={C.wood} stroke="#77583C" strokeWidth="9"/>
  <path d="M150 1090V1300M980 1090V1300" stroke="#72583F" strokeWidth="30"/>
  <rect x="692" y="772" width="228" height="166" rx="13" fill="#314740"/>
  <rect x="709" y="789" width="194" height="127" rx="7" fill={green?'#C7E1AD':'#BCE0E5'}/>
  <Label x={806} y={841} text={green?'STORE B':'STORE A'} size={20} fill={accent}/>
  <path d="M685 943H927L958 969H653Z" fill="#526159"/>
  <g opacity=".95">
   <rect x="70" y="655" width="270" height="38" rx="8" fill={accent}/>
   <Label x={205} y={683} text={warehouse?'FULFILLMENT':'ONLINE STORE'} size={18} fill={C.light}/>
  </g>
  {!warehouse&&<g>
   {[0,1,2,3].map(i=> <g key={i} transform={'translate('+ (95+i*114+Math.sin(t+i)*2)+' '+(890+(i%2)*25)+')'}><rect x="-47" y="-33" width="94" height="66" rx="5" fill="#D2A16A" stroke="#7D5637" strokeWidth="4"/><path d="M0-31V31" stroke="#F7DCA9" strokeWidth="6"/></g>)}
   <g transform="translate(816 710)"><circle r="38" fill="#FFFCED" stroke="#8B9A89" strokeWidth="7"/><path d="M0-30V-8M0 0H21" stroke={accent} strokeWidth="6" strokeLinecap="round"/></g>
  </g>}
  {warehouse&&<g>
   <path d="M45 866H1035" stroke="#656C5E" strokeWidth="20"/>
   {[0,1,2,3,4,5].map(i=><g key={i} transform={'translate('+ (135+i*165+(t*68)%165)+' 824)'}><rect x="-55" y="-47" width="110" height="92" rx="8" fill="#D5A66F" stroke="#744D36" strokeWidth="5"/><path d="M0-43V39" stroke="#F4D6A0" strokeWidth="6"/></g>)}
   {[0,1,2,3,4].map(i=><g key={i}><circle cx={250+i*145} cy="886" r="20" fill="#646A60"/><circle cx={250+i*145} cy="886" r="8" fill="#D6D0BF"/></g>)}
  </g>}
  <Label x={540} y={120} text={warehouse?'ORDER FULFILLMENT':'SMALL BUSINESS HQ'} size={27} fill={accent}/>
 </g>;
};

const Burst:React.FC<{color:string;secondary:string;t:number}> = ({color,secondary,t}) => {
 const rays=Array.from({length:24},(_,i)=>{const a=i*Math.PI/12, r=1750, r2=870; return <path key={i} d={'M540 760L'+(540+Math.cos(a)*r2)+' '+(760+Math.sin(a)*r2)+'L'+(540+Math.cos(a+.055)*r)+' '+(760+Math.sin(a+.055)*r)+'Z'} fill={i%2?color:secondary} opacity=".33"/>;});
 return <g><rect width="1080" height="1500" fill={color}/>{rays}<circle cx="540" cy="760" r="300" fill={secondary} opacity=".22" transform={'scale('+(1+0.012*Math.sin(t*1.5))+') translate(0 0)'}/></g>;
};

const Coin:React.FC<{x:number;y:number;r?:number;fill?:string}> = ({x,y,r=31,fill=C.gold})=><g><circle cx={x} cy={y} r={r} fill={fill} stroke="#956F2F" strokeWidth="5"/><text x={x} y={y+r*.36} textAnchor="middle" fontFamily="Arial" fontSize={r*1.05} fontWeight="bold" fill="#805F2D">$</text></g>;

const StoreScene:React.FC<{t:number;story:number;episode:GiftEpisode;progress:number}> = ({t,story,episode,progress}) => {
 const shared=(y:number=1200)=> <><Office t={t}/><Person episode={episode} role="customer" x={785} y={y} t={t} expression={story<3.5?'happy':'surprised'} scale={.94}/>
  {Array.from({length:Math.min(10,Math.max(1,Math.floor((story+.8)*2.1)))},(_,i)=><Box key={i} x={105+(i%5)*118} y={1115-Math.floor(i/5)*170} s={.43} label="ORDER"/>)}
 </>;
 return <g>
  {story<3.5? <>{shared()}<rect x="448" y="365" width="570" height="245" rx="28" fill="#FFF9EA" stroke={C.gold} strokeWidth="8"/><Label x={733} y={455} text="500 SALES!" size={62} fill={C.green}/><Label x={733} y={545} text="−$3 PER SALE" size={53} fill={C.red}/></>:
   story<7?<><rect width="1080" height="1500" fill={C.cream}/><path d="M540 100V1415" stroke="#CFC6AD" strokeWidth="8"/>
    <g transform="translate(0 0) scale(.5 1)"><Office t={t}/><Person episode={episode} role="customer" x={785} y={1230} t={t} expression="surprised" scale={.72}/></g>
    <g transform="translate(540 0) scale(.5 1)"><rect width="1080" height="1500" fill="#DCE8CE"/><Office t={t} green/><Person episode={episode} role="friend" x={865} y={1230} t={t} expression="happy" scale={.72}/></g>
    <rect x="46" y="180" width="455" height="170" rx="28" fill="#FFF9EA" stroke={C.red} strokeWidth="7"/><Label x={273} y={245} text="500 SALES" size={34} fill={C.blueDark}/><Label x={273} y={310} text="−$1,500" size={46} fill={C.red}/>
    <rect x="579" y="180" width="455" height="170" rx="28" fill="#FFF9EA" stroke={C.green} strokeWidth="7"/><Label x={806} y={245} text="100 SALES" size={34} fill={C.green}/><Label x={806} y={310} text="+$700" size={46} fill={C.green}/>
   </>:
   story<9.5?<><Burst color={C.blueDark} secondary="#65B6C0" t={t}/><Person episode={episode} role="customer" x={280} y={1320} t={t} expression="thinking" scale={.73}/><Person episode={episode} role="friend" x={800} y={1320} t={t} expression="calm" scale={.73}/><Box x={340} y={910} s={.58}/><Box x={740} y={910} s={.58}/><Label x={540} y={335} text="SAME PRODUCT. SAME PRICE." size={42} fill={C.light}/><text x="540" y="635" textAnchor="middle" fontSize="145" fontWeight="900" fill={C.gold}>?</text><Label x={340} y={790} text="$20" size={34} fill={C.light}/><Label x={740} y={790} text="$20" size={34} fill={C.light}/></>:
   story<13?<><Office t={t} warehouse/><Label x={540} y={420} text="ONE $20 PRODUCT" size={55} fill={C.dark}/><Box x={415+Math.sin(t*2)*85} y={810} s={.8}/><rect x="635" y="650" width="330" height="175" rx="23" fill={C.light} stroke={C.gold} strokeWidth="8"/><Label x={800} y={720} text="$8 COST" size={44} fill={C.red}/><Label x={800} y={778} text="MAKE + SHIP" size={23} fill={C.muted}/><Label x={540} y={1020} text="$20 − $8 = $12 BEFORE ADS" size={31} fill={C.dark}/></>:
   story<17?<><Office t={t}/><Person episode={episode} role="customer" x={800} y={1230} t={t} expression="surprised" scale={.95}/><Label x={540} y={560} text="AD SPEND PER ORDER" size={39} fill={C.red}/>{[1,2,3].map(i=><g key={i} opacity={ease(story,13+i*.72,.4)}><Coin x={200+i*112} y={790}/></g>)}<rect x="575" y="600" width="280" height="105" rx="18" fill="#233A38"/><Label x={715} y={665} text="ONE CUSTOMER" size={21} fill={C.light}/><Label x={540} y={935} text="$0 → $5 → $10 → $15" size={39} fill={C.red}/></>:
   story<20?<><Burst color="#277A80" secondary="#47A7AA" t={t}/><Label x={540} y={390} text="THE PER-ORDER MATH" size={42} fill={C.light}/><Label x={540} y={705} text="$20" size={108} fill={C.gold}/><Label x={540} y={850} text="− $8 PRODUCT + FULFILLMENT" size={38} fill={C.light}/><Label x={540} y={990} text="− $15 ADVERTISING" size={43} fill="#FFD4B6"/><Label x={540} y={1160} text="= ?" size={80} fill={C.gold}/></>:
   story<23?<><Burst color="#A9343E" secondary="#E3654F" t={t}/><Label x={540} y={540} text="−$3" size={190} fill={C.light}/><Label x={540} y={660} text="PER ORDER" size={48} fill={C.gold}/><Box x={540} y={1010} s={.72} rotate={-7}/><Person episode={episode} role="customer" x={195} y={1280} t={t} expression="surprised" scale={.67}/><Label x={540} y={350} text="TWENTY IN. EIGHT + FIFTEEN OUT." size={29} fill={C.light}/></>:
   story<26?<><Office t={t} warehouse/><Person episode={episode} role="customer" x={875} y={1260} t={t} expression="surprised" scale={.77}/><Label x={540} y={415} text="500 ORDERS × −$3" size={54} fill={C.red}/><Label x={540} y={585} text="= −$1,500" size={92} fill={C.red}/>{Array.from({length:12},(_,i)=><g key={i}><Box x={115+i%6*155} y={785+Math.floor(i/6)*180} s={.38} label="−$3"/><circle cx={115+i%6*155} cy={785+Math.floor(i/6)*180} r="15" fill={C.red}/></g>)}</>:
   story<30?<><Office t={t} green/><Person episode={episode} role="friend" x={810} y={1240} t={t} expression="happy" scale={.94}/><Label x={540} y={535} text="STORE B" size={48} fill={C.green}/><Coin x={330} y={770}/><Coin x={440} y={770}/><Label x={540} y={890} text="AD COST: $5 / ORDER" size={42} fill={C.green}/></>:
   story<34.5?<><Burst color="#477D4B" secondary="#E4BE59" t={t}/><Label x={540} y={335} text="$20 − $8 − $5 = +$7" size={55} fill={C.light}/><Label x={540} y={510} text="PER ORDER" size={28} fill={C.gold}/>{Array.from({length:Math.min(10,Math.floor((story-30)*3)+1)},(_,i)=><g key={i}><Box x={145+(i%5)*198} y={780+Math.floor(i/5)*190} s={.4} label="ORDER"/><Coin x={145+(i%5)*198} y={692+Math.floor(i/5)*190} r={23}/></g>)}<Label x={540} y={1200} text="100 × $7 = +$700" size={69} fill={C.light}/></>:
   story<39?<><Burst color="#226B67" secondary="#86B586" t={t}/><Person episode={episode} role="friend" x={540} y={1300} t={t} expression="happy" scale={.86}/><Label x={540} y={390} text="UNIT ECONOMICS" size={59} fill={C.light}/><g opacity={ease(story,35.3,.6)}><circle cx="280" cy="730" r="84" fill={C.gold}/><circle cx="800" cy="730" r="84" fill={C.light}/><path d="M371 730H702" stroke={C.gold} strokeWidth="15" strokeDasharray="24 22"/><path d="M686 696L730 730L686 764" fill="none" stroke={C.gold} strokeWidth="15"/><Label x={280} y={745} text="ORDER" size={24}/><Label x={800} y={745} text="RETURN" size={24}/><Label x={540} y={925} text="CUSTOMER LIFETIME VALUE" size={32} fill={C.gold}/><Label x={540} y={980} text="REPEATS CAN HELP; THEY AREN’T GUARANTEED" size={18} fill={C.light}/></g></>:
   story<43?<><Office t={t}/><Person episode={episode} role="customer" x={805} y={1250} t={t} expression="surprised" scale={.95}/><Label x={540} y={420} text="MORE SALES ≠ MORE PROFIT" size={42} fill={C.red}/><Label x={540} y={535} text="BEFORE FIXED COSTS" size={22} fill={C.muted}/><Label x={540} y={690} text="AD BILLS KEEP GROWING" size={31} fill={C.red}/>{[0,1,2,3].map(i=><g key={i} opacity={.78}><rect x={135+i*207} y={800+(i%2)*68} width="150" height="106" rx="13" fill="#F1D8CB" stroke={C.red} strokeWidth="5"/><Label x={210+i*207} y={866+(i%2)*68} text="−$15" size={30} fill={C.red}/></g>)}</>:
    <><rect width="1080" height="1500" fill="#DCEAF0"/><rect x="540" width="540" height="1500" fill="#DCE8CE"/><path d="M540 90V1400" stroke="#FFF9EA" strokeWidth="12"/>
      <Label x={270} y={154} text="STORE A" size={35} fill={C.blueDark}/><Label x={810} y={154} text="STORE B" size={35} fill={C.green}/>
      <rect x="65" y="190" width="410" height="238" rx="24" fill={C.light} stroke={C.red} strokeWidth="7"/><rect x="605" y="190" width="410" height="238" rx="24" fill={C.light} stroke={C.green} strokeWidth="7"/>
      <Label x={270} y={267} text="500 SALES" size={37} fill={C.blueDark}/><Label x={270} y={350} text="−$1,500" size={61} fill={C.red}/><Label x={270} y={396} text="CONTRIBUTION" size={17} fill={C.muted}/>
      <Label x={810} y={267} text="100 SALES" size={37} fill={C.green}/><Label x={810} y={350} text="+$700" size={61} fill={C.green}/><Label x={810} y={396} text="CONTRIBUTION" size={17} fill={C.muted}/>
      <rect x="120" y="493" width="840" height="180" rx="28" fill={C.light} stroke={C.gold} strokeWidth="9"/><Label x={540} y={565} text="PROFIT PER ORDER MATTERS" size={41} fill={C.dark}/><Label x={540} y={618} text="Contribution after product, fulfillment and ads" size={20} fill={C.muted}/>
      <Label x={540} y={720} text="HYPOTHETICAL • BEFORE FIXED COSTS" size={18} fill={C.muted}/>
      {[0,1,2,3,4,5].map(i=><g key={i}><rect x={86+i*155} y={870+(i%2)*118} width="118" height="98" rx="9" fill="#D5A66F" stroke="#744D36" strokeWidth="5"/><path d={'M'+(145+i*155)+' '+875+'V'+960} stroke="#F7E1B2" strokeWidth="7"/></g>)}
      <Person episode={episode} role="customer" x={305} y={1370} t={t} expression="surprised" scale={.69}/><Person episode={episode} role="friend" x={850} y={1370} t={t} expression="happy" scale={.69}/>
    </>}
 </g>;
};

export const UnitEconomicsEpisode:React.FC<{episode:GiftEpisode}> = ({episode}) => {
 const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const seconds=frame/fps;
 const story=seconds/episode.durationSeconds*STORY_END;
 const caption=captionData.find(c=>story>=c[0]&&story<c[1]);
 const progress=clamp(seconds/episode.durationSeconds);
 const part=story<3.5?0:story<7?1:story<9.5?2:story<13?3:story<17?4:story<20?5:story<23?6:story<26?7:story<30?8:story<34.5?9:story<39?10:story<43?11:12;
 const names=['THE HOOK','TWO STORES','SAME PRODUCT','PRODUCT COST','AD COST','THE MATH','LOSS PER ORDER','TOTAL LOSS','LOWER AD COST','POSITIVE UNIT ECONOMICS','REPEAT CUSTOMERS','THE WRONG GROWTH','FINAL COMPARISON'];
 const opacity=interpolate(frame%6,[0,3,6],[.82,1,.82]);
 return <AbsoluteFill style={{background:C.cream,overflow:'hidden',fontFamily:'Arial, sans-serif'}}>
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
   <rect width="1080" height="1920" fill={C.cream}/>
   <g transform="translate(0 0)"><StoreScene t={story} story={story} episode={episode} progress={progress}/></g>
  </svg>
  <div style={{position:'absolute',left:58,right:58,top:34,display:'flex',justifyContent:'space-between',alignItems:'center',color:(story>=7&&story<9.5)||(story>=17&&story<26)||(story>=30&&story<39)?C.light:C.dark}}>
   <strong style={{fontSize:27,letterSpacing:2}}>ODDLY LOGICAL</strong><span style={{fontSize:16,letterSpacing:2,color:(story>=7&&story<9.5)||(story>=17&&story<26)||(story>=30&&story<39)?C.light:C.green}}>BUSINESS IN PLAIN SIGHT</span>
  </div>
  <div style={{position:'absolute',left:0,right:0,top:0,height:7,background:'#D5D1C3'}}><div style={{height:'100%',width:(progress*100)+'%',background:C.gold}}/></div>
  <div style={{position:'absolute',left:52,right:52,bottom:176,minHeight:142,display:'flex',justifyContent:'center',alignItems:'center',padding:'4px 24px',borderRadius:24,background:'rgba(25,35,31,.92)',boxShadow:'0 8px 22px #0004',color:'white',fontSize:39,fontWeight:800,lineHeight:1.2,textAlign:'center',opacity:caption?opacity:0,transform:'translateY('+ (caption?0:10)+'px)'}}>
   {caption?.[2]}
  </div>
  <div style={{position:'absolute',left:68,right:68,bottom:80,display:'flex',justifyContent:'space-between',fontSize:16,fontWeight:800,letterSpacing:2,color:C.muted}}><span>{names[part]}</span><span>{Math.floor(seconds)+'s / '+Math.ceil(episode.durationSeconds)+'s'}</span></div>
  <Audio src={staticFile(episode.narration.src!)} volume={1}/>
 </AbsoluteFill>;
};

