import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SlapFace, type FacePhase} from './SlapFace';
import {SlapHand, type HandPhase} from './SlapHand';
import {slapTimeline, type SlapKeyframe} from './slapTimeline';

export type StageMode='hook'|'angular'|'force'|'wet'|'finale'|'loop';
export type StageOverlay='torso'|'rotation'|'force'|'water'|'contact';
type Props={mode?:StageMode;hand?:HandPhase;face?:FacePhase;hitAt?:number;frameOffset?:number;speed?:number;wet?:boolean;pullback?:boolean;zoom?:boolean;overlays?:StageOverlay[];timeline?:SlapKeyframe[];cameraX?:number;cameraY?:number;cameraScale?:number};

export const SlapStage: React.FC<Props> = ({mode='hook',hand='freeze',face='neutral',hitAt=0,frameOffset=0,speed=1,wet=false,pullback=false,zoom=false,overlays=[],timeline,cameraX=0,cameraY=0,cameraScale=1.3}) => {
  const frame=useCurrentFrame()+frameOffset;
  const scale=pullback?interpolate(frame,[0,70],[cameraScale,1.05],{extrapolateRight:'clamp'}):zoom?interpolate(frame,[0,75],[cameraScale,1.55],{extrapolateRight:'clamp'}):cameraScale;
  const pose=timeline?slapTimeline(frame,timeline,speed):undefined;
  const faceState=pose?.faceState??face;
  const handPos=pose?.handPos;
  const handRot=pose?.handRot;
  const t=frame*speed;
  const rotation=interpolate(t,[0,60,140,220],[0,-18,18,0],{extrapolateRight:'clamp'});
  const forceLength=interpolate(t,[0,240],[130,460],{extrapolateRight:'clamp'});
  const waterStretch=interpolate(t,[0,60,68,72],[26,105,3,3],{extrapolateRight:'clamp'});
  return <div data-stage-mode={mode} style={{position:'absolute',inset:0,overflow:'visible',transform:`translate(${cameraX}px,${cameraY}px) scale(${scale})`,transformOrigin:zoom?'58% 48%':'50% 50%'}}>
    {overlays.includes('torso')&&<div style={{position:'absolute',left:'38%',top:'30%',width:250,height:300,opacity:.3,zIndex:1}}><svg width="250" height="300" viewBox="0 0 250 300"><path d="M125 20 Q64 28 58 91 L30 287 H220 L192 91 Q186 28 125 20Z" fill="#8ba1b5" stroke="#d7e5f2" strokeWidth="5"/><path d="M70 105Q125 134 180 105M57 146Q125 175 193 146M45 190Q125 220 205 190" stroke="#334a5e" strokeWidth="8" fill="none"/><path d="M125 31V250" stroke="#e7c767" strokeWidth="5" strokeDasharray="10 10"/></svg></div>}
    {overlays.includes('rotation')&&<div style={{position:'absolute',left:'42%',top:'34%',font:'900 104px Arial',color:'#83d9e9',transform:`rotate(${rotation}deg)`,textShadow:'0 4px 20px #000',zIndex:2}}>↻</div>}
    {overlays.includes('force')&&<div style={{position:'absolute',left:'42%',top:'58%',width:480,height:58,zIndex:2}}><svg width="480" height="58" viewBox="0 0 480 58"><path d={`M0 34H${forceLength}`} stroke="#ff7869" strokeWidth="9" strokeLinecap="round"/><path d={`M${forceLength-28} 12L${forceLength} 34L${forceLength-28} 56`} fill="none" stroke="#ff7869" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/><text x="4" y="20" fill="#ffe4d7" fontSize="16" fontWeight="bold">FORCE VECTOR</text></svg></div>}
    {overlays.includes('water')&&<div style={{position:'absolute',left:'60%',top:'43%',width:260,height:100,zIndex:4,pointerEvents:'none'}}><svg width="260" height="100" viewBox="0 0 260 100"><path d={`M4 25 Q130 ${waterStretch} 256 25`} fill="none" stroke="#83f1f5" strokeWidth="7"/><path d={`M4 25 Q130 ${waterStretch+9} 256 25`} fill="none" stroke="#fff" strokeWidth="2" opacity=".9"/><circle cx="130" cy={waterStretch+18} r="7" fill="#9afaff"/></svg></div>}
    {overlays.includes('contact')&&<div style={{position:'absolute',left:'65%',top:'43%',width:130,height:130,border:'5px solid #6ef3f5',borderRadius:'50%',boxShadow:'0 0 32px #54e8ef',opacity:.75,zIndex:2,pointerEvents:'none'}}/>}
    <SlapFace phase={faceState} hitAt={hitAt} frameOffset={frameOffset}/><SlapHand phase={pose?'freeze':hand} position={handPos} rotation={handRot} speed={speed} wet={wet} frameOffset={frameOffset}/>
  </div>;
};
