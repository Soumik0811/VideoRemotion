import React from 'react';
import {Sequence, useVideoConfig} from 'remotion';
import type {Scene} from './types';
import {Transition} from './transitions';
export const SceneRenderer: React.FC<{scenes: Scene[]}> = ({scenes}) => { const {fps}=useVideoConfig(); return <>{scenes.map((s,i)=>{ const Background=s.background; return <Sequence key={i} from={Math.round(s.start*fps)} durationInFrames={Math.max(1,Math.round((s.end-s.start)*fps))}><Transition type={s.transition} duration={12}><Background/>{s.props?.map((p,j)=>{ const Prop=p.component; return <Sequence key={j} from={Math.round((p.at-s.start)*fps)} durationInFrames={Math.round((p.duration??s.end-p.at)*fps)}><Prop {...p.props}/></Sequence>; })}</Transition></Sequence>; })}</>; };
