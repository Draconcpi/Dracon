'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Palette, X } from 'lucide-react';
import ArtImage from '@/components/ui/ArtImage';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import ConstellationLoader from '@/components/ui/ConstellationLoader';
import PageHeader from '@/components/ui/PageHeader';
import { useReveal } from '@/components/motion/useReveal';
import { constellationAt } from '@/lib/constellations';
import { gsap, Flip, ScrollTrigger, useGSAP, MOTION_OK, EASE } from '@/lib/gsap';
import { useI18n } from '@/i18n';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: Category;
  categoryId: string;
  tags: string[];
  featured: boolean;
  order: number;
}

const gradients = [
  'from-dracon-purple-800/50 to-indigo-900/50',
  'from-dracon-purple-900/50 to-dracon-orange-700/30',
  'from-blue-900/50 to-dracon-purple-900/50',
  'from-dracon-purple-800/50 to-cyan-900/30',
  'from-gray-900/50 to-dracon-purple-900/50',
  'from-sky-900/40 to-dracon-purple-800/40',
  'from-dracon-orange-700/30 to-dracon-purple-900/50',
  'from-green-900/30 to-dracon-purple-900/40',
];

// Varied proportions give the wall the rhythm of a real gallery hang
const ASPECTS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[5/4]', 'aspect-[3/4]'];

function Fallback({ index }: { index: number }) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`}>
      <div className="absolute inset-[18%] opacity-60">
        <ConstellationGlyph id={constellationAt(index)} animate={false} className="h-full w-full" />
      </div>
    </div>
  );
}

/* ─── Full-screen viewer ─────────────────────────────────────────── */

function Lightbox({
  items,
  index,
  onClose,
  onMove,
}: {
  items: PortfolioItem[];
  index: number;
  onClose: () => void;
  onMove: (dir: 1 | -1) => void;
}) {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const item = items[index];

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onMove(1);
      else if (e.key === 'ArrowLeft') onMove(-1);
      else if (e.key === 'Tab' && root.current) {
        // Keep focus inside the dialog
        const focusables = root.current.querySelectorAll<HTMLElement>('button, a[href]');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [onClose, onMove]);

  // Copy fades in each time the artwork changes
  useGSAP(
    () => {
      if (!window.matchMedia(MOTION_OK).matches) return;
      gsap.from('[data-lb-copy] > *', { y: 16, opacity: 0, duration: 0.8, ease: EASE, stagger: 0.06 });
    },
    { scope: root, dependencies: [index], revertOnUpdate: true }
  );

  if (!item) return null;

  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-[100] flex flex-col bg-dracon-void/95 backdrop-blur-md lg:flex-row"
      onClick={onClose}
    >
      <div className="relative min-h-0 flex-1 p-4 pt-20 sm:p-8 sm:pt-20 lg:p-12" onClick={(e) => e.stopPropagation()}>
        <div data-flip-id={`art-${item.id}`} data-lightbox-media className="relative h-full w-full">
          <ArtImage
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-contain"
            fallback={<Fallback index={items.indexOf(item)} />}
          />
        </div>
      </div>

      <aside
        className="relative flex w-full flex-col border-t border-white/10 bg-dracon-midnight/80 p-6 sm:p-8 lg:w-[420px] lg:border-l lg:border-t-0 lg:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div data-lb-copy className="flex-1 overflow-y-auto">
          <p className="meta">{item.category.name}</p>
          <h2 id="lightbox-title" className="display mt-3 text-[clamp(1.75rem,3vw,2.5rem)]">
            {item.title}
          </h2>
          <p className="text-pretty mt-5 leading-relaxed text-dracon-mist">{item.description}</p>
          {item.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-dracon-purple-100/20 px-3 py-1 text-sm text-dracon-mist">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="num text-sm text-dracon-dust">
            {index + 1} / {items.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onMove(-1)}
              aria-label={t('portfolio.prev')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-dracon-purple-100/25 text-dracon-starlight transition-colors hover:border-dracon-orange-300/60 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onMove(1)}
              aria-label={t('portfolio.next')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-dracon-purple-100/25 text-dracon-starlight transition-colors hover:border-dracon-orange-300/60 hover:text-white"
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </aside>

      <button
        ref={closeRef}
        type="button"
        aria-label={t('common.close')}
        onClick={onClose}
        className="glass absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-dracon-starlight transition-colors hover:text-white sm:right-6 sm:top-6"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>
    </div>,
    document.body
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */

export default function PortfolioPage() {
  const { t } = useI18n();
  const page = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const openState = useRef<Flip.FlipState | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [portfolioRes, catRes] = await Promise.all([fetch('/api/portfolio'), fetch('/api/categories')]);
        const portfolioData = await portfolioRes.json();
        const catData = await catRes.json();
        if (portfolioData.success) setItems(portfolioData.data);
        if (catData.success) setCategories(catData.data);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const visible = activeCategory === 'all' ? items : items.filter((item) => item.category.slug === activeCategory);

  useReveal(page, [loading]);

  const chooseCategory = (slug: string) => {
    if (slug === activeCategory) return;
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll('[data-flip-item]'));
    setActiveCategory(slug);
  };

  // The wall re-hangs itself: kept works glide to their new places, newcomers fade in
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      if (!window.matchMedia(MOTION_OK).matches) return;
      Flip.from(state, {
        duration: 0.9,
        ease: 'expo.inOut',
        stagger: 0.02,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.8, ease: EASE, delay: 0.25 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { scope: grid, dependencies: [activeCategory] }
  );

  const open = (i: number, el: HTMLElement | null) => {
    if (el && window.matchMedia(MOTION_OK).matches) openState.current = Flip.getState(el);
    setOpenIndex(i);
  };

  // The thumbnail flies into the viewer
  useGSAP(
    () => {
      const state = openState.current;
      if (openIndex === null || !state) return;
      openState.current = null;
      const target = document.querySelector('[data-lightbox-media]');
      if (!target) return;
      Flip.from(state, { targets: target, duration: 0.9, ease: 'expo.inOut', scale: true, absolute: false });
      gsap.from('[role="dialog"]', { backgroundColor: 'rgba(5,0,16,0)', duration: 0.6, ease: 'power2.out' });
    },
    { dependencies: [openIndex] }
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const move = useCallback(
    (dir: 1 | -1) => setOpenIndex((i) => (i === null || visible.length === 0 ? i : (i + dir + visible.length) % visible.length)),
    [visible.length]
  );

  const filters = [{ id: '__all', slug: 'all', name: t('portfolio.filters.all') }, ...categories];

  return (
    <div ref={page} className="min-h-screen pb-24">
      <PageHeader title={t('portfolio.header.title')} subtitle={t('portfolio.header.subtitle')} glyph="cygnus" />

      {/* Category filters */}
      {!loading && items.length > 0 && (
        <section className="section-container mb-14">
          <div data-reveal="rise" role="group" aria-label={t('portfolio.header.title')} className="flex flex-wrap gap-2">
            {filters.map((cat) => {
              const active = activeCategory === cat.slug;
              const count = cat.slug === 'all' ? items.length : items.filter((i) => i.category.slug === cat.slug).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => chooseCategory(cat.slug)}
                  className={`group inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-[0.95rem] font-medium transition-all duration-300 ${
                    active
                      ? 'border-dracon-orange-300/70 bg-dracon-orange-500/10 text-white shadow-[0_0_24px_-6px_rgba(249,115,22,0.6)]'
                      : 'border-dracon-purple-100/15 text-dracon-mist hover:border-dracon-purple-100/40 hover:text-white'
                  }`}
                >
                  {cat.name}
                  <span className={`num text-xs ${active ? 'text-dracon-orange-200' : 'text-dracon-dust'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {loading && <ConstellationLoader label={t('common.loading')} className="section-container py-20" />}

      {!loading && items.length === 0 && (
        <div className="section-container py-20 text-center">
          <Palette className="mx-auto mb-4 h-12 w-12 text-dracon-purple-300/60" strokeWidth={1.25} aria-hidden />
          <p className="text-lg text-dracon-mist">{t('portfolio.empty')}</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <section className="section-container">
          <div ref={grid} className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {items.map((item, i) => {
              const shown = activeCategory === 'all' || item.category.slug === activeCategory;
              const visibleIndex = visible.indexOf(item);
              return (
                <article
                  key={item.id}
                  data-flip-item
                  data-flip-id={`card-${item.id}`}
                  className={`break-inside-avoid ${shown ? '' : 'hidden'}`}
                >
                  <button
                    type="button"
                    onClick={(e) => open(visibleIndex, e.currentTarget.querySelector('[data-flip-id^="art-"]'))}
                    className="group block w-full text-left"
                    aria-label={item.title}
                  >
                    <div
                      data-flip-id={`art-${item.id}`}
                      className={`relative overflow-hidden rounded-2xl bg-dracon-dark ${ASPECTS[i % ASPECTS.length]}`}
                    >
                      <ArtImage
                        src={item.thumbnailUrl || item.imageUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                        fallback={<Fallback index={i} />}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dracon-void/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      {item.tags.length > 0 && (
                        <ul className="absolute inset-x-4 bottom-4 flex translate-y-2 flex-wrap gap-1.5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          {item.tags.slice(0, 3).map((tag) => (
                            <li key={tag} className="rounded-full bg-dracon-void/70 px-2.5 py-0.5 text-xs text-dracon-starlight backdrop-blur-sm">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition duration-500 group-hover:ring-dracon-orange-300/50" />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl font-semibold text-dracon-starlight transition-colors duration-300 group-hover:text-white">
                        {item.title}
                      </h3>
                      <span className="meta shrink-0">{item.category.name}</span>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
          {visible.length === 0 && <p className="py-16 text-center text-dracon-mist">{t('portfolio.emptyCategory')}</p>}
        </section>
      )}

      {openIndex !== null && <Lightbox items={visible} index={openIndex} onClose={close} onMove={move} />}
    </div>
  );
}
