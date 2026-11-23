import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';

const baseline=execFileSync('git',['show','a5289c8:src/components/BackgroundParticles.tsx'],{encoding:'utf8'});
const current=await readFile('src/components/BackgroundParticles.tsx','utf8');

function renderTrace(source,component,{light=false,reduced=false,pause=false}={}){
 let seed=123456,now=100000000,rafId=0,ref=0,pausedLength=0;const effects=[],frames=new Map(),trace=[],events=new Map();
 const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
 const math=Object.create(Math);math.random=random;
 function context(name){
  const target={createPattern:()=>name+'-pattern',createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:image=>trace.push([name,'grain',createHash('sha256').update(image.data).digest('hex')]),createLinearGradient:(...args)=>{trace.push([name,'gradient',...args]);return {addColorStop:(...stop)=>trace.push([name,'colorStop',...stop])};}};
  for(const method of ['clearRect','fillRect','beginPath','moveTo','lineTo','stroke','arc','fill'])target[method]=(...args)=>trace.push([name,method,...args]);
  return new Proxy(target,{set(target,key,value){trace.push([name,key,typeof value==='object'?'<gradient>':value]);target[key]=value;return true;}});
 }
 const contexts=['stars','film','grain'].map(context),canvases=contexts.map(ctx=>({width:0,height:0,getContext:()=>ctx}));
 const react={useRef:()=>({current:canvases[ref++]}),useEffect:callback=>effects.push(callback),useState:()=>[false,()=>{}],createElement:()=>null};
 const sandbox={exports:{},React:react,require:name=>{assert.equal(name,'react');return react;},Math:math,Date:class extends Date{static now(){return now;}},Uint8ClampedArray,
  navigator:{hardwareConcurrency:8},window:{innerWidth:1440,innerHeight:1100,matchMedia:query=>({matches:query.includes('reduced-motion')&&reduced}),addEventListener(){},removeEventListener(){}},
  document:{hidden:false,documentElement:{dataset:{siteTheme:light?'light':'dark'}},createElement:()=>canvases[2],addEventListener:(name,handler)=>events.set(name,handler),removeEventListener:name=>events.delete(name)},MutationObserver:class{observe(){}disconnect(){}},
  requestAnimationFrame:cb=>{frames.set(++rafId,cb);return rafId;},cancelAnimationFrame:id=>frames.delete(id)};
 const code=ts.transpileModule(source+'\nglobalThis.renderBackground='+component+';',{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React}}).outputText;
 vm.createContext(sandbox);vm.runInContext(code,sandbox);sandbox.renderBackground();effects.forEach(fn=>fn());
 for(let i=1;i<=720;i++){
  const time=i*1000/60;now=100000000+time;const pending=[...frames.values()];frames.clear();pending.forEach(callback=>callback(time));
  if(pause&&i===299){sandbox.document.hidden=true;events.get('visibilitychange')();pausedLength=trace.length;}
  if(pause&&i>=300&&i<420)assert.equal(trace.length,pausedLength,'hidden canvas must not draw or regenerate grain');
  if(pause&&i===419){sandbox.document.hidden=false;events.get('visibilitychange')();}
 }
 return trace;
}

test('desktop dark sky matches every seeded drawing command from a5289c8 for twelve seconds',()=>{
 const before=renderTrace(baseline,'BackgroundParticles'),after=renderTrace(current,'DesktopParticles');
 assert.deepEqual(after,before);
 assert.ok(after.some(command=>command[1]==='gradient'),'shooting star tail was drawn');
 assert.ok(after.some(command=>command[1]==='grain'),'film grain was drawn');
 assert.ok(after.some(command=>command[1]==='lineTo'),'scratches or meteor path were drawn');
});

test('hidden document pauses drawing and resumes with the original desktop timing',()=>{
 assert.deepEqual(renderTrace(current,'DesktopParticles',{pause:true}),renderTrace(baseline,'BackgroundParticles',{pause:true}));
});

test('reduced motion does not freeze either desktop sky theme',()=>{
 assert.deepEqual(renderTrace(current,'DesktopParticles',{reduced:true}),renderTrace(current,'DesktopParticles'));
 const light=renderTrace(current,'DesktopParticles',{light:true,reduced:true});
 assert.ok(light.some(command=>command[1]==='gradient'));
 const alpha=light.filter(command=>command[1]==='fillStyle'&&String(command[2]).startsWith('rgba(29, 29, 31, ')).map(command=>Number(command[2].match(/, ([\d.]+)\)$/)[1]));
 assert.ok(alpha.length>320);assert.ok(alpha.every(value=>value>=.34999&&value<=.80001));
});
