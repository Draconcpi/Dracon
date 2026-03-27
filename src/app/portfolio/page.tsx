'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import AnimatedCard from '@/components/ui/AnimatedCard';

const categories = ['Todos', 'Ilustração', 'Concept Art', 'Animação', 'Arte Digital Mística'];

// Mock portfolio data (will be replaced with API data)
const portfolioData = [
  {
    id: '1',
    title: 'O Guardião das Estrelas',
    slug: 'o-guardiao-das-estrelas',
    description: 'Uma criatura ancestral que vela pelos segredos das constelações. Esta ilustração foi inspirada nas lendas sobre seres que protegem o equilíbrio entre os mundos terrestre e celeste.',
    category: 'Ilustração',
    tags: ['fantasia', 'estrelas', 'guardião'],
    featured: true,
    gradient: 'from-dracon-purple-800/50 to-indigo-900/50',
  },
  {
    id: '2',
    title: 'Dragão Arcano',
    slug: 'dragao-arcano',
    description: 'Um dragão nascido das forças primordiais da magia, envolvido em runas e energia arcana. Concept art para projeto pessoal de worldbuilding.',
    category: 'Concept Art',
    tags: ['dragão', 'arcano', 'magia'],
    featured: true,
    gradient: 'from-dracon-purple-900/50 to-dracon-orange-700/30',
  },
  {
    id: '3',
    title: 'Ritual da Lua Crescente',
    slug: 'ritual-da-lua-crescente',
    description: 'Animação loop de um ritual mágico sob a luz da lua crescente, com partículas de energia fluindo entre símbolos antigos.',
    category: 'Animação',
    tags: ['animação', 'lua', 'ritual'],
    featured: true,
    gradient: 'from-blue-900/50 to-dracon-purple-900/50',
  },
  {
    id: '4',
    title: 'Constelação do Fênix',
    slug: 'constelacao-do-fenix',
    description: 'Mapa estelar místico representando a constelação perdida do Fênix, desenhada com técnicas de arte digital e elementos de astrologia antiga.',
    category: 'Arte Digital Mística',
    tags: ['constelação', 'fênix', 'astrologia'],
    featured: true,
    gradient: 'from-dracon-purple-800/50 to-cyan-900/30',
  },
  {
    id: '5',
    title: 'A Feiticeira das Sombras',
    slug: 'a-feiticeira-das-sombras',
    description: 'Personagem mística que manipula as sombras como extensão de sua vontade.',
    category: 'Ilustração',
    tags: ['feiticeira', 'sombras', 'personagem'],
    featured: false,
    gradient: 'from-gray-900/50 to-dracon-purple-900/50',
  },
  {
    id: '6',
    title: 'Fortaleza nas Nuvens',
    slug: 'fortaleza-nas-nuvens',
    description: 'Concept art de uma fortaleza flutuante entre as nuvens, lar de uma ordem antiga de magos astrais.',
    category: 'Concept Art',
    tags: ['fortaleza', 'nuvens', 'ambiente'],
    featured: false,
    gradient: 'from-sky-900/40 to-dracon-purple-800/40',
  },
  {
    id: '7',
    title: 'Olho do Cosmos',
    slug: 'olho-do-cosmos',
    description: 'Arte digital mística representando o Olho do Cosmos — um portal entre dimensões.',
    category: 'Arte Digital Mística',
    tags: ['cosmos', 'portal', 'runas'],
    featured: false,
    gradient: 'from-dracon-orange-700/30 to-dracon-purple-900/50',
  },
  {
    id: '8',
    title: 'Espírito da Floresta',
    slug: 'espirito-da-floresta',
    description: 'Animação de um espírito da floresta emergindo das raízes de uma árvore ancestral.',
    category: 'Animação',
    tags: ['espírito', 'floresta', 'natureza'],
    featured: false,
    gradient: 'from-green-900/30 to-dracon-purple-900/40',
  },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState<typeof portfolioData[0] | null>(null);

  const filteredItems = activeCategory === 'Todos'
    ? portfolioData
    : portfolioData.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="section-container text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-dracon-orange-400 text-sm tracking-[0.3em] uppercase font-medium mb-4"
        >
          ✦ Galeria de Obras ✦
        </motion.p>
        <GlowText as="h1" className="text-5xl md:text-6xl font-bold mb-4">
          Portfólio
        </GlowText>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Explore o universo visual de Dracon — ilustrações, concept art, animações e
          arte digital mística nascidas entre estrelas e constelações.
        </motion.p>
      </section>

      {/* Category Filters */}
      <section className="section-container mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-dracon-purple-600 text-white shadow-arcane'
                  : 'bg-dracon-purple-900/20 text-gray-400 border border-dracon-purple-800/30 hover:border-dracon-purple-600/50 hover:text-dracon-purple-300'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="section-container">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <AnimatedCard onClick={() => setSelectedItem(item)}>
                  <div className={`relative h-72 bg-gradient-to-br ${item.gradient} rounded-xl overflow-hidden group`}>
                    {/* Decorative element */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-20 h-20 border border-dracon-purple-500/20 rounded-full"
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dracon-void via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-dracon-orange-400 text-xs tracking-wider uppercase font-medium">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-display font-bold text-white mt-1 mb-2 group-hover:text-dracon-purple-200 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex gap-2">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-gray-400 bg-dracon-purple-900/40 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dracon-void/90 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-dracon-midnight border border-dracon-purple-800/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-arcane-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image area */}
              <div className={`h-64 bg-gradient-to-br ${selectedItem.gradient} rounded-t-2xl relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="w-24 h-24 border border-dracon-purple-400/30 rounded-full"
                  />
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dracon-void/60 backdrop-blur-sm flex items-center justify-center text-gray-300 hover:text-white hover:bg-dracon-purple-600/60 transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                <span className="text-dracon-orange-400 text-xs tracking-wider uppercase font-medium">
                  {selectedItem.category}
                </span>
                <h2 className="text-3xl font-display font-bold text-white mt-2 mb-4 glow-text">
                  {selectedItem.title}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {selectedItem.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm text-dracon-purple-300 bg-dracon-purple-900/30 px-3 py-1 rounded-full border border-dracon-purple-800/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
