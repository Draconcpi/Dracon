'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { useI18n } from '@/i18n';

const servicesMeta = [
  { id: '1', icon: '🎨' },
  { id: '2', icon: '✏️' },
  { id: '3', icon: '🎬' },
  { id: '4', icon: '🐉' },
];

const processIcons = ['💬', '📋', '✏️', '🎨', '🔍', '✨'];

export default function ServicesPage() {
  const { t, locale } = useI18n();
  const [expandedService, setExpandedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="section-container text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-dracon-orange-400 text-sm tracking-[0.3em] uppercase font-medium mb-4"
        >
          {t('services.header.tag')}
        </motion.p>
        <GlowText as="h1" className="text-5xl md:text-6xl font-bold mb-4">
          {t('services.header.title')}
        </GlowText>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          {t('services.header.subtitle')}
        </motion.p>
      </section>

      {/* Services Grid */}
      <section className="section-container mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesMeta.map((service, i) => (
            <AnimatedCard
              key={service.id}
              delay={i * 0.1}
              onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <motion.span
                    className="text-4xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  >
                    {service.icon}
                  </motion.span>
                  <span className="text-dracon-orange-400 font-bold text-lg">
                    {t(`services.items.${i}.price`)}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  {t(`services.items.${i}.title`)}
                </h3>
                <p className="text-gray-400 mb-4">{t(`services.items.${i}.shortDescription`)}</p>

                {/* Expanded content */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedService === service.id ? 'auto' : 0,
                    opacity: expandedService === service.id ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-dracon-purple-800/20">
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{t(`services.items.${i}.description`)}</p>
                    <p className="text-dracon-purple-400 text-xs mb-4 italic">{t(`services.items.${i}.priceNote`)}</p>
                    <ul className="space-y-2">
                      {Array.from({ length: 5 }, (_, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="text-dracon-purple-400">✦</span>
                          {t(`services.items.${i}.features.${fi}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <button className="mt-4 text-dracon-purple-400 text-sm hover:text-dracon-purple-300 transition-colors">
                  {expandedService === service.id ? t('services.toggleLess') : t('services.toggleMore')}
                </button>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="section-container mb-32">
        <div className="text-center mb-16">
          <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4">
            {t('services.process.title')}
          </GlowText>
          <p className="text-gray-400 max-w-lg mx-auto">
            {t('services.process.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processIcons.map((icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-arcane p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-dracon-purple-900/50 border border-dracon-purple-600/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">{icon}</span>
              </div>
              <div className="text-dracon-orange-400 text-xs font-bold tracking-wider mb-2">
                {t('services.process.stepLabel')} {i + 1}
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">
                {t(`services.process.steps.${i}.title`)}
              </h3>
              <p className="text-gray-400 text-sm">{t(`services.process.steps.${i}.description`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Commission Form */}
      <section className="section-container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <GlowText as="h2" className="text-3xl md:text-4xl font-bold mb-4" color="orange">
              {t('services.form.title')}
            </GlowText>
            <p className="text-gray-400">
              {t('services.form.subtitle')}
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-arcane p-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              alert(t('services.form.alertSent'));
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">{t('services.form.name')}</label>
                <input type="text" className="input-arcane" placeholder={t('services.form.namePlaceholder')} required />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">{t('services.form.email')}</label>
                <input type="email" className="input-arcane" placeholder={t('services.form.emailPlaceholder')} required />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">{t('services.form.serviceType')}</label>
              <select className="input-arcane" required>
                <option value="">{t('services.form.serviceDefault')}</option>
                {servicesMeta.map((s, i) => (
                  <option key={s.id} value={t(`services.items.${i}.title`)}>{t(`services.items.${i}.title`)}</option>
                ))}
                <option value="outro">{t('services.form.serviceOther')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">{t('services.form.subject')}</label>
              <input type="text" className="input-arcane" placeholder={t('services.form.subjectPlaceholder')} required />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">{t('services.form.description')}</label>
              <textarea
                className="input-arcane min-h-[150px] resize-y"
                placeholder={t('services.form.descriptionPlaceholder')}
                required
              />
            </div>

            <MagicButton type="submit" variant="fire" className="w-full text-lg py-4">
              {t('services.form.submit')}
            </MagicButton>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
