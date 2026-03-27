'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';

// ─── Characters (stars in the constellation) ──────────────────────
// Each star has a position on the constellation map, a color, and character info.
// Replace imageUrl with real images in public/images/dragon-eyes/
const characters = [
  {
    id: 'lyra',
    name: 'Lyra',
    role: 'A Vidente Estelar',
    description:
      'Nascida sob a chuva de meteoros de Aldebaran, Lyra enxerga os fios do destino entrelaçados nas estrelas. Seus olhos refletem constelações que outros não podem ver.',
    color: '#a855f4', // purple
    cx: 200,
    cy: 120,
    imageUrl: '/images/dragon-eyes/lyra.png',
  },
  {
    id: 'ignis',
    name: 'Ignis',
    role: 'O Guardião do Fogo Arcano',
    description:
      'Forjado nas chamas primordiais, Ignis carrega dentro de si o fogo que deu origem ao primeiro sol. Seu olhar pode derreter aço e iluminar as trevas mais profundas.',
    color: '#f97316', // orange
    cx: 400,
    cy: 80,
    imageUrl: '/images/dragon-eyes/ignis.png',
  },
  {
    id: 'nyx',
    name: 'Nyx',
    role: 'A Sombra Silenciosa',
    description:
      'Filha da noite eterna, Nyx se move entre dimensões como uma brisa gelada. Suas asas escuras carregam segredos que nem os deuses se atrevem a pronunciar.',
    color: '#6366f1', // indigo
    cx: 600,
    cy: 150,
    imageUrl: '/images/dragon-eyes/nyx.png',
  },
  {
    id: 'aurion',
    name: 'Aurion',
    role: 'O Cavaleiro Celestial',
    description:
      'Último descendente dos Cavaleiros de Orion, Aurion porta a espada que corta entre realidades. Jurou proteger o equilíbrio entre luz e escuridão.',
    color: '#eab308', // gold
    cx: 300,
    cy: 260,
    imageUrl: '/images/dragon-eyes/aurion.png',
  },
  {
    id: 'seraph',
    name: 'Seraph',
    role: 'O Dragão Ancestral',
    description:
      'O mais antigo dos seres mágicos, Seraph testemunhou o nascimento e a morte de incontáveis estrelas. Seus olhos — os Dragon Eyes — são a chave para todo o poder cósmico.',
    color: '#ef4444', // red
    cx: 500,
    cy: 300,
    imageUrl: '/images/dragon-eyes/seraph.png',
  },
  {
    id: 'elara',
    name: 'Elara',
    role: 'A Curandeira das Raízes',
    description:
      'Conectada ao coração da terra, Elara canaliza a energia vital das raízes antigas. Onde ela pisa, flores nascem — onde ela chora, florestas inteiras despertam.',
    color: '#22c55e', // green
    cx: 150,
    cy: 310,
    imageUrl: '/images/dragon-eyes/elara.png',
  },
  {
    id: 'zephyr',
    name: 'Zephyr',
    role: 'O Mensageiro dos Ventos',
    description:
      'Rápido como o pensamento, Zephyr percorre os céus carregando mensagens entre os reinos. Dizem que ele sussurra profecias ao ouvido de quem está prestes a mudar o mundo.',
    color: '#06b6d4', // cyan
    cx: 700,
    cy: 240,
    imageUrl: '/images/dragon-eyes/zephyr.png',
  },
];

// Lines connecting the stars to form the constellation
const constellationLines: [string, string][] = [
  ['lyra', 'ignis'],
  ['ignis', 'nyx'],
  ['lyra', 'aurion'],
  ['ignis', 'aurion'],
  ['ignis', 'seraph'],
  ['nyx', 'seraph'],
  ['nyx', 'zephyr'],
  ['aurion', 'seraph'],
  ['aurion', 'elara'],
  ['elara', 'seraph'],
  ['seraph', 'zephyr'],
];

// ─── Project lore sections ────────────────────────────────────────
const loreSections = [
  {
    title: 'A Origem',
    text: 'No princípio, antes do tempo ter nome, existiam apenas os Olhos do Dragão — sete estrelas primordiais que observavam o vazio infinito. Cada estrela carregava dentro de si uma centelha de consciência, um fragmento de poder que moldaria toda a existência.',
  },
  {
    title: 'O Despertar',
    text: 'Quando a primeira estrela piscou, o universo tremeu. A energia liberada criou as primeiras formas de vida — seres feitos de luz e sombra, conectados às estrelas por fios invisíveis de magia. Esses seres se tornaram os guardiões do equilíbrio cósmico.',
  },
  {
    title: 'A Guerra das Constelações',
    text: 'Mas o poder atrai ambição. Uma entidade do vazio, conhecida apenas como O Eclipse, tentou devorar os Dragon Eyes para reescrever a realidade. Os guardiões se uniram na Constelação do Dragão — uma formação lendária que canaliza o poder combinado de todas as estrelas.',
  },
  {
    title: 'O Legado',
    text: 'A guerra não teve vencedor — apenas sobreviventes. Os guardiões se espalharam pelos reinos, cada um carregando a memória de sua estrela. Dizem que quando os sete se reencontrarem, a Constelação do Dragão brilhará novamente e o destino do cosmos será decidido.',
  },
];

// ─── Constellation Component ─────────────────────────────────────
function InteractiveConstellation() {
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const activeCharId = selectedChar ?? hoveredChar;
  const activeChar = characters.find((c) => c.id === activeCharId);

  const getCharById = (id: string) => characters.find((c) => c.id === id)!;

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
          {constellationLines.map(([fromId, toId], i) => {
            const from = getCharById(fromId);
            const to = getCharById(toId);
            const isActive = activeCharId === fromId || activeCharId === toId;
            return (
              <line
                key={i}
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
                  {char.name}
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
            <div
              className="rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center"
              style={{
                borderColor: `${activeChar.color}33`,
                background: `linear-gradient(135deg, ${activeChar.color}08 0%, transparent 60%), rgba(10,0,21,0.8)`,
              }}
            >
              {/* Character image placeholder */}
              <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border"
                style={{
                  borderColor: `${activeChar.color}44`,
                  background: `radial-gradient(circle at center, ${activeChar.color}22 0%, transparent 70%), rgba(10,0,21,0.6)`,
                }}
              >
                {/* Replace with <Image> when you have character images */}
                <svg width="60" height="60" viewBox="0 0 100 100">
                  <polygon
                    points="50,5 63,35 95,35 70,57 78,90 50,72 22,90 30,57 5,35 37,35"
                    fill="none"
                    stroke={activeChar.color}
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <circle cx="50" cy="50" r="15" fill={activeChar.color} opacity="0.3" />
                  <circle cx="50" cy="50" r="6" fill={activeChar.color} opacity="0.6" />
                </svg>
              </div>

              {/* Character info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeChar.color }}
                  />
                  <span
                    className="text-xs tracking-[0.2em] uppercase font-medium"
                    style={{ color: activeChar.color }}
                  >
                    {activeChar.role}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                  {activeChar.name}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {activeChar.description}
                </p>
              </div>
            </div>
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
          ✦ Passe o mouse sobre uma estrela para conhecer o personagem ✦
        </motion.p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function DragonEyesPage() {
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
              ✦ Projeto Pessoal ✦
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold glow-text text-dracon-purple-200 mb-4 tracking-wider"
            >
              DRAGON EYES
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Sete estrelas. Sete guardiões. Uma constelação que guarda os segredos
              do poder mais antigo do cosmos.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CONSTELLATION */}
      <section className="relative py-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dracon-purple-500/30 to-transparent" />
        <div className="section-container">
          <div className="text-center mb-12">
            <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4">
              A Constelação do Dragão
            </GlowText>
            <p className="text-gray-400 max-w-lg mx-auto">
              Cada estrela representa um guardião cósmico. Explore seus segredos.
            </p>
          </div>

          <InteractiveConstellation />
        </div>
      </section>

      {/* LORE / STORY */}
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
              ✦ Lore
            </motion.span>
            <GlowText as="h2" className="text-3xl md:text-4xl font-bold mt-3 mb-4" color="orange">
              A História
            </GlowText>
          </div>

          <div className="max-w-3xl mx-auto space-y-16">
            {loreSections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative pl-8 border-l-2 border-dracon-purple-800/30"
              >
                <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-dracon-purple-500 -translate-x-[7px]" />
                <span className="text-dracon-purple-400 text-xs tracking-[0.15em] uppercase font-medium">
                  Capítulo {i + 1}
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

      {/* GALLERY */}
      <section className="relative py-24">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dracon-purple-500/30 to-transparent" />
        <div className="section-container">
          <div className="text-center mb-12">
            <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4">
              Galeria do Projeto
            </GlowText>
            <p className="text-gray-400 max-w-lg mx-auto">
              Artes conceituais, estudos de personagens e cenas do universo Dragon Eyes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Conceito — Constelação do Dragão', accent: '#a855f4' },
              { title: 'Estudo — Olhos de Seraph', accent: '#ef4444' },
              { title: 'Cena — O Despertar', accent: '#f97316' },
              { title: 'Conceito — Floresta de Elara', accent: '#22c55e' },
              { title: 'Cena — Guerra das Constelações', accent: '#6366f1' },
              { title: 'Estudo — Lâmina de Aurion', accent: '#eab308' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[4/3] rounded-xl overflow-hidden border border-dracon-purple-800/20 group relative cursor-pointer"
                style={{
                  background: `radial-gradient(ellipse at 40% 40%, ${item.accent}15 0%, transparent 70%), linear-gradient(135deg, #0a0015 0%, #1a0030 100%)`,
                }}
              >
                {/* Placeholder decorative element */}
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
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm text-gray-300 font-display">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              Este é apenas o começo
            </GlowText>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Dragon Eyes é um projeto em constante evolução. Novos personagens,
              capítulos e artes serão adicionados conforme o universo se expande.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/portfolio">
                <MagicButton variant="primary">Ver Portfólio Completo</MagicButton>
              </a>
              <a href="/contact">
                <MagicButton variant="secondary">Acompanhe o Projeto</MagicButton>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
