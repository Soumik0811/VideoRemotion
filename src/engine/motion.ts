import {Easing, interpolate, spring} from 'remotion';
export const clamp01 = (n:number) => Math.max(0,Math.min(1,n));
export const progress = (frame:number, start:number, frames:number) =>
  interpolate(frame,[start,start+frames],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const pop = (frame:number, fps:number, delay=0) =>
  spring({fps,frame:Math.max(0,frame-delay),config:{damping:15, stiffness:150,mass:0.7}}) * (frame<delay?0:1);
export const drift = (frame:number, offset=0, amplitude=8) => Math.sin(frame/13+offset)*amplitude;

// Generic seconds-based (t) choreography helpers shared across episodes.
export const ease = (t:number, start:number, duration:number) => interpolate(t,[start,start+duration],[0,1],{easing:Easing.inOut(Easing.cubic),extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const appear = (t:number,start:number,duration=.6) => interpolate(t,[start,start+duration],[0,1],{easing:Easing.out(Easing.cubic),extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const windowAt = (t:number,start:number,end:number,fade=.6) => appear(t,start,fade)*(1-ease(t,end-fade,fade));
export const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
export const curve=(p:number,a:[number,number],b:[number,number],c:[number,number])=>({x:(1-p)**2*a[0]+2*(1-p)*p*b[0]+p*p*c[0],y:(1-p)**2*a[1]+2*(1-p)*p*b[1]+p*p*c[1]});

