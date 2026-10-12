import React from 'react';
import {BakeryEpisode} from '../types';
import {B,SANS,appear,ease} from '../engine/motion';

export const SubtitleOverlay:React.FC<{t:number;episode:BakeryEpisode}>=({t,episode})=>{
 const cue=episode.captions.find(c=>t>=c.start&&t<c.end);
 if(!cue)return null;
 const alpha=appear(t,cue.start,.12)*(1-ease(t,cue.end-.1,.1));
 return <div style={{position:'absolute',left:80,right:80,top:1505,height:185,display:'flex',alignItems:'center',justifyContent:'center',opacity:alpha,transform:`translateY(${(1-appear(t,cue.start,.2))*7}px)`}}>
  <div style={{fontFamily:SANS,fontSize:43,lineHeight:1.3,fontWeight:700,color:B.dark,textAlign:'center',maxWidth:900}}>
   {cue.text.split(' ').map((word,i)=>{const emphasis=/^(six|hundred|thousand|dollars|sixty|days|gross|profit|cash|flow)[.,…']*/i.test(word);return <React.Fragment key={i}><span style={{color:emphasis?B.green:undefined}}>{word}</span>{' '}</React.Fragment>})}
  </div>
 </div>;
};
