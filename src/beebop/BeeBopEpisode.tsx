import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BeeBopEpisode as EpisodeType, BeebopPose} from './types';
import {B, SANS, SERIF, appear, ease, mix, windowAt} from './engine/motion';
import {ObjectMotion} from '../engine/ObjectMotion';
import {BeeBopCharacter} from './components/BeeBopCharacter';
import {Kitchen, AtomicField, Street, Studio, CameraRig} from './components/Environment';
import {Banana, BananaBunch, Atom, RadiationSymbol, Detector, Truck, Guard, Gauge, Particle, Sparkle} from './components/ScienceProps';
import {SubtitleOverlay} from './components/SubtitleOverlay';

const Badge: React.FC<{x:number; y:number; label:string; value:string; color?:string; width?:number}> = ({x, y, label, value, color=B.green, width=300}) => (
  <g transform={`translate(${x} ${y})`} fontFamily={SANS}>
    <rect x={-width/2+4} y={-43} width={width} height={112} rx={18} fill="#6B584318"/>
    <rect x={-width/2} y={-49} width={width} height={112} rx={18} fill={B.paper} stroke="#DDD0BA" strokeWidth={2}/>
    <text y={-14} textAnchor="middle" fontSize={17} fill={B.muted} letterSpacing={1.2}>{label}</text>
    <text y={34} textAnchor="middle" fontSize={value.length>12?30:40} fontWeight="bold" fill={color}>{value}</text>
  </g>
);
const FactTag: React.FC<{x:number; y:number; text:string; color?:string}> = ({x, y, text, color=B.glow}) => (
  <g transform={`translate(${x} ${y})`} fontFamily={SANS}>
    <text textAnchor="middle" fontSize={30} fontWeight="bold" letterSpacing={2} fill={color}>{text}</text>
  </g>
);

const StoryWorld: React.FC<{t:number; episode:EpisodeType}> = ({t, episode}) => {
  const f = episode.facts;
  const chars = episode.character;
  const dive = ease(t, 4.8, 2) * (1 - ease(t, 11.2, 2));
  const alarmPush = ease(t, 19, .8) * (1 - ease(t, 26.5, 1));
  const zoom = mix(1, 2.25, dive) * mix(1, 1.06, alarmPush) * (1 + .01 * Math.sin(t/9));
  const cy = mix(500, 470, dive);
  const sHook = windowAt(t, 0, 5.2, .6);
  const sAtom = windowAt(t, 4.6, 12.6, .8);
  const sCp = windowAt(t, 12, 27.4, .8);
  const sSafe = windowAt(t, 27, 35.4, .8);
  const sYou = appear(t, 35, .8);
  const alarm = ease(t, 19, .6) * (1 - ease(t, 27, .6));
  const truckX = mix(-280, 600, ease(t, 12.4, 5));
  return <svg width="1080" height="1000" viewBox="0 0 1080 1000" style={{display:'block', overflow:'hidden'}}>
    <CameraRig cx={540} cy={cy} zoom={zoom}>
      {/* 01 · HOOK */}
      <g opacity={sHook}>
        <Kitchen t={t}/>
        <BeeBopCharacter characters={chars} t={t} x={280} y={300} scale={1.05} look={1} actions={[{at:0,pose:'idle'},{at:2.4,pose:'shocked'}]}/>
        <ObjectMotion t={t} at={[600,540]} kind="pop" start={1.2}><Banana scale={1.25}/></ObjectMotion>
        {[0,1,2,3].map(i=><Particle key={i} x={600+(i-1.5)*16} y={505} seed={i*.31} t={t}/>)}
        <g transform="translate(858 556)">
          <rect x={-46} y={-30} width={92} height={64} rx={10} fill={B.board} stroke={B.ink} strokeWidth={3}/>
          <rect x={-34} y={-20} width={68} height={26} rx={4} fill={B.boardSoft}/>
          <g opacity={ease(t,2.6,.4)}><circle cx={28} cy={26} r={7} fill={B.red} opacity={Math.sin(t*12)>0?1:.3}/></g>
          <RadiationSymbol x={0} y={-7} scale={.28} color={B.gold}/>
        </g>
        <g opacity={ease(t,3.2,.5)}><Badge x={600} y={250} label="SAY WHAT?" value="RADIOACTIVE" color={B.terra} width={340}/></g>
      </g>

      {/* 02 · POTASSIUM-40 */}
      <g opacity={sAtom}>
        <AtomicField t={t}/>
        <Atom x={540} y={470} scale={1.5} t={t} label={f.potassiumIsotope}/>
        <g opacity={ease(t,6.2,.6)}><FactTag x={540} y={760} text="POTASSIUM-40 DECAYS"/></g>
        <g opacity={ease(t,7.4,.6)}><Badge x={540} y={880} label="A SINGLE BANANA" value="~15 Bq" color={B.green} width={320}/></g>
      </g>

      {/* 03+04 · TRUCK → ALARM (one continuous scene, loops never restart) */}
      <g opacity={sCp}>
        <Street t={t}/>
        <Detector x={600} y={620} scale={.95} t={t} alarm={alarm}/>
        <Truck x={truckX} y={600} scale={.95} t={t} load={1}/>
        {[0,1,2].map(i=><ObjectMotion key={i} t={t} at={[560+i*40, 470-(i%2)*36]} kind="pop" start={25+i*.3}><BananaBunch scale={.55} count={3}/></ObjectMotion>)}
        <g opacity={appear(t,23.5,.5)}><Guard x={812} y={505} scale={.9} t={t} arms={ease(t,24.5,.6)}/></g>
        <BeeBopCharacter characters={chars} t={t} x={880} y={376} scale={.82} actions={[{at:12,pose:'present'},{at:19,pose:'shocked'},{at:24.5,pose:'laughing'}]}/>
        <g opacity={alarm}>
          <rect x={-200} y={-200} width={1480} height={1400} fill={B.red} opacity={.09*(.5+.5*Math.sin(t*8))}/>
          <FactTag x={540} y={210} text="ALARM! THOUSANDS OF BANANAS" color={B.red}/>
        </g>
      </g>

      {/* 05 · IS IT DANGEROUS? */}
      <g opacity={sSafe}>
        <Studio t={t}/>
        <BeeBopCharacter characters={chars} t={t} x={210} y={320} scale={1.0} actions={[{at:27,pose:'happy'},{at:30,pose:'explaining'}]}/>
        <ObjectMotion t={t} at={[470,560]} kind="pop" start={27.4}><Banana scale={1.35} bitten/></ObjectMotion>
        <Gauge x={740} y={560} scale={.72} value={.06} label="ONE BANANA" valueText="~15 Bq" tone={B.green}/>
        <Gauge x={985} y={560} scale={.98} value={1} label="TRUCKLOAD" valueText="MAX" tone={B.red}/>
        <g opacity={ease(t,33,.6)}><FactTag x={540} y={780} text="COMPLETELY HARMLESS" color={B.green}/></g>
      </g>

      {/* 06 · YOU'RE A WALKING BANANA */}
      <g opacity={sYou}>
        <Studio t={t}/>
        <BeeBopCharacter characters={chars} t={t} x={250} y={300} scale={1.05} actions={[{at:35,pose:'point'},{at:38.4,pose:'shocked'},{at:43.5,pose:'happy'},{at:46,pose:'laughing'}]}/>
        <g opacity={appear(t,38.4,.6)}>
          {[[330,360],[300,430],[360,470]].map((p,i)=><Atom key={i} x={p[0]} y={p[1]} scale={.34} t={t} label="" decay={0}/>)}
          <RadiationSymbol x={330} y={300} scale={.5} color={B.glow}/>
        </g>
        <g opacity={appear(t,38.4,.5)}><FactTag x={540} y={210} text="YOU'RE RADIOACTIVE TOO!" color={B.terra}/></g>
        <g opacity={appear(t,40.9,.5)}><Badge x={330} y={640} label="YOUR BODY HOLDS" value={f.bodyPotassiumLabel} color={B.green} width={330}/></g>
        <ObjectMotion t={t} at={[800,560]} kind="pop" start={43.6} dur={.9}><Banana scale={3.1} rotate={-12}/></ObjectMotion>
        <g opacity={appear(t,44.6,.6)}><Sparkle x={700} y={380} t={t} seed={1} size={1.4}/><Sparkle x={900} y={420} t={t} seed={3} size={1.1} color={B.glow}/></g>
        <g opacity={appear(t,45.8,.6)}><FactTag x={540} y={820} text="A WALKING BANANA!" color={B.amber}/></g>
      </g>
    </CameraRig>
  </svg>;
};

export const BeeBopEpisode: React.FC<{episode:EpisodeType}> = ({episode}) => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig(), t = frame/fps;
  const scene = episode.scenes.find(s => t >= s.start && t < s.end) ?? episode.scenes.at(-1)!;
  const titleFade = appear(t, scene.start, .55) * (scene.id==='you' ? 1 : 1 - ease(t, scene.end-.4, .4));
  return <AbsoluteFill style={{background:B.cream, color:B.ink, fontFamily:SANS}}>
    <div style={{position:'absolute', top:68, left:65, right:65, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div style={{display:'flex', alignItems:'center', gap:14}}>
        <svg width="44" height="44" viewBox="-30 -30 60 60"><RadiationSymbol color={B.terra}/></svg>
        <span style={{fontSize:21, fontWeight:700, letterSpacing:4}}>ODDLY LOGICAL</span>
      </div>
      <div style={{fontSize:17, letterSpacing:2, padding:'10px 15px', border:'1px solid #C9BDA7', borderRadius:30}}>SCIENCE, EXPLAINED</div>
    </div>
    <div style={{position:'absolute', top:154, left:65, right:65, opacity:titleFade, transform:`translateY(${10*(1-appear(t,scene.start,.7))}px)`}}>
      <div style={{fontSize:18, letterSpacing:3, color:scene.id==='alarm'||scene.id==='hook'?B.terra:B.green, fontWeight:700, marginBottom:18}}>{scene.label}</div>
      <div style={{fontFamily:SERIF, fontSize:scene.id==='you'?82:70, lineHeight:1.09, letterSpacing:-2.4, fontWeight:600, whiteSpace:'pre-line'}}>{scene.heading}</div>
    </div>
    <div style={{position:'absolute', top:435, left:0, width:1080, height:1000}}><StoryWorld t={t} episode={episode}/></div>
    <div style={{position:'absolute', top:1435, left:0, right:0, height:55, background:`linear-gradient(${B.cream}00, ${B.cream})`}}/>
    <SubtitleOverlay t={t} episode={episode}/>
    <div style={{position:'absolute', left:70, right:70, top:1734, display:'flex', gap:12}}>
      {episode.scenes.map(s=><div key={s.id} style={{height:4, background:'#DCD2BF', flex:s.end-s.start, borderRadius:8, overflow:'hidden'}}><div style={{height:'100%', width:`${Math.max(0,Math.min(1,(t-s.start)/(s.end-s.start)))*100}%`, background:B.green}}/></div>)}
    </div>
    <div style={{position:'absolute', left:70, right:70, top:1757, fontSize:15, letterSpacing:1.2, color:B.muted, display:'flex', justifyContent:'space-between'}}>
      <span>A STORY ABOUT POTASSIUM-40</span><span>BEEBOP / 01</span>
    </div>
    <Audio src={staticFile(episode.assets.music)} volume={f=>.5*ease(f/fps,0,1.5)*(1-ease(f/fps,episode.durationSeconds-2.5,2.5))}/>
    {episode.soundEvents.map((e,i)=><Sequence key={i} from={Math.round(e.at*fps)} durationInFrames={Math.round(fps*1.4)} premountFor={fps}><Audio src={staticFile(`audio/bakery/${e.sound}.wav`)} volume={.4}/></Sequence>)}
    {episode.narration.src && <Audio src={staticFile(episode.narration.src)} volume={1}/>}
  </AbsoluteFill>;
};
