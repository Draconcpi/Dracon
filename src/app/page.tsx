'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Flame, Mail, Palette, Sparkles } from 'lucide-react';
import MagicButton from '@/components/ui/MagicButton';
import ArtImage from '@/components/ui/ArtImage';
import Astrolabe from '@/components/ui/Astrolabe';
import ConstellationDivider from '@/components/ui/ConstellationDivider';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import ConstellationLoader from '@/components/ui/ConstellationLoader';
import SectionHeading from '@/components/ui/SectionHeading';
import { useReveal } from '@/components/motion/useReveal';
import { constellationAt } from '@/lib/constellations';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, EASE } from '@/lib/gsap';
import { useI18n } from '@/i18n';

// WebGL hero centrepiece (client-only)
const CelestialOrb = dynamic(() => import('@/components/three/CelestialOrb'), { ssr: false });

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: { id: string; name: string; slug: string };
  tags: string[];
  featured: boolean;
  order: number;
}

const defaultAccents = ['#a855f4', '#f97316', '#818cf8', '#c084fc', '#8b5cf6', '#f59e0b'];

/** Star-chart placeholder used while an artwork has no image. */
function ArtPlaceholder({ index }: { index: number }) {
  const accent = defaultAccents[index % defaultAccents.length];
  return (
    <div
      data-reveal-media
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at 30% 40%, ${accent}33 0%, transparent 65%), radial-gradient(ellipse at 75% 70%, ${accent}1f 0%, transparent 60%), linear-gradient(135deg, #0a0015 0%, #1a0030 50%, #0a0015 100%)`,
      }}
    >
      <div className="absolute inset-[16%] opacity-70">
        <ConstellationGlyph id={constellationAt(index)} color={accent} animate={false} className="h-full w-full" />
      </div>
    </div>
  );
}

/* ═══ Hero ═══════════════════════════════════════════════════════════ */

function Hero() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const title = t('home.hero.title');
  const tagline = t('home.hero.tagline').replace(/✦/g, '').trim();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // One orchestrated arrival: the planet surfaces, the name condenses out of starlight, then the offer.
        gsap
          .timeline({ defaults: { ease: EASE } })
          .from('[data-orb]', { scale: 0.82, opacity: 0, duration: 2.4 })
          .from('[data-hero-line]', { scaleX: 0, duration: 1.4, ease: 'power3.inOut' }, 0.3)
          .from('[data-hero-tag]', { opacity: 0, y: 12, duration: 1.1 }, 0.45)
          .from(
            '[data-hero-char]',
            { yPercent: 70, rotateX: -85, opacity: 0, filter: 'blur(14px)', duration: 1.6, stagger: 0.07 },
            0.5
          )
          .from('[data-hero-sub]', { opacity: 0, y: 22, duration: 1.2 }, 1.1)
          .from('[data-hero-cta] > *', { opacity: 0, y: 22, duration: 1.1, stagger: 0.1 }, 1.25)
          .from('[data-hero-meta]', { opacity: 0, duration: 1.6 }, 1.6);

        // Scrolling away dives toward the planet while the type drifts up into the dark.
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
          })
          .to('[data-orb]', { scale: 1.35, yPercent: 8, ease: 'none' }, 0)
          .to('[data-hero-copy]', { yPercent: -18, opacity: 0, ease: 'none' }, 0)
          .to('[data-hero-title]', { letterSpacing: '0.24em', ease: 'none' }, 0)
          .to('[data-hero-meta]', { opacity: 0, ease: 'none' }, 0);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div data-orb className="absolute inset-0 will-change-transform">
        <CelestialOrb className="absolute inset-0" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_42%_at_50%_60%,rgba(5,0,16,0.72),transparent_75%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-dracon-void" />

      <div data-hero-copy className="section-container relative z-10 pb-24 pt-28 text-center">
        <p className="mb-7 flex items-center justify-center gap-4 text-sm font-medium tracking-[0.18em] text-dracon-orange-200 sm:text-base">
          <span data-hero-line aria-hidden className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-dracon-orange-300/80 sm:w-16" />
          <span data-hero-tag>{tagline}</span>
          <span data-hero-line aria-hidden className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-dracon-orange-300/80 sm:w-16" />
        </p>

        <h1
          data-hero-title
          aria-label={title}
          className="hero-title mb-9 pl-[0.12em] font-display text-[clamp(3.5rem,14vw,10.5rem)] font-bold leading-none tracking-[0.12em] [perspective:900px]"
        >
          {Array.from(title).map((char, i) => (
            <span key={`${char}-${i}`} data-hero-char aria-hidden className="starlight-fill inline-block will-change-transform">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <p data-hero-sub className="text-pretty mx-auto mb-11 max-w-[38rem] text-lg font-light leading-relaxed text-dracon-starlight/85 md:text-xl">
          {t('home.hero.subtitle')}
        </p>

        <div data-hero-cta className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagicButton href="/portfolio" variant="primary" className="px-8 py-4 text-lg">
            <Sparkles className="h-5 w-5" aria-hidden />
            {t('home.hero.ctaPortfolio')}
          </MagicButton>
          <MagicButton href="/services" variant="secondary" className="px-8 py-4 text-lg">
            <Palette className="h-5 w-5" aria-hidden />
            {t('home.hero.ctaServices')}
          </MagicButton>
        </div>
      </div>

      {/* Star-chart annotations */}
      <div data-hero-meta aria-hidden className="pointer-events-none absolute inset-x-8 bottom-8 hidden items-end justify-between lg:flex">
        <span className="font-display text-[11px] tracking-[0.3em] text-dracon-mist/60">γ Draconis · RA 17h 56m · Dec +51° 29′</span>
        <span className="flex flex-col items-center gap-3 text-xs tracking-[0.2em] text-dracon-dust">
          {t('home.hero.scroll')}
          <span className="relative h-12 w-px overflow-hidden bg-dracon-purple-100/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-hint_2.4s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-gradient-to-b from-transparent to-dracon-orange-200" />
          </span>
        </span>
        <span className="font-display text-[11px] tracking-[0.3em] text-dracon-mist/60">Draco · 1083 deg²</span>
      </div>
    </section>
  );
}

/* ═══ Latest works: a pinned orbit the visitor travels with the scroll ═══ */

function LatestOrbit({ items, loading }: { items: PortfolioItem[]; loading: boolean }) {
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!items.length || !track.current || !viewport.current) return;
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - viewport.current!.clientWidth);
        gsap.set(viewport.current, { overflow: 'visible' });

        const travel = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo(
          '[data-orbit-progress]',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
          }
        );

        // Each plate drifts against the travel, so the art seems to sit deeper than its frame.
        gsap.utils.toArray<HTMLElement>('[data-orbit-card]').forEach((card) => {
          const media = card.querySelector('[data-orbit-media]');
          if (!media) return;
          gsap.fromTo(
            media,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: travel, start: 'left right', end: 'right left', scrub: true },
            }
          );
        });
      });
    },
    { scope: section, dependencies: [items.length], revertOnUpdate: true }
  );

  return (
    <section ref={section} aria-labelledby="ultimas-artes" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24">
      <ConstellationDivider />
      <div className="section-container mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="ultimas-artes" data-reveal="rise" className="display text-[clamp(2.25rem,4.6vw,3.75rem)]">
            {t('home.carousel.title')}
          </h2>
          <p data-reveal="rise" className="text-pretty mt-4 max-w-[44ch] text-lg text-dracon-mist">
            {t('home.carousel.subtitle')}
          </p>
        </div>
        <Link
          data-reveal="rise"
          href="/portfolio"
          className="link-underline inline-flex items-center gap-2 self-start pb-1 text-base font-medium text-dracon-starlight md:self-auto"
        >
          {t('home.carousel.cta')}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      {loading ? (
        <ConstellationLoader label={t('common.aligningStars')} className="py-24" />
      ) : (
        <div ref={viewport} className="no-scrollbar overflow-x-auto overscroll-x-contain">
          <div ref={track} className="flex w-max snap-x snap-mandatory gap-5 px-4 sm:px-6 lg:snap-none lg:gap-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            {items.map((art, i) => (
              <Link
                key={art.id}
                href="/portfolio"
                data-orbit-card
                className="group w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-auto"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-dracon-dark shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] lg:aspect-auto lg:h-[58vh] lg:w-[calc(58vh*0.8)]">
                  <div data-orbit-media className="absolute -inset-x-[8%] inset-y-0">
                    <ArtImage
                      src={art.thumbnailUrl || art.imageUrl}
                      alt={art.title}
                      fill
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 40vh"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      fallback={<ArtPlaceholder index={i} />}
                    />
                  </div>
                  <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 transition duration-500 group-hover:ring-dracon-orange-300/50" />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xl font-semibold text-dracon-starlight">{art.title}</h3>
                    <p className="meta mt-1">{art.category.name}</p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 h-5 w-5 shrink-0 text-dracon-dust transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-dracon-orange-300"
                    aria-hidden
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && items.length > 1 && (
        <div className="section-container mt-12 hidden lg:block">
          <div aria-hidden className="relative h-px bg-dracon-purple-100/15">
            <span data-orbit-progress className="absolute inset-0 origin-left bg-gradient-to-r from-dracon-purple-300 to-dracon-orange-300" />
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══ Featured works: an editorial spread instead of a uniform grid ═══ */

const FEATURE_LAYOUT = [
  { box: 'md:col-span-7', frame: 'aspect-[4/5]' },
  { box: 'md:col-span-5 md:mt-40', frame: 'aspect-[4/5]' },
  { box: 'md:col-span-10 md:col-start-2', frame: 'aspect-[16/9]' },
  { box: 'md:col-span-5 md:col-start-2', frame: 'aspect-[4/5]' },
  { box: 'md:col-span-6 md:mt-32', frame: 'aspect-[4/5]' },
];

function FeaturedWorks({ items }: { items: PortfolioItem[] }) {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -6 },
            { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }
          );
        });
      });
    },
    { scope: root, dependencies: [items.length], revertOnUpdate: true }
  );

  if (items.length === 0) return null;

  return (
    <section ref={root} aria-labelledby="destaques" className="relative py-28 md:py-36">
      <ConstellationDivider variant={1} />
      <div className="section-container">
        <SectionHeading id="destaques" title={t('home.featured.title')} subtitle={t('home.featured.subtitle')} />

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-16 md:mt-24 md:grid-cols-12 md:gap-y-28">
          {items.map((work, i) => {
            const layout = FEATURE_LAYOUT[i % FEATURE_LAYOUT.length];
            return (
              <article key={work.id} className={layout.box}>
                <Link href="/portfolio" className="group block" aria-label={work.title}>
                  <div data-reveal="mask" className={`relative overflow-hidden rounded-2xl bg-dracon-dark ${layout.frame}`}>
                    <div data-parallax className="absolute -inset-y-[8%] inset-x-0">
                      <ArtImage
                        src={work.imageUrl}
                        alt={work.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        fallback={<ArtPlaceholder index={i + 2} />}
                      />
                    </div>
                    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                  </div>
                  <div data-reveal="rise" className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-[1fr_auto] sm:items-baseline">
                    <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-semibold leading-tight text-dracon-starlight transition-colors duration-500 group-hover:text-white">
                      {work.title}
                    </h3>
                    <p className="meta sm:text-right">{work.category.name}</p>
                    <p className="text-pretty max-w-[52ch] text-dracon-mist sm:col-span-2 line-clamp-2">{work.description}</p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <div data-reveal="rise" className="mt-20 flex justify-center">
          <MagicButton href="/portfolio" variant="secondary">
            {t('home.featured.cta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </MagicButton>
        </div>
      </div>
    </section>
  );
}

/* ═══ About preview ═══ */

function AboutPreview() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-astrolabe]',
          { rotate: -18, yPercent: 10 },
          { rotate: 12, yPercent: -10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-labelledby="sobre-artista" className="relative py-28 md:py-36">
      <ConstellationDivider tone="orange" variant={2} />
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="sobre-artista" data-reveal="rise" className="display text-[clamp(2.25rem,4.6vw,3.75rem)]">
              {t('home.aboutPreview.title')}
            </h2>
            <p data-reveal="rise" className="text-pretty mt-8 max-w-[58ch] text-lg leading-relaxed text-dracon-starlight/90">
              {t('home.aboutPreview.p1')}
            </p>
            <p data-reveal="rise" className="text-pretty mt-5 max-w-[58ch] text-lg leading-relaxed text-dracon-mist">
              {t('home.aboutPreview.p2')}
            </p>
            <div data-reveal="rise" className="mt-10">
              <MagicButton href="/about" variant="secondary">
                {t('home.aboutPreview.cta')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </MagicButton>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:col-start-8">
            <div data-astrolabe>
              <Astrolabe className="w-full">
                <div className="relative w-[46%]">
                  <div
                    aria-hidden
                    className="absolute -inset-[20%] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.18),transparent_70%)]"
                  />
                  <ConstellationGlyph id="draco" color="#fdba74" className="relative h-auto w-full" />
                </div>
              </Astrolabe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ Closing call: a planet's limb rises behind the offer ═══ */

function CommissionCall() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-horizon]',
          { yPercent: 18 },
          { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: true } }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-labelledby="encomenda" className="relative pb-28 pt-16 md:pb-36">
      <div className="section-container relative z-10">
        <div className="border-celestial relative overflow-hidden rounded-[2rem] bg-dracon-void/70 px-6 pb-48 pt-20 text-center md:px-16 md:pb-64 md:pt-28">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-8 w-[44%] opacity-25">
            <ConstellationGlyph id="draco" color="#fdba74" className="h-auto w-full" />
          </div>
          <div aria-hidden className="pointer-events-none absolute -left-6 top-10 w-[30%] opacity-20">
            <ConstellationGlyph id="cassiopeia" className="h-auto w-full" delay={0.6} />
          </div>
          <div aria-hidden data-horizon className="planet-horizon top-[70%] md:top-[66%]" />

          <div className="relative">
            <h2 id="encomenda" data-reveal="rise" className="display mx-auto max-w-[16ch] text-[clamp(2.5rem,6vw,4.75rem)]">
              {t('home.cta.title')}
            </h2>
            <p data-reveal="rise" className="text-pretty mx-auto mt-6 max-w-[52ch] text-lg text-dracon-mist">
              {t('home.cta.subtitle')}
            </p>
            <div data-reveal="rise" className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagicButton href="/services" variant="fire" className="px-8 py-4 text-lg">
                <Flame className="h-5 w-5" aria-hidden />
                {t('home.cta.ctaServices')}
              </MagicButton>
              <MagicButton href="/contact" variant="secondary" className="px-8 py-4 text-lg">
                <Mail className="h-5 w-5" aria-hidden />
                {t('home.cta.ctaContact')}
              </MagicButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const page = useRef<HTMLDivElement>(null);
  const [allItems, setAllItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        if (data.success) setAllItems(data.data);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  const latest = allItems.slice(0, 6);
  const featured = allItems.filter((item) => item.featured);

  useReveal(page, [loading]);

  // Pin spacing and trigger positions depend on the art that just arrived
  useEffect(() => {
    if (loading) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [loading]);

  return (
    <div ref={page}>
      <Hero />
      <LatestOrbit items={latest} loading={loading} />
      <FeaturedWorks items={featured} />
      <AboutPreview />
      <CommissionCall />
    </div>
  );
}
