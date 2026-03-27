'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { useI18n } from '@/i18n';

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
    <footer className="relative border-t border-dracon-purple-800/20 bg-dracon-void/80 backdrop-blur-sm">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-dracon-purple-500/50 to-transparent" />

      <div className="section-container py-16">
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
              className="rounded-sm mb-4"
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
            <div className="flex gap-4">
              {Object.entries(SOCIAL_LINKS).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-dracon-purple-900/30 border border-dracon-purple-800/30 flex items-center justify-center text-gray-400 hover:text-dracon-purple-300 hover:border-dracon-purple-600/50 hover:shadow-arcane transition-all duration-300"
                >
                  <span className="text-xs uppercase font-bold">
                    {name.slice(0, 2)}
                  </span>
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
