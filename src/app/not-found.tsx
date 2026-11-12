'use client';

import { useRef } from 'react';
import { House, Images } from 'lucide-react';
import MagicButton from '@/components/ui/MagicButton';
import Astrolabe from '@/components/ui/Astrolabe';
import { gsap, useGSAP, MOTION_OK, EASE } from '@/lib/gsap';
import { useI18n } from '@/i18n';

export default function NotFound() {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: EASE } })
          .from('[data-nf-digit]', { yPercent: 60, opacity: 0, filter: 'blur(14px)', duration: 1.6, stagger: 0.12 })
          .from('[data-nf-copy] > *', { y: 18, opacity: 0, duration: 1.1, stagger: 0.1 }, 0.6);
        // The lost astrolabe keeps drifting
        gsap.to('[data-nf-orb]', { y: -14, rotate: 8, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="section-container relative z-10 py-32 text-center">
        <h1 aria-label="404" className="hero-title font-display text-[clamp(8rem,26vw,15rem)] font-bold leading-none">
          {['4', '0', '4'].map((d, i) => (
            <span key={i} aria-hidden data-nf-digit className="starlight-fill inline-block">
              {d}
            </span>
          ))}
        </h1>

        <div data-nf-copy>
          <h2 className="display mt-4 text-[clamp(1.75rem,3.5vw,2.5rem)]">{t('notFound.heading')}</h2>
          <p className="text-pretty mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed text-dracon-mist">{t('notFound.message')}</p>
          <div data-nf-orb className="my-10 flex justify-center">
            <Astrolabe className="w-32" />
          </div>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <MagicButton href="/" variant="primary">
              <House className="h-4 w-4" aria-hidden />
              {t('notFound.ctaHome')}
            </MagicButton>
            <MagicButton href="/portfolio" variant="secondary">
              <Images className="h-4 w-4" aria-hidden />
              {t('notFound.ctaPortfolio')}
            </MagicButton>
          </div>
        </div>
      </div>
    </div>
  );
}
