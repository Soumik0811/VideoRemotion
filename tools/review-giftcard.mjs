// Render representative frames through one bundle/browser for repeatable visual QA.
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
const root=path.resolve(import.meta.dirname,'..');
const captionsHidden=process.argv.includes('--no-captions');
const inputProps=captionsHidden?{showCaptions:false}:{};
const out=path.join(root,'out/episode-02/v4-review',captionsHidden?'no-captions':'');
fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.tsx'),onProgress:()=>{}});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
try {
 const composition=await selectComposition({serveUrl,id:'GiftCardBreakage02',inputProps,puppeteerInstance:browser});
 const requested = process.argv.slice(2).filter(arg=>arg!=='--no-captions').map(Number);
 const times = requested.length ? requested : [3,8,15,23,28,30.7,32.7,35.8,38.5,42.7,43.3,47,50.4,52.8,54.4,57.2,58.7,59.8,60.9,62.4,65,69,72,76,79,84,89,93,98,103,109,117,124,127.5,130.5,135];
 for(const seconds of times) {
   await renderStill({serveUrl,composition,inputProps,frame:Math.round(seconds*30),puppeteerInstance:browser,output:path.join(out,`${String(seconds).padStart(4,'0')}.png`)});
   console.log(`Rendered review frame: ${seconds}s`);
 }
}finally{await browser.close({silent:true});}
