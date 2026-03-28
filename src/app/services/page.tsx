'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlowText from '@/components/ui/GlowText';
import MagicButton from '@/components/ui/MagicButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { useI18n } from '@/i18n';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string | null;
  priceNote: string | null;
  features: string[];
  icon: string;
  order: number;
  active: boolean;
}

const processIcons = ['💬', '📋', '✏️', '🎨', '🔍', '✨'];

export default function ServicesPage() {
  const { t } = useI18n();
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.success) setServices(data.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

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
        {loading && (
          <div className="text-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-4xl inline-block">✦</motion.div>
            <p className="text-gray-400 mt-4">Carregando...</p>
          </div>
        )}
        {!loading && services.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">💼</p>
            <p className="text-gray-400 text-lg">Nenhum serviço disponível no momento.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
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
                  {service.price && (
                    <span className="text-dracon-orange-400 font-bold text-lg">
                      {service.price}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4">{service.shortDescription}</p>

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
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{service.description}</p>
                    {service.priceNote && (
                      <p className="text-dracon-purple-400 text-xs mb-4 italic">{service.priceNote}</p>
                    )}
                    <ul className="space-y-2">
                      {service.features.map((feature, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="text-dracon-purple-400">✦</span>
                          {feature}
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
                {services.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
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
