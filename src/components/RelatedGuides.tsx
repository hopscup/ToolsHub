import { ArrowUpRight } from 'lucide-react';

export type RelatedGuide = {
  href: string;
  title: string;
  description: string;
  label?: string;
};

export const RelatedGuides = ({ items }: { items: RelatedGuide[] }) => (
  <section className="mt-12 border-t border-white/[0.08] pt-10" aria-labelledby="related-guides-title">
    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Читайте также</p>
    <h2 id="related-guides-title" className="mt-3 font-display text-2xl font-black text-white md:text-3xl">
      Следующий полезный материал
    </h2>
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="group flex min-h-36 flex-col justify-between rounded-lg border border-white/[0.09] bg-white/[0.025] p-5 transition-colors hover:border-brand-purple/45 hover:bg-brand-purple/[0.06]"
        >
          <div>
            {item.label && (
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-purple/80">{item.label}</p>
            )}
            <h3 className="mt-2 font-display text-base font-black leading-6 text-white/85 group-hover:text-white">{item.title}</h3>
            <p className="mt-2 text-xs font-medium leading-5 text-white/45">{item.description}</p>
          </div>
          <ArrowUpRight className="mt-4 h-4 w-4 text-white/25 transition-colors group-hover:text-brand-purple" />
        </a>
      ))}
    </div>
  </section>
);
