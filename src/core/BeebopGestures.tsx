import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BeebopRig} from './Beebop';
import {GESTURES, RIG, blendExpression, type GestureName} from './beebop.config';

const names = Object.keys(GESTURES) as GestureName[];

export const BeebopGestures: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  return <AbsoluteFill style={{background:'#0F1A44', display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gridTemplateRows:'repeat(2, 1fr)', padding:30, gap:12}}>
    {names.map((name) => { const g=GESTURES[name]; return <div key={name} style={{position:'relative', color:'#F4EFE6', font:'700 24px sans-serif', textAlign:'center'}}><div>{name}</div><div style={{height:'90%'}}><BeebopRig frame={frame} fps={fps} hands={g.hands} expression={blendExpression(g.expression,g.expression,1)} body={{tuck:g.tuck,flap:g.flap,lift:g.hover}}/></div></div>; })}
  </AbsoluteFill>;
};
