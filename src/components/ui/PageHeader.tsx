'use client';

import { useRef, type ReactNode } from 'react';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import type { ConstellationId } from '@/lib/constellations';
import { gsap, useGSAP, MOTION_OK, EASE } from '@/lib/gsap';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  glyph?: ConstellationId;
  glyphColor?: string;
  children?: ReactNode;
}

/** Opening of an inner page: the title rises letter by letter while its constellation is traced beside it. */
export default function PageHeader({ title, subtitle, glyph = 'draco', glyphColor = '#c4b5fd', children }: PageHeaderProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: EASE } })
          .from('[data-char]', {
            yPercent: 110,
            rotate: 6,
            opacity: 0,
            duration: 1.3,
            stagger: { each: 0.035 },
          })
          .from('[data-sub]', { y: 18, opacity: 0, duration: 1.1 }, 0.35)
          .from('[data-rule]', { scaleX: 0, transformOrigin: '0% 50%', duration: 1.6, ease: 'power3.inOut' }, 0.2)
          .from('[data-glyph]', { opacity: 0, scale: 0.9, rotate: -8, duration: 2 }, 0.1);
      });
    },
    { scope: root }
  );

  return (
    <header ref={root} className="section-container relative pb-16 pt-36 md:pb-20 md:pt-44">
      <div
        data-glyph
        aria-hidden
        className="pointer-events-none absolute bottom-24 right-4 top-24 flex w-[44vw] max-w-[420px] justify-end opacity-50 sm:right-8 md:top-28 md:opacity-75"
      >
        <ConstellationGlyph id={glyph} color={glyphColor} className="h-full w-auto max-w-full" />
      </div>

      <h1 aria-label={title} className="display relative text-[clamp(3.25rem,10vw,7.5rem)] leading-[0.95]">
        {title.split(' ').map((word, w) => (
          <span key={w} aria-hidden className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0">
            {Array.from(word).map((ch, i) => (
              <span key={i} data-char className="inline-block">
                {ch}
              </span>
            ))}
          </span>
        ))}
      </h1>
      {subtitle && (
        <p data-sub className="text-pretty relative mt-8 max-w-[56ch] text-lg leading-relaxed text-dracon-mist md:text-xl">
          {subtitle}
        </p>
      )}
      {children}
      <div data-rule className="rule-orbit mt-14" />
    </header>
  );
}
