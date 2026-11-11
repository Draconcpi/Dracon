'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';
import GlowText from '@/components/ui/GlowText';
import AnimatedCard from '@/components/ui/AnimatedCard';
import ArtImage from '@/components/ui/ArtImage';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import ConstellationLoader from '@/components/ui/ConstellationLoader';
import { constellationAt } from '@/lib/constellations';
import { useI18n } from '@/i18n';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: Category;
  categoryId: string;
  tags: string[];
  featured: boolean;
  order: number;
}

const gradients = [
  'from-dracon-purple-800/50 to-indigo-900/50',
  'from-dracon-purple-900/50 to-dracon-orange-700/30',
  'from-blue-900/50 to-dracon-purple-900/50',
  'from-dracon-purple-800/50 to-cyan-900/30',
  'from-gray-900/50 to-dracon-purple-900/50',
  'from-sky-900/40 to-dracon-purple-800/40',
  'from-dracon-orange-700/30 to-dracon-purple-900/50',
  'from-green-900/30 to-dracon-purple-900/40',
];

export default function PortfolioPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [portfolioRes, catRes] = await Promise.all([
          fetch('/api/portfolio'),
          fetch('/api/categories'),
        ]);
        const portfolioData = await portfolioRes.json();
        const catData = await catRes.json();
        if (portfolioData.success) setItems(portfolioData.data);
        if (catData.success) setCategories(catData.data);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category.slug === activeCategory);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="section-container text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-dracon-orange-400 text-sm tracking-[0.3em] uppercase font-medium mb-4"
        >
          {t('portfolio.header.tag')}
        </motion.p>
        <GlowText as="h1" className="text-5xl md:text-6xl font-bold mb-4">
          {t('portfolio.header.title')}
        </GlowText>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          {t('portfolio.header.subtitle')}
        </motion.p>
      </section>

      {/* Category Filters */}
      <section className="section-container mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="glass inline-flex max-w-full flex-wrap justify-center gap-1 rounded-2xl p-1.5 sm:rounded-full">
            {[{ id: '__all', slug: 'all', name: t('portfolio.filters.all') }, ...categories].map((cat) => {
              const active = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                    active ? 'text-white' : 'text-gray-400 hover:text-dracon-purple-100'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="portfolio-filter"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-dracon-purple-500/80 to-dracon-purple-600/80 shadow-[0_0_20px_rgba(168,85,244,0.45)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Loading state */}
      {loading && <ConstellationLoader label={t('common.loading')} className="section-container py-20" />}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="section-container text-center py-20">
          <Palette className="mx-auto mb-4 h-12 w-12 text-dracon-purple-400/60" strokeWidth={1.25} />
          <p className="text-gray-400 text-lg">Nenhuma obra encontrada.</p>
        </div>
      )}

      {/* Portfolio Grid */}
      {!loading && items.length > 0 && (
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
                  <div className="relative h-72 rounded-xl overflow-hidden group">
                    {/* Image or decorative fallback */}
                    <ArtImage
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      fallback={
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]}`}>
                          <div className="absolute inset-[18%] opacity-50 transition-opacity duration-500 group-hover:opacity-80">
                            <ConstellationGlyph id={constellationAt(i)} className="h-full w-full" />
                          </div>
                        </div>
                      }
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dracon-void via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-dracon-orange-400 text-xs tracking-wider uppercase font-medium">
                        {item.category.name}
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
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dracon-void/90 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="border-celestial bg-dracon-midnight/95 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-arcane-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image area */}
              <div className="aspect-[16/9] rounded-t-2xl relative overflow-hidden">
                <ArtImage
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 672px) 100vw, 672px"
                  fallback={
                    <div className={`h-full bg-gradient-to-br ${gradients[0]}`}>
                      <div className="absolute inset-[15%]">
                        <ConstellationGlyph id={constellationAt(items.indexOf(selectedItem))} className="h-full w-full" />
                      </div>
                    </div>
                  }
                />
                <button
                  type="button"
                  aria-label={t('common.close')}
                  onClick={() => setSelectedItem(null)}
                  className="glass absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-gray-200 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                <span className="text-dracon-orange-400 text-xs tracking-wider uppercase font-medium">
                  {selectedItem.category.name}
                </span>
                <h2 className="text-3xl font-display font-bold mt-2 mb-4">
                  <span className="starlight-fill">{selectedItem.title}</span>
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
