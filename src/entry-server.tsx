import {StrictMode,Suspense} from 'react';
import {renderToPipeableStream} from 'react-dom/server';
import {Writable} from 'node:stream';
import App from './App';
import {HydrationReady} from './HydrationReady';

export function renderPage(pathname:string):Promise<string> {
  const location=new URL(pathname,'https://hopscup.tools');
  Object.assign(globalThis,{window:{location,history:{state:null}},location});
  return new Promise((resolve,reject)=>{
    let markup='';
    let piped=false;
    const output=new Writable({write(chunk,encoding,done){markup+=chunk.toString();done();}});
    output.on('finish',()=>resolve(markup));output.on('error',reject);
    const stream=renderToPipeableStream(<StrictMode><Suspense fallback={null}><App /></Suspense><HydrationReady /></StrictMode>,{
      onAllReady(){if(!piped){piped=true;queueMicrotask(()=>stream.pipe(output));}},
      onError(error){console.error('Prerender failed: '+pathname,error);reject(error);},
      onShellError:reject,
    });
  });
}
