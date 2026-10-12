import React from 'react';
import {G,SANS,ease,mix} from '../theme';

export const GiftCard:React.FC<{x?:number;y?:number;scale?:number;amount?:string;rotate?:number}>=({x=0,y=0,scale=1,amount='$20',rotate=0})=><g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
 <rect x="-150" y="-91" width="300" height="182" rx="21" fill="#D9B873" transform="translate(0 8)"/><rect x="-150" y="-97" width="300" height="182" rx="21" fill={G.green}/><path d="M-138-83H138V72H-138Z" fill="none" stroke="#CFDEBA66" strokeWidth="2"/>
 <circle cx="-83" cy="-5" r="34" fill={G.white}/><CoffeeCup x={-83} y={-5} scale={.39}/><LabelText x={-30} y={-50} text="GIFT CARD" size={18} color={G.white}/><text x="20" y="28" fontSize="52" fill={G.white} fontWeight="bold" fontFamily={SANS}>{amount}</text><LabelText x={-30} y={58} text="STARBUCKS" size={12} color="#D8E7CB"/>
</g>;
const LabelText:React.FC<{x:number;y:number;text:string;size:number;color?:string}>=({x,y,text,size,color=G.ink})=><text x={x} y={y} fontFamily={SANS} fontSize={size} letterSpacing="1.3" fill={color} fontWeight="bold">{text}</text>;
export const CoffeeCup:React.FC<{x?:number;y?:number;scale?:number;steam?:number}>=({x=0,y=0,scale=1,steam=0})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
 <path d="M-43-44H43L32 65Q0 77-32 65Z" fill={G.white} stroke="#C8B994" strokeWidth="3"/><path d="M-37-5H37L33 41H-33Z" fill="#C9AD7F"/><rect x="-49" y="-53" width="98" height="15" rx="5" fill="#354E42"/><path d="M-43-53L-34-65H34L44-53Z" fill="#587260"/><circle cy="17" r="18" fill={G.green}/><path d="M-7 10H7v13H-7Z" fill={G.white}/>
 {steam>0&&<g fill="none" stroke="#D8E2D2" strokeWidth="4" strokeLinecap="round" opacity=".8"><path d={`M-17-81q${8*Math.sin(steam*2)}-15 0-30`}/><path d={`M13-75q${10*Math.cos(steam*2)}-19 0-37`}/></g>}
</g>;
export const Drawer:React.FC<{x:number;y:number;t:number;close:number}>=({x,y,t,close})=><g transform={`translate(${x} ${y})`}>
 <rect x="-266" y="-102" width="532" height="329" rx="14" fill="#A9825E"/><path d="M-255-92H255V202H-255Z" fill="#D6B187"/><rect x="-227" y="-68" width="454" height="133" rx="8" fill="#80654D"/>
 <g transform={`translate(0 ${mix(42,0,close)})`}><path d="M-226 53V-64H226V53" fill="#D9BA91"/><GiftCard y={-3} scale={.68} amount="$6" rotate={-7}/><rect x="-241" y={mix(25,-79,close)} width="482" height={145} rx="8" fill="#BE976F" stroke="#9A7655" strokeWidth="4"/><rect x="-47" y={mix(71,-33,close)} width="94" height="16" rx="8" fill="#675443"/></g>
 <path d="M-247 215v35M247 215v35" stroke="#806247" strokeWidth="20"/>
</g>;
export const CafeBackground:React.FC<{t:number}>=({t})=><g>
 <path d="M0 830Q270 790 537 850Q820 785 1080 842V1468H0Z" fill="#D5E8D1"/>
 <g fill="#9CCBB733">{[0,1,2,3,4].map(i=><g key={i}><rect x={-50+i*258} y={790-(i%3)*66} width="217" height="550"/><path d={`M${-60+i*258} ${790-(i%3)*66}h237v21h-237Z`}/>{[0,1,2].map(j=><rect key={j} x={-22+i*258+j*59} y={841-(i%3)*66} width="42" height="130" fill="#E6F2D644"/>)}</g>)}</g>
 <g transform="translate(221 940)"><rect width="638" height="441" rx="8" fill="#AEC4A5"/><path d="M-23-13H660V72H-23Z" fill="#2F6A50"/><LabelText x={175} y={39} text="STARBUCKS" size={35} color={G.white}/><rect x="24" y="92" width="385" height="258" fill="#8EB5AE" stroke="#F4E6C9" strokeWidth="10"/><path d="M28 100H129L405 281V340L27 158Z" fill="#E7F3D62A"/><path d="M149 95V345M281 95V345M29 217H405" stroke="#D8DDB8" strokeWidth="5"/><rect x="447" y="96" width="161" height="345" fill="#779D8B" stroke="#F4E6C9" strokeWidth="9"/><rect x="462" y="114" width="130" height="219" fill="#AAC6B9"/><circle cx="575" cy="350" r="6" fill="#F1D289"/><path d="M-28 73H659L679 127H-48Z" fill="#FAEDCE"/>{[0,1,2,3,4,5,6,7].map(i=><path key={i} d={`M${-26+i*86} 73h40l12 54h-44Z`} fill="#7CA180"/>)}</g>
 <path d="M0 1379H1080V1493H0Z" fill="#EADBC2"/><path d="M0 1493H1080" stroke="#C8B8A0" strokeWidth="8"/><path d="M100 1383l-50 110M322 1383l-20 110M542 1383l20 110M779 1383l50 110M1000 1383l70 110" stroke="#D7C5A8" strokeWidth="2"/>
 <g opacity=".6" transform={`translate(${Math.sin(t/14)*8} 0)`}><path d="M60 870q-8-33 25-34q15-34 39-8q38-12 42 22h23q23 18-3 24Z" fill={G.white}/></g>
</g>;
