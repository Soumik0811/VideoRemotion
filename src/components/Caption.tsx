import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';
import {Caption as CaptionData} from '../types';
import {C,FONT} from '../engine/theme';
export const CaptionStrip:React.FC<{captions:CaptionData[];fps:number;seconds:number}> = ({captions,fps,seconds})=>{
 const f=useCurrentFrame(); const t=f/fps;
 const index=captions.findIndex((v,i)=>t>=v.at&&(i===captions.length-1||t<captions[i+1].at));
 if(index<0)return null;
 const localFrames=f-captions[index].at*fps;
 const fade=interpolate(localFrames,[0,7],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <div style={{position:'absolute',left:65,right:65,bottom:126,minHeight:116,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',color:C.white,fontWeight:900,fontFamily:FONT,fontSize:43,lineHeight:1.24,letterSpacing:'-0.015em',opacity:fade,transform:`translateY(${(1-fade)*11}px)`}}>{captions[index].text}</div>
};
