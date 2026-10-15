import React from 'react';
import {GiftEpisode} from '../types';
import {G,SANS,ease} from '../theme';
import {CoffeeCup,GiftCard} from '../components/Assets';
import {Label} from '../components/Boards';
import {CharacterAction} from './CharacterAction';
import {Camera} from './motion';
import {Parallax} from './EnvironmentCamera';
import {CalendarProgression} from './Interactions';

const Plant:React.FC<{x:number;y:number;scale?:number;t:number}>=({x,y,scale=1,t})=><g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-49-60H49L37 22H-35Z" fill="#CA8F71"/><path d="M-31-46H32" stroke="#E4AA83" strokeWidth="4"/><g transform={`rotate(${Math.sin(t*.8)*1.3} 0 -40)`} stroke="#3E6F55" strokeWidth="6" fill="#739C6A"><path d="M0-57V-233"/><path d="M0-186Q-80-257-60-173Q-24-161 0-155M0-157Q82-230 67-146Q31-126 0-129M0-98Q-89-173-68-96Q-31-75 0-74M0-224Q50-295 40-215Q21-186 0-182"/></g></g>;

const City:React.FC<{t:number}>=({t})=><g><rect x="-600" y="-400" width="2900" height="1800" fill="#AEDCCB"/>{[0,1,2,3,4,5,6].map(i=><g key={i} fill={i%2?'#92C8B5':'#9CD1BE'}><path d={`M${-200+i*320} ${240-i%3*85}h285v870h-285Z`}/><path d={`M${-215+i*320} ${220-i%3*85}h315l-15 35h-285Z`}/>{Array.from({length:12},(_,j)=><rect key={j} x={-170+i*320+j%3*82} y={310-i%3*85+Math.floor(j/3)*157} width="53" height="95" fill="#C3E3CF66"/>)}</g>)}<path d={`M${120+(t*8)%1300} 145q30-50 67-13q50-15 62 27h-151Z`} fill="#ECF2D4"/></g>;

export const CafeEnvironment:React.FC<{t:number;camera:Camera;episode:GiftEpisode;door?:number;layer?:'back'|'front';dark?:boolean}>=({t,camera,episode,door=0,layer='back',dark=false})=>layer==='back'?<g>
  <rect x="-2000" y="-1800" width="5600" height="5000" fill="#F0DEBC"/>
  <Parallax camera={camera}><City t={t}/></Parallax>
  <path d="M-1000-300H2600V300H-1000ZM-1000 285H45V1130H-1000ZM565 285H730V1130H565ZM1500 285H2600V1130H1500Z" fill="#ECD9B8"/>
  <rect x="740" y="250" width="870" height="880" fill="#B3BE94"/>
  <path d="M-600 1120H2300V2400H-600Z" fill="#D7BA91"/>
  {[0,1,2,3,4].map(i=><path key={i} d={`M-600 ${1140+i*170}H2300`} stroke="#BE9B73" strokeWidth="3"/>)}
  {[-2,-1,0,1,2,3,4,5].map(i=><path key={i} d={`M${i*350} 1120L${800+(i*350-800)*2.8} 2400`} stroke="#C8A47B" strokeWidth="3"/>)}
  <path d="M35 285H570V1120H35Z" fill="none" stroke="#6F8A71" strokeWidth="24"/>
  <path d="M45 309L547 757V945L45 496Z" fill="#F6EAC838"/>
  <path d="M305 297V1110M45 787H559" stroke="#7E9D7D" strokeWidth="12"/>
  <g transform={`translate(49 295) scale(${1-door*.72} 1)`}><rect x="0" y="0" width="253" height="815" fill="#D6E0BD33" stroke="#587D64" strokeWidth="10"/><rect x="193" y="422" width="12" height="62" rx="5" fill="#EAC577"/><rect x="56" y="240" width="135" height="57" rx="4" fill={G.white}/><Label x={125} y={278} center size={22} color={G.green}>OPEN</Label></g>
  <rect x="22" y="175" width="568" height="111" rx="5" fill="#3F7158"/><Label x={305} y={247} center color={G.white} size={46}>STARBUCKS</Label>
  <path d="M20 288H590L614 366H0Z" fill="#F6E7BC"/>{Array.from({length:8},(_,i)=><path key={i} d={`M${20+i*72} 288h35l9 78h-38Z`} fill="#73996F"/>)}
  <path d="M-600 100H2300M-600 145H2300" stroke="#E1C49D" strokeWidth="11"/>
  <g transform="translate(938 325)"><rect width="508" height="253" rx="3" fill="#9B7954"/><rect x="12" y="12" width="484" height="229" fill="#345144"/><Label x={254} y={58} center size={27} color="#F1E5C5">THE DAILY BREW</Label><path d="M39 79H469" stroke="#B6BE95" strokeWidth="2"/>{['COFFEE & GOOD COMPANY','ESPRESSO  /  BAKERY','A LITTLE MOMENT, GIVEN'].map((s,i)=><Label key={s} x={254} y={119+i*43} center color="#D7DCBC" size={i===2?15:20}>{s}</Label>)}</g>
  {[455,1090].map((x,i)=><g key={x}><path d={`M${x} -100V130`} stroke="#686A50" strokeWidth="6"/><path d={`M${x-95} 215Q${x-88} 111 ${x} 113Q${x+89} 115 ${x+95} 215Z`} fill={i?'#C48960':'#70926B'}/><ellipse cx={x} cy="215" rx="95" ry="15" fill="#FBE2A2"/><path d={`M${x-77} 230L${x-259} 1030H${x+259}L${x+77} 230Z`} fill="#FFEBB50C"/></g>)}
  <g transform="translate(1230 776)"><rect x="-130" y="-92" width="283" height="152" rx="11" fill="#C9CEB7" stroke="#738B77" strokeWidth="5"/><rect x="-113" y="-75" width="117" height="68" rx="5" fill="#587669"/><circle cx="81" cy="-50" r="25" fill="#ECE9CE" stroke="#829985" strokeWidth="4"/><path d="M81-51l11-14" stroke="#4D6F5B" strokeWidth="4"/><path d="M-80 9v39m60-39v39m123-43v36" stroke="#60786B" strokeWidth="9"/><path d="M-148 70H170" stroke="#6C8172" strokeWidth="12"/>
    {[0,1,2].map(i=><CoffeeCup key={i} x={-75+i*86} y={-120} scale={.31} steam={t+i+1}/>)}</g>
  <path d="M788 854H1650" stroke="#8C7755" strokeWidth="20"/>
  <g opacity=".76"><CharacterAction state={{role:'friend',x:395+Math.sin(t*.24)*8,y:1050,scale:.7,right:{x:46,y:-236},expression:'happy'}} t={t+.7} episode={episode}/><CharacterAction state={{role:'customer',x:105,y:1040,scale:.67,left:{x:-85,y:-235},expression:'calm'}} t={t+2} episode={episode}/></g>
  <g transform="translate(274 998)"><path d="M-99 12h199M-79 17l-20 134M82 17l20 134" stroke="#8D7555" strokeWidth="14"/><ellipse cy="0" rx="152" ry="32" fill="#D2A472"/><CoffeeCup x={-34} y={-30} scale={.4} steam={t+1}/></g>
  <path d="M87 1025v114m-28-186v92h52m312-72v70h-51m15-16v115" fill="none" stroke="#BD9161" strokeWidth="13"/>
  <Plant x={667} y={1134} t={t} scale={1.05}/>
  {dark&&<rect x="-600" y="-500" width="2800" height="2500" fill="#173C32" opacity=".65"/>}
</g>:<g>
  <path d="M844 948H1700V1173H844Z" fill="#AC7C53"/><path d="M850 987H1700V1173H850Z" fill="#C2996B"/>
  {[0,1,2,3,4].map(i=><path key={i} d={`M${867+i*170} 1004h139v148H${867+i*170}Z`} fill="none" stroke="#A67D56" strokeWidth="4"/>)}
  <rect x="822" y="925" width="916" height="34" rx="6" fill="#F5DBAF"/><path d="M840 955H1700" stroke="#865F42" strokeWidth="6"/>
  <g transform="translate(1514 886)"><path d="M-73 33h146l-14-116h-118Z" fill="#567B5E"/><GiftCard y={-47} scale={.31}/><Label x={0} y={14} center size={13} color={G.white}>GIVE A MOMENT</Label></g>
  <Plant x={-75} y={1430} t={t} scale={1.8}/>
</g>;

export const HomeEnvironment:React.FC<{t:number;camera:Camera;calendarStart?:number;night?:number}>=({t,camera,calendarStart=10000,night=0})=><g>
  <rect x="-1600" y="-1600" width="4600" height="4600" fill="#E6CCAD"/>
  <path d="M-1600 1070H3000V3000H-1600Z" fill="#C59776"/>
  {[0,1,2,3,4].map(i=><path key={i} d={`M-900 ${1100+i*170}H2400`} stroke="#B58C70" strokeWidth="3"/>)}
  <rect x="70" y="170" width="473" height="618" fill="#B6D8CA" stroke="#F6E4C5" strokeWidth="23"/>
  <Parallax camera={camera} depth={.04}><path d="M86 619h120v-89h110v73h210v161H86Z" fill="#8DBAAE"/><circle cx="419" cy="299" r="60" fill="#FFF0B8"/><path d="M111 245h240L531 530V710Z" fill="#EAF2CF44"/></Parallax>
  <path d="M306 180V784M81 470H535" stroke="#F6E4C5" strokeWidth="13"/><path d="M50 164V824l105-49V173M565 164V824l-93-49V173" fill="#C98269"/><path d="M70 167V774M541 167v608" stroke="#AA6E5D" strokeWidth="7"/>
  <path d="M-200 1051H1800" stroke="#E5C6A0" strokeWidth="23"/>
  <CalendarProgression x={1170} y={468} t={t} start={calendarStart}/>
  <g transform="translate(703 331)"><path d="M0 0h196v226H0Z" fill="#BD8A65"/><path d="M13 13h170v200H13Z" fill="#F3E4C6"/><path d="M27 168L88 58L145 171Z" fill="#A7B992"/><circle cx="137" cy="64" r="22" fill="#D99E6E"/><path d="M37 179h115" stroke="#D1B68D" strokeWidth="4"/></g>
  <g transform="translate(280 1114)"><rect x="-221" y="-172" width="443" height="215" rx="38" fill="#9AAC89"/><rect x="-191" y="-95" width="382" height="142" rx="21" fill="#A5B18C"/><rect x="-240" y="-90" width="74" height="160" rx="22" fill="#809B7D"/><rect x="167" y="-90" width="74" height="160" rx="22" fill="#809B7D"/><path d="M-208 65v45m412-45v45" stroke="#6D7157" strokeWidth="18"/><path d="M-141-88q52-27 108 0l-9 86h-94Z" fill="#EDCD92"/></g>
  <g transform="translate(785 815)"><path d="M-60-180h120l30 92h-180Z" fill="#D4A65F"/><path d="M0-85V0" stroke="#6F7254" strokeWidth="9"/><ellipse rx="62" ry="10" fill="#7C7956"/></g>
  <Plant x={1440} y={1150} t={t} scale={1.2}/><ellipse cx="696" cy="1300" rx="535" ry="142" fill="#E1BB8B"/><ellipse cx="696" cy="1300" rx="469" ry="106" fill="none" stroke="#CA9C74" strokeWidth="4"/>
  <rect x="-1600" y="-1600" width="4600" height="4600" fill="#364D69" opacity={night*.26}/>
</g>;

export const OfficeEnvironment:React.FC<{t:number;camera:Camera}>=({t,camera})=><g>
  <rect x="-1400" y="-1600" width="4400" height="4600" fill="#B6C4A9"/>
  <path d="M-1400 1100H3000V3000H-1400Z" fill="#B8A98B"/>
  <g transform="translate(116 168)"><rect width="431" height="591" fill="#E9E2BF" stroke="#688A73" strokeWidth="18"/><Parallax camera={camera}><path d="M11 361h100v-133h120v67h104v-58h86v343H11Z" fill="#C5CFAD"/><path d="M20 80L410 460V551L20 171Z" fill="#FFF0CB55"/></Parallax><path d="M212 0V591M0 287H431" stroke="#688A73" strokeWidth="13"/></g>
  <g transform="translate(1111 202)"><rect width="374" height="448" fill="#8D9271"/>{[0,1,2].map(row=><g key={row}><rect x="-16" y={124+row*136} width="406" height="15" rx="3" fill="#63785C"/>{[0,1,2,3,4].map(i=><g key={i}><rect x={15+i*63} y={20+row*136} width="48" height="103" rx="3" fill={['#D5AE75','#778E7B','#E5CF9E','#BD876A','#9EB396'][i]}/><path d={`M${26+i*63} ${41+row*136}h25`} stroke="#EBDAB3" strokeWidth="4"/></g>)}</g>)}</g>
  <g transform="translate(756 164)"><circle r="91" fill="#E9DEBC" stroke="#698369" strokeWidth="12"/><path d={`M0 0L${Math.sin(t*.04)*57} ${-Math.cos(t*.04)*57}`} stroke="#52674D" strokeWidth="6"/><path d="M0 0L-35-25" stroke="#52674D" strokeWidth="8"/><circle r="7" fill="#52674D"/></g>
  <rect x="-800" y="1070" width="3200" height="23" fill="#87977C"/>
  <Plant x={1590} y={1133} t={t} scale={1.5}/>
</g>;

export const OfficeDesk:React.FC<{t:number;children:React.ReactNode}>=({t,children})=><g>
  <path d="M435 1019h967v47H435ZM476 1060v271M1354 1060v271" stroke="#756C50" strokeWidth="29" fill="#AC926A"/>
  <rect x="399" y="990" width="1040" height="49" rx="7" fill="#D1B083"/>
  <g transform="translate(1274 938)"><path d="M0 20L-17-213L-109-254" fill="none" stroke="#5C7560" strokeWidth="13"/><path d="M-162-211l19-85 91 45-65 58Z" fill="#D5AA5E"/><ellipse cx="1" cy="20" rx="67" ry="15" fill="#4F6B56"/><path d="M-152-209L-407 0H-111L-84-203Z" fill="#FBE1A318"/></g>
  <g transform="translate(1164 1000) rotate(-9)"><rect x="-57" y="-47" width="114" height="71" rx="7" fill="#688171"/><rect x="-40" y="-35" width="80" height="19" fill="#C2D4AD"/>{Array.from({length:12},(_,i)=><rect key={i} x={-41+i%4*23} y={-5+Math.floor(i/4)*10} width="15" height="6" rx="1" fill="#DCD5B5"/>)}</g>
  <path d="M463 934l147-22 14 79-147 11Z" fill="#F3E6C6"/><path d="M482 950l109-17m-104 34 112-20" stroke="#B5BA99" strokeWidth="4"/>
  {children}
</g>;

export const ExteriorEnvironment:React.FC<{t:number;camera:Camera;ending?:boolean}>=({t,camera,ending=false})=><g>
  <rect x="-1600" y="-2000" width="5000" height="5000" fill="#ACD9C3"/><Parallax camera={camera}><City t={t}/></Parallax>
  <path d="M-800 1240H2400V2200H-800Z" fill="#EBD0A4"/><path d="M-800 1455H2400V1530H-800Z" fill="#CFB99B"/><path d="M-800 1528H2400V2500H-800Z" fill="#959B92"/>
  <g transform="translate(180 380)"><rect x="0" y="60" width="1230" height="800" fill="#B5BF83"/><path d="M-40 18H1270V160H-40Z" fill="#567654"/><path d="M-55 0H1285V33H-55Z" fill="#F7E6BE"/><Label x={615} y={116} center color={G.white} size={ending?65:69}>{ending?'ODDLY LOGICAL':'STARBUCKS'}</Label>
    <rect x="53" y="265" width="455" height="475" fill="#85B4A6" stroke="#E6D7A2" strokeWidth="16"/><rect x="773" y="265" width="405" height="475" fill="#85B4A6" stroke="#E6D7A2" strokeWidth="16"/><path d="M62 280L500 657V731L62 378M781 280l390 337v110L781 391" fill="#D7E9C144"/>
    <path d="M281 273v455M978 273v455M62 503h438M781 503h390" stroke="#D4D099" strokeWidth="9"/>
    <rect x="551" y="228" width="177" height="632" fill="#577F69" stroke="#E3C696" strokeWidth="13"/><rect x="572" y="256" width="133" height="418" fill="#9FBFA5"/><circle cx="685" cy="727" r="9" fill="#EFD188"/>
    <path d="M-31 170H1260L1294 286H-67Z" fill="#F8E4B9"/>{Array.from({length:14},(_,i)=><path key={i} d={`M${-31+i*94} 170h48l12 116h-52Z`} fill="#759568"/>)}
  </g>
  <g transform="translate(-120 720)"><rect x="-360" y="-75" width="510" height="581" fill="#D0987B"/><path d="M-380-157H168V-33H-380Z" fill="#937F8B"/><rect x="-331" y="86" width="419" height="356" fill="#77A9AA" stroke="#EBD6B9" strokeWidth="19"/><circle cx="-101" cy="-124" r="94" fill="#E3AC85"/><CoffeeCup x={-101} y={-128} scale={.8}/></g>
  <Plant x={1255} y={1335} t={t} scale={1.1}/>
  <path d="M-800 1420H2400" stroke="#E1BD91" strokeWidth="3"/>
</g>;
