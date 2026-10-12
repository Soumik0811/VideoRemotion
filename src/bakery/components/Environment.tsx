import React from 'react';
import {B,SANS,SERIF} from '../engine/motion';
import {BreadLoaf,BreadTray,CashRegister,IngredientShelf} from './Props';

export const BakeryExterior:React.FC<{x:number;color:string;name:string;empty?:boolean;door?:number}>=({x,color,name,empty=false,door=0})=><g transform={`translate(${x} 290)`}>
 <path d="M0 84H433V542H0Z" fill={color}/><path d="M12 93H421V167H12Z" fill="#FFF9EE17" stroke="#382F2A18" strokeWidth="3"/>
 <path d="M-10 71H444L440 92H-6Z" fill="#FFF1D0"/><path d="M-5 91H438V101H-5Z" fill="#705D4124"/>
 <path d="M105 68L118-18H317L333 68" fill={color} stroke="#382F2A18" strokeWidth="7"/>
 <path d="M117-20H320" stroke="#F9EACB" strokeWidth="14"/><ellipse cx="219" cy="21" rx="69" ry="37" fill="#F3D59B"/><BreadLoaf x={219} y={28} scale={.78}/>
 <text x="216" y="147" textAnchor="middle" fontFamily={SERIF} fontWeight="600" fontSize="31" fill={B.white}>{name}’s bakery</text>
 <rect x="21" y="228" width="222" height="255" fill="#F4D5A4"/><rect x="31" y="239" width="201" height="232" fill="#6C9794"/>
 <path d="M31 239H232V285H31Z" fill="#587C77"/><path d="M31 361H232M31 432H232" stroke="#DBC190" strokeWidth="8"/>
 {!empty&&[0,1,2,3,4,5].map(i=><BreadLoaf key={i} x={63+i%3*66} y={344+Math.floor(i/3)*71} scale={.53}/>)}
 <CashRegister x={179} y={440} scale={.43} open={empty?1:0}/><path d="M33 240H116L232 394V452L31 283Z" fill="#E1F5E733"/><path d="M170 240H194L231 295V329Z" fill="#E1F5E722"/>
 <path d="M31 295H232M31 405H232M95 239V470M170 239V470" stroke="#D7DFB4" strokeWidth="4"/>
 <rect x="267" y="201" width="147" height="341" fill="#F1D1A0"/><rect x="278" y="214" width="125" height="319" fill="#668C88"/>
 <g transform={`translate(278 214) scale(${1-door*.35} 1)`}><rect width="125" height="319" fill={color}/><rect x="12" y="12" width="101" height="210" rx="47" fill="#85B9B9"/><path d="M20 166L103 83V124L20 207Z" fill="#C3E6D73A"/><path d="M63 16V223M13 112H114" stroke="#F5D7A0" strokeWidth="5"/><rect x="13" y="242" width="100" height="55" fill="none" stroke="#F4D7B077" strokeWidth="3"/><circle cx="110" cy="232" r="5" fill="#EEC777"/></g>
 <path d="M14 503H245V541H14Z" fill="#FFF9EE21" stroke="#382F2A18" strokeWidth="2"/>
 <path d="M3 182H253L272 239H-15Z" fill="#F9E9C5"/>
 {[0,1,2,3,4,5].map(i=><g key={i}><path d={`M${3+i*42} 182H${24+i*42}L${14+i*46} 239H${-9+i*46}Z`} fill={color}/><path d={`M${-15+i*47} 239h47v15q-23 28-47 0Z`} fill={i%2?'#F4DBAA':color}/></g>)}
 <path d="M-16 239H272" stroke="#AD87643A" strokeWidth="3"/>
 <path d="M-5 542H438" stroke="#F3D9AA" strokeWidth="10"/>
 <g transform="translate(255 477) rotate(-5)"><path d="M-25-27H32L43 66H-33Z" fill="#DBBD86"/><path d="M-18-18H25L32 51H-24Z" fill="#647369"/><text x="4" y="8" fontSize="11" fontFamily={SANS} fill="#F5E8C9" textAnchor="middle">FRESH</text><text x="4" y="24" fontSize="11" fontFamily={SANS} fill="#F5E8C9" textAnchor="middle">DAILY</text><path d="M-29 63l-3 15M37 63l3 15" stroke="#BA9663" strokeWidth="5"/></g>
</g>;

export const Neighborhood:React.FC<{t:number;morning?:number;noahEmpty?:boolean;oliverOpen?:number}>=({t,morning=0,noahEmpty=false,oliverOpen=0})=><>
 <defs><linearGradient id="bakery-sky" x2="0" y2="1"><stop stopColor="#B0E4D7"/><stop offset="1" stopColor={B.cream}/></linearGradient><linearGradient id="bakery-ground" x2="0" y2="1"><stop stopColor="#F0DFC0"/><stop offset="1" stopColor="#E8D3B4"/></linearGradient></defs>
 <rect x="-600" y="-300" width="2280" height="1600" fill="url(#bakery-sky)"/>
 <circle cx={873-morning*92} cy={158-morning*55} r="67" fill="#FFF0BC" opacity=".8"/>
 <g fill="#FFF9EE" opacity=".36" transform={`translate(${Math.sin(t/22)*14} 0)`}><path d="M75 134q-10-34 28-40q20-42 49-6q42-8 43 28h33q23 27-7 28H76Z"/><path d="M560 91q-9-27 20-32q22-36 49-7q36-7 39 23h28q20 20-4 24H560Z"/></g>
 <path d="M0 543Q207 364 398 509Q637 340 870 483Q1000 382 1080 447V841H0Z" fill={B.hills}/>
 <g fill="#77BFB222" stroke="none">{[{x:-60,y:218,w:226,h:550},{x:217,y:103,w:204,h:632},{x:410,y:226,w:160,h:480},{x:570,y:5,w:260,h:712},{x:850,y:161,w:278,h:596}].map((b,i)=><g key={i}>
  <path d={`M${b.x} ${b.y+30}h${b.w}v${b.h}h-${b.w}Z`}/><path d={`M${b.x-12} ${b.y+13}h${b.w+24}l-8 20h-${b.w+8}Z`}/><path d={`M${b.x+40} ${b.y}h${b.w-90}v30h-${b.w-90}Z`}/>
  {[0,1,2].map(c=>[0,1,2,3].map(r=><rect key={`${c}-${r}`} x={b.x+22+c*(b.w-35)/3} y={b.y+65+r*98} width={(b.w-72)/3} height="66" fill="#D3EEDF55"/>))}
 </g>)}</g>
 <g opacity=".6"><path d="M36 438V811M1039 427V814" stroke="#879D70" strokeWidth="15"/><ellipse cx="34" cy="471" rx="76" ry="120" fill="#9DBF8F"/><ellipse cx="1053" cy="489" rx="80" ry="124" fill="#9DBF8F"/><ellipse cx="16" cy="409" rx="55" ry="65" fill="#AEC99B"/></g>
 <path d="M-600 825H1680V1300H-600Z" fill="url(#bakery-ground)"/>
 <path d="M-600 940H1680V955H-600Z" fill="#C4AD99"/><path d="M-600 955H1680V1300H-600Z" fill="#B2B2AA"/>
 <path d="M-600 906H1680M65 830L9 940M279 830L257 940M520 830L542 940M778 830L834 940M995 830L1072 940" stroke="#DCC4A3" strokeWidth="2"/>
 <BakeryExterior x={65} color="#8FA77D" name="Oliver" door={oliverOpen}/><BakeryExterior x={587} color={B.terra} name="Noah" empty={noahEmpty}/>
 <g transform="translate(546 683)"><path d="M0-135V153" stroke="#7D8973" strokeWidth="7"/><path d="M-19-135h38l-6-45h-27Z" fill="#F1E8C7" stroke="#7D8973" strokeWidth="5"/><path d="M-11 152h24" stroke="#7D8973" strokeWidth="11"/></g>
</>;

export const BakeryInterior:React.FC<{x?:number;y?:number;stock?:number}>=({x=0,y=0,stock=3})=><g transform={`translate(${x} ${y})`}>
 <rect x="-220" y="-205" width="440" height="325" rx="20" fill="#F2E4CA" stroke="#C5AB89" strokeWidth="3"/><path d="M-208-190H208V-145H-208Z" fill="#D5DFBD"/><text y="-161" textAnchor="middle" fontFamily={SANS} fontSize="19" letterSpacing="2" fill={B.green}>THE NEXT BATCH</text><IngredientShelf x={-52} y={-8} scale={.86} stock={stock}/><CashRegister x={143} y={57} scale={.78} open={stock?0:1}/>
</g>;
export const Supermarket:React.FC<{x?:number;y?:number;scale?:number}>=({x=0,y=0,scale=1})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <rect x="-205" y="-160" width="410" height="340" fill="#D9CCAB"/><path d="M-220-167H220V-93H-220Z" fill="#91AC9C"/><path d="M-224-174H224" stroke="#FBEDCC" strokeWidth="15"/><text y="-117" fontFamily={SANS} fontSize="29" textAnchor="middle" fontWeight="bold" fill={B.white}>SUPERMARKET</text>
 <rect x="-180" y="-67" width="195" height="185" fill="#83A9A3" stroke="#F1E4C6" strokeWidth="8"/><path d="M-180-3H15M-85-67V115" stroke="#E0D7AD" strokeWidth="4"/><path d="M-177-63H-114L10 57V102Z" fill="#E4F2D633"/><rect x="47" y="-66" width="130" height="230" fill="#B6C6AE" stroke="#F1E4C6" strokeWidth="7"/>
 <path d="M64-35H160V99H64Z" fill="#75958A"/><text x="113" y="24" fontFamily={SANS} textAnchor="middle" fontSize="13" fill={B.white}>RECEIVING</text><text x="113" y="44" fontFamily={SANS} textAnchor="middle" fontSize="13" fill={B.white}>COUNTER</text><path d="M35 141H197V178H35Z" fill="#AD8C69"/>
</g>;
export const IngredientCounter:React.FC<{x?:number;y?:number;scale?:number}>=({x=0,y=0,scale=1})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <rect x="-158" y="-115" width="316" height="219" rx="12" fill="#F2E4CA" stroke="#C3AA87" strokeWidth="3"/><path d="M-158-115H158V-69H-158Z" fill="#C8B381"/><text y="-85" fontFamily={SANS} fontSize="17" textAnchor="middle" fill={B.white} fontWeight="bold">INGREDIENT SUPPLIER</text><IngredientShelf y={36} scale={.64}/><rect x="-165" y="90" width="330" height="26" rx="5" fill="#A88564"/>
</g>;
export const CameraRig:React.FC<{center:number;zoom:number;children:React.ReactNode}>=({center,zoom,children})=><g transform={`translate(540 590) scale(${zoom}) translate(${-center} -590)`}>{children}</g>;
