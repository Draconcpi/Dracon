'use client';

import { motion } from 'framer-motion';
import MagicButton from '@/components/ui/MagicButton';
import { useI18n } from '@/i18n';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, locale } = useI18n();
  return (
    <div className="min-h-screen flex items-center justify-center cosmic-bg relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />

      <div className="text-center relative z-10 section-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-6"
          >
            ⚡
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {t('error.heading')}
          </h1>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            {t('error.message')}
          </p>

          {error.message && (
            <p className="text-red-400/60 text-sm mb-6 font-mono">
              {error.message}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagicButton onClick={reset} variant="primary">
              {t('error.ctaRetry')}
            </MagicButton>
            <a href="/">
              <MagicButton variant="secondary">{t('error.ctaHome')}</MagicButton>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
