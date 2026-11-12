'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { useI18n } from '@/i18n';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  const navLabels: Record<string, string> = {
    '/': t('nav.home'),
    '/portfolio': t('nav.portfolio'),
    '/dragon-eyes': t('nav.dragonEyes'),
    '/about': t('nav.about'),
    '/services': t('nav.services'),
    '/contact': t('nav.contact'),
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide navbar on admin pages (after all hooks so the hook order never changes)
  if (pathname.startsWith('/admin')) return null;

  const solid = isScrolled || isMobileOpen;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4"
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-dracon-orange-500 focus:px-4 focus:py-2 focus:font-medium focus:text-dracon-purple-950"
      >
        {t('common.skip')}
      </a>
      <nav className="relative mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl px-4 sm:px-6">
        <div
          aria-hidden
          className={`glass absolute inset-0 rounded-2xl transition-opacity duration-500 ${solid ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Logo */}
        <Link href="/" className="relative flex items-center">
          <Image
            src="/images/logo.png"
            alt="Dracon"
            width={2665}
            height={816}
            className="h-auto w-[120px] sm:w-[140px]"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="relative hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                  active ? 'text-white' : 'text-gray-400 hover:text-dracon-purple-100'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute inset-0 rounded-full border border-dracon-purple-100/20 bg-gradient-to-r from-dracon-purple-500/25 to-dracon-orange-500/15 shadow-[0_0_20px_rgba(168,85,244,0.25)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  >
                    <span className="absolute -bottom-[3px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-dracon-orange-200 shadow-[0_0_8px_2px_rgba(251,146,60,0.7)]" />
                  </motion.span>
                )}
                <span className="relative z-10">{navLabels[link.href] || link.label}</span>
              </Link>
            );
          })}
          <div className="ml-3">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isMobileOpen ? t('common.close') : t('common.menu')}
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="relative flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <motion.span
            animate={isMobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 bg-dracon-purple-100"
          />
          <motion.span
            animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block h-0.5 w-6 bg-dracon-purple-100"
          />
          <motion.span
            animate={isMobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block h-0.5 w-6 bg-dracon-purple-100"
          />
        </button>

        {/* Reading progress, traced like a constellation line */}
        {isScrolled && (
          <motion.span
            aria-hidden
            style={{ scaleX: progress }}
            className="absolute inset-x-5 -bottom-px h-px origin-left bg-gradient-to-r from-dracon-purple-300 via-dracon-purple-100 to-dracon-orange-400"
          />
        )}
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 font-display text-lg tracking-wide transition-colors ${
                        active ? 'bg-dracon-purple-500/15 text-white' : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`h-1.5 w-1.5 rounded-full ${
                          active
                            ? 'bg-dracon-orange-200 shadow-[0_0_8px_2px_rgba(251,146,60,0.7)]'
                            : 'bg-dracon-purple-100/40'
                        }`}
                      />
                      {navLabels[link.href] || link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="px-3 pt-3">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
