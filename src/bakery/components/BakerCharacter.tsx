import React from 'react';
import {B,ease,mix} from '../engine/motion';
import {BakerAction,CharacterId,BakeryEpisode} from '../types';
import {BreadTray,MoneyBill} from './Props';

type Pose={ls:number;le:number;rs:number;re:number;tilt:number;smile:number;brow:number;mouth:number};
const poses:Record<BakerAction,Pose>={
 idle:{ls:8,le:-8,rs:-8,re:8,tilt:0,smile:5,brow:0,mouth:0},
 wave:{ls:8,le:-8,rs:-112,re:-38,tilt:-3,smile:9,brow:0,mouth:0},
 talk:{ls:16,le:-15,rs:-30,re:-28,tilt:2,smile:5,brow:0,mouth:6},
 point:{ls:8,le:-8,rs:-94,re:5,tilt:4,smile:6,brow:0,mouth:0},
 bread:{ls:20,le:-100,rs:-20,re:100,tilt:0,smile:8,brow:0,mouth:0},
 money:{ls:8,le:-8,rs:-35,re:-80,tilt:2,smile:8,brow:0,mouth:0},
 receive:{ls:10,le:-8,rs:-38,re:-60,tilt:3,smile:9,brow:0,mouth:0},
 scratch:{ls:9,le:-8,rs:-155,re:-50,tilt:-7,smile:-3,brow:6,mouth:0},
 surprised:{ls:27,le:-10,rs:-27,re:10,tilt:-4,smile:0,brow:9,mouth:10},
 confused:{ls:25,le:-85,rs:-25,re:85,tilt:-8,smile:-4,brow:8,mouth:0},
 happy:{ls:8,le:-12,rs:-25,re:-20,tilt:3,smile:12,brow:0,mouth:0},
 worried:{ls:12,le:-20,rs:-8,re:12,tilt:-5,smile:-8,brow:8,mouth:0},
 walk:{ls:18,le:-5,rs:-18,re:5,tilt:0,smile:5,brow:0,mouth:0},
};

/** One rig for both bakers. All poses blend over 0.7 s; no CSS or random state. */
export const BakerCharacter:React.FC<{id:CharacterId;characters:BakeryEpisode['characters'];t:number;x?:number;y?:number;scale?:number;actions?:{at:number;action:BakerAction}[];costume?:'baker'|'casual'|'barista'|'analyst';handProp?:React.ReactNode}>=({id,characters,t,x=0,y=0,scale=1,actions=[],costume='baker',handProp})=>{
 const c=characters[id],offset=id==='noah'?1.7:0;
 const apron=costume==='baker'||costume==='barista';
 const shirt=apron?B.cream:c.color;
 let p={...poses.idle};let action:BakerAction='idle',strength=0,breadWeight=0,moneyWeight=0;
 for(const cue of actions){const a=ease(t,cue.at,.7);if(a>0){for(const key of Object.keys(p) as (keyof Pose)[])p[key]=mix(p[key],poses[cue.action][key],a);breadWeight=mix(breadWeight,cue.action==='bread'?1:0,a);moneyWeight=mix(moneyWeight,cue.action==='money'||cue.action==='receive'?1:0,a);action=cue.action;strength=a;}}
 const breath=Math.sin(t*2.1+offset)*1.8;
 const wave=action==='wave'?Math.sin((t+offset)*5.2)*13*strength:0;
 const scratch=action==='scratch'?Math.sin(t*6)*4*strength:0;
 const walking=action==='walk'?strength:0;
 let blink=1;for(const at of [2.1,6.8,10.6,15.5,21.1,27.2,31.5,36.7,42.1,47.6,53.4,58.7,64.8,69.3,75.8,82.7,87.4]){const d=Math.abs(t-(at+offset));if(d<.13)blink=Math.min(blink,.08+.92*(d/.13)**2);}
 const arm=(side:'left'|'right',shoulder:number,elbow:number)=>{const sx=side==='left'?71:169;return <g transform={`translate(${sx} 202) rotate(${shoulder})`}>
  <path d="M-16 0Q-20-13 0-16Q20-13 16 2L13 47Q0 57-13 47Z" fill={shirt} stroke="#382F2A33" strokeWidth="2.5"/>
  <path d="M-11 40L-10 77Q0 90 10 77L11 40" fill={c.skin} stroke="#BC8B64" strokeWidth="2"/>
  <g transform={`translate(0 78) rotate(${elbow})`}><path d="M-10-4Q0-12 10-4L9 56Q16 60 14 70Q12 80 1 79Q-12 77-11 64Z" fill={c.skin} stroke="#BC8B64" strokeWidth="2"/><path d="M8 60Q17 47 20 56L15 69" fill={c.skin} stroke="#BC8B64" strokeWidth="2"/></g>
 </g>};
 const hand=(s:number,e:number)=>{const a=s*Math.PI/180,b=(s+e)*Math.PI/180;return {x:169-Math.sin(a)*78-Math.sin(b)*70,y:202+Math.cos(a)*78+Math.cos(b)*70}};
 const cashHand=hand(p.rs,p.re);
 return <g transform={`translate(${x} ${y}) scale(${scale})`}>
  <ellipse cx="120" cy="402" rx="83" ry="13" fill="#826D5122"/>
  <g transform={`translate(0 ${breath+walking*Math.abs(Math.sin(t*7))*3})`}>
   {[0,1].map(i=><g key={i} transform={`rotate(${walking*Math.sin(t*7+i*Math.PI)*12} ${i?146:93} 307)`}><path d={`M${i?127:75} 298h36l-2 80h-30Z`} fill={i?'#746044':'#806949'}/><path d={`M${i?126:75} 372h32q4 9 ${i?20:-17} 14q9 17-6 18h-49q-9-12 3-32Z`} fill="#4D4035"/><path d={`M${i?127:57} 400h54`} stroke="#AA9273" strokeWidth="4" strokeLinecap="round"/></g>)}
   {arm('left',p.ls+walking*Math.sin(t*7)*12,p.le)}
   <path d="M72 184Q120 166 168 184Q185 221 181 296L174 326Q120 342 66 326L60 292Q57 226 72 184Z" fill={shirt} stroke="#382F2A33" strokeWidth="2.5"/>
   {apron?<>
   <path d="M91 182L94 225H146L149 182" fill="none" stroke={c.color} strokeWidth="13"/><path d="M91 211Q119 220 149 211L173 324Q120 342 67 324Z" fill={c.color} stroke="#382F2A22" strokeWidth="2.5"/>
   <path d="M99 272Q120 280 141 272V300Q120 316 99 300Z" fill="#FFFFFF20" stroke="#382F2A20" strokeWidth="2"/><path d="M78 237Q121 249 163 237" fill="none" stroke="#FFF9EE55" strokeWidth="3"/>
   </>:<><path d="M97 178Q120 198 142 178L134 326H109Z" fill={B.cream}/><path d="M98 179L85 211L107 223M142 179L153 211L134 223" fill="none" stroke="#FFFFFF45" strokeWidth="3"/><rect x="144" y="244" width="22" height="22" rx="3" fill="#FFFFFF22"/>{costume==='analyst'&&<path d="M116 192h10l4 75-10 14-10-14Z" fill="#384E4A"/>}</>}
   {arm('right',p.rs,p.re+wave+scratch)}
   <g transform={`rotate(${p.tilt+Math.sin(t*1.4+offset)*.7} 120 177)`}>
    <rect x="104" y="159" width="32" height="32" rx="13" fill={c.skin}/><ellipse cx="64" cy="109" rx="10" ry="17" fill={c.skin}/><ellipse cx="176" cy="109" rx="10" ry="17" fill={c.skin}/>
    <path d="M63 81Q60 37 119 33Q180 36 177 86L174 125Q169 163 124 175Q78 169 66 132Z" fill={c.skin} stroke="#BC8B64" strokeWidth="2.5"/>
    <path d={id==='oliver'?'M65 91Q53 55 79 40Q124 13 166 42Q187 56 176 90L165 73Q125 87 103 65Q89 85 75 73L73 96Z':'M64 95Q51 51 82 37Q147 10 173 49L177 98L162 86L160 67Q126 87 97 67Q83 90 74 87Z'} fill={c.hair}/>
    {costume==='baker'&&<><path d="M62 61Q49 43 64 27Q60 4 88 5Q106-9 124 3Q152-6 165 13Q190 13 183 39Q194 55 172 65Z" fill={c.color} stroke="#382F2A22" strokeWidth="2"/><path d="M67 54Q118 42 173 54L173 71Q118 58 67 72Z" fill={c.color}/><path d="M73 59Q118 49 165 59" fill="none" stroke="#FFFFFF38" strokeWidth="4"/></>}
    {costume==='barista'&&<><path d="M63 64Q67 18 119 19Q170 18 181 64Z" fill={c.color}/><path d="M62 65Q109 44 180 59L194 68Q151 79 116 68Z" fill="#205640"/><circle cx="121" cy="43" r="12" fill={B.cream}/><path d="M116 41h10v9h-10Z" fill={c.color}/></>}
    <g stroke={B.dark} strokeWidth="4" strokeLinecap="round" fill="none"><path d={`M87 ${92+p.brow/2}Q97 ${87-p.brow} 108 ${91-p.brow}`}/><path d={`M137 ${91-p.brow}Q148 ${87-p.brow} 158 ${92+p.brow/2}`}/></g>
    <g transform={`translate(0 109) scale(1 ${blink})`} fill={B.dark}><ellipse cx="99" cy="0" rx={id==='noah'?4.5:4} ry="6"/><ellipse cx="148" cy="0" rx="4" ry="6"/></g>
    {costume==='analyst'&&<g fill="none" stroke="#493F34" strokeWidth="3"><circle cx="99" cy="109" r="17"/><circle cx="148" cy="109" r="17"/><path d="M116 109h15M82 105l-11-5M165 105l10-5"/></g>}
    <path d="M122 109l-4 15q5 6 12 0" stroke="#BD875F" strokeWidth="2.5" fill="none" strokeLinecap="round"/><ellipse cx="83" cy="130" rx="10" ry="5" fill="#D7867344"/><ellipse cx="159" cy="130" rx="10" ry="5" fill="#D7867344"/>
    <path d={`M105 144Q124 ${144+p.smile*1.8} 141 142`} fill={p.smile>7?'#FFF9EE':'none'} stroke={B.dark} strokeWidth="3" strokeLinecap="round"/>
    <ellipse cx="124" cy="146" rx={p.mouth*.6} ry={p.mouth*(action==='talk'?.55+.4*Math.sin(t*13)**2:1)} fill={B.dark}/>
    {id==='noah'&&<g fill="#AC765955"><circle cx="82" cy="121" r="1.5"/><circle cx="90" cy="124" r="1.5"/><circle cx="158" cy="123" r="1.5"/></g>}
   </g>
   {breadWeight>0&&<g opacity={breadWeight}><BreadTray x={120} y={304} scale={.65}/></g>}
   {moneyWeight>0&&<g opacity={moneyWeight}>{handProp?<g transform={`translate(${cashHand.x} ${cashHand.y-4}) rotate(-12)`}>{handProp}</g>:<MoneyBill x={cashHand.x} y={cashHand.y-4} scale={.65} rotate={-12}/>}</g>}
  </g>
 </g>;
};

export const CustomerCharacter:React.FC<{x:number;y:number;t:number;scale?:number;variant?:number}>=({x,y,t,scale=.7,variant=0})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <ellipse cx="74" cy="314" rx="61" ry="9" fill="#826D5122"/><g transform={`translate(0 ${Math.sin(t*2+variant)*1.5})`}>
 <path d="M52 241l-5 61m48-61 10 61" stroke="#6B686B" strokeWidth="24"/><path d="M48 305H27m77 0h23" stroke="#54494B" strokeWidth="13" strokeLinecap="round"/>
 <path d="M34 148Q75 133 113 151L124 248Q76 262 25 247Z" fill={variant?'#C6A86E':'#8FADB4'}/><path d="M35 163Q18 202 19 229m93-65q28 18 31 48" stroke={variant?'#C6A86E':'#8FADB4'} strokeWidth="22" strokeLinecap="round"/>
 <path d="M141 205l28-10" stroke="#E5B893" strokeWidth="15" strokeLinecap="round"/><rect x="63" y="119" width="24" height="37" rx="9" fill="#E5B893"/><ellipse cx="75" cy="83" rx="47" ry="58" fill="#E5B893"/>
 <path d="M29 87Q11 21 73 18Q134 20 121 86Q104 54 75 60Q53 77 29 65Z" fill={variant?'#685048':'#6D4F3F'}/><circle cx="61" cy="91" r="3.5" fill={B.dark}/><circle cx="96" cy="91" r="3.5" fill={B.dark}/><path d="M67 113q12 10 24-1" fill="none" stroke={B.dark} strokeWidth="3" strokeLinecap="round"/>
 </g>
</g>;
