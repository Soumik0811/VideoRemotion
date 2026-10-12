import React from 'react';
import {Composition} from 'remotion';
import episodeJSON from './data/episode.json';
import {Episode} from './types';
import {Explainer} from './Explainer';

const episode=episodeJSON as Episode;
const durationInFrames=episode.scenes.reduce((n,s)=>n+Math.round(s.seconds*episode.fps),0);
export const RemotionRoot:React.FC=()=>
  <Composition id="FinanceExplainer" component={Explainer} width={episode.width} height={episode.height} fps={episode.fps} durationInFrames={durationInFrames} defaultProps={{episode}}/>;
