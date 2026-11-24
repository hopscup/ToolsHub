import type { ReactNode } from 'react';
import { motion } from './CssTransitions';
import { Coins, CreditCard, Gamepad2, Globe, Laptop, MessageSquare, ShieldCheck, Sparkles, Star, Users } from 'lucide-react';
import { homeCopy, homeLink } from '../data/homePage.js';

type Props = {
  language: 'ru' | 'en';
  services: ReactNode; guides: ReactNode;
};
const icons = { shield: ShieldCheck, globe: Globe, laptop: Laptop, sparkles: Sparkles, card: CreditCard, message: MessageSquare, users: Users, coins: Coins, gamepad: Gamepad2 };

export function HomeHub({ language, services, guides }: Props) {
  const text = (copy: { ru: string; en: string }) => copy[language];
  return <div data-home-hub className="space-y-16">
    <section id="home-tasks" aria-labelledby="home-tasks-title">
      <h2 id="home-tasks-title" tabIndex={-1} className="font-display text-2xl md:text-3xl font-black text-white mb-3 focus:outline-none">{text(homeCopy.tasksTitle)}</h2>
      <p className="text-sm md:text-base text-white/60 leading-relaxed mb-8">{text(homeCopy.tasksSubtitle)}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
        {homeCopy.tasks.map(task => {
          const Icon = icons[task.icon as keyof typeof icons];
          return <motion.div key={task.id} data-home-task={task.id} data-catalog-card={`home-task-${task.id}`} initial={false}
            className="bg-[#111111]/80 backdrop-blur-xl p-7 rounded-[1.5rem] group flex flex-col justify-between gap-8 relative overflow-hidden h-full border border-white/5 shadow-2xl hover:border-brand-purple/30 hover:shadow-[0_0_60px_rgba(129,28,254,0.15)] transition-all duration-500 hover:-translate-y-1">
            <div>
              <div className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-purple/30 bg-brand-purple/10"><Icon className="h-5 w-5 text-brand-purple" /></div>
              <h3 className="font-display font-bold text-xl text-white leading-tight mb-3">{text(task.title)}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{text(task.text)}</p>
            </div>
            <div className="flex flex-col gap-3 text-sm leading-relaxed">
              {task.links.map(link => <a key={link.href} href={homeLink(link.href, language)} className="text-brand-purple underline underline-offset-4 hover:text-white">{text(link.label)}</a>)}
            </div>
          </motion.div>;
        })}
      </div>
    </section>
    <section data-home-featured aria-labelledby="home-featured-title">
      <h2 id="home-featured-title" className="font-display text-2xl md:text-3xl font-black text-white mb-3">{text(homeCopy.featuredTitle)}</h2>
      <p className="text-sm md:text-base text-white/60 leading-relaxed mb-8">{text(homeCopy.featuredSubtitle)}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">{services}</div>
    </section>
    <section data-home-guides aria-labelledby="home-guides-title">
      <h2 id="home-guides-title" className="font-display text-2xl md:text-3xl font-black text-white mb-8">{text(homeCopy.guidesTitle)}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{guides}</div>
      <p className="mt-6 text-sm leading-relaxed"><a href={homeLink('/guides', language)} className="text-brand-purple underline underline-offset-4 hover:text-white">{text(homeCopy.allGuides)}</a></p>
    </section>
    <section aria-labelledby="home-selection-title" className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="home-selection-title" className="font-display text-2xl md:text-3xl font-black text-white mb-3">{text(homeCopy.selectionTitle)}</h2>
          <p className="text-sm md:text-base text-white/60 leading-relaxed">{text(homeCopy.selectionText)}</p>
        </div>
        <div className="grid gap-3 w-full lg:max-w-md">
          {homeCopy.selectionPoints[language].map(point => <div key={point} className="flex gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
            <Star className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-white/62 font-semibold leading-relaxed">{point}</span>
          </div>)}
        </div>
      </div>
    </section>
  </div>;
}
