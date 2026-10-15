import React from 'react';
import {BakerCharacter} from '../../bakery/components/BakerCharacter';
import {BakerAction} from '../../bakery/types';
import {GiftEpisode,Role} from '../types';
import {GiftCard} from './Assets';
import {ease,mix} from '../theme';

const gestures:Record<Role,{at:number;action:BakerAction}[]>={
 explainer:[{at:0,action:'surprised'},{at:2,action:'point'},{at:8.7,action:'confused'},{at:11.4,action:'talk'},{at:18,action:'point'},{at:27,action:'idle'},{at:36,action:'surprised'},{at:40.2,action:'point'},{at:46,action:'confused'},{at:53,action:'point'},{at:58,action:'scratch'},{at:63,action:'point'},{at:78,action:'talk'},{at:84,action:'point'},{at:92.5,action:'happy'},{at:94.5,action:'surprised'},{at:97,action:'point'},{at:105,action:'talk'},{at:109,action:'point'},{at:119,action:'confused'},{at:125,action:'point'},{at:132.4,action:'wave'}],
 customer:[{at:0,action:'idle'},{at:27.3,action:'walk'},{at:28.5,action:'money'},{at:32.9,action:'receive'},{at:34,action:'happy'},{at:126,action:'money'},{at:130,action:'confused'}],
 barista:[{at:0,action:'happy'},{at:5,action:'point'},{at:27,action:'wave'},{at:32.8,action:'receive'},{at:36,action:'point'},{at:41,action:'happy'},{at:49,action:'receive'},{at:53,action:'point'},{at:94,action:'surprised'},{at:98,action:'point'},{at:101,action:'happy'},{at:129,action:'receive'}],
 friend:[{at:49,action:'money'},{at:51.5,action:'receive'},{at:54,action:'happy'},{at:57,action:'scratch'},{at:59,action:'confused'},{at:61,action:'worried'}],
 analyst:[{at:11,action:'point'},{at:19,action:'happy'},{at:63,action:'point'},{at:70.8,action:'talk'},{at:75,action:'point'},{at:79,action:'confused'},{at:82,action:'point'},{at:90.5,action:'surprised'},{at:92,action:'happy'},{at:105,action:'point'},{at:115,action:'happy'}],
};
const positions:{at:number;roles:Partial<Record<Role,number>>}[]=[
 {at:0,roles:{explainer:105,barista:710}},{at:11,roles:{explainer:105,analyst:710}},
 {at:27,roles:{customer:160,barista:710}},{at:36,roles:{explainer:105,barista:710}},
 {at:49,roles:{friend:160,barista:710}},{at:56,roles:{explainer:105,friend:710}},
 {at:63,roles:{explainer:105,analyst:710}},{at:94,roles:{explainer:105,barista:710}},
 {at:105,roles:{explainer:105,analyst:710}},{at:119,roles:{explainer:105}},
 {at:125.8,roles:{explainer:65,customer:418}},{at:129,roles:{explainer:65,customer:418,barista:760}},
 {at:132.4,roles:{explainer:425}},
];
export const CastLayer:React.FC<{t:number;episode:GiftEpisode}>=({t,episode})=><g>
 {(Object.keys(episode.characters) as Role[]).map(role=>{
  const c=episode.characters[role];let x=positions[0].roles[role]??(role==='friend'||role==='customer'?160:710),opacity=positions[0].roles[role]===undefined?0:1;
  for(const state of positions.slice(1)){const p=ease(t,state.at,.85);if(p>0){const target=state.roles[role];x=mix(x,target??x,p);const visibility=target===undefined?ease(t,state.at,.27):ease(t,state.at+.27,.5);opacity=mix(opacity,target===undefined?0:1,visibility);}}
  if(opacity<.001)return null;
  const characters={oliver:c,noah:c};
  return <g key={role} opacity={opacity} transform={`translate(0 ${24*(1-opacity)})`}><BakerCharacter id={c.shape} characters={characters} t={t} x={x} y={1092} scale={.94} actions={gestures[role]} costume={c.costume} handProp={role==='customer'||role==='friend'?<GiftCard scale={.3} amount={role==='friend'&&t>53?'$6':'$20'}/>:undefined}/></g>;
 })}
</g>;
