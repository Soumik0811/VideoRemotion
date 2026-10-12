import fs from 'node:fs';
const path=new URL('../src/data/episode.json',import.meta.url);
const episode=JSON.parse(fs.readFileSync(path,'utf8'));
let t=0;
const lines=[episode.title,'',...episode.scenes.flatMap((s,i)=>{
 const line=[`[${t}s – ${t+s.seconds}s] SCENE ${i+1} (${s.type})`,s.narration,''];t+=s.seconds;return line;
})];
fs.writeFileSync(new URL('../out/elevenlabs-script.txt',import.meta.url),lines.join('\n'));
console.log('Exported ElevenLabs script:',t,'seconds');
