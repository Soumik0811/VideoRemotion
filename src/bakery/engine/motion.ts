import {Easing, interpolate} from 'remotion';
import {clamp01} from '../../engine/motion';
import {BakeryEpisode} from '../types';
export {clamp01};
export const ease = (t:number, start:number, duration:number) => interpolate(t,[start,start+duration],[0,1],{easing:Easing.inOut(Easing.cubic),extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const appear = (t:number,start:number,duration=.6) => interpolate(t,[start,start+duration],[0,1],{easing:Easing.out(Easing.cubic),extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const windowAt = (t:number,start:number,end:number,fade=.6) => appear(t,start,fade)*(1-ease(t,end-fade,fade));
export const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
export const money=(n:number)=>'$'+Math.round(n).toLocaleString('en-US');
export const curve=(p:number,a:[number,number],b:[number,number],c:[number,number])=>({x:(1-p)**2*a[0]+2*(1-p)*p*b[0]+p*p*c[0],y:(1-p)**2*a[1]+2*(1-p)*p*b[1]+p*p*c[1]});
export const B={cream:'#F7F1E4',sage:'#92AE85',green:'#55775E',mint:'#AEDBCD',terra:'#D68C73',dark:'#382F2A',muted:'#84756C',hills:'#DCE8CE',pavement:'#E9DAC4',gold:'#EBC16B',white:'#FFF9EE',glass:'#8DBBB9'};
export const SANS='"DejaVu Sans", sans-serif';
export const SERIF='"URW Bookman", Georgia, serif';
/** Stretch each scene's choreography to the editable scene boundaries. */
export const storyTime=(t:number,episode:BakeryEpisode)=>{
 const reference=[0,15,26,45,59,78,90];
 const index=episode.scenes.findIndex(s=>t>=s.start&&t<s.end);
 if(index<0)return t<=0?0:90;
 const scene=episode.scenes[index];
 return mix(reference[index],reference[index+1],clamp01((t-scene.start)/(scene.end-scene.start)));
};
