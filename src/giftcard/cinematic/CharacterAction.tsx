import React from 'react';
import {GiftEpisode, Role} from '../types';
import {G} from '../theme';
import {Point, elbowFor, point} from './motion';

export type CharacterState = {
  role: Role; x: number; y: number; scale?: number; face?: 1|-1;
  left?: Point; right?: Point; walk?: number; expression?: 'calm'|'happy'|'surprised'|'thinking';
  tilt?: number; look?: number; back?: boolean;
};
const breath = (t: number) => Math.sin(t*2.1)*1.4;
const hands = (s: CharacterState, t: number) => ({
  left: s.left ?? point(-73 + Math.sin(t*7)*18*(s.walk??0), -156),
  right: s.right ?? point(73 - Math.sin(t*7)*18*(s.walk??0), -156),
});
/** This exact conversion is shared by the rig and every held prop. */
export const handPosition = (s: CharacterState, side: 'left'|'right', t: number): Point => {
  const h = hands(s,t)[side], scale = s.scale ?? 1;
  return {x: s.x+h.x*scale*(s.face??1), y: s.y+(h.y+breath(t))*scale};
};

export const CharacterAction: React.FC<{state: CharacterState; t: number; episode: GiftEpisode; opacity?:number;armsOnly?:boolean}> = ({state:s,t,episode,opacity=1,armsOnly=false}) => {
  const c=episode.characters[s.role], h=hands(s,t), walking=s.walk??0;
  const phase=t*7, lift=breath(t), expression=s.expression??'calm';
  const blink=Math.abs(((t+(s.role==='friend'?.7:0))%4.7)-3.8)<.11 ? .12 : 1;
  const apron=s.role==='barista', casual=s.role!=='barista';
  const shirt=apron?G.white:c.color, trouser=s.role==='customer'?'#34454E':'#74604E';
  const arm=(side:'left'|'right')=>{
    const shoulder=point(side==='left'?-44:44,-271), hand=h[side];
    const elbow=elbowFor(shoulder,hand,side==='left'?-1:1);
    return <g strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${shoulder.x} ${shoulder.y}L${elbow.x} ${elbow.y}L${hand.x} ${hand.y}`} fill="none" stroke="#4C4335" strokeWidth="31"/>
      <path d={`M${shoulder.x} ${shoulder.y}L${elbow.x} ${elbow.y}L${hand.x} ${hand.y}`} fill="none" stroke={c.skin} strokeWidth="26"/>
      <path d={`M${shoulder.x} ${shoulder.y}L${elbow.x} ${elbow.y}`} fill="none" stroke={shirt} strokeWidth="32"/>
      <circle cx={hand.x} cy={hand.y} r="16" fill={c.skin} stroke="#A66F5222" strokeWidth="2"/>
      <path d={`M${hand.x+7} ${hand.y-8}q12-7 8 7`} fill="none" stroke={c.skin} strokeWidth="10"/>
    </g>;
  };
  if(armsOnly)return <g transform={`translate(${s.x} ${s.y}) scale(${(s.scale??1)*(s.face??1)} ${s.scale??1}) translate(0 ${lift})`}>{arm('left')}{arm('right')}</g>;
  return <g opacity={opacity} transform={`translate(${s.x} ${s.y}) scale(${(s.scale??1)*(s.face??1)} ${s.scale??1})`}>
    <ellipse cy="8" rx="82" ry="15" fill="#25382C20"/>
    {[0,1].map(i=>{
      const p=phase+i*Math.PI, hip=i?23:-23;
      const footX=hip+Math.sin(p)*39*walking, footY=-Math.max(0,Math.cos(p))*18*walking;
      const kneeX=hip+Math.sin(p-.5)*21*walking;
      return <g key={i}><path d={`M${hip} -162Q${kneeX} -90 ${footX} ${footY-15}`} fill="none" stroke={i?trouser:'#5A5148'} strokeWidth="39" strokeLinecap="round"/>
        <path d={`M${footX-17} ${footY-24}q18-6 31 4l19 10q7 14-7 15h-44q-8-7 1-29Z`} fill="#3D3934"/><path d={`M${footX-17} ${footY+5}h58`} stroke="#BFAE90" strokeWidth="4"/></g>;
    })}
    <g transform={`translate(0 ${lift})`}>
      {arm('left')}
      <path d="M-46-284Q0-302 46-284L63-169Q0-143-62-169Z" fill={shirt} stroke="#4C4335" strokeWidth="3"/>
      {casual&&<><path d="M-19-289Q0-274 20-289L16-165H-17Z" fill={G.white}/><path d="M-22-286L-33-252L-17-241M22-286L34-252L18-241" fill="none" stroke="#FFFFFF50" strokeWidth="3"/>
        <rect x="32" y="-237" width="18" height="19" rx="2" fill="#FFFFFF25"/>{s.role==='analyst'&&<path d="M-5-276h10l6 67-11 12-11-12Z" fill="#35584C"/>}</>}
      {apron&&<><path d="M-27-284L-23-251H23L27-284" fill="none" stroke={c.color} strokeWidth="12"/><path d="M-31-261H31L50-164Q0-149-50-164Z" fill={c.color}/><path d="M-18-205q18 10 37 0v27q-18 10-37 0Z" fill="#FFFFFF22"/><rect x="7" y="-243" width="31" height="12" rx="3" fill={G.white}/><path d="M12-237h19" stroke="#355444" strokeWidth="2"/></>}
      <rect x="-15" y="-318" width="30" height="38" rx="12" fill={c.skin}/>
      <g transform={`rotate(${s.tilt??Math.sin(t*.9)*1.2} 0 -306)`}>
        <ellipse cx="-56" cy="-355" rx="10" ry="16" fill={c.skin}/><ellipse cx="56" cy="-355" rx="10" ry="16" fill={c.skin}/>
        <path d="M-55-375Q-53-419 0-418Q57-417 56-371L51-337Q44-303 0-301Q-46-306-52-339Z" fill={c.skin} stroke="#A77958" strokeWidth="2.5"/>
        <path d={s.role==='friend'?'M-55-350Q-74-411-28-426Q29-444 57-400L60-339L45-355L39-386Q-5-362-26-386L-43-361Z':'M-55-354Q-75-407-31-426Q22-446 54-409L61-373L46-364L35-393Q-6-374-29-393L-45-365Z'} fill={c.hair}/>
        {apron&&<><path d="M-59-387Q-56-434 0-435Q52-434 62-387Z" fill={c.color}/><path d="M-60-385Q0-404 61-389L83-376Q32-365-20-381Z" fill="#214C3D"/><circle cy="-411" r="11" fill={G.white}/></>}
        {!s.back&&<>
          <g fill="none" stroke="#42372E" strokeWidth="4" strokeLinecap="round"><path d={`M-36 ${expression==='surprised'?-382:-375}q12 ${expression==='thinking'?-12:-6} 23 0`}/><path d={`M14 ${expression==='surprised'?-382:-375}q12 ${expression==='thinking'?3:-6} 24 0`}/></g>
          <g transform={`translate(${s.look??0} -356) scale(1 ${blink})`}><ellipse cx="-25" rx="5" ry="7" fill="#303931"/><ellipse cx="26" rx="5" ry="7" fill="#303931"/><circle cx="-23" cy="-2" r="1.4" fill="white"/><circle cx="28" cy="-2" r="1.4" fill="white"/></g>
          {s.role==='analyst'&&<g stroke="#4E493F" fill="none" strokeWidth="3"><circle cx="-25" cy="-356" r="16"/><circle cx="26" cy="-356" r="16"/><path d="M-9-356H10M-42-358l-10-4M42-358l10-4"/></g>}
          <path d="M1-355l-5 16q7 5 12-1" fill="none" stroke="#AD7957" strokeWidth="2.5" strokeLinecap="round"/>
          {expression==='surprised'?<ellipse cy="-320" rx="8" ry="11" fill="#513C32"/>:<path d={`M-16-324Q1 ${expression==='happy'?-304:expression==='thinking'?-331:-315} 19-325`} fill={expression==='happy'?G.white:'none'} stroke="#634435" strokeWidth="3" strokeLinecap="round"/>}
          <ellipse cx="-37" cy="-335" rx="10" ry="5" fill="#B8665230"/><ellipse cx="38" cy="-335" rx="10" ry="5" fill="#B8665230"/>
        </>}
        {s.back&&<path d="M-51-386Q0-437 52-384L48-329Q0-316-48-335Z" fill={c.hair}/>}
      </g>
      {arm('right')}
    </g>
  </g>;
};
