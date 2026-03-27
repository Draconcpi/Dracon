'use client';

import { motion } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import { useI18n } from '@/i18n';

const skillLevels = [95, 90, 85, 92, 88, 97];
const timelineIcons = ['🌙', '⭐', '🔮', '✨', '🐉'];

export default function AboutPage() {
  const { t, locale } = useI18n();
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="section-container text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-dracon-orange-400 text-sm tracking-[0.3em] uppercase font-medium mb-4"
        >
          {t('about.header.tag')}
        </motion.p>
        <GlowText as="h1" className="text-5xl md:text-6xl font-bold mb-4">
          {t('about.header.title')}
        </GlowText>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          {t('about.header.subtitle')}
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
              {t('about.story.title')}
            </GlowText>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>{t('about.story.p1')}</p>
              <p>{t('about.story.p2')}</p>
              <p>{t('about.story.p3')}</p>
              <p>{t('about.story.p4')}</p>
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
                    {t('about.story.brandEst')}
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
            {t('about.skills.title')}
          </GlowText>
          <p className="text-gray-400 max-w-lg mx-auto">
            {t('about.skills.subtitle')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {skillLevels.map((level, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-between mb-2">
                <span className="text-gray-300 font-medium">{t(`about.skills.items.${i}`)}</span>
                <span className="text-dracon-purple-400">{level}%</span>
              </div>
              <div className="h-2 bg-dracon-purple-900/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${level}%` }}
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
            {t('about.timeline.title')}
          </GlowText>
          <p className="text-gray-400 max-w-lg mx-auto">
            {t('about.timeline.subtitle')}
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-dracon-purple-600/50 via-dracon-purple-500/30 to-transparent" />

          {timelineIcons.map((icon, i) => (
            <motion.div
              key={i}
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
                  <span className="text-dracon-orange-400 text-sm font-bold">{t(`about.timeline.items.${i}.year`)}</span>
                  <h3 className="text-xl font-display font-bold text-white mt-1 mb-2">
                    {t(`about.timeline.items.${i}.title`)}
                  </h3>
                  <p className="text-gray-400 text-sm">{t(`about.timeline.items.${i}.description`)}</p>
                </div>
              </div>

              {/* Center dot */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  whileInView={{ scale: [0, 1.2, 1] }}
                  viewport={{ once: true }}
                  className="w-12 h-12 rounded-full bg-dracon-purple-900/80 border-2 border-dracon-purple-500 flex items-center justify-center shadow-arcane"
                >
                  <span className="text-lg">{icon}</span>
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
