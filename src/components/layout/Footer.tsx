'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { useI18n } from '@/i18n';
import ConstellationDivider from '@/components/ui/ConstellationDivider';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import SocialIcon from '@/components/ui/SocialIcon';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();
  if (pathname.startsWith('/admin')) return null;

  const navLabels: Record<string, string> = {
    '/': t('nav.home'),
    '/portfolio': t('nav.portfolio'),
    '/dragon-eyes': t('nav.dragonEyes'),
    '/about': t('nav.about'),
    '/services': t('nav.services'),
    '/contact': t('nav.contact'),
  };

  return (
    <footer className="relative mt-12 border-t border-white/5 bg-gradient-to-b from-dracon-void/40 to-dracon-void/90 backdrop-blur-sm">
      <ConstellationDivider variant={1} />
      <div aria-hidden className="pointer-events-none absolute right-[6%] top-10 hidden w-56 opacity-[0.15] lg:block">
        <ConstellationGlyph id="ursaMajor" className="h-auto w-full" />
      </div>

      <div className="section-container relative py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/logo.png"
              alt="Dracon Logo"
              width={140}
              height={44}
              className="mb-4 h-auto w-[140px] rounded-sm"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display text-sm font-semibold text-dracon-purple-400 uppercase tracking-wider mb-4">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-dracon-purple-300 transition-colors duration-300"
                  >
                    {navLabels[link.href] || link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display text-sm font-semibold text-dracon-purple-400 uppercase tracking-wider mb-4">
              {t('footer.social')}
            </h4>
            <div className="relative flex w-fit items-center gap-4">
              <span
                aria-hidden
                className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-dracon-purple-300/40 via-dracon-orange-300/40 to-dracon-purple-300/40"
              />
              {Object.entries(SOCIAL_LINKS).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-dracon-purple-100/25 bg-dracon-dark text-gray-300 transition-all duration-300 hover:border-dracon-purple-100/60 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,244,0.5)]"
                >
                  <SocialIcon name={name} className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-6">
              {t('footer.email')}
            </p>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dracon-purple-800/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            {t('footer.copyright', { year: new Date().getFullYear().toString() })}
          </p>
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            <span>{t('footer.madeWith')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
