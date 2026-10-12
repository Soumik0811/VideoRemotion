// Render representative frames through one bundle/browser for repeatable visual QA.
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill} from '@remotion/renderer';
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'out/episode-02/review');
fs.mkdirSync(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.tsx'),onProgress:()=>{}});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
try {
 const composition=await selectComposition({serveUrl,id:'GiftCardBreakage02',puppeteerInstance:browser});
 for(const seconds of [3,8,15,23,28,34,38,43,47,50,54,57,60.5,66,73,82,87,92.8,98,102,109,117,124,128,131,135]) {
   await renderStill({serveUrl,composition,frame:Math.round(seconds*30),puppeteerInstance:browser,output:path.join(out,`${String(seconds).padStart(4,'0')}.png`)});
   console.log(`Inspected frame artifact: ${seconds}s`);
 }
}finally{await browser.close({silent:true});}
