'use client';

import { motion } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import Astrolabe from '@/components/ui/Astrolabe';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import { useI18n } from '@/i18n';

const skillLevels = [95, 90, 85, 92, 88, 97];
const timelineSteps = [0, 1, 2, 3, 4];

export default function AboutPage() {
  const { t } = useI18n();
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-dracon-purple-900/80 via-dracon-cosmic/90 to-dracon-void/95 backdrop-blur-sm">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(124,34,206,0.25),transparent_65%)]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Astrolabe className="w-[86%]">
                  <div className="text-center">
                    <p className="starlight-fill font-display text-2xl font-bold tracking-[0.2em] md:text-3xl">
                      DRACON
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-dracon-orange-300/70 md:text-xs">
                      {t('about.story.brandEst')}
                    </p>
                  </div>
                </Astrolabe>
              </div>
              <div aria-hidden className="absolute bottom-6 left-1/2 w-1/2 -translate-x-1/2 opacity-40">
                <ConstellationGlyph id="draco" color="#fdba74" className="h-auto w-full" />
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
                <span className="font-display text-dracon-purple-200">{level}%</span>
              </div>
              <div className="relative h-1.5 rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full rounded-full bg-gradient-to-r from-dracon-purple-600 via-dracon-purple-300 to-dracon-orange-400"
                >
                  <span
                    aria-hidden
                    className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgba(251,146,60,0.7)]"
                  />
                </motion.div>
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
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-dracon-purple-300/60 via-dracon-orange-300/30 to-transparent" />

          {timelineSteps.map((i) => (
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

              {/* Center star */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  whileInView={{ scale: [0, 1.2, 1] }}
                  viewport={{ once: true }}
                  className="relative flex h-12 w-12 items-center justify-center rounded-full border border-dracon-purple-100/40 bg-dracon-dark shadow-arcane"
                >
                  <span aria-hidden className="absolute inset-0 rounded-full border border-dracon-purple-300/40 animate-pulse-ring" />
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-dracon-orange-200" fill="currentColor" aria-hidden>
                    <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" />
                  </svg>
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
