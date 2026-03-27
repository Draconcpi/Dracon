'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';
import ConstellationLines from '@/components/ui/ConstellationLines';
import AnimatedCard from '@/components/ui/AnimatedCard';

function ArcaneSymbol() {
  return (
    <motion.svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
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

export default function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ConstellationLines />
        <ArcaneSymbol />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dracon-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-dracon-orange-500/5 rounded-full blur-3xl" />

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
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
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
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-dracon-purple-600/5 rounded-full blur-3xl -translate-y-1/2" />
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
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border border-dracon-purple-600/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-8 border border-dracon-purple-500/15 rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-16 border border-dracon-orange-500/10 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-dracon-purple-500/20 to-dracon-orange-500/10 blur-xl" />
                  <div className="absolute w-16 h-16 rounded-full bg-dracon-purple-400/30 animate-glow-pulse" />
                </div>
                {[0, 90, 180, 270].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + 45 * Math.cos(rad);
                  const y = 50 + 45 * Math.sin(rad);
                  return (
                    <motion.div
                      key={angle}
                      className="absolute w-3 h-3 bg-dracon-purple-400/40 rounded-full"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, delay: angle / 360 }}
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
