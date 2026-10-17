import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
export const Transition: React.FC<{type?: string; duration: number; children: React.ReactNode}> = ({type='none', duration, children}) => { const f=useCurrentFrame(); const opacity=type==='fade'?interpolate(f,[0,duration],[0,1],{extrapolateRight:'clamp'}):1; const scale=type==='zoom'?interpolate(f,[0,duration],[1.08,1],{extrapolateRight:'clamp'}):1; return <div style={{opacity, transform:`scale(${scale})`, width:'100%',height:'100%'}}>{children}</div>; };
