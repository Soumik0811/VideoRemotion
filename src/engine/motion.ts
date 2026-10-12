import {interpolate, spring} from 'remotion';
export const clamp01 = (n:number) => Math.max(0,Math.min(1,n));
export const progress = (frame:number, start:number, frames:number) =>
  interpolate(frame,[start,start+frames],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const pop = (frame:number, fps:number, delay=0) =>
  spring({fps,frame:Math.max(0,frame-delay),config:{damping:15, stiffness:150,mass:0.7}}) * (frame<delay?0:1);
export const drift = (frame:number, offset=0, amplitude=8) => Math.sin(frame/13+offset)*amplitude;
