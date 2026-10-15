import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {GiftEpisode} from './types';
import {G,SANS,SERIF,appear,ease,mix} from './theme';
import {CinematicStory} from './cinematic/CinematicStory';
import {storyTime,audioTime} from './cinematic/timing';

export const GiftCardEpisode:React.FC<{episode:GiftEpisode;showCaptions?:boolean}>=({episode,showCaptions=true})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps,visualTime=storyTime(t,episode);
 const cue=episode.captions.find(c=>t>=c.start&&t<c.end);
 const scene=episode.scenes.find(s=>t>=s.start&&t<s.end)??episode.scenes.at(-1)!;
 return <AbsoluteFill style={{background:G.paper,fontFamily:SANS,color:G.ink,overflow:'hidden'}}>
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0}}>
   <defs><clipPath id="cinematic-stage"><rect x="0" y="178" width="1080" height="1325"/></clipPath></defs>
   <CinematicStory t={visualTime} episode={episode}/>
   <path d="M0 177H1080M0 1504H1080" stroke="#C7B995" strokeWidth="2"/>
  </svg>
  <div style={{position:'absolute',left:65,right:65,top:55,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div style={{fontFamily:SERIF,fontWeight:700,fontSize:45,letterSpacing:-1.9}}>Oddly Logical<span style={{color:G.green}}>.</span></div>
   <span style={{border:`1px solid #B8C4AC`,padding:'11px 18px',borderRadius:24,fontSize:16,letterSpacing:2}}>STORY 02</span>
  </div>
  <div style={{position:'absolute',left:68,top:125,fontSize:14,fontWeight:700,letterSpacing:3,color:G.green}}>BUSINESS SECRETS IN PLAIN SIGHT</div>
  {showCaptions&&cue&&<div style={{position:'absolute',top:1538,left:82,right:82,height:153,display:'flex',alignItems:'center',justifyContent:'center',opacity:appear(t,cue.start,.1)*(1-ease(t,cue.end-.08,.08)),transform:`translateY(${mix(4,0,appear(t,cue.start,.13))}px)`}}><div style={{fontSize:39,lineHeight:1.35,textAlign:'center',fontWeight:700}}>{cue.text.split(' ').map((word,i)=><React.Fragment key={i}><span style={{color:/^(twenty|fourteen|six|million|revenue|liability|breakage|cash|gift-card|Starbucks)/i.test(word)?G.green:G.ink}}>{word}</span>{' '}</React.Fragment>)}</div></div>}
  <div style={{position:'absolute',left:70,right:70,top:1733,height:3,background:'#DCD7C5',borderRadius:8,overflow:'hidden'}}><div style={{height:'100%',width:`${100*t/episode.durationSeconds}%`,background:G.green}}/></div>
  <div style={{position:'absolute',left:70,right:70,top:1757,display:'flex',justifyContent:'space-between',fontSize:14,letterSpacing:1.3,color:G.muted}}><span>THE GIFT-CARD SECRET</span><span>{scene.label.replace(/^\d+ \/ /,'')}</span></div>
  <Audio src={staticFile(episode.assets.music)} volume={f=>{const time=f/fps,v=storyTime(time,episode);return (.52+.16*ease(v,94,1.5)*(1-ease(v,104,1)))*ease(time,0,1.3)*(1-ease(time,episode.durationSeconds-2.5,2.5));}}/>
  {episode.soundEvents.map((cue,i)=><Sequence key={i} from={Math.round(audioTime(cue.at,episode)*fps)} durationInFrames={Math.round(fps*1.4)}><Audio src={staticFile(`audio/giftcard/${cue.sound}.wav`)} volume={.36}/></Sequence>)}
  {episode.narration.src&&<Audio src={staticFile(episode.narration.src)} volume={1}/>}
 </AbsoluteFill>;
};
