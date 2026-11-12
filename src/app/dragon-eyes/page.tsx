'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, Telescope } from 'lucide-react';
import MagicButton from '@/components/ui/MagicButton';
import ConstellationDivider from '@/components/ui/ConstellationDivider';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import ConstellationLoader from '@/components/ui/ConstellationLoader';
import ArtImage from '@/components/ui/ArtImage';
import SectionHeading from '@/components/ui/SectionHeading';
import { useReveal } from '@/components/motion/useReveal';
import { constellationAt } from '@/lib/constellations';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, EASE } from '@/lib/gsap';
import { useI18n } from '@/i18n';

const CONSTELLATION_BOX = 'mx-auto aspect-[4/3] w-full max-w-5xl sm:aspect-[2/1]';

// WebGL scene (client-only)
const DragonConstellation3D = dynamic(() => import('@/components/three/DragonConstellation3D'), {
  ssr: false,
  loading: () => <div className={CONSTELLATION_BOX} />,
});

/* ─── Types ─────────────────────────────────────────────────── */
interface Character {
  id: string;
  charId: string;
  name: string;
  role: string;
  description: string;
  color: string;
  cx: number;
  cy: number;
  imageUrl: string | null;
  order: number;
  active: boolean;
}

interface Line {
  id: string;
  fromId: string;
  toId: string;
}

interface LoreSection {
  id: string;
  title: string;
  text: string;
  chapter: number;
  order: number;
}

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string | null;
  accent: string;
  order: number;
}

/* ─── 2D constellation (fallback when WebGL is unavailable) ─────*/
function ConstellationSVG({
  characters,
  lines,
  activeCharId,
  getName,
  onHover,
  onSelect,
}: {
  characters: Character[];
  lines: Line[];
  activeCharId: string | null;
  getName: (char: Character) => string;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const getCharById = (id: string) => characters.find((c) => c.id === id);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <svg
        viewBox="0 0 850 420"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 0 20px rgba(168,85,244,0.1))' }}
      >
        {lines.map((line) => {
          const from = getCharById(line.fromId);
          const to = getCharById(line.toId);
          if (!from || !to) return null;
          const isActive = activeCharId === from.id || activeCharId === to.id;
          return (
            <line
              key={line.id}
              x1={from.cx}
              y1={from.cy}
              x2={to.cx}
              y2={to.cy}
              stroke={isActive ? '#a855f4' : 'rgba(168,85,244,0.15)'}
              strokeWidth={isActive ? 1.5 : 0.8}
              strokeDasharray={isActive ? 'none' : '4 4'}
              style={{ transition: 'all 0.4s ease' }}
            />
          );
        })}

        {characters.map((char) => {
          const isActive = activeCharId === char.id;
          return (
            <g
              key={char.id}
              onMouseEnter={() => onHover(char.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(char.id)}
              className="cursor-pointer"
            >
              <circle
                cx={char.cx}
                cy={char.cy}
                r={isActive ? 28 : 18}
                fill="none"
                stroke={char.color}
                strokeWidth={isActive ? 1.5 : 0.5}
                opacity={isActive ? 0.6 : 0.2}
                style={{ transition: 'all 0.4s ease' }}
              />
              <circle
                cx={char.cx}
                cy={char.cy}
                r={isActive ? 20 : 12}
                fill={char.color}
                opacity={isActive ? 0.15 : 0.05}
                style={{ transition: 'all 0.4s ease' }}
              />
              <circle
                cx={char.cx}
                cy={char.cy}
                r={isActive ? 7 : 5}
                fill={char.color}
                opacity={isActive ? 1 : 0.7}
                style={{ transition: 'all 0.3s ease' }}
              />
              <circle
                cx={char.cx}
                cy={char.cy}
                r={isActive ? 3 : 2}
                fill="white"
                opacity={isActive ? 0.9 : 0.6}
                style={{ transition: 'all 0.3s ease' }}
              />
              <text
                x={char.cx}
                y={char.cy - (isActive ? 36 : 24)}
                textAnchor="middle"
                fill={isActive ? char.color : 'rgba(200,180,255,0.5)'}
                fontSize={isActive ? 14 : 11}
                fontFamily="var(--font-cinzel)"
                fontWeight={isActive ? 700 : 400}
                style={{ transition: 'all 0.3s ease' }}
              >
                {getName(char)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Constellation Component ─────────────────────────────────*/
function InteractiveConstellation({
  characters,
  lines,
}: {
  characters: Character[];
  lines: Line[];
}) {
  const { t, locale } = useI18n();
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const activeCharId = selectedChar ?? hoveredChar;
  const activeChar = characters.find((c) => c.id === activeCharId);

  // Portuguese comes from the admin (DB); English uses the built-in translation when one exists
  const getName = useCallback(
    (char: Character) => {
      const key = `dragonEyes.characters.${char.charId}.name`;
      const value = t(key);
      return locale === 'en' && value !== key ? value : char.name;
    },
    [t, locale]
  );

  const toggle = useCallback((id: string) => {
    setSelectedChar((prev) => (prev === id ? null : id));
  }, []);

  const nodes = useMemo(
    () => characters.map((c) => ({ id: c.id, name: getName(c), color: c.color, cx: c.cx, cy: c.cy })),
    [characters, getName]
  );

  return (
    <div className="relative w-full">
      <DragonConstellation3D
        nodes={nodes}
        links={lines}
        activeId={activeCharId}
        onHover={setHoveredChar}
        onSelect={toggle}
        className={CONSTELLATION_BOX}
        fallback={
          <ConstellationSVG
            characters={characters}
            lines={lines}
            activeCharId={activeCharId}
            getName={getName}
            onHover={setHoveredChar}
            onSelect={toggle}
          />
        }
      />

      {/* Guardian legend — keyboard & touch friendly selection */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {characters.map((c) => {
          const isActive = c.id === activeCharId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              onMouseEnter={() => setHoveredChar(c.id)}
              onMouseLeave={() => setHoveredChar(null)}
              aria-pressed={selectedChar === c.id}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-display text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive
                  ? 'border-white/30 bg-white/10 text-white'
                  : 'border-white/10 bg-white/[0.03] text-gray-400 hover:text-gray-200'
              }`}
            >
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: c.color, boxShadow: `0 0 10px ${c.color}` }}
              />
              {getName(c)}
            </button>
          );
        })}
      </div>

      {/* Character Detail Panel */}
      <AnimatePresence mode="wait">
        {activeChar && (
          <motion.div
            key={activeChar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-8 max-w-3xl mx-auto"
          >
            <CharacterDetail char={activeChar} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint when nothing selected */}
      {!activeChar && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-dracon-dust mt-8"
        >
          {t('dragonEyes.constellation.hint')}
        </motion.p>
      )}
    </div>
  );
}

/* ─── Character Detail (reused in constellation) ──────────── */
function CharacterDetail({ char: c }: { char: Character }) {
  const { t, locale } = useI18n();

  // Portuguese comes from the admin (DB); English uses the built-in translation when one exists
  const localized = (field: 'name' | 'role' | 'description') => {
    const key = `dragonEyes.characters.${c.charId}.${field}`;
    return locale === 'en' && t(key) !== key ? t(key) : c[field];
  };
  const charName = localized('name');
  const charRole = localized('role');
  const charDesc = localized('description');

  return (
    <div
      className="border-celestial relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl p-6 md:flex-row md:p-8"
      style={{
        background: `radial-gradient(ellipse at top left, ${c.color}24 0%, transparent 60%), rgba(10,0,21,0.82)`,
      }}
    >
      {/* Character image or placeholder */}
      <div
        className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border"
        style={{
          borderColor: `${c.color}44`,
          background: `radial-gradient(circle at center, ${c.color}22 0%, transparent 70%), rgba(10,0,21,0.6)`,
          boxShadow: `0 0 40px -10px ${c.color}`,
        }}
      >
        <ArtImage
          src={c.imageUrl}
          alt={charName}
          fill
          sizes="160px"
          className="object-cover"
          fallback={<ConstellationGlyph id={constellationAt(c.order)} color={c.color} className="h-3/4 w-3/4" />}
        />
      </div>

      {/* Character info */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: c.color }}
          />
          <span
            className="text-sm font-medium italic"
            style={{ color: c.color }}
          >
            {charRole}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
          {charName}
        </h3>
        <p className="text-dracon-mist leading-relaxed md:text-lg">
          {charDesc}
        </p>
      </div>
    </div>
  );
}
/* ─── Main Page ────────────────────────────────────────────── */
export default function DragonEyesPage() {
  const { t } = useI18n();
  const page = useRef<HTMLDivElement>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [loreSections, setLoreSections] = useState<LoreSection[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/constellation');
      const json = await res.json();
      if (json.success) {
        setCharacters(json.data.characters);
        setLines(json.data.lines);
        setLoreSections(json.data.lore);
        setGalleryItems(json.data.gallery);
      }
    } catch (err) {
      console.error('Failed to fetch constellation data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useReveal(page, [loading]);

  useGSAP(
    () => {
      if (loading) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Seven stars open: the title condenses out of starlight over the dragon's chart
        gsap
          .timeline({ defaults: { ease: EASE } })
          .from('[data-de-glyph]', { opacity: 0, scale: 0.86, rotate: -6, duration: 2.6 })
          .from('[data-de-char]', { yPercent: 70, rotateX: -80, opacity: 0, filter: 'blur(12px)', duration: 1.5, stagger: 0.05 }, 0.25)
          .from('[data-de-sub]', { opacity: 0, y: 20, duration: 1.2 }, 0.9);

        gsap.to('[data-de-glyph]', {
          yPercent: 18,
          rotate: 6,
          ease: 'none',
          scrollTrigger: { trigger: '[data-de-hero]', start: 'top top', end: 'bottom top', scrub: true },
        });

        // The lore is read along a line of light, each chapter's star igniting as it is reached
        const stars = gsap.utils.toArray<HTMLElement>('[data-lore-star]');
        if (stars.length) {
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: '[data-lore]', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
          });
          tl.fromTo('[data-lore-line]', { scaleY: 0 }, { scaleY: 1, duration: stars.length }, 0);
          stars.forEach((star, i) => {
            tl.fromTo(
              star,
              { scale: 0.5, backgroundColor: '#2e0550', boxShadow: '0 0 0 0 rgba(216,180,254,0)' },
              { scale: 1, backgroundColor: '#f3e8ff', boxShadow: '0 0 22px 6px rgba(192,132,252,0.7)', duration: 0.3 },
              i + 0.05
            );
          });
        }
      });
    },
    { scope: page, dependencies: [loading], revertOnUpdate: true }
  );

  useEffect(() => {
    if (loading) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [loading]);

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <ConstellationLoader label={t('common.aligningStars')} />
      </section>
    );
  }

  const title = t('dragonEyes.hero.title');

  return (
    <div ref={page}>
      {/* HERO */}
      <section data-de-hero className="relative flex min-h-[86vh] items-center justify-center overflow-hidden pt-24">
        <div
          data-de-glyph
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 w-[min(94vw,1000px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.22]"
        >
          <ConstellationGlyph id="draco" color="#fdba74" className="h-auto w-full" />
        </div>
        <div className="section-container relative z-10 text-center">
          <h1
            aria-label={title}
            className="hero-title font-display text-[clamp(3rem,11vw,8.5rem)] font-bold leading-none tracking-[0.08em] [perspective:900px]"
          >
            {title.split(' ').map((word, w) => (
              <span key={w}>
                {w > 0 && ' '}
                <span aria-hidden className="inline-block whitespace-nowrap">
                  {Array.from(word).map((ch, i) => (
                    <span key={i} data-de-char className="starlight-fill inline-block">
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>
          <p data-de-sub className="text-pretty mx-auto mt-8 max-w-[40rem] text-lg font-light leading-relaxed text-dracon-starlight/85 md:text-xl">
            {t('dragonEyes.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* CONSTELLATION */}
      {characters.length > 0 && (
        <section aria-labelledby="constelacao" className="relative py-20">
          <ConstellationDivider />
          <div className="section-container">
            <SectionHeading
              id="constelacao"
              align="center"
              className="mb-12"
              title={t('dragonEyes.constellation.title')}
              subtitle={t('dragonEyes.constellation.subtitle')}
            />
            <InteractiveConstellation characters={characters} lines={lines} />
          </div>
        </section>
      )}

      {/* LORE / STORY */}
      {loreSections.length > 0 && (
        <section aria-labelledby="historia" className="relative py-28">
          <ConstellationDivider tone="orange" variant={2} />
          <div className="section-container">
            <SectionHeading id="historia" title={t('dragonEyes.lore.title')} />

            <ol data-lore className="relative mx-auto mt-16 max-w-3xl">
              <span aria-hidden className="absolute bottom-0 left-[7px] top-2 w-px bg-dracon-purple-100/15" />
              <span
                aria-hidden
                data-lore-line
                className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-dracon-purple-200 via-dracon-orange-300/70 to-transparent"
              />
              {loreSections.map((section, i) => (
                <li key={section.id} className="relative mb-16 pl-14 last:mb-0">
                  <span aria-hidden data-lore-star className="absolute left-[1px] top-2 h-[13px] w-[13px] rounded-full bg-dracon-purple-50" />
                  <div data-reveal="rise">
                    <p className="meta">
                      {t('dragonEyes.lore.chapterLabel')} {section.chapter || i + 1}
                    </p>
                    <h3 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold text-dracon-starlight">{section.title}</h3>
                    <p className="text-pretty mt-4 text-lg leading-relaxed text-dracon-mist">{section.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {galleryItems.length > 0 && (
        <section aria-labelledby="galeria" className="relative py-28">
          <ConstellationDivider variant={1} />
          <div className="section-container">
            <SectionHeading id="galeria" title={t('dragonEyes.gallery.title')} subtitle={t('dragonEyes.gallery.subtitle')} />

            <ul className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
              {galleryItems.map((item, i) => (
                <li key={item.id} className="break-inside-avoid">
                  <figure>
                    <div
                      data-reveal="mask"
                      className={`group relative overflow-hidden rounded-2xl ${i % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
                      style={{
                        background: `radial-gradient(ellipse at 40% 40%, ${item.accent}26 0%, transparent 70%), linear-gradient(135deg, #0a0015 0%, #1a0030 100%)`,
                      }}
                    >
                      <ArtImage
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                        fallback={
                          <div data-reveal-media className="absolute inset-[16%] opacity-50 transition-opacity duration-500 group-hover:opacity-80">
                            <ConstellationGlyph id={constellationAt(i)} color={item.accent} animate={false} className="h-full w-full" />
                          </div>
                        }
                      />
                      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                    </div>
                    <figcaption className="mt-3 flex items-center gap-3 text-dracon-mist">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.accent, boxShadow: `0 0 8px ${item.accent}` }} />
                      {item.title}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {characters.length === 0 && loreSections.length === 0 && galleryItems.length === 0 && (
        <p className="section-container py-20 text-center text-lg text-dracon-mist">{t('dragonEyes.empty')}</p>
      )}

      {/* CTA */}
      <section aria-labelledby="dragon-eyes-cta" className="relative py-28">
        <ConstellationDivider variant={2} />
        <div className="section-container">
          <SectionHeading id="dragon-eyes-cta" align="center" title={t('dragonEyes.cta.title')} subtitle={t('dragonEyes.cta.subtitle')} />
          <div data-reveal="rise" className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <MagicButton href="/portfolio" variant="primary">
              <Images className="h-4 w-4" aria-hidden />
              {t('dragonEyes.cta.ctaPortfolio')}
            </MagicButton>
            <MagicButton href="/contact" variant="secondary">
              <Telescope className="h-4 w-4" aria-hidden />
              {t('dragonEyes.cta.ctaFollow')}
            </MagicButton>
          </div>
        </div>
      </section>
    </div>
  );
}
