export function waitForPageStyles(): Promise<void[]> {
  return Promise.all(Array.from(document.querySelectorAll<HTMLLinkElement>('link[data-deferred-css]'),link=>new Promise<void>(resolve=>{
    const failed=()=>{
      window.__hopscupRecoverChunk?.(new Error('Unable to preload CSS for '+link.href));
    };
    const loaded=()=>{link.media='all';resolve();};
    if(link.dataset.failed)failed();
    else if(link.sheet)loaded();
    else {link.addEventListener('load',loaded,{once:true});link.addEventListener('error',failed,{once:true});}
  })));
}
