import {interpolate} from 'remotion';
import type {FacePhase} from './SlapFace';

export type SlapKeyframe = {t:number;handPos:{x:number;y:number};handRot:number;faceState:FacePhase};
export type SlapPose = {handPos:{x:number;y:number};handRot:number;faceState:FacePhase};

/** Evaluate scene-local keyframes; speed below 1 remaps stage time into slow motion. */
export const slapTimeline = (frame:number, keyframes:SlapKeyframe[], speed=1):SlapPose => {
  if(!keyframes.length)return {handPos:{x:0,y:0},handRot:0,faceState:'neutral'};
  const t=frame*speed;
  if(t<=keyframes[0].t)return keyframes[0];
  for(let i=1;i<keyframes.length;i++){
    const a=keyframes[i-1],b=keyframes[i];
    if(t<=b.t){const x=interpolate(t,[a.t,b.t],[a.handPos.x,b.handPos.x],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});const y=interpolate(t,[a.t,b.t],[a.handPos.y,b.handPos.y],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});const r=interpolate(t,[a.t,b.t],[a.handRot,b.handRot],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return {handPos:{x,y},handRot:r,faceState:t<b.t?a.faceState:b.faceState};}
  }
  return keyframes[keyframes.length-1];
};
