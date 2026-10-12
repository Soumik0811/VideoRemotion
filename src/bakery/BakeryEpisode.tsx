import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {BakeryEpisode as EpisodeType,BakerAction} from './types';
import {B,SANS,SERIF,appear,ease,mix,money,windowAt,storyTime} from './engine/motion';
import {BakerCharacter,CustomerCharacter} from './components/BakerCharacter';
import {Neighborhood,CameraRig,Supermarket,IngredientCounter,BakeryInterior} from './components/Environment';
import {BreadLoaf,BreadTray,FlourSack,MoneyStack,MoneyTransfer,InvoiceCard,CalendarFlip,CashRegister,FlowArrow} from './components/Props';
import {ComparisonPanel} from './components/ComparisonPanel';
import {SubtitleOverlay} from './components/SubtitleOverlay';

const Badge:React.FC<{x:number;y:number;label:string;value:string;color?:string;width?:number}>=({x,y,label,value,color=B.green,width=310})=><g transform={`translate(${x} ${y})`} fontFamily={SANS}>
 <rect x={-width/2+4} y="-43" width={width} height="117" rx="18" fill="#6B584318"/><rect x={-width/2} y="-49" width={width} height="117" rx="18" fill={B.white} stroke="#DDD0BA" strokeWidth="2"/>
 <text y="-14" textAnchor="middle" fontSize="18" fill={B.muted} letterSpacing="1.2">{label}</text><text y="39" textAnchor="middle" fontSize={value.length>15?30:value.length>12?32:value.length>9?36:45} fontWeight="bold" fill={color}>{value}</text>
</g>;
const oliverActions:{at:number;action:BakerAction}[]=[{at:.8,action:'wave'},{at:4,action:'money'},{at:7.3,action:'bread'},{at:12.5,action:'happy'},{at:18,action:'wave'},{at:23,action:'idle'},{at:27,action:'bread'},{at:30,action:'receive'},{at:34,action:'money'},{at:38,action:'point'},{at:42,action:'bread'},{at:48,action:'idle'},{at:78,action:'bread'},{at:85,action:'happy'}];
const noahActions:{at:number;action:BakerAction}[]=[{at:1.3,action:'wave'},{at:4,action:'money'},{at:7.3,action:'bread'},{at:12.5,action:'happy'},{at:20.8,action:'surprised'},{at:22,action:'scratch'},{at:25,action:'confused'},{at:28,action:'idle'},{at:45.5,action:'bread'},{at:50.8,action:'point'},{at:54.5,action:'happy'},{at:57.2,action:'surprised'},{at:58.4,action:'worried'},{at:79,action:'scratch'},{at:83,action:'worried'}];

const StoryWorld:React.FC<{t:number;episode:EpisodeType}>=({t,episode})=>{
 const f=episode.financials;
 const oliverFocus=windowAt(t,26,45,1.5),noahFocus=windowAt(t,45,59,1.5),comparison=windowAt(t,59,78,1);
 const center=540-140*oliverFocus+60*noahFocus;
 const zoom=1+.08*oliverFocus+.015*Math.sin(t/13)*(1-comparison);
 const setup=windowAt(t,3.8,14.8,.7),isSales=ease(t,9.5,.5);
 const reveal=windowAt(t,20.7,25.9,.7),direct=windowAt(t,26.5,44.7,.7),credit=windowAt(t,46,58.9,.7),lesson=appear(t,78,.9);
 return <svg width="1080" height="1000" viewBox="0 0 1080 1000" style={{display:'block',overflow:'hidden'}}>
  {comparison<1&&<g opacity={1-comparison}>
   <CameraRig center={center} zoom={zoom}>
    <Neighborhood t={t} morning={ease(t,15,3)} noahEmpty={t>20} oliverOpen={ease(t,18,1)}/>
    <g opacity={windowAt(t,26.6,36.5,1)}><CustomerCharacter x={mix(-150,58,ease(t,26.6,1.7))} y={640} t={t} scale={.84}/><BreadLoaf x={169} y={809} scale={.48}/></g>
    <g opacity={windowAt(t,30.3,35.9,.7)}><CustomerCharacter x={-14} y={669} t={t} scale={.66} variant={1}/></g>
    <g opacity={1-credit}><BakerCharacter id="oliver" characters={episode.characters} t={t} x={202} y={560} scale={.9} actions={oliverActions}/></g>
    <g opacity={1-direct}><BakerCharacter id="noah" characters={episode.characters} t={t} x={714} y={560} scale={.9} actions={noahActions}/></g>
    <g opacity={setup}>
     <Badge x={279} y={181} label={isSales>.5?'BREAD SOLD':'STARTING CASH'} value={money(mix(f.startingCash,f.sales*ease(t,9.7,1.4),isSales))}/>
     <Badge x={807} y={181} label={isSales>.5?'BREAD SOLD':'STARTING CASH'} value={money(mix(f.startingCash,f.sales*ease(t,9.7,1.4),isSales))} color={B.terra}/>
    </g>
    <g opacity={windowAt(t,4,7.4,.5)}><MoneyStack x={284} y={82} scale={.86}/><MoneyStack x={810} y={82} scale={.86}/></g>
    <g opacity={windowAt(t,7.2,10,.5)}><FlourSack x={428} y={748} scale={.9}/><FlourSack x={940} y={748} scale={.9}/></g>
    <MoneyTransfer t={t} start={7.15} from={[284,82]} to={[429,739]}/><MoneyTransfer t={t} start={7.15} from={[810,82]} to={[940,739]}/>
    <g opacity={windowAt(t,15.8,20.6,.8)}><Badge x={279} y={181} label="OLIVER" value="OPEN AGAIN" width={365}/><Badge x={807} y={181} label="NOAH" value="WHAT’S WRONG?" color={B.terra} width={397}/></g>
    <g opacity={reveal}><Badge x={279} y={181} label="OLIVER" value="READY TO BAKE" width={395}/><Badge x={807} y={181} label="NOAH’S CASH" value="$0" color={B.terra}/><CashRegister x={957} y={815} scale={1} open={ease(t,21.3,.8)}/><g transform="translate(891 343)"><text fontFamily={SERIF} fontSize="95" fill={B.terra}>?</text></g></g>
    <g opacity={direct}><Badge x={388} y={181} label={t<37.4?'CASH RECEIVED TODAY':'CASH TO RESTOCK'} value={t<37.4?money(f.sales*(.5*ease(t,28.8,.75)+.5*ease(t,31.2,.75))):money(f.productionCost)} width={400}/><CashRegister x={460} y={809} scale={.87}/></g>
    <MoneyTransfer t={t} start={28.7} from={[164,806]} to={[460,799]}/><MoneyTransfer t={t} start={31.1} from={[164,806]} to={[460,799]}/>
    <g opacity={windowAt(t,37.5,44.7,.7)}><IngredientCounter x={709} y={630} scale={.81}/><FlowArrow x={515} y={624} width={87}/><FlourSack x={586} y={840} scale={.8}/></g>
    <MoneyTransfer t={t} start={38} from={[460,799]} to={[709,641]}/>
    <g opacity={windowAt(t,41.6,44.7,.7)}><BreadTray x={466} y={756} scale={.83}/><text x="514" y="374" textAnchor="middle" fontFamily={SANS} fontSize="23" fontWeight="bold" fill={B.green}>THE NEXT BATCH IS FUNDED</text></g>
    <g opacity={credit}><Supermarket x={260} y={665} scale={.87}/><Badge x={360} y={181} label="THE CUSTOMER" value="A SUPERMARKET" width={466} color={B.muted}/></g>
    {[0,1,2].map(i=>{const start=49+i*.4,p=ease(t,start,1.8);return <g key={i} opacity={windowAt(t,start,start+2.1,.3)}><BreadTray x={mix(805,375,p)} y={785-Math.sin(p*Math.PI)*80} scale={.7}/></g>})}
    <g opacity={windowAt(t,52.5,58.9,.6)} transform={`translate(0 ${18*(1-appear(t,52.5,.7))})`}><InvoiceCard x={450} y={473} scale={.88} amount={f.sales} days={f.paymentDays}/></g>
    <g opacity={windowAt(t,57.1,58.9,.3)}><CalendarFlip x={667} y={361} scale={.78} progress={ease(t,57.25,1.2)} days={f.paymentDays}/><CashRegister x={949} y={808} scale={1} open={ease(t,57.4,.5)}/></g>
    <g opacity={lesson}><Badge x={280} y={181} label="OLIVER" value="KEEPS BAKING" width={386}/><Badge x={807} y={181} label="NOAH" value="WAITING FOR CASH" color={B.terra} width={443}/>
     <BakeryInterior x={310} y={430} stock={3}/><BakeryInterior x={812} y={430} stock={0}/>
     <text x={810} y={575} fontFamily={SANS} fontSize="17" fill={B.muted} textAnchor="middle">PAYMENT STILL OWED</text>
    </g>
   </CameraRig>
  </g>}
  {comparison>0&&<g opacity={comparison}><ComparisonPanel t={t} episode={episode}/></g>}
 </svg>;
};

export const BakeryEpisode:React.FC<{episode:EpisodeType}>=({episode})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const visualTime=storyTime(t,episode);
 const scene=episode.scenes.find(s=>t>=s.start&&t<s.end)??episode.scenes.at(-1)!;
 const titleFade=appear(t,scene.start,.55)*(scene.id==='lesson'?1:1-ease(t,scene.end-.4,.4));
 const heading=scene.id==='setup'&&visualTime>9.5?'Same sales.\nDifferent tomorrow.':scene.heading;
 return <AbsoluteFill style={{background:B.cream,color:B.dark,fontFamily:SANS}}>
  <div style={{position:'absolute',top:68,left:65,right:65,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
   <div style={{display:'flex',alignItems:'center',gap:14}}><svg width="43" height="40" viewBox="-56 -43 112 84"><BreadLoaf/></svg><span style={{fontSize:21,fontWeight:700,letterSpacing:4}}>MONEY, EXPLAINED</span></div>
   <div style={{fontSize:17,letterSpacing:2,padding:'10px 15px',border:`1px solid #C9BDA7`,borderRadius:30}}>EPISODE 01</div>
  </div>
  <div style={{position:'absolute',top:154,left:65,right:65,opacity:titleFade,transform:`translateY(${10*(1-appear(t,scene.start,.7))}px)`}}>
   <div style={{fontSize:18,letterSpacing:3,color:scene.id==='noah'?B.terra:B.green,fontWeight:700,marginBottom:18}}>{scene.label}</div>
   <div style={{fontFamily:SERIF,fontSize:scene.id==='lesson'?86:70,lineHeight:1.09,letterSpacing:-2.4,fontWeight:600,whiteSpace:'pre-line'}}>{heading}</div>
  </div>
  <div style={{position:'absolute',top:435,left:0,width:1080,height:1000}}><StoryWorld t={visualTime} episode={episode}/></div>
  <div style={{position:'absolute',top:1435,left:0,right:0,height:55,background:`linear-gradient(${B.cream}00, ${B.cream})`}}/>
  <SubtitleOverlay t={t} episode={episode}/>
  <div style={{position:'absolute',left:70,right:70,top:1734,display:'flex',gap:12}}>{episode.scenes.map(s=><div key={s.id} style={{height:4,background:'#DCD2BF',flex:s.end-s.start,borderRadius:8,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.max(0,Math.min(1,(t-s.start)/(s.end-s.start)))*100}%`,background:B.green}}/></div>)}</div>
  <div style={{position:'absolute',left:70,right:70,top:1757,fontSize:15,letterSpacing:1.2,color:B.muted,display:'flex',justifyContent:'space-between'}}><span>A STORY ABOUT PAYMENT TIMING</span><span>01 / THE BAKERS</span></div>
  <Audio src={staticFile(episode.assets.music)} volume={f=>.62*ease(f/fps,0,1.5)*(1-ease(f/fps,episode.durationSeconds-2.5,2.5))}/>
  {episode.soundEvents.map((e,i)=><Sequence key={i} from={Math.round(e.at*fps)} durationInFrames={Math.round(fps*1.4)}><Audio src={staticFile(`audio/bakery/${e.sound}.wav`)} volume={.43}/></Sequence>)}
  {episode.narration.src&&<Audio src={staticFile(episode.narration.src)} volume={1}/>}
 </AbsoluteFill>;
};
