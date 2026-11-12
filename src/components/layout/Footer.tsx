'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { useI18n } from '@/i18n';
import ConstellationDivider from '@/components/ui/ConstellationDivider';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import SocialIcon from '@/components/ui/SocialIcon';
import { useReveal } from '@/components/motion/useReveal';

const SOCIAL_NAMES: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'X',
  artstation: 'ArtStation',
  behance: 'Behance',
};

export default function Footer() {
  const pathname = usePathname();
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  useReveal(root, [pathname]);
  if (pathname.startsWith('/admin')) return null;

  const navLabels: Record<string, string> = {
    '/': t('nav.home'),
    '/portfolio': t('nav.portfolio'),
    '/dragon-eyes': t('nav.dragonEyes'),
    '/about': t('nav.about'),
    '/services': t('nav.services'),
    '/contact': t('nav.contact'),
  };
  const email = t('footer.email');

  return (
    <footer ref={root} className="relative mt-12 border-t border-white/5 bg-gradient-to-b from-dracon-void/30 to-dracon-void">
      <ConstellationDivider variant={1} />
      <div aria-hidden className="pointer-events-none absolute right-[6%] top-12 hidden w-60 opacity-[0.14] lg:block">
        <ConstellationGlyph id="ursaMajor" className="h-auto w-full" />
      </div>

      <div className="section-container relative pb-10 pt-20">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div data-reveal="rise" className="md:col-span-5">
            <Image src="/images/logo.png" alt="Dracon" width={2665} height={816} className="h-auto w-[180px]" />
            <p className="text-pretty mt-6 max-w-[40ch] leading-relaxed text-dracon-mist">{t('footer.description')}</p>
            <a
              href={`mailto:${email}`}
              className="link-underline mt-8 inline-flex items-center gap-2 pb-1 text-lg font-medium text-dracon-starlight hover:text-white"
            >
              {email}
              <ArrowUpRight className="h-5 w-5 text-dracon-orange-300" aria-hidden />
            </a>
          </div>

          <nav data-reveal="rise" aria-labelledby="footer-nav" className="md:col-span-3 md:col-start-7">
            <h2 id="footer-nav" className="font-display text-base font-semibold text-dracon-starlight">
              {t('footer.navigation')}
            </h2>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className={`link-underline pb-0.5 transition-colors duration-300 ${
                      pathname === link.href ? 'text-dracon-orange-200' : 'text-dracon-mist hover:text-white'
                    }`}
                  >
                    {navLabels[link.href] || link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div data-reveal="rise" className="md:col-span-3">
            <h2 className="font-display text-base font-semibold text-dracon-starlight">{t('footer.social')}</h2>
            <ul className="mt-5 space-y-3">
              {Object.entries(SOCIAL_LINKS).map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 text-dracon-mist transition-colors duration-300 hover:text-white"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dracon-purple-100/20 transition-colors duration-300 group-hover:border-dracon-orange-300/60 group-hover:text-dracon-orange-200">
                      <SocialIcon name={name} className="h-3.5 w-3.5" />
                    </span>
                    {SOCIAL_NAMES[name] ?? name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal="line" className="rule-orbit mt-16" />
        <div className="mt-6 flex flex-col gap-2 text-sm text-dracon-dust md:flex-row md:items-center md:justify-between">
          <p>{t('footer.copyright', { year: new Date().getFullYear().toString() })}</p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
