import fs from 'node:fs';
const episode=JSON.parse(fs.readFileSync(new URL('../src/data/bakery-episode.json',import.meta.url),'utf8'));
const out=new URL('../out/episode-01/',import.meta.url);
fs.mkdirSync(out,{recursive:true});
const stamp=t=>{const ms=Math.round(t*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;};
fs.writeFileSync(new URL('narration.txt',out),episode.narration.text+'\n');
fs.writeFileSync(new URL('captions.srt',out),episode.captions.map((c,i)=>`${i+1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n'));
fs.writeFileSync(new URL('timing.json',out),JSON.stringify({notice:'Editorial estimates, not audio-aligned. Replace timings after recording the exact script.',duration:episode.durationSeconds,scenes:episode.scenes,sentences:episode.narration.sentences,captions:episode.captions},null,2)+'\n');
console.log(`Exported exact narration and ${episode.captions.length} caption groups (${episode.durationSeconds}s, estimated timing).`);
