import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import path from 'node:path';
import {writeFile,mkdir} from 'node:fs/promises';
const require=createRequire(process.env.IMAGE_RUNTIME_PACKAGE || path.join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json'));
const sharp=require('sharp'),width=780,height=1688;
await mkdir('public/sky',{recursive:true});
for(const theme of ['dark','light']){
 let seed=72891;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const pixels=Buffer.alloc(width*height*3);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const a=Math.exp(-((x+50)**2/(width*.9)**2+(y-height*.17)**2/(height*.4)**2));
  const b=Math.exp(-((x-width*.96)**2/(width*.85)**2+(y-height*.76)**2/(height*.35)**2));
  const haze=a*.24+b*.15,base=theme==='dark'?[8,6,13]:[255,255,255],tint=a>b?[63,33,131]:[84,40,146];
  const i=(y*width+x)*3;for(let c=0;c<3;c++)pixels[i+c]=Math.round(theme==='dark'?base[c]+tint[c]*haze:base[c]-(255-tint[c])*haze*.13);
 }
 const dot=(x,y,r,opacity)=>{for(let dy=-Math.ceil(r);dy<=Math.ceil(r);dy++)for(let dx=-Math.ceil(r);dx<=Math.ceil(r);dx++){
  const xx=x+dx,yy=y+dy,d=Math.hypot(dx,dy);if(xx<0||yy<0||xx>=width||yy>=height||d>r)continue;
  const alpha=opacity*Math.max(0,1-d/(r+.5)),i=(yy*width+xx)*3,color=theme==='dark'?[242,238,255]:[42,39,53];
  for(let c=0;c<3;c++)pixels[i+c]=Math.round(pixels[i+c]*(1-alpha)+color[c]*alpha);
 }};
 for(let i=0;i<450;i++)dot(Math.floor(random()*width),Math.floor(random()*height),.7+random()*.3,.12+random()*.17);
 for(let i=0;i<155;i++)dot(Math.floor(random()*width),Math.floor(random()*height),1+random()*2.2,.55+random()*.4);
 let image;for(const quality of [86,80,74,68,60]){image=await sharp(pixels,{raw:{width,height,channels:3}}).webp({quality}).toBuffer();if(image.length<=40000)break;}
 if(image.length>40000)throw Error('Mobile sky exceeds 40KB');await writeFile(`public/sky/${theme}.webp`,image);console.log(theme,image.length);
}
