import {scheduleIdlePreload} from './idlePreload.js';
let tracker:typeof import('@vercel/analytics').track;
const queue:Array<[string,Record<string,any>]> = [];
let scheduled = false;

export function trackDeferredEvent(name:string,properties:Record<string,any>) {
  if (tracker) tracker(name,properties);
  else queue.push([name,properties]);
}

export function startDeferredAnalytics() {
  if (scheduled) return;
  scheduled = true;
  scheduleIdlePreload(() => {
    void import('@vercel/analytics').then(module => {
      module.inject({framework:'react'});
      tracker = module.track;
      for (const [name,properties] of queue.splice(0)) tracker(name,properties);
    }).catch(() => {scheduled = false;});
  });
}
