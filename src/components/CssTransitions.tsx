import {Children, createContext, createElement, forwardRef, useContext, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode} from 'react';

const Presence = createContext(true);
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
export const useIsPresent = () => useContext(Presence);
export const domAnimation = undefined;
export const LazyMotion = ({children}: {children: ReactNode; features?: unknown; strict?: boolean}) => children;

// The shell needs only enter/exit fades. Article rendering has no animation dependency.
export function AnimatePresence({children}: {children: ReactNode; initial?: boolean; mode?: string}) {
  const visible = Children.toArray(children);
  const previous = useRef<ReactNode[]>(visible);
  const [exiting, setExiting] = useState(false);
  if (visible.length) previous.current = visible;
  useEffect(() => {
    if (visible.length || !previous.current.length) {setExiting(false); return;}
    setExiting(true);
    const timer = setTimeout(() => {previous.current = []; setExiting(false);}, 180);
    return () => clearTimeout(timer);
  }, [visible.length]);
  return <Presence value={Boolean(visible.length)}><div className={exiting ? 'css-presence css-presence-exiting' : 'css-presence'}>{visible.length ? visible : previous.current}</div></Presence>;
}

function animated(tag: string) {
  return forwardRef<HTMLElement, any>(function CssTransition({initial, animate: _animate, exit: _exit, layout: _layout, transition, whileHover, children, className = '', style, ...props}, ref) {
    const afterHydration = useRef(useSyncExternalStore(subscribe,clientSnapshot,serverSnapshot));
    const variables = {'--enter-opacity': initial?.opacity ?? 1, '--enter-x': `${initial?.x || 0}px`, '--enter-y': `${initial?.y || 0}px`, '--enter-scale': initial?.scale ?? 1, '--enter-duration': `${transition?.duration ?? 0.2}s`, '--hover-scale': whileHover?.scale ?? 1, '--hover-y': `${whileHover?.y || 0}px`};
    return createElement(tag, {...props, ref, className: `${className}${afterHydration.current && initial && initial !== false ? ' css-enter' : ''}${whileHover ? ' css-hover' : ''}`, style: {...variables, ...style} as CSSProperties}, children);
  });
}
export const motion = {div: animated('div'), a: animated('a'), aside: animated('aside'), span: animated('span')};
