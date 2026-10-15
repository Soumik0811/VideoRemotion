import type {GiftEpisode} from '../types';
import storyboard from './storyboard.json';

/** Map every sentence boundary, including pauses. Measured timestamps retime actions and SFX. */
export const mapTime=(time:number,from:number[],to:number[]):number=>{
  if(from.length!==to.length)throw new Error('Narration timing anchors must match the finalized script');
  const i=from.findIndex((value,index)=>index>0&&time<=value);
  if(i<0)return to[to.length-1];
  const p=Math.max(0,Math.min(1,(time-from[i-1])/(from[i]-from[i-1])));
  return to[i-1]+(to[i]-to[i-1])*p;
};
const reference=[0,...storyboard.referenceSentences.flatMap(s=>[s.start,s.end]),storyboard.referenceDuration];
const measured=(e:GiftEpisode)=>[0,...e.narration.sentences.flatMap(s=>[s.start,s.end]),e.durationSeconds];
export const storyTime=(time:number,episode:GiftEpisode)=>mapTime(time,measured(episode),reference);
export const audioTime=(time:number,episode:GiftEpisode)=>mapTime(time,reference,measured(episode));
