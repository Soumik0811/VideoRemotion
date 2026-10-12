import React from 'react';
import {AbsoluteFill,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {EpisodeScene,SceneType} from '../types';
import {C,FONT} from '../engine/theme';
import {pop,progress,drift} from '../engine/motion';
import {Person,Shirt,Cash,Pill} from '../components/Shapes';

const Heading:React.FC<{text:string;small?:boolean}>=({text,small=false})=><div style={{position:'absolute',top:270,left:66,right:65,textAlign:'center',fontSize:small?71:82,lineHeight:1.09,whiteSpace:'pre-line',fontWeight:1000,letterSpacing:'-0.055em',color:C.dark}}>{text}</div>;
const At:React.FC<{x:number;y:number;children:React.ReactNode;scale?:number;rotate?:number;opacity?:number}>=({x,y,children,scale=1,rotate=0,opacity=1})=><div style={{position:'absolute',left:x,top:y,transform:`scale(${scale}) rotate(${rotate}deg)`,transformOrigin:'center',opacity}}>{children}</div>;
const Big:React.FC<{children:React.ReactNode;x?:number;y:number;color?:string;font?:number;align?:'center'|'left'}>=({children,x=0,y,color=C.dark,font=65,align='center'})=><div style={{position:'absolute',top:y,left:x,right:align==='center'?0:undefined,fontSize:font,color,fontWeight:1000,textAlign:align,fontFamily:FONT}}>{children}</div>;
const count = (to:number, p:number)=>Math.round(to*Math.max(0,Math.min(1,p))).toLocaleString('en-US');

const Hook:React.FC<{s:EpisodeScene}>=({s})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 return <><Heading text={s.headline}/>
  <At x={123} y={610} scale={pop(f,fps,7)*0.95}><Person shirt={C.coral} eyes="happy" size={324} wave={drift(f,1,6)}/></At>
  <At x={628} y={610} scale={pop(f,fps,17)*0.95}><Person shirt={C.blue} eyes="happy" size={324} wave={drift(f,3,6)}/></At>
  <At x={385} y={870} scale={pop(f,fps,32)*0.92}><Shirt size={165}/></At>
  <At x={173} y={1145} scale={pop(f,fps,24)}><Pill color={C.gold} large>$100</Pill></At>
  <At x={696} y={1145} scale={pop(f,fps,35)}><Pill color={C.gold} large>$100</Pill></At>
  <Big y={1340} font={45}>WHO WOULD YOU BET ON?</Big>
 </>
};
const Inventory:React.FC<{s:EpisodeScene}>=({s})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const shirts=Array.from({length:5},(_,i)=>i);
 return <><Heading text={s.headline}/>
   {shirts.map((i)=><At key={i} x={77+i*195} y={570+drift(f,i,5)} scale={pop(f,fps,13+i*7)*0.95}><Shirt size={167} color={C.coral}/></At>)}
   <At x={315} y={822} scale={pop(f,fps,65)}><Pill>5 × $20 = $100</Pill></At>
   <At x={115} y={980} scale={pop(f,fps,112)*0.65}><Person shirt={C.coral} size={260}/></At>
   <At x={496} y={1010} scale={pop(f,fps,136)}><Cash size={155} rotation={-10}/></At>
   <At x={685} y={1018} scale={pop(f,fps,162)}><Cash size={155} rotation={13}/></At>
   <Big y={1330} color={C.green} font={67}>+ $50 GROSS MARGIN</Big>
 </>
};
const Preorder:React.FC<{s:EpisodeScene}>=({s})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const notices=[0,1,2,3,4,5];
 return <><Heading text={s.headline}/>
   <At x={83} y={640} scale={pop(f,fps,10)*0.85}><Person shirt={C.blue} size={315} eyes="happy" wave={drift(f,1,15)}/></At>
   <At x={460} y={665+drift(f,1,8)} scale={pop(f,fps,30)*0.9}><Shirt size={220} color={C.gold}/></At>
   {notices.map((i)=><At key={i} x={440+(i%2)*235} y={890+Math.floor(i/2)*117} scale={pop(f,fps,56+i*16)*0.83}><Pill color={i%2?C.mint:C.white}>✓ ORDER</Pill></At>)}
   <At x={285} y={1346} scale={pop(f,fps,235)}><Pill color={C.gold} large>50 PREORDERS</Pill></At>
 </>
};
const MathScene:React.FC<{s:EpisodeScene}>=({s})=>{
 const f=useCurrentFrame();
 const rows=[{lab:'CUSTOMER PAYMENTS',val:1500,color:C.mint,from:14},{lab:'PRODUCTION COST',val:-1000,color:'#F9DDD1',from:104},{lab:'GROSS MARGIN*',val:500,color:C.gold,from:202}];
 return <><Heading text={s.headline}/>
  {rows.map((r,i)=>{
    const p=progress(f,r.from,32);
    return <div key={i} style={{position:'absolute',top:570+i*236,left:65,right:65,height:201,transform:`translateX(${(1-p)*(i%2?100:-100)}px)`,opacity:p,border:`5px solid ${C.dark}`,background:r.color,borderRadius:27,boxShadow:'0 12px 0 #33292214',padding:'22px 42px'}}>
       <div style={{fontSize:28,fontWeight:900,letterSpacing:'0.08em',color:C.soft}}>{r.lab}</div>
       <div style={{fontSize:99,fontWeight:1000,letterSpacing:'-0.06em'}}>{r.val<0?'-':''}${count(Math.abs(r.val),progress(f,r.from+15,48))}</div>
     </div>;
   })}
   <div style={{position:'absolute',left:70,right:70,top:1395,fontSize:26,color:C.soft,textAlign:'center',lineHeight:1.3}}>*Before sample, shipping, platform fees, returns and taxes.</div>
 </>
};
const Compare:React.FC<{s:EpisodeScene}>=({s})=>{
 const f=useCurrentFrame();
 const left=progress(f,35,45),right=progress(f,57,76);
 return <><Heading text={s.headline} small/>
   <Big y={525} font={37} color={C.soft}>GROSS MARGIN COMPARISON</Big>
   <div style={{position:'absolute',left:145,right:145,top:685,height:535,borderBottom:`7px solid ${C.dark}`,display:'flex',alignItems:'flex-end',justifyContent:'space-around'}}>
    <div style={{width:220,height:Math.max(1,82*left),border:`6px solid ${C.dark}`,borderBottom:0,background:C.coral,borderRadius:'17px 17px 0 0',position:'relative'}}>
      <span style={{position:'absolute',top:-70,left:0,right:0,textAlign:'center',fontSize:54,fontWeight:1000}}>${count(50,left)}</span>
    </div>
    <div style={{width:220,height:Math.max(1,445*right),border:`6px solid ${C.dark}`,borderBottom:0,background:C.green,borderRadius:'17px 17px 0 0',position:'relative'}}>
      <span style={{position:'absolute',top:-70,left:0,right:0,textAlign:'center',fontSize:54,fontWeight:1000}}>${count(500,right)}</span>
    </div>
   </div>
   <Big y={1252} font={37}>ALEX: 5 SHIRTS     MAYA: 50 SHIRTS</Big>
   <At x={245} y={1340} scale={pop(f,30,124)*0.95}><Pill color={C.gold}>10× VOLUME</Pill></At>
   <div style={{position:'absolute',top:1485,left:90,right:90,textAlign:'center',fontSize:28,color:C.soft,fontWeight:800}}>Preorders reduce unsold-stock risk—not the work of finding buyers.</div>
 </>
};
const components:Record<SceneType,React.FC<{s:EpisodeScene}>>={hook:Hook,inventory:Inventory,preorder:Preorder,math:MathScene,compare:Compare};
export const SceneRenderer:React.FC<{scene:EpisodeScene}>=({scene})=>{
 const Component=components[scene.type]; return <AbsoluteFill><Component s={scene}/></AbsoluteFill>;
};
