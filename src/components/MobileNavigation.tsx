import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Menu,X,Globe,Youtube,Send} from 'lucide-react';
import {SiteThemeToggle} from './SiteTheme';
import {serviceCategoryNames,serviceCategoryRoutes} from '../data/servicePresentation.js';
type Item = {href:string;label:string;icon:ReactNode};
export function MobileNavigation({items = Object.entries(serviceCategoryRoutes).map(([id,href]) => ({href,label:serviceCategoryNames[id][0],icon:<Globe size={20}/>})),socials = <><a className="site-theme-toggle" href="https://www.youtube.com/@hopscup" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={18}/></a><a className="site-theme-toggle" href="https://t.me/hopscupcrpt" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><Send size={18}/></a></>}: {items?:Item[];socials?:ReactNode}) {
  const [open,setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;const overflow = document.body.style.overflow;
    element?.showModal();document.body.style.overflow='hidden';
    return () => {element?.close();document.body.style.overflow=overflow;trigger.current?.focus({preventScroll:true});};
  }, [open]);
  return <>
    <button ref={trigger} type="button" className="site-theme-toggle site-mobile-trigger" aria-label="Открыть меню" aria-controls="site-mobile-menu" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={20}/></button>
    <dialog ref={dialog} id="site-mobile-menu" className="site-mobile-menu" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <div className="site-mobile-menu-top"><a href="/" aria-label="Hopscup's Tools Hub"><img src="/logo.webp" alt="Hopscup" width="40" height="40"/></a><button type="button" className="site-theme-toggle" aria-label="Закрыть меню" onClick={() => setOpen(false)}><X size={22}/></button></div>
      <nav aria-label="Разделы сайта">{items.map(item => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.icon}<span>{item.label}</span></a>)}</nav>
      <div className="site-mobile-menu-bottom">{socials}<SiteThemeToggle/></div>
    </dialog>
  </>;
}
