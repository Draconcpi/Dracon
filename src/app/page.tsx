'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';
import ConstellationLines from '@/components/ui/ConstellationLines';
import AnimatedCard from '@/components/ui/AnimatedCard';

function ArcaneSymbol() {
  return (
    <motion.svg
      width="200"
      height="200"
      viewBox="0 0 300 300"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
    >
      <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(168,85,244,0.3)" strokeWidth="0.5" />
      <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(168,85,244,0.2)" strokeWidth="0.5" />
      <circle cx="150" cy="150" r="100" fill="none" stroke="rgba(168,85,244,0.15)" strokeWidth="0.5" />
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 150 + 130 * Math.cos(rad);
        const y = 150 + 130 * Math.sin(rad);
        return <circle key={angle} cx={x} cy={y} r="4" fill="rgba(168,85,244,0.4)" />;
      })}
      <polygon
        points="150,30 170,110 250,110 185,160 205,240 150,190 95,240 115,160 50,110 130,110"
        fill="none"
        stroke="rgba(249,115,22,0.15)"
        strokeWidth="0.5"
      />
    </motion.svg>
  );
}

const featuredWorks = [
  {
    title: 'O Guardião das Estrelas',
    category: 'Ilustração',
    description: 'Uma criatura ancestral que vela pelos segredos das constelações.',
    gradient: 'from-dracon-purple-800/40 to-dracon-purple-900/40',
  },
  {
    title: 'Dragão Arcano',
    category: 'Concept Art',
    description: 'Nascido das forças primordiais da magia, envolvido em runas e energia arcana.',
    gradient: 'from-dracon-purple-900/40 to-dracon-orange-700/20',
  },
  {
    title: 'Ritual da Lua Crescente',
    category: 'Animação',
    description: 'Ritual mágico sob a luz da lua crescente com partículas de energia.',
    gradient: 'from-dracon-orange-700/20 to-dracon-purple-800/40',
  },
  {
    title: 'Constelação do Fênix',
    category: 'Arte Digital Mística',
    description: 'Mapa estelar representando a constelação perdida do Fênix.',
    gradient: 'from-dracon-purple-800/40 to-dracon-cosmic',
  },
];

const latestArts = [
  {
    title: 'O Guardião das Estrelas',
    category: 'Ilustração',
    imageUrl: '/images/portfolio/guardian-stars.jpg',
    color: 'from-purple-900/80 via-purple-800/60 to-transparent',
    accent: '#a855f4',
  },
  {
    title: 'Dragão Arcano',
    category: 'Concept Art',
    imageUrl: '/images/portfolio/arcane-dragon.jpg',
    color: 'from-orange-900/80 via-orange-800/60 to-transparent',
    accent: '#f97316',
  },
  {
    title: 'Ritual da Lua Crescente',
    category: 'Animação',
    imageUrl: '/images/portfolio/moon-ritual.jpg',
    color: 'from-indigo-900/80 via-indigo-800/60 to-transparent',
    accent: '#818cf8',
  },
  {
    title: 'Constelação do Fênix',
    category: 'Arte Digital Mística',
    imageUrl: '/images/portfolio/phoenix-constellation.jpg',
    color: 'from-purple-900/80 via-purple-800/60 to-transparent',
    accent: '#c084fc',
  },
  {
    title: 'A Feiticeira das Sombras',
    category: 'Ilustração',
    imageUrl: '/images/portfolio/shadow-sorceress.jpg',
    color: 'from-violet-900/80 via-violet-800/60 to-transparent',
    accent: '#8b5cf6',
  },
  {
    title: 'Olho do Cosmos',
    category: 'Arte Digital Mística',
    imageUrl: '/images/portfolio/cosmic-eye.jpg',
    color: 'from-amber-900/80 via-amber-800/60 to-transparent',
    accent: '#f59e0b',
  },
];

function ArtCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = latestArts.length;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const art = latestArts[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Main carousel area */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border border-dracon-purple-800/30">
        {/* Background with gradient placeholder */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            {/* Gradient background as placeholder for image */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 30% 50%, ${art.accent}33 0%, transparent 70%), radial-gradient(ellipse at 70% 30%, ${art.accent}22 0%, transparent 60%), linear-gradient(135deg, #0a0015 0%, #1a0030 50%, #0a0015 100%)`,
              }}
            />

            {/* Decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <polygon
                  points="100,10 125,75 195,75 140,115 155,185 100,145 45,185 60,115 5,75 75,75"
                  fill="none"
                  stroke={art.accent}
                  strokeWidth="0.5"
                />
                <circle cx="100" cy="100" r="80" fill="none" stroke={art.accent} strokeWidth="0.3" />
              </svg>
            </div>

            {/* Bottom gradient overlay */}
            <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t ${art.color}`} />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-dracon-orange-400 text-xs md:text-sm tracking-[0.2em] uppercase font-medium mb-2"
              >
                ✦ {art.category}
              </motion.span>
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-4xl font-display font-bold text-white mb-2 glow-text"
              >
                {art.title}
              </motion.h3>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-dracon-void/60 border border-dracon-purple-600/40 backdrop-blur-sm flex items-center justify-center text-dracon-purple-300 hover:bg-dracon-purple-600/30 hover:border-dracon-purple-400 transition-all duration-300"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-dracon-void/60 border border-dracon-purple-600/40 backdrop-blur-sm flex items-center justify-center text-dracon-purple-300 hover:bg-dracon-purple-600/30 hover:border-dracon-purple-400 transition-all duration-300"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {latestArts.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === current
                ? 'w-8 bg-dracon-purple-400'
                : 'w-2 bg-dracon-purple-800/50 hover:bg-dracon-purple-600/50'
            }`}
          />
        ))}
      </div>

      {/* Thumbnails row */}
      <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-thin">
        {latestArts.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`flex-shrink-0 w-20 h-14 md:w-28 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              i === current
                ? 'border-dracon-purple-400 shadow-arcane scale-105'
                : 'border-dracon-purple-800/30 opacity-50 hover:opacity-80 hover:border-dracon-purple-600/50'
            }`}
          >
            <div
              className="w-full h-full"
              style={{
                background: `radial-gradient(ellipse at center, ${item.accent}44 0%, #0a001588 100%)`,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ConstellationLines />
        <ArcaneSymbol />

        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-dracon-orange-400 text-sm tracking-[0.3em] uppercase font-medium mb-6"
            >
              ✦ Ilustração & Animação ✦
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-display font-bold glow-text text-dracon-purple-200 mb-6 tracking-wider"
            >
              DRACON
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Criando universos visuais onde magia e imaginação se encontram
              entre estrelas e constelações. Arte mística, fantasia e mundos arcanos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/portfolio">
                <MagicButton variant="primary" className="text-lg px-8 py-4">
                  ✦ Ver Portfólio
                </MagicButton>
              </Link>
              <Link href="/services">
                <MagicButton variant="secondary" className="text-lg px-8 py-4">
                  Encomendar Arte
                </MagicButton>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-dracon-purple-600/40 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-3 bg-dracon-purple-400/60 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* LATEST ARTS CAROUSEL */}
      <section className="relative py-24">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dracon-purple-500/30 to-transparent" />
        <div className="section-container">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-dracon-orange-400 text-sm tracking-[0.2em] uppercase font-medium"
            >
              ✦ Galeria
            </motion.span>
            <GlowText as="h2" className="text-4xl md:text-5xl font-bold mt-3 mb-4">
              Últimas Artes
            </GlowText>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 max-w-lg mx-auto"
            >
              Navegue pelas criações mais recentes do universo Dracon.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ArtCarousel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/portfolio">
              <MagicButton variant="secondary">Explorar portfólio completo →</MagicButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURED WORKS */}
      <section className="relative py-32">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dracon-purple-500/30 to-transparent" />
        <div className="section-container">
          <div className="text-center mb-16">
            <GlowText as="h2" className="text-4xl md:text-5xl font-bold mb-4">
              Obras em Destaque
            </GlowText>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-400 max-w-lg mx-auto"
            >
              Uma seleção das obras mais recentes e fascinantes do universo Dracon.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredWorks.map((work, i) => (
              <AnimatedCard key={work.title} delay={i * 0.15}>
                <div className={`p-8 h-80 flex flex-col justify-end bg-gradient-to-br ${work.gradient} rounded-xl relative overflow-hidden group`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    <svg width="120" height="120" viewBox="0 0 100 100">
                      <polygon
                        points="50,5 63,35 95,35 70,57 78,90 50,72 22,90 30,57 5,35 37,35"
                        fill="none"
                        stroke="rgba(168,85,244,0.5)"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <span className="text-dracon-orange-400 text-xs tracking-wider uppercase font-medium">
                      {work.category}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-white mt-2 mb-2">
                      {work.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{work.description}</p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/portfolio">
              <MagicButton variant="secondary">Ver todo o portfólio →</MagicButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="relative py-32">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dracon-orange-500/20 to-transparent" />
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-dracon-orange-400 text-sm tracking-[0.2em] uppercase font-medium">
                Sobre o Artista
              </span>
              <GlowText as="h2" className="text-4xl md:text-5xl font-bold mt-3 mb-6" animate={false}>
                Arte Nascida das Estrelas
              </GlowText>
              <p className="text-gray-400 leading-relaxed mb-4">
                Dracon é um estúdio de arte digital especializado em ilustração de fantasia,
                concept art e animação. Cada obra é uma jornada por mundos arcanos onde a
                magia flui entre constelações e símbolos ancestrais.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Inspirado pela mitologia, astrologia e mistérios do cosmos, cada peça
                carrega a essência de universos fantásticos esperando para ser descobertos.
              </p>
              <Link href="/about">
                <MagicButton variant="secondary">Conheça a história →</MagicButton>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 border border-dracon-purple-600/20 rounded-full" />
                <div className="absolute inset-8 border border-dracon-purple-500/15 rounded-full" />
                <div className="absolute inset-16 border border-dracon-orange-500/10 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-dracon-purple-500/20 to-dracon-orange-500/10" />
                  <div className="absolute w-16 h-16 rounded-full bg-dracon-purple-400/30" />
                </div>
                {[0, 90, 180, 270].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + 45 * Math.cos(rad);
                  const y = 50 + 45 * Math.sin(rad);
                  return (
                    <div
                      key={angle}
                      className="absolute w-3 h-3 bg-dracon-purple-400/40 rounded-full"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-32">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dracon-purple-500/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dracon-purple-900/5 to-transparent" />
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlowText as="h2" className="text-4xl md:text-5xl font-bold mb-6" color="orange" animate={false}>
              Transforme sua Visão em Arte
            </GlowText>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              Encomende uma ilustração, concept art ou animação única.
              Cada projeto é uma colaboração mágica entre sua visão e a arte Dracon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <MagicButton variant="fire" className="text-lg px-8 py-4">
                  🔥 Ver Serviços
                </MagicButton>
              </Link>
              <Link href="/contact">
                <MagicButton variant="secondary" className="text-lg px-8 py-4">
                  Entrar em Contato
                </MagicButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
