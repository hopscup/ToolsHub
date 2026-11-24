export function createPreloader(load) {
  let pending;
  return () => pending ||= Promise.resolve().then(load).catch(error => {
    pending = undefined;
    throw error;
  });
}

export function scheduleIdlePreload(task, target = window) {
  let cancelled = false;
  let idle;
  let timer;
  const run = () => {if (!cancelled) task();};
  const schedule = () => {
    if (target.requestIdleCallback) idle = target.requestIdleCallback(run, {timeout: 2000});
    else timer = target.setTimeout(run, 250);
  };
  if (target.document.readyState === 'complete') schedule();
  else target.addEventListener('load', schedule, {once: true});
  return () => {
    cancelled = true;
    target.removeEventListener('load', schedule);
    if (idle !== undefined) target.cancelIdleCallback?.(idle);
    if (timer !== undefined) target.clearTimeout(timer);
  };
}
