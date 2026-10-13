import React from 'react';
import {Composition} from 'remotion';
import episodeJSON from './data/episode.json';
import {Episode} from './types';
import {Explainer} from './Explainer';
import bakeryJSON from './data/bakery-episode.json';
import {BakeryEpisode} from './bakery/BakeryEpisode';
import {BakeryEpisode as BakeryEpisodeType} from './bakery/types';
import beebopJSON from './data/beebop-episode.json';
import {BeeBopEpisode} from './beebop/BeeBopEpisode';
import {BeeBopEpisode as BeeBopEpisodeType} from './beebop/types';

const episode=episodeJSON as Episode;
const durationInFrames=episode.scenes.reduce((n,s)=>n+Math.round(s.seconds*episode.fps),0);
const bakery=bakeryJSON as BakeryEpisodeType;
const beebop=beebopJSON as BeeBopEpisodeType;
export const RemotionRoot:React.FC=()=> <>
  <Composition id="BeeBopRadioactiveBanana" component={BeeBopEpisode} width={beebop.width} height={beebop.height} fps={beebop.fps} durationInFrames={Math.round(beebop.durationSeconds*beebop.fps)} defaultProps={{episode:beebop}} calculateMetadata={({props})=>({durationInFrames:Math.round(props.episode.durationSeconds*props.episode.fps),fps:props.episode.fps,width:props.episode.width,height:props.episode.height})}/>
  <Composition id="BakeryEpisode01" component={BakeryEpisode} width={bakery.width} height={bakery.height} fps={bakery.fps} durationInFrames={Math.round(bakery.durationSeconds*bakery.fps)} defaultProps={{episode:bakery}} calculateMetadata={({props})=>({durationInFrames:Math.round(props.episode.durationSeconds*props.episode.fps),fps:props.episode.fps,width:props.episode.width,height:props.episode.height})}/>
  <Composition id="FinanceExplainer" component={Explainer} width={episode.width} height={episode.height} fps={episode.fps} durationInFrames={durationInFrames} defaultProps={{episode}}/>
</>;
