import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {GiftEpisode} from './types';
import {G,SANS,SERIF,appear,ease,mix} from './theme';
import {CafeBackground} from './components/Assets';
import {CastLayer} from './components/Cast';
import {StoryBoards} from './components/StoryBoards';

const reference=[0,11,27,36,49,56,63,78,94,105,119,138];
export const GiftCardEpisode:React.FC<{episode:GiftEpisode}>=({episode})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
 const index=Math.max(0,episode.scenes.findIndex(s=>t>=s.start&&t<s.end));
 const scene=episode.scenes[index],local=t-scene.start;
 const visualLocal=(local/(scene.end-scene.start))*(reference[index+1]-reference[index]);
 const visualTime=reference[index]+visualLocal;
 const fade=appear(local,0,.4)*(index===episode.scenes.length-1?1:1-ease(t,scene.end-.3,.3));
 const cue=episode.captions.find(c=>t>=c.start&&t<c.end);
 const accent=scene.id==='forgotten'?G.terra:G.green;
 return <AbsoluteFill style={{background:G.paper,fontFamily:SANS,color:G.ink,overflow:'hidden'}}>
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
   <CafeBackground t={visualTime}/>
   <g opacity={fade} transform={`translate(0 ${8*(1-appear(local,0,.5))})`}><StoryBoards id={scene.id} t={visualLocal} episode={episode}/></g>
   <CastLayer t={visualTime} episode={episode}/>
  </svg>
  <div style={{position:'absolute',left:65,right:65,top:67,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div style={{display:'flex',gap:15,alignItems:'center'}}><div style={{width:37,height:37,border:`3px solid ${G.green}`,borderRadius:10,transform:'rotate(-8deg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:23,fontWeight:700,color:G.green}}>!</div><span style={{fontSize:23,fontWeight:700,letterSpacing:3.2}}>ODDLY LOGICAL</span></div>
   <span style={{border:`1px solid ${G.line}`,padding:'10px 17px',borderRadius:25,fontSize:16,letterSpacing:2}}>NO. 02</span>
  </div>
  <div style={{position:'absolute',left:65,right:65,top:151,opacity:fade}}>
   <div style={{fontSize:17,fontWeight:700,letterSpacing:2.7,color:accent,marginBottom:20}}>{scene.label}</div>
   <div style={{fontFamily:SERIF,fontSize:scene.id==='hook'?77:65,lineHeight:1.08,fontWeight:600,letterSpacing:-1.8,whiteSpace:'pre-line'}}>{scene.heading}</div>
  </div>
  {cue&&<div style={{position:'absolute',top:1530,left:85,right:85,height:153,display:'flex',alignItems:'center',justifyContent:'center',opacity:appear(t,cue.start,.12)*(1-ease(t,cue.end-.1,.1)),transform:`translateY(${mix(6,0,appear(t,cue.start,.17))}px)`}}><div style={{fontSize:41,lineHeight:1.3,textAlign:'center',fontWeight:700}}>{cue.text.split(' ').map((word,i)=><React.Fragment key={i}><span style={{color:/^(twenty|fourteen|six|million|revenue|liability|breakage|cash|gift-card|Starbucks)/i.test(word)?accent:G.ink}}>{word}</span>{' '}</React.Fragment>)}</div></div>}
  <div style={{position:'absolute',left:70,right:70,top:1734,display:'flex',gap:8}}>{episode.scenes.map(s=><div key={s.id} style={{height:4,background:'#DCD7C5',flex:s.end-s.start,borderRadius:8,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.max(0,Math.min(1,(t-s.start)/(s.end-s.start)))*100}%`,background:G.green}}/></div>)}</div>
  <div style={{position:'absolute',left:70,right:70,top:1758,display:'flex',justifyContent:'space-between',fontSize:15,letterSpacing:1.2,color:G.muted}}><span>BUSINESS SECRETS IN PLAIN SIGHT</span><span>GIFT-CARD BREAKAGE</span></div>
  <Audio src={staticFile(episode.assets.music)} volume={f=>.7*ease(f/fps,0,1.3)*(1-ease(f/fps,episode.durationSeconds-2.5,2.5))}/>
  {episode.soundEvents.map((cue,i)=><Sequence key={i} from={Math.round(cue.at*fps)} durationInFrames={Math.round(fps*1.4)}><Audio src={staticFile(`audio/giftcard/${cue.sound}.wav`)} volume={.46}/></Sequence>)}
  {episode.narration.src&&<Audio src={staticFile(episode.narration.src)} volume={1}/>}
 </AbsoluteFill>;
};
