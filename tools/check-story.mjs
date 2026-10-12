import fs from 'node:fs';
const path=new URL('../src/data/episode.json',import.meta.url);
const e=JSON.parse(fs.readFileSync(path,'utf8'));
if(!Array.isArray(e.scenes)||e.scenes.length===0) throw Error('Missing scenes');
let sec=0;
for(const [i,s] of e.scenes.entries()) {
  if(s.seconds<=0 || !Array.isArray(s.captions))throw Error('Invalid scene '+i);
  if(s.captions.some(c=>c.at<0||c.at>=s.seconds))throw Error('Caption out of bounds at scene '+i);
  sec+=s.seconds;
}
console.log(`Valid episode: ${e.scenes.length} scenes / ${sec}s / ${e.width}x${e.height} @ ${e.fps}fps`);
