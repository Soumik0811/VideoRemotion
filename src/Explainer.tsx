import React from 'react';
import {AbsoluteFill,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {Episode} from './types';
import {Stage} from './components/Stage';
import {CaptionStrip} from './components/Caption';
import {SceneRenderer} from './scenes/SceneRenderer';

export const Explainer:React.FC<{episode:Episode}>=({episode})=>{
 const frame=useCurrentFrame();
 const duration=episode.scenes.reduce((n,s)=>n+Math.round(s.seconds*episode.fps),0);
 let start=0;
 return <AbsoluteFill>
   {episode.scenes.map((scene,i)=>{
     const from=start; const frames=Math.round(scene.seconds*episode.fps);start+=frames;
     return <Sequence key={`${i}-${scene.type}`} from={from} durationInFrames={frames}>
        <Stage brand={episode.brand} series={episode.series} eyebrow={scene.eyebrow} progress={frame/duration}>
          <SceneRenderer scene={scene}/>
          <CaptionStrip captions={scene.captions} fps={episode.fps} seconds={scene.seconds}/>
        </Stage>
     </Sequence>
   })}
   <Audio src={staticFile('audio/narration.wav')} volume={1}/>
   <Audio src={staticFile('audio/music.wav')} volume={0.22}/>
 </AbsoluteFill>;
};
