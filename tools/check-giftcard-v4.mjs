import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);
// Test the exact animation math used by Remotion, without a browser or a second implementation.
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(module,filename)=>{
  const source=fs.readFileSync(filename,'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022,resolveJsonModule:true}});
  module._compile(compiled.outputText,filename);
};
const e=require('../src/data/giftcard-episode.json');
const board=require('../src/giftcard/cinematic/storyboard.json');
const {storyTime,audioTime}=require('../src/giftcard/cinematic/timing.ts');
const {purchaseAction,giftAction,redemptionAction,homeAction}=require('../src/giftcard/cinematic/choreography.ts');
const {handPosition}=require('../src/giftcard/cinematic/CharacterAction.tsx');
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const near=(a,b,limit,message)=>assert.ok(distance(a,b)<limit,`${message}: ${distance(a,b).toFixed(2)} world pixels`);
assert.equal(e.financials.reportedBreakageMillions,222.4);
assert.ok(e.financials.reportedBreakageMillions>e.financials.reportedBreakageFloorMillions);
assert.equal(board.shots[0].start,0);
board.shots.forEach((s,i)=>{assert.ok(s.end>s.start);assert.equal(s.end,board.shots[i+1]?.start??board.referenceDuration);});
for(let frame=0;frame<=4140;frame++){
  const t=frame/30;assert.ok(Math.abs(storyTime(audioTime(t,e),e)-t)<1e-7,'Timing round trip drift');
}
const stretched=structuredClone(e);stretched.durationSeconds*=1.18;
for(const s of stretched.narration.sentences){s.start*=1.18;s.end*=1.18;}
for(const t of [0,30.4,50.45,60.8,94.5,138])assert.ok(Math.abs(audioTime(t,stretched)-t*1.18)<1e-7,'Actions and Foley must follow changed narration timing');
for(const t of [32.7,35.8]){const {buyer,cashier}=purchaseAction(t);near(handPosition(buyer,'right',t),handPosition(cashier,'left',t),36,'Cash/card exchange hands must meet');}
{const t=43.15,{buyer,friend}=giftAction(t);near(handPosition(buyer,'right',t),handPosition(friend,'left',t),36,'Gift handoff must meet');}
{const t=53,{cashier}=redemptionAction(t);near(handPosition(cashier,'left',t),{x:850,y:930},22,'Cup must reach counter before release');}
{const t=54.2,{friend}=redemptionAction(t);near(handPosition(friend,'left',t),{x:850,y:930},12,'Recipient must reach cup before pickup');}
for(const t of [58.65,60.45,61.2]){const {friend,open}=homeAction(t);near(handPosition(friend,'right',t),{x:970,y:1020-27+78*open},8,'Drawer grip must follow its handle');}
{const t=60.1,{friend}=homeAction(t);near(handPosition(friend,'left',t),{x:970,y:1010},8,'Card must reach drawer before release');}
// Sample every action frame for finite positions and plausible reach, including transitions.
for(const [fn,start,end] of [[purchaseAction,27,41],[giftAction,41,49],[redemptionAction,49,56],[homeAction,56,63]]){
  for(let t=start;t<end;t+=1/30){for(const state of Object.values(fn(t))){if(typeof state!=='object'||!state.role)continue;
    for(const side of ['left','right']){const p=handPosition(state,side,t);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
      if(state[side])assert.ok(distance(state[side],{x:side==='left'?-44:44,y:-271})<222,'Unnatural arm extension');
    }
  }}
}
assert.equal(e.narration.sentences.length,board.referenceSentences.length);
console.log(`V4 verified: ${board.shots.length} continuous shots; sentence-based retiming; handoffs, cup pickup, drawer grips and all action poses.`);
