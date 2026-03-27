'use client';

import { motion } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';

const timeline = [
  {
    year: '2020',
    title: 'O Despertar',
    description: 'Início da jornada artística de Dracon, com os primeiros estudos de ilustração digital e fantasia.',
    icon: '🌙',
  },
  {
    year: '2021',
    title: 'Primeiras Constelações',
    description: 'Desenvolvimento do estilo visual próprio — combinando astrologia, magia e elementos arcanos.',
    icon: '⭐',
  },
  {
    year: '2022',
    title: 'O Portal se Abre',
    description: 'Primeiros projetos profissionais de concept art e ilustração para clientes e estúdios independentes.',
    icon: '🔮',
  },
  {
    year: '2023',
    title: 'Runas em Movimento',
    description: 'Expansão para o mundo da animação 2D, trazendo vida aos universos criados através de motion graphics.',
    icon: '✨',
  },
  {
    year: '2024',
    title: 'O Universo Dracon',
    description: 'Consolidação da marca como referência em arte mística, fantasia e universos visuais imersivos.',
    icon: '🐉',
  },
];

const skills = [
  { name: 'Ilustração Digital', level: 95 },
  { name: 'Concept Art', level: 90 },
  { name: 'Animação 2D', level: 85 },
  { name: 'Design de Personagens', level: 92 },
  { name: 'Worldbuilding Visual', level: 88 },
  { name: 'Arte Mística / Arcana', level: 97 },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="section-container text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-dracon-orange-400 text-sm tracking-[0.3em] uppercase font-medium mb-4"
        >
          ✦ A História ✦
        </motion.p>
        <GlowText as="h1" className="text-5xl md:text-6xl font-bold mb-4">
          Sobre Dracon
        </GlowText>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Uma jornada entre estrelas, runas e mundos fantásticos — onde cada traço
          carrega a magia do invisível e a beleza do arcano.
        </motion.p>
      </section>

      {/* Story Section */}
      <section className="section-container mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-6" animate={false}>
              O Artista por trás da Magia
            </GlowText>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                Dracon nasceu da fusão entre imaginação e obsessão por mundos fantásticos.
                Como artista digital, meu trabalho é uma exploração constante dos limites
                entre o real e o sobrenatural.
              </p>
              <p>
                Cada ilustração conta uma história que transcende o visual — são portais
                para universos onde dragões guardam segredos ancestrais, onde constelações
                traçam destinos e onde a magia é a linguagem fundamental de toda criação.
              </p>
              <p>
                Trabalho com uma paleta profunda de roxos e laranjas, evocando a atmosfera
                de noites cósmicas iluminadas por estrelas distantes. A estética arcana e
                mística é a assinatura de cada peça que crio.
              </p>
              <p>
                Meu objetivo é transformar visões em arte — seja para um personagem de RPG,
                um mundo de ficção, uma capa de livro ou uma animação que hipnotiza.
              </p>
            </div>
          </motion.div>

          {/* Visual element */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-dracon-purple-900/40 to-dracon-cosmic border border-dracon-purple-800/20 relative overflow-hidden">
              {/* Mystic symbols */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              >
                <svg width="100%" height="100%" viewBox="0 0 400 500" className="opacity-10">
                  <circle cx="200" cy="250" r="150" fill="none" stroke="rgba(168,85,244,0.5)" strokeWidth="0.5" />
                  <circle cx="200" cy="250" r="120" fill="none" stroke="rgba(168,85,244,0.3)" strokeWidth="0.5" />
                  <polygon
                    points="200,100 260,220 340,220 280,300 300,400 200,340 100,400 120,300 60,220 140,220"
                    fill="none"
                    stroke="rgba(249,115,22,0.2)"
                    strokeWidth="0.5"
                  />
                </svg>
              </motion.div>

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-7xl mb-4"
                  >
                    🐉
                  </motion.div>
                  <p className="font-display text-2xl font-bold glow-text text-dracon-purple-300">
                    DRACON
                  </p>
                  <p className="text-dracon-orange-400/60 text-sm tracking-wider mt-1">
                    Est. 2020
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-container mb-32">
        <div className="text-center mb-12">
          <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4">
            Habilidades Arcanas
          </GlowText>
          <p className="text-gray-400 max-w-lg mx-auto">
            Domínio técnico e artístico forjado em anos de prática e paixão pela arte.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-between mb-2">
                <span className="text-gray-300 font-medium">{skill.name}</span>
                <span className="text-dracon-purple-400">{skill.level}%</span>
              </div>
              <div className="h-2 bg-dracon-purple-900/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-dracon-purple-600 to-dracon-orange-500 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="section-container">
        <div className="text-center mb-16">
          <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4">
            Linha do Tempo
          </GlowText>
          <p className="text-gray-400 max-w-lg mx-auto">
            Os marcos da jornada artística de Dracon através dos anos.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-dracon-purple-600/50 via-dracon-purple-500/30 to-transparent" />

          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative flex items-center gap-8 mb-16 ${
                i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <div className="card-arcane p-6 inline-block">
                  <span className="text-dracon-orange-400 text-sm font-bold">{item.year}</span>
                  <h3 className="text-xl font-display font-bold text-white mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>

              {/* Center dot */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  whileInView={{ scale: [0, 1.2, 1] }}
                  viewport={{ once: true }}
                  className="w-12 h-12 rounded-full bg-dracon-purple-900/80 border-2 border-dracon-purple-500 flex items-center justify-center shadow-arcane"
                >
                  <span className="text-lg">{item.icon}</span>
                </motion.div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
