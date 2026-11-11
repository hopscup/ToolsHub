import { Play } from 'lucide-react';
import { useState } from 'react';

type ArticleVideoProps = {
  video: { id: string; url: string; caption: string };
  poster?: { src: string; alt: string; width: number; height: number };
};

export const ArticleVideo = ({ video, poster }: ArticleVideoProps) => {
  const [playing, setPlaying] = useState(false);
  return <figure className="mx-auto mt-8 max-w-3xl" data-article-video>
    <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
      {playing ? <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
        title={video.caption} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="absolute inset-0 h-full w-full border-0"
      /> : <button type="button" onClick={() => setPlaying(true)} aria-label={`Смотреть: ${video.caption}`}
        className="group absolute inset-0 block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-purple">
        {poster && <img src={poster.src} alt={poster.alt} width={poster.width} height={poster.height}
          fetchPriority="high" decoding="async" className="block h-full w-full object-contain" />}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/80 text-[#fff] shadow-lg transition-colors group-hover:bg-brand-purple">
            <Play aria-hidden="true" className="h-6 w-6 fill-current" />
          </span>
        </span>
      </button>}
    </div>
    <figcaption className="mt-3 text-center text-xs font-semibold text-white/55">
      <a href={video.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{video.caption}</a>
    </figcaption>
  </figure>;
};
