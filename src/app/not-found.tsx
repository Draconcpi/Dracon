'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import MagicButton from '@/components/ui/MagicButton';
import Astrolabe from '@/components/ui/Astrolabe';
import { useI18n } from '@/i18n';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex items-center justify-center cosmic-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-dracon-purple-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-dracon-orange-500/5 rounded-full blur-3xl" />

      <div className="text-center relative z-10 section-container">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <h1 className="hero-title text-[10rem] md:text-[14rem] font-display font-bold leading-none">
            <span className="starlight-fill">404</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Decorative line */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-dracon-purple-500 to-transparent mx-auto mb-6" />

          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
            {t('notFound.heading')}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
            {t('notFound.message')}
          </p>

          {/* A lost little astrolabe */}
          <div className="mb-8 flex justify-center">
            <Astrolabe className="w-32" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <MagicButton variant="primary">{t('notFound.ctaHome')}</MagicButton>
            </Link>
            <Link href="/portfolio">
              <MagicButton variant="secondary">{t('notFound.ctaPortfolio')}</MagicButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
