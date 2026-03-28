'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';
import { useI18n } from '@/i18n';

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

  const getCharById = (id: string) => characters.find((c) => c.id === id);

  return (
    <div className="relative w-full">
      {/* Constellation SVG */}
      <div className="relative w-full max-w-4xl mx-auto">
        <svg
          viewBox="0 0 850 420"
          className="w-full h-auto"
          style={{ filter: 'drop-shadow(0 0 20px rgba(168,85,244,0.1))' }}
        >
          {/* Connection lines */}
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
                style={{
                  transition: 'all 0.4s ease',
                }}
              />
            );
          })}

          {/* Stars */}
          {characters.map((char) => {
            const isActive = activeCharId === char.id;
            // Try i18n key, fall back to DB value
            const charNameKey = `dragonEyes.characters.${char.charId}.name`;
            const charName = t(charNameKey) !== charNameKey ? t(charNameKey) : char.name;
            return (
              <g
                key={char.id}
                onMouseEnter={() => setHoveredChar(char.id)}
                onMouseLeave={() => setHoveredChar(null)}
                onClick={() =>
                  setSelectedChar(selectedChar === char.id ? null : char.id)
                }
                className="cursor-pointer"
              >
                {/* Glow ring */}
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
                {/* Outer glow */}
                <circle
                  cx={char.cx}
                  cy={char.cy}
                  r={isActive ? 20 : 12}
                  fill={char.color}
                  opacity={isActive ? 0.15 : 0.05}
                  style={{ transition: 'all 0.4s ease' }}
                />
                {/* Star core */}
                <circle
                  cx={char.cx}
                  cy={char.cy}
                  r={isActive ? 7 : 5}
                  fill={char.color}
                  opacity={isActive ? 1 : 0.7}
                  style={{ transition: 'all 0.3s ease' }}
                />
                {/* White center */}
                <circle
                  cx={char.cx}
                  cy={char.cy}
                  r={isActive ? 3 : 2}
                  fill="white"
                  opacity={isActive ? 0.9 : 0.6}
                  style={{ transition: 'all 0.3s ease' }}
                />
                {/* Name label */}
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
                  {charName}
                </text>
              </g>
            );
          })}
        </svg>
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
      className="rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center"
      style={{
        borderColor: `${c.color}33`,
        background: `linear-gradient(135deg, ${c.color}08 0%, transparent 60%), rgba(10,0,21,0.8)`,
      }}
    >
      {/* Character image or placeholder */}
      <div
        className="w-32 h-32 md:w-40 md:h-40 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border"
        style={{
          borderColor: `${c.color}44`,
          background: `radial-gradient(circle at center, ${c.color}22 0%, transparent 70%), rgba(10,0,21,0.6)`,
        }}
      >
        {c.imageUrl ? (
          <img src={c.imageUrl} alt={charName} className="w-full h-full object-cover" />
        ) : (
          <svg width="60" height="60" viewBox="0 0 100 100">
            <polygon
              points="50,5 63,35 95,35 70,57 78,90 50,72 22,90 30,57 5,35 37,35"
              fill="none"
              stroke={c.color}
              strokeWidth="2"
              opacity="0.5"
            />
            <circle cx="50" cy="50" r="15" fill={c.color} opacity="0.3" />
            <circle cx="50" cy="50" r="6" fill={c.color} opacity="0.6" />
          </svg>
        )}
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
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-dracon-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Carregando constelação...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
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
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold glow-text text-dracon-purple-200 mb-4 tracking-wider"
            >
              {t('dragonEyes.hero.title')}
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
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dracon-purple-500/30 to-transparent" />
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
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dracon-orange-500/20 to-transparent" />
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

            <div className="max-w-3xl mx-auto space-y-16">
              {loreSections.map((section, i) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative pl-8 border-l-2 border-dracon-purple-800/30"
                >
                  <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-dracon-purple-500 -translate-x-[7px]" />
                  <span className="text-dracon-purple-400 text-xs tracking-[0.15em] uppercase font-medium">
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
        </section>
      )}

      {/* GALLERY */}
      {galleryItems.length > 0 && (
        <section className="relative py-24">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dracon-purple-500/30 to-transparent" />
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
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-[4/3] rounded-xl overflow-hidden border border-dracon-purple-800/20 group relative cursor-pointer"
                  style={{
                    background: `radial-gradient(ellipse at 40% 40%, ${item.accent}15 0%, transparent 70%), linear-gradient(135deg, #0a0015 0%, #1a0030 100%)`,
                  }}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                      <svg width="80" height="80" viewBox="0 0 100 100">
                        <polygon
                          points="50,5 63,35 95,35 70,57 78,90 50,72 22,90 30,57 5,35 37,35"
                          fill="none"
                          stroke={item.accent}
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-sm text-gray-300 font-display">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-24">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dracon-purple-500/30 to-transparent" />
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
