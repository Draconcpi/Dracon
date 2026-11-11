'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import ConstellationDivider from '@/components/ui/ConstellationDivider';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import ConstellationLoader from '@/components/ui/ConstellationLoader';
import ArtImage from '@/components/ui/ArtImage';
import { constellationAt } from '@/lib/constellations';
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
  const { t } = useI18n();
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const activeCharId = selectedChar ?? hoveredChar;
  const activeChar = characters.find((c) => c.id === activeCharId);

  // Try i18n key, fall back to DB value
  const getName = useCallback(
    (char: Character) => {
      const key = `dragonEyes.characters.${char.charId}.name`;
      const value = t(key);
      return value !== key ? value : char.name;
    },
    [t]
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
          className="text-center text-gray-500 text-sm mt-8"
        >
          {t('dragonEyes.constellation.hint')}
        </motion.p>
      )}
    </div>
  );
}

/* ─── Character Detail (reused in constellation) ──────────── */
function CharacterDetail({ char: c }: { char: Character }) {
  const { t } = useI18n();

  // Try i18n key, fall back to DB value
  const nameKey = `dragonEyes.characters.${c.charId}.name`;
  const roleKey = `dragonEyes.characters.${c.charId}.role`;
  const descKey = `dragonEyes.characters.${c.charId}.description`;
  const charName = t(nameKey) !== nameKey ? t(nameKey) : c.name;
  const charRole = t(roleKey) !== roleKey ? t(roleKey) : c.role;
  const charDesc = t(descKey) !== descKey ? t(descKey) : c.description;

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
            className="text-xs tracking-[0.2em] uppercase font-medium"
            style={{ color: c.color }}
          >
            {charRole}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
          {charName}
        </h3>
        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
          {charDesc}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function DragonEyesPage() {
  const { t } = useI18n();
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

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <ConstellationLoader label={t('common.aligningStars')} />
      </section>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 w-[min(92vw,960px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.14]"
        >
          <ConstellationGlyph id="draco" color="#fdba74" className="h-auto w-full" />
        </div>
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-dracon-orange-400 text-sm tracking-[0.3em] uppercase font-medium mb-4"
            >
              {t('dragonEyes.hero.tag')}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="hero-title text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-4 tracking-wider"
            >
              <span className="starlight-fill">{t('dragonEyes.hero.title')}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              {t('dragonEyes.hero.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CONSTELLATION */}
      {characters.length > 0 && (
        <section className="relative py-20">
          <ConstellationDivider />
          <div className="section-container">
            <div className="text-center mb-12">
              <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4">
                {t('dragonEyes.constellation.title')}
              </GlowText>
              <p className="text-gray-400 max-w-lg mx-auto">
                {t('dragonEyes.constellation.subtitle')}
              </p>
            </div>

            <InteractiveConstellation characters={characters} lines={lines} />
          </div>
        </section>
      )}

      {/* LORE / STORY */}
      {loreSections.length > 0 && (
        <section className="relative py-24">
          <ConstellationDivider tone="orange" variant={2} />
          <div className="section-container">
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-dracon-orange-400 text-sm tracking-[0.2em] uppercase font-medium"
              >
                {t('dragonEyes.lore.tag')}
              </motion.span>
              <GlowText as="h2" className="text-3xl md:text-4xl font-bold mt-3 mb-4" color="orange">
                {t('dragonEyes.lore.title')}
              </GlowText>
            </div>

            <div className="relative mx-auto max-w-3xl">
              <div
                aria-hidden
                className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-dracon-purple-300/60 via-dracon-orange-300/30 to-transparent"
              />
              <div className="space-y-14">
                {loreSections.map((section, i) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="relative pl-12"
                  >
                    <span aria-hidden className="absolute left-0 top-1 flex h-4 w-4 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-dracon-purple-300/40 animate-pulse-ring" />
                      <span className="relative h-2.5 w-2.5 rounded-full bg-dracon-purple-50 shadow-[0_0_12px_3px_rgba(192,132,252,0.8)]" />
                    </span>
                    <span className="text-dracon-purple-200 text-xs tracking-[0.15em] uppercase font-medium">
                      {t('dragonEyes.lore.chapterLabel')} {section.chapter || i + 1}
                    </span>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white mt-1 mb-3">
                      {section.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">{section.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {galleryItems.length > 0 && (
        <section className="relative py-24">
          <ConstellationDivider variant={1} />
          <div className="section-container">
            <div className="text-center mb-12">
              <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4">
                {t('dragonEyes.gallery.title')}
              </GlowText>
              <p className="text-gray-400 max-w-lg mx-auto">
                {t('dragonEyes.gallery.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, i) => (
                <AnimatedCard key={item.id} delay={i * 0.1}>
                  <div
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl"
                    style={{
                      background: `radial-gradient(ellipse at 40% 40%, ${item.accent}22 0%, transparent 70%), linear-gradient(135deg, #0a0015 0%, #1a0030 100%)`,
                    }}
                  >
                    <ArtImage
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                      fallback={
                        <div className="absolute inset-[16%] opacity-40 transition-opacity duration-500 group-hover:opacity-70">
                          <ConstellationGlyph id={constellationAt(i)} color={item.accent} className="h-full w-full" />
                        </div>
                      }
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="font-display text-sm text-gray-200">{item.title}</p>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-24">
        <ConstellationDivider variant={2} />
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4">
              {t('dragonEyes.cta.title')}
            </GlowText>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              {t('dragonEyes.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/portfolio">
                <MagicButton variant="primary">{t('dragonEyes.cta.ctaPortfolio')}</MagicButton>
              </a>
              <a href="/contact">
                <MagicButton variant="secondary">{t('dragonEyes.cta.ctaFollow')}</MagicButton>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
