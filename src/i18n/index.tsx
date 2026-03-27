'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import pt from './pt.json';
import en from './en.json';

export type Locale = 'pt' | 'en';

const translations: Record<Locale, Record<string, unknown>> = { pt, en };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return path; // fallback to key
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('pt');

  useEffect(() => {
    const saved = localStorage.getItem('dracon-locale') as Locale | null;
    if (saved && (saved === 'pt' || saved === 'en')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('dracon-locale', newLocale);
    document.documentElement.lang = newLocale === 'pt' ? 'pt-BR' : 'en';
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(translations[locale] as Record<string, unknown>, key);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v));
        });
      }
      return value;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}

// Helper to get typed array from translations
export function useTranslations(namespace: string) {
  const { locale } = useI18n();
  const ns = getNestedValue(translations[locale] as Record<string, unknown>, namespace);
  return ns;
}

export function getTranslationArray<T>(locale: Locale, key: string): T[] {
  const val = getNestedValue(translations[locale] as Record<string, unknown>, key);
  if (Array.isArray(val)) return val as T[];
  return [];
}
