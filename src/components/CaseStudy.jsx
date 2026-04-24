import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Calendar, Users,
  ChevronLeft, ChevronRight, Play, Pause,
  X, Maximize2, FileText, Gamepad2, ExternalLink
} from 'lucide-react';

// ─── CSS ──────────────────────────────────────────────────────────────────────
const caseStudyStyles = `
  /* ── Page background (dots everywhere) ── */
  .cs-page {
    background-image: radial-gradient(#e2e8f0 1.5px, transparent 1.5px);
    background-size: 24px 24px;
    background-color: #ffffff;
  }

  /* ── Morphing Bubble (hero) ── */
  .bubble-container {
    position: relative;
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    animation: bubble-morph 8s ease-in-out infinite;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(99,102,241,0.28), 0 12px 40px rgba(0,0,0,0.18);
  }
  .bubble-container::after {
    content: '';
    position: absolute;
    inset: 10px;
    border-radius: inherit;
    border: 2px solid rgba(255,255,255,0.38);
    pointer-events: none;
    z-index: 10;
  }
  .bubble-container img, .bubble-container video {
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  .bubble-container:hover img, .bubble-container:hover video { transform: scale(1.08); }
  @keyframes bubble-morph {
    0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    33%  { border-radius: 45% 55% 65% 35% / 50% 65% 35% 50%; }
    66%  { border-radius: 70% 30% 50% 50% / 35% 60% 40% 65%; }
    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  }

  /* ── ExpandableMedia ── */
  .exp-media {
    position: relative;
    overflow: hidden;
    background: #0f172a;
    border-radius: 0.875rem;
    cursor: zoom-in;
  }
  .exp-media img, .exp-media video {
    width: 100%; height: 100%;
    object-fit: contain;
    display: block;
    transition: transform 0.4s ease;
  }
  .exp-media:hover img { transform: scale(1.02); }
  .exp-media .exp-overlay {
    position: absolute; inset: 0;
    display: flex; align-items: flex-end; justify-content: flex-end;
    padding: 10px;
    opacity: 0;
    transition: opacity 0.22s ease;
  }
  .exp-media:hover .exp-overlay { opacity: 1; }
  .exp-btn {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.25);
    color: white;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .exp-btn:hover { background: rgba(255,255,255,0.3); }

  /* ── Caption overlay inside exp-media ── */
  .exp-caption {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 10px 14px;
    background: linear-gradient(to top, rgba(0,0,0,0.72), transparent);
    color: white; font-size: 0.8125rem; font-weight: 500;
    pointer-events: none;
  }

  /* ── Split block media wrapper ── */
  .split-media-wrap {
    overflow: hidden;
    border-radius: 1.25rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.14);
    transition: box-shadow 0.3s ease;
  }
  .split-media-wrap:hover { box-shadow: 0 28px 80px rgba(0,0,0,0.2); }

  /* ── Carousel ── */
  .carousel-track { display: flex; transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
  .carousel-slide { flex-shrink: 0; width: 100%; }

  /* ── Section divider ── */
  .section-divider-bar { height: 2px; background: linear-gradient(to right, #0f172a 30%, transparent); }

  /* ── Summary cards ── */
  .summary-card {
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(10px);
    border-radius: 1.5rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.07);
    border: 1px solid rgba(226,232,240,0.9);
    overflow: hidden;
  }

  /* ── Role card lift (kept for backward compat) ── */
  .role-card { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease; }
  .role-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(0,0,0,0.12); }

  /* ── Lightbox ── */
  .lightbox-backdrop {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.9);
    backdrop-filter: blur(14px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: lb-fade 0.2s ease forwards;
  }
  @keyframes lb-fade { from { opacity: 0; } to { opacity: 1; } }
  .lightbox-inner {
    position: relative;
    max-width: min(92vw, 1400px);
    max-height: 90vh;
    width: 100%;
    animation: lb-zoom 0.26s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
    border-radius: 1.125rem;
    overflow: hidden;
    box-shadow: 0 40px 120px rgba(0,0,0,0.8);
    background: #0f172a;
  }
  @keyframes lb-zoom {
    from { transform: scale(0.88); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }
  .lightbox-inner img, .lightbox-inner video {
    width: 100%; max-height: 90vh; object-fit: contain; display: block;
  }
  .lb-close {
    position: fixed; top: 18px; right: 18px; z-index: 10000;
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,255,255,0.1); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.18);
    color: white; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s, transform 0.2s;
  }
  .lb-close:hover { background: rgba(255,255,255,0.22); transform: scale(1.08); }
`;

// ─── HELPER ───
const fixPath = (path) => {
  if (!path) return path;
  const base = import.meta.env.BASE_URL;
  if (path.startsWith(base)) return path;
  if (path.startsWith('/') && !path.startsWith('http')) {
    return (base + path.slice(1)).replace(/\/+/g, '/');
  }
  return path;
};

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA LOADER — generic component for images and videos with a loading spinner
// ─────────────────────────────────────────────────────────────────────────────
const MediaLoader = ({ src, type = 'image', className = '', style = {}, imgProps = {}, videoProps = {} }) => {
  const [loaded, setLoaded] = useState(false);
  const combinedStyle = {
    ...style,
    opacity: loaded ? (style.opacity ?? 1) : 0,
    transition: style.transition ? `${style.transition}, opacity 0.5s ease` : 'opacity 0.5s ease, transform 0.4s ease'
  };
  
  return (
    <>
      {!loaded && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
           <div className="w-8 h-8 border-4 border-indigo-200/30 border-t-indigo-500 rounded-full animate-spin"></div>
         </div>
      )}
      {type === 'video' ? (
        <video 
          src={src} 
          preload="metadata"
          {...videoProps}
          className={`${className} relative z-10`} 
          style={combinedStyle}
          onLoadedData={() => setLoaded(true)}
        />
      ) : (
        <img 
          src={src} 
          loading="lazy"
          decoding="async"
          {...imgProps}
          className={`${className} relative z-10`}
          style={combinedStyle}
          onLoad={() => setLoaded(true)}
        />
      )}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX
// ─────────────────────────────────────────────────────────────────────────────
const Lightbox = ({ item, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const src = fixPath(item.src);

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Close"><X className="w-5 h-5" /></button>
      <div className="lightbox-inner bg-slate-900/80 min-h-[30vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <MediaLoader 
          src={src} 
          type={item.type} 
          imgProps={{ alt: item.caption ?? 'Media' }}
          videoProps={{ autoPlay: true, controls: true, loop: true, playsInline: true }}
          style={{ transition: 'opacity 0.3s ease' }}
        />
        {item.caption && <div className="exp-caption z-20 relative">{item.caption}</div>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPANDABLE MEDIA — base component for any clickable/zoomable media
// ─────────────────────────────────────────────────────────────────────────────
const ExpandableMedia = ({ item, onExpand, aspectClass = 'aspect-video' }) => {
  const src = fixPath(item.src);
  return (
    <div
      className={`exp-media ${aspectClass} bg-slate-100/30`}
      onClick={() => onExpand({ type: item.type, src: item.src, caption: item.caption })}
    >
      <MediaLoader 
        src={src} 
        type={item.type} 
        imgProps={{ alt: item.caption ?? '' }}
        videoProps={{ autoPlay: true, muted: true, loop: true, playsInline: true }}
      />
      {item.caption && <div className="exp-caption z-20 relative">{item.caption}</div>}
      <div className="exp-overlay z-20 relative">
        <div className="exp-btn"><Maximize2 className="w-3.5 h-3.5" /></div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SPLIT BLOCK — text + single media, alternating left/right
// ─────────────────────────────────────────────────────────────────────────────
const SplitBlock = ({ block, index, onExpand }) => {
  const isLeft = block.layout !== 'media-right';

  const mediaCol = (
    <div className="w-full lg:w-1/2 flex items-center justify-center">
      <div className="split-media-wrap w-full max-w-xl">
        <ExpandableMedia
          item={{ type: block.media.type, src: block.media.src, caption: block.title }}
          onExpand={onExpand}
        />
      </div>
    </div>
  );

  const textCol = (
    <div className="w-full lg:w-1/2 flex flex-col justify-center">
      {block.label && (
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-4">{block.label}</p>
      )}
      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 mb-5 leading-tight">
        {block.title}
      </h3>
      <p className="text-slate-500 leading-relaxed text-[15px] mb-4">{block.description}</p>
      {block.items && block.items.length > 0 && (
        <ul className="mt-1 space-y-2 mb-4">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] text-slate-500">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
      {block.note && (
        <p className="text-[13px] italic text-slate-400 border-l-2 border-slate-200 pl-4">{block.note}</p>
      )}
    </div>
  );

  return (
    <div
      className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-16 px-8 md:px-16 max-w-7xl mx-auto
        ${index % 2 !== 0 ? 'bg-white/60 rounded-3xl' : ''}`}
    >
      {isLeft ? <>{mediaCol}{textCol}</> : <>{textCol}{mediaCol}</>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA GRID — flexible grid of images/videos
// layouts: '1-full' | '2col' | '3col' | '1+2' | '2+2'
// ─────────────────────────────────────────────────────────────────────────────
const MediaGrid = ({ block, onExpand }) => {
  const { layout = '2col', items = [], label } = block;

  const colClass = {
    '1-full': 'grid-cols-1',
    '2col':   'grid-cols-1 sm:grid-cols-2',
    '3col':   'grid-cols-1 sm:grid-cols-3',
    '2+2':    'grid-cols-2',
  }[layout] ?? 'grid-cols-2';

  return (
    <div className="py-6 px-8 md:px-16 max-w-7xl mx-auto">
      {label && (
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-4">{label}</p>
      )}
      {layout === '1+2' ? (
        <>
          {items[0] && (
            <div className="mb-3">
              <ExpandableMedia item={items[0]} onExpand={onExpand} />
            </div>
          )}
          {items.length > 1 && (
            <div className="grid grid-cols-2 gap-3">
              {items.slice(1, 3).map((item, i) => (
                <ExpandableMedia key={i} item={item} onExpand={onExpand} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={`grid ${colClass} gap-3`}>
          {items.map((item, i) => (
            <ExpandableMedia key={i} item={item} onExpand={onExpand} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TEXT BLOCK — standalone text paragraph with optional bullets + note
// ─────────────────────────────────────────────────────────────────────────────
const TextBlock = ({ block }) => (
  <div className="py-12 px-8 md:px-16 max-w-4xl mx-auto">
    {block.label && (
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-3">{block.label}</p>
    )}
    {block.title && (
      <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 mb-5 leading-tight">
        {block.title}
      </h3>
    )}
    <p className="text-slate-500 leading-relaxed text-[15px]">{block.text}</p>
    {block.items && block.items.length > 0 && (
      <ul className="mt-4 space-y-2">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[14px] text-slate-500">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    )}
    {block.note && (
      <p className="mt-5 text-[13px] italic text-slate-400 border-l-2 border-slate-200 pl-4">{block.note}</p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION DIVIDER — visual separator with big number + title
// ─────────────────────────────────────────────────────────────────────────────
const SectionDivider = ({ block }) => (
  <div className="py-20 px-8 md:px-16 max-w-7xl mx-auto">
    <div className="section-divider-bar mb-10" />
    <div className="flex items-end gap-6">
      <span
        className="font-black text-slate-100 leading-none select-none flex-shrink-0"
        style={{ fontSize: 'clamp(80px, 10vw, 130px)', lineHeight: 0.82 }}
      >
        {block.number}
      </span>
      <div className="pb-2">
        {block.label && (
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-3">{block.label}</p>
        )}
        <h2 className="font-black uppercase tracking-tighter text-slate-900 leading-none"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
          {block.title}
        </h2>
      </div>
    </div>
    {block.description && (
      <p className="mt-6 text-slate-500 max-w-2xl leading-relaxed text-[15px]">{block.description}</p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY CARD — one card (characteristics / problems / solutions + images)
// ─────────────────────────────────────────────────────────────────────────────
const SummaryCard = ({ card, onExpand }) => (
  <div className="summary-card flex flex-col">
    {/* Header */}
    <div className="px-8 pt-8 pb-5 border-b border-slate-100">
      {card.label && (
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-1">{card.label}</p>
      )}
      <div className="flex items-baseline gap-4">
        <span className="text-6xl font-black text-slate-100 leading-none select-none">{card.number}</span>
        <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-tight">
          {card.title}
        </h3>
      </div>
    </div>

    {/* 3-col grid */}
    <div className="grid grid-cols-3 divide-x divide-slate-100 flex-1">
      <div className="px-5 py-5">
        <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-500 mb-3">{card.characteristicsLabel}</p>
        <ul className="space-y-2">
          {card.characteristics.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-5 py-5">
        <p className="text-[9px] font-bold uppercase tracking-widest text-amber-600 mb-3">{card.problemsLabel}</p>
        <ul className="space-y-2">
          {card.problems.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-5 py-5">
        <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 mb-3">{card.solutionsLabel}</p>
        <ul className="space-y-2">
          {card.solutions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Preview images */}
    {card.images && card.images.length > 0 && (
      <div className={`grid gap-2 p-4 border-t border-slate-100 ${card.images.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {card.images.map((src, i) => (
          <ExpandableMedia
            key={i}
            item={{ type: 'image', src }}
            onExpand={onExpand}
            aspectClass="aspect-video"
          />
        ))}
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY CARD PAIR — two summary cards side by side
// ─────────────────────────────────────────────────────────────────────────────
const SummaryCardPair = ({ block, onExpand }) => (
  <div className="py-16 px-8 md:px-16 max-w-7xl mx-auto">
    <div className="mb-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">{block.summaryLabel}</p>
      <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">{block.systemsLabel}</h2>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {block.cards.map((card, i) => (
        <SummaryCard key={i} card={card} onExpand={onExpand} />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CAROUSEL BLOCK — auto-playing carousel, use sparingly
// ─────────────────────────────────────────────────────────────────────────────
const CarouselBlock = ({ block, onExpand }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const items  = block.items ?? [];
  const delay  = block.interval ?? 4000;

  const advance = useCallback(
    (dir = 1) => setCurrent(prev => (prev + dir + items.length) % items.length),
    [items.length]
  );

  useEffect(() => {
    if (paused || items.length <= 1) return;
    intervalRef.current = setInterval(() => advance(1), delay);
    return () => clearInterval(intervalRef.current);
  }, [paused, advance, delay, items.length]);

  if (items.length === 0) return null;

  return (
    <div className="py-12 px-8 md:px-16 max-w-7xl mx-auto">
      {(block.label || block.title) && (
        <div className="mb-8 text-center">
          {block.label && (
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">{block.label}</p>
          )}
          {block.title && (
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{block.title}</h3>
          )}
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-slate-950">
        {/* Track */}
        <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {items.map((item, i) => (
            <div key={i} className="carousel-slide aspect-video relative">
              <ExpandableMedia item={item} onExpand={onExpand} aspectClass="w-full h-full" />
            </div>
          ))}
        </div>

        {/* Arrows */}
        {items.length > 1 && (
          <>
            <button onClick={() => advance(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur hover:bg-white/35 transition flex items-center justify-center text-white z-10"
              aria-label="Previous"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => advance(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur hover:bg-white/35 transition flex items-center justify-center text-white z-10"
              aria-label="Next"><ChevronRight className="w-5 h-5" /></button>
          </>
        )}

        {/* Pause / counter */}
        {items.length > 1 && (
          <button onClick={() => setPaused(p => !p)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur hover:bg-white/35 transition flex items-center justify-center text-white z-10"
            aria-label={paused ? 'Play' : 'Pause'}>
            {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {items.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-indigo-600' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT BLOCK DISPATCHER
// ─────────────────────────────────────────────────────────────────────────────
const ContentBlock = ({ block, index, onExpand }) => {
  const [isVisible, setIsVisible] = useState(false);
  const blockRef = useRef(null);

  useEffect(() => {
    if (!block.busteConfig) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    if (blockRef.current) observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, [block.busteConfig]);

  let content = null;
  switch (block.type) {
    case 'split':             content = <SplitBlock block={block} index={index} onExpand={onExpand} />; break;
    case 'carousel':          content = <CarouselBlock block={block} onExpand={onExpand} />; break;
    case 'media-grid':        content = <MediaGrid block={block} onExpand={onExpand} />; break;
    case 'text-block':        content = <TextBlock block={block} />; break;
    case 'section-divider':   content = <SectionDivider block={block} />; break;
    case 'summary-card-pair': content = <SummaryCardPair block={block} onExpand={onExpand} />; break;
    default:                  return null;
  }

  if (!content) return null;

  return (
    <div className="relative" ref={blockRef}>
      {block.busteConfig && (
        <div className="absolute inset-0 w-full hidden lg:flex justify-center pointer-events-none z-0">
          <div className="relative w-full max-w-7xl">
            <div
              className="absolute"
              style={{
                ...block.busteConfig.css
              }}
            >
          <img
            src={fixPath('/gwido/images/Gwido_Buste.webp')}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              width: 'auto',
              display: 'block',
              transformOrigin: 'center center',
              filter: 'drop-shadow(6px 0 28px rgba(99,102,241,0.5))',
              ...block.busteConfig.imgCss,
              transform: isVisible 
                ? (block.busteConfig.imgCss?.transform || 'rotate(40deg)')
                : (block.busteConfig.initialTransform || 'translateY(100px) rotate(0deg)'),
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: isVisible ? (block.busteConfig.delay || '0.5s') : '0s'
            }}
          />
            </div>
          </div>
        </div>
      )}
      <div className="relative z-10">
        {content}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CaseStudy = ({ project, onBack }) => {
  const { t } = useTranslation();
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const openLightbox  = useCallback((item) => setLightboxItem(item), []);
  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  const rolesList =
    project.rolesList ??
    (project.role ? project.role.split('|').map(r => r.trim()) : []);

  const contentBlocks = project.contentBlocks ?? [];

  return (
    <div className="cs-page min-h-screen text-slate-900 font-sans relative z-0">
      <style dangerouslySetInnerHTML={{ __html: caseStudyStyles }} />

      {/* ── Lightbox ─────────────────────────────────── */}
      {lightboxItem && <Lightbox item={lightboxItem} onClose={closeLightbox} />}

      {/* ── Fixed nav ────────────────────────────────── */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center px-6 md:px-12 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <button onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('caseStudy.backToWorks')}
        </button>
        <span className="mx-4 text-slate-200">|</span>
        <span className="text-xs font-black uppercase tracking-tighter text-slate-900">{project.title}</span>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-0 items-center pt-20">
        {/* Left — text */}
        <div className="px-8 md:px-16 py-20 flex flex-col justify-center">
          <span className="inline-flex self-start mb-6 px-4 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
            {project.category}
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 mb-6 leading-none">
            {project.title}
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-4 max-w-lg">{project.description}</p>
          {project.context && (
            <p className="text-sm text-slate-400 leading-relaxed mb-10 max-w-lg border-l-2 border-slate-200 pl-4">
              {project.context}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            {project.timeline && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Calendar className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{t('caseStudy.timeline')}</p>
                  <p className="text-sm font-semibold text-slate-700">{project.timeline}</p>
                </div>
              </div>
            )}
            {project.teamSize && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{t('caseStudy.teamSize')}</p>
                  <p className="text-sm font-semibold text-slate-700">{project.teamSize}</p>
                </div>
              </div>
            )}
            {rolesList.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{t('caseStudy.myRoles')}</p>
                <div className="flex flex-wrap gap-2">
                  {rolesList.map((r, i) => (
                    <span key={i} className="border border-indigo-200 rounded-full text-xs px-3 py-1 text-indigo-600 font-medium bg-indigo-50/80">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.links && project.links.length > 0 && (
              <div className="sm:col-span-2 mt-4">
                <div className="flex flex-wrap gap-4">
                  {project.links.map((link, i) => (
                    <a 
                      key={i} 
                      href={fixPath(link.url)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/20 hover:-translate-y-1"
                    >
                      {link.type === 'pdf' ? <FileText className="w-4 h-4" /> : <Gamepad2 className="w-4 h-4" />}
                      {t(link.labelKey)}
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — morphing bubble */}
        <div className="hidden lg:flex items-center justify-center px-12 py-20">
          <div className="bubble-container w-[520px] h-[520px] bg-slate-100/50">
            <MediaLoader 
              src={fixPath(project.image) ?? `https://picsum.photos/seed/${project.id ?? project.title}/800/800`} 
              imgProps={{ alt: project.title }} 
            />
          </div>
        </div>
      </section>

      {/* ── Content blocks ───────────────────────────── */}
      {contentBlocks.length > 0 && (
        <div className="py-4">
          {contentBlocks.map((block, i) => (
            <ContentBlock key={i} block={block} index={i} onExpand={openLightbox} />
          ))}
        </div>
      )}

      {/* ── Footer ───────────────────────────────────── */}
      <section className="py-24 px-8 md:px-16 flex flex-col items-center text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">{t('caseStudy.finishedExploring')}</p>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-10 leading-tight">
          {t('caseStudy.seeAllProjects')}
        </h2>
        <button onClick={onBack}
          className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('caseStudy.backToWorks')}
        </button>
      </section>
    </div>
  );
};

export default CaseStudy;
