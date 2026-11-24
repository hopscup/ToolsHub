import {useEffect, useState} from 'react';
import {Moon, Sun} from 'lucide-react';

export type SiteTheme = 'dark' | 'light';
export const SITE_THEME_KEY = 'hopscup-site-theme';
export const readSiteTheme = (): SiteTheme => {
  try { return localStorage.getItem(SITE_THEME_KEY) === 'light' ? 'light' : 'dark'; }
  catch { return 'dark'; }
};
export const writeSiteTheme = (theme: SiteTheme) => {
  document.documentElement.dataset.siteTheme = theme;
  try { localStorage.setItem(SITE_THEME_KEY,theme); } catch {}
  window.dispatchEvent(new Event('hopscup-site-theme-change'));
};
export function useSiteTheme():[SiteTheme,(theme:SiteTheme)=>void] {
  const [theme,setTheme] = useState<SiteTheme>('dark');
  useEffect(() => {
    const sync = () => setTheme(document.documentElement.dataset.siteTheme === 'light' ? 'light' : 'dark');
    const storage = () => {writeSiteTheme(readSiteTheme());sync();};
    sync();
    window.addEventListener('hopscup-site-theme-change',sync);window.addEventListener('storage',storage);
    return () => {window.removeEventListener('hopscup-site-theme-change',sync);window.removeEventListener('storage',storage);};
  }, []);
  return [theme,next=>{writeSiteTheme(next);setTheme(next);}];
}
export function SiteThemeToggle() {
  const [theme,setTheme] = useSiteTheme();
  const label = theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему';
  return <button type="button" className="site-theme-toggle" aria-label={label} title={label}
    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
    {theme === 'dark' ? <Sun size={17} aria-hidden="true"/> : <Moon size={17} aria-hidden="true"/>}
  </button>;
}
