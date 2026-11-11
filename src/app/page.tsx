'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Mail, Palette, Sparkles } from 'lucide-react';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import ArtImage from '@/components/ui/ArtImage';
import Astrolabe from '@/components/ui/Astrolabe';
import ConstellationDivider from '@/components/ui/ConstellationDivider';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import ConstellationLoader from '@/components/ui/ConstellationLoader';
import { constellationAt } from '@/lib/constellations';
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
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at 30% 40%, ${accent}33 0%, transparent 65%), radial-gradient(ellipse at 75% 70%, ${accent}1f 0%, transparent 60%), linear-gradient(135deg, #0a0015 0%, #1a0030 50%, #0a0015 100%)`,
      }}
    >
      <div className="absolute inset-[14%] opacity-70">
        <ConstellationGlyph id={constellationAt(index)} color={accent} className="h-full w-full" />
      </div>
    </div>
  );
}

const CAROUSEL_FADE = 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)';

/** 3D coverflow carousel: drag/swipe, arrows, dots and autoplay (paused on hover). */
function ArtCarousel({ items }: { items: PortfolioItem[] }) {
  const { t } = useI18n();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const panned = useRef(false);
  const total = items.length;

  const go = useCallback((index: number) => setCurrent(((index % total) + total) % total), [total]);

  useEffect(() => {
    if (total <= 1 || paused) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % total), 5000);
    return () => clearInterval(timer);
  }, [total, paused]);

  if (total === 0) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-6xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative">
        <motion.div
          className="relative h-[230px] overflow-hidden sm:h-[330px] md:h-[430px] lg:h-[470px]"
          style={{ touchAction: 'pan-y', WebkitMaskImage: CAROUSEL_FADE, maskImage: CAROUSEL_FADE }}
          onPanStart={() => {
            panned.current = true;
          }}
          onPanEnd={(_, info) => {
            if (info.offset.x < -50) go(current + 1);
            else if (info.offset.x > 50) go(current - 1);
            setTimeout(() => {
              panned.current = false;
            }, 0);
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center [perspective:1600px]">
            {items.map((art, i) => {
              let offset = i - current;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;
              const distance = Math.abs(offset);
              const visible = distance <= 2;
              const isActive = offset === 0;

              return (
                <motion.button
                  key={art.id}
                  type="button"
                  aria-label={art.title}
                  aria-current={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    if (!panned.current && !isActive) go(i);
                  }}
                  initial={false}
                  animate={{
                    x: `${offset * 62}%`,
                    z: -distance * 240,
                    rotateY: offset * -28,
                    scale: 1 - distance * 0.04,
                    opacity: visible ? [1, 0.6, 0.25][distance] : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 110, damping: 20, mass: 0.9 }}
                  style={{ zIndex: 10 - distance, pointerEvents: visible ? 'auto' : 'none' }}
                  className="absolute h-[88%] w-[80%] overflow-hidden rounded-2xl border border-white/10 bg-dracon-dark text-left shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:w-[64%] md:w-[58%]"
                >
                  <ArtImage
                    src={art.imageUrl}
                    alt={art.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80vw, 700px"
                    fallback={<ArtPlaceholder index={i} />}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dracon-void/95 via-dracon-void/20 to-transparent" />
                  <div
                    className={`absolute inset-x-0 bottom-0 p-5 transition-opacity duration-500 md:p-8 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-dracon-orange-300 md:text-xs">
                      ✦ {art.category.name}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-bold text-white md:text-3xl">{art.title}</h3>
                  </div>
                  {isActive && (
                    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-dracon-purple-100/30" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(current - 1)}
              aria-label={t('home.carousel.prev')}
              className="glass absolute left-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-dracon-purple-100 transition-colors duration-300 hover:text-white md:left-3 md:h-12 md:w-12"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(current + 1)}
              aria-label={t('home.carousel.next')}
              className="glass absolute right-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-dracon-purple-100 transition-colors duration-300 hover:text-white md:right-3 md:h-12 md:w-12"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(i)}
              aria-label={item.title}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current
                  ? 'w-10 bg-gradient-to-r from-dracon-purple-300 to-dracon-orange-400 shadow-[0_0_10px_rgba(168,85,244,0.6)]'
                  : 'w-2 bg-dracon-purple-100/25 hover:bg-dracon-purple-100/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Full-screen hero with the 3D celestial orb and a letter-by-letter title reveal. */
function Hero() {
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 800], [0, 110]);
  const contentOpacity = useTransform(scrollY, [0, 520], [1, 0]);
  const hintOpacity = useTransform(scrollY, [0, 140], [1, 0]);
  const title = t('home.hero.title');

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <CelestialOrb className="absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_62%,rgba(5,0,16,0.75),transparent_75%)]"
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="section-container relative z-10 pb-24 pt-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-dracon-orange-300 sm:text-sm"
        >
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-dracon-orange-400/80 sm:w-14" />
          {t('home.hero.tagline')}
          <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-dracon-orange-400/80 sm:w-14" />
        </motion.p>

        <h1
          aria-label={title}
          className="hero-title mb-8 pl-[0.12em] font-display text-[clamp(3.25rem,13vw,10rem)] font-bold leading-none tracking-[0.12em] [perspective:800px]"
        >
          {Array.from(title).map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              aria-hidden
              className="starlight-fill inline-block"
              initial={{ opacity: 0, y: 50, rotateX: -80, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.35 + i * 0.08, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-balance mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300/90 md:text-xl"
        >
          {t('home.hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link href="/portfolio">
            <MagicButton variant="primary" className="px-8 py-4 text-lg">
              <Sparkles className="h-5 w-5" aria-hidden />
              {t('home.hero.ctaPortfolio')}
            </MagicButton>
          </Link>
          <Link href="/services">
            <MagicButton variant="secondary" className="px-8 py-4 text-lg">
              <Palette className="h-5 w-5" aria-hidden />
              {t('home.hero.ctaServices')}
            </MagicButton>
          </Link>
        </motion.div>
      </motion.div>

      {/* Star-chart annotations */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-8 hidden font-display text-[10px] uppercase tracking-[0.35em] text-dracon-purple-100/40 lg:block"
      >
        γ Draconis · RA 17h 56m · Dec +51° 29′
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-8 hidden font-display text-[10px] uppercase tracking-[0.35em] text-dracon-purple-100/40 lg:block"
      >
        Draco · 1083 deg²
      </div>

      <motion.div
        style={{ opacity: hintOpacity }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-gray-500">{t('home.hero.scroll')}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex h-10 w-6 justify-center rounded-full border-2 border-dracon-purple-200/40"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-2 h-3 w-1.5 rounded-full bg-dracon-purple-100/70"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  const { t } = useI18n();
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

  const featuredItems = allItems.filter((item) => item.featured);
  const carouselItems = allItems.slice(0, 6); // up to 6 items for carousel

  return (
    <>
      <Hero />

      {/* LATEST ARTS CAROUSEL */}
      <section className="relative py-24">
        <ConstellationDivider />
        <div className="section-container">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-dracon-orange-400 text-sm tracking-[0.2em] uppercase font-medium"
            >
              {t('home.carousel.tag')}
            </motion.span>
            <GlowText as="h2" className="text-4xl md:text-5xl font-bold mt-3 mb-4">
              {t('home.carousel.title')}
            </GlowText>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 max-w-lg mx-auto"
            >
              {t('home.carousel.subtitle')}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {loading ? (
              <ConstellationLoader label={t('common.aligningStars')} className="py-24" />
            ) : (
              <ArtCarousel items={carouselItems} />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/portfolio">
              <MagicButton variant="secondary">
                {t('home.carousel.cta')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </MagicButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURED WORKS */}
      <section className="relative py-28">
        <ConstellationDivider variant={1} />
        <div className="section-container">
          <div className="text-center mb-16">
            <GlowText as="h2" className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.featured.title')}
            </GlowText>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 max-w-lg mx-auto"
            >
              {t('home.featured.subtitle')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredItems.length > 0 ? featuredItems.map((work, i) => (
              <AnimatedCard key={work.id} delay={i * 0.15}>
                <div className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-xl p-8">
                  <ArtImage
                    src={work.imageUrl}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    fallback={<ArtPlaceholder index={i + 2} />}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dracon-void via-dracon-void/50 to-transparent" />
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-dracon-orange-400/30 bg-dracon-orange-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-dracon-orange-300">
                      ✦ {work.category.name}
                    </span>
                    <h3 className="mt-3 mb-2 font-display text-2xl font-bold text-white">
                      {work.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-300">{work.description}</p>
                  </div>
                </div>
              </AnimatedCard>
            )) : !loading && (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">✦</p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/portfolio">
              <MagicButton variant="secondary">
                {t('home.featured.cta')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </MagicButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="relative py-28">
        <ConstellationDivider tone="orange" variant={2} />
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-dracon-orange-400 text-sm tracking-[0.2em] uppercase font-medium">
                {t('home.aboutPreview.tag')}
              </span>
              <GlowText as="h2" className="text-4xl md:text-5xl font-bold mt-3 mb-6" animate={false}>
                {t('home.aboutPreview.title')}
              </GlowText>
              <p className="text-gray-400 leading-relaxed mb-4">
                {t('home.aboutPreview.p1')}
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                {t('home.aboutPreview.p2')}
              </p>
              <Link href="/about">
                <MagicButton variant="secondary">
                  {t('home.aboutPreview.cta')}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </MagicButton>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative mx-auto w-full max-w-md"
            >
              <Astrolabe className="w-full">
                <div className="relative w-[46%]">
                  <div
                    aria-hidden
                    className="absolute -inset-[20%] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.18),transparent_70%)]"
                  />
                  <ConstellationGlyph id="draco" color="#fdba74" className="relative h-auto w-full" />
                </div>
              </Astrolabe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-28">
        <ConstellationDivider />
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-celestial relative overflow-hidden rounded-3xl bg-dracon-dark/60 px-6 py-16 text-center backdrop-blur-md md:px-16 md:py-20"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.14),transparent_60%)]"
            />
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-6 w-[48%] opacity-25">
              <ConstellationGlyph id="draco" color="#fdba74" className="h-auto w-full" />
            </div>
            <div aria-hidden className="pointer-events-none absolute -bottom-10 -left-6 w-[34%] opacity-20">
              <ConstellationGlyph id="cassiopeia" className="h-auto w-full" delay={0.6} />
            </div>

            <div className="relative">
              <GlowText as="h2" className="mb-6 text-4xl font-bold md:text-5xl" color="orange" animate={false}>
                {t('home.cta.title')}
              </GlowText>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300/90">
                {t('home.cta.subtitle')}
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/services">
                  <MagicButton variant="fire" className="px-8 py-4 text-lg">
                    <Flame className="h-5 w-5" aria-hidden />
                    {t('home.cta.ctaServices')}
                  </MagicButton>
                </Link>
                <Link href="/contact">
                  <MagicButton variant="secondary" className="px-8 py-4 text-lg">
                    <Mail className="h-5 w-5" aria-hidden />
                    {t('home.cta.ctaContact')}
                  </MagicButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
