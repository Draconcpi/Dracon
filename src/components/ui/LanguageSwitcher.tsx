'use client';

import { Languages } from 'lucide-react';
import { useI18n, Locale } from '@/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const nextLocale: Locale = locale === 'pt' ? 'en' : 'pt';

  return (
    <button
      onClick={() => setLocale(nextLocale)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dracon-purple-800/30 bg-dracon-void/60 backdrop-blur-sm text-sm text-gray-300 hover:border-dracon-purple-600/50 hover:text-dracon-purple-300 transition-all duration-300"
      title={locale === 'pt' ? 'Switch to English' : 'Mudar para Português'}
    >
      <Languages className="h-4 w-4" aria-hidden />
      <span className="uppercase font-medium tracking-wider text-xs">{nextLocale}</span>
    </button>
  );
}
