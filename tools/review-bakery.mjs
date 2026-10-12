// Render representative frames through one bundle/browser for repeatable visual QA.
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'out/episode-01/review');
fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.tsx'),onProgress:()=>{}});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
try {
 const composition=await selectComposition({serveUrl,id:'BakeryEpisode01',puppeteerInstance:browser});
 for(const seconds of [2,8,12,15,16,22,26,27,31,35,40,44,45,46,51,54,57.8,59,60,65,69,73,78,79,84,89]) {
   await renderStill({serveUrl,composition,frame:Math.round(seconds*30),puppeteerInstance:browser,output:path.join(out,`${String(seconds).padStart(4,'0')}.png`)});
   console.log(`Inspected frame artifact: ${seconds}s`);
 }
}finally{await browser.close({silent:true});}
