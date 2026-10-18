import React from 'react';
import {Composition} from 'remotion';
import episodeJSON from './data/episode.json';
import {Episode} from './types';
import {Explainer} from './Explainer';
import bakeryJSON from './data/bakery-episode.json';
import {BakeryEpisode} from './bakery/BakeryEpisode';
import {BakeryEpisode as BakeryEpisodeType} from './bakery/types';
import giftcardJSON from './data/giftcard-episode.json';
import {GiftCardEpisode} from './giftcard/GiftCardEpisode';
import {GiftEpisode} from './giftcard/types';
import unitEconomicsJSON from './data/unit-economics-episode.json';
import {UnitEconomicsEpisode} from './episodes/unitEconomics/UnitEconomicsEpisode';
import {LeftDigitEffect, LEFT_DIGIT_DURATION} from './episodes/leftDigitEffect/LeftDigitEffect';
import {WawaEsop, WAWA_ESOP_DURATION} from './episodes/wawaEsop/WawaEsop';

const episode=episodeJSON as Episode;
const durationInFrames=episode.scenes.reduce((n,s)=>n+Math.round(s.seconds*episode.fps),0);
const bakery=bakeryJSON as BakeryEpisodeType;
const giftcard=giftcardJSON as GiftEpisode;
const unitEconomics=unitEconomicsJSON as GiftEpisode;
export const RemotionRoot:React.FC=()=> <>
  <Composition id="GiftCardBreakage02" component={GiftCardEpisode} width={giftcard.width} height={giftcard.height} fps={giftcard.fps} durationInFrames={Math.round(giftcard.durationSeconds*giftcard.fps)} defaultProps={{episode:giftcard}} calculateMetadata={({props})=>({durationInFrames:Math.round(props.episode.durationSeconds*props.episode.fps),fps:props.episode.fps,width:props.episode.width,height:props.episode.height})}/>
  <Composition id="BakeryEpisode01" component={BakeryEpisode} width={bakery.width} height={bakery.height} fps={bakery.fps} durationInFrames={Math.round(bakery.durationSeconds*bakery.fps)} defaultProps={{episode:bakery}} calculateMetadata={({props})=>({durationInFrames:Math.round(props.episode.durationSeconds*props.episode.fps),fps:props.episode.fps,width:props.episode.width,height:props.episode.height})}/>
  <Composition id="FinanceExplainer" component={Explainer} width={episode.width} height={episode.height} fps={episode.fps} durationInFrames={durationInFrames} defaultProps={{episode}}/>
  <Composition id="UnitEconomics03" component={UnitEconomicsEpisode} width={unitEconomics.width} height={unitEconomics.height} fps={unitEconomics.fps} durationInFrames={Math.ceil(unitEconomics.durationSeconds*unitEconomics.fps)} defaultProps={{episode:unitEconomics}} calculateMetadata={({props})=>({durationInFrames:Math.ceil(props.episode.durationSeconds*props.episode.fps),fps:props.episode.fps,width:props.episode.width,height:props.episode.height})}/>
  <Composition id="LeftDigitEffect04" component={LeftDigitEffect} width={1080} height={1920} fps={30} durationInFrames={LEFT_DIGIT_DURATION}/>`r`n  <Composition id="WawaEsop05" component={WawaEsop} width={1080} height={1920} fps={30} durationInFrames={WAWA_ESOP_DURATION}/>
</>;
