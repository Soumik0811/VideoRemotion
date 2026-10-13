import React from 'react';
import {BeeBopEpisode} from '../types';
import {B, SANS, appear, ease} from '../engine/motion';

const EMPHASIS = /^(radioactive|radiation|potassium|potassium-40|banana|bananas|truck|truckload|alarm|detectors?|tiny|harmless|you're|you|body|walking)[.,!?…'"]*/i;

export const SubtitleOverlay: React.FC<{t: number; episode: BeeBopEpisode}> = ({t, episode}) => {
  const cue = episode.captions.find(c => t >= c.start && t < c.end);
  if (!cue) return null;
  const alpha = appear(t, cue.start, .12) * (1 - ease(t, cue.end - .1, .1));
  return <div style={{position:'absolute', left:80, right:80, top:1505, height:185, display:'flex', alignItems:'center', justifyContent:'center', opacity:alpha, transform:`translateY(${(1-appear(t,cue.start,.2))*7}px)`}}>
    <div style={{fontFamily:SANS, fontSize:43, lineHeight:1.3, fontWeight:700, color:B.ink, textAlign:'center', maxWidth:920}}>
      {cue.text.split(' ').map((word,i)=>{const em=EMPHASIS.test(word);return <React.Fragment key={i}><span style={{color:em?B.terra:undefined}}>{word}</span>{' '}</React.Fragment>;})}
    </div>
  </div>;
};
