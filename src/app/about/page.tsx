'use client';

import { useRef } from 'react';
import Astrolabe from '@/components/ui/Astrolabe';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import ConstellationDivider from '@/components/ui/ConstellationDivider';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeading from '@/components/ui/SectionHeading';
import { useReveal } from '@/components/motion/useReveal';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
import { useI18n } from '@/i18n';

const skillSlots = [0, 1, 2, 3, 4, 5];
const timelineSteps = [0, 1, 2, 3, 4];
const SKILL_TONES = ['#c9a5f5', '#fdba74', '#a5b4fc', '#d8b4fe', '#fb923c', '#e9d5ff'];

export default function AboutPage() {
  const { t } = useI18n();
  const page = useRef<HTMLDivElement>(null);
  useReveal(page);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The emblem turns slowly as the story is read
        gsap.fromTo(
          '[data-emblem]',
          { rotate: -10, yPercent: 6 },
          { rotate: 10, yPercent: -6, ease: 'none', scrollTrigger: { trigger: '[data-story]', start: 'top bottom', end: 'bottom top', scrub: true } }
        );

        // The timeline is a line of light that reaches each year in turn
        const stars = gsap.utils.toArray<HTMLElement>('[data-year-star]');
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
        });
        tl.fromTo('[data-timeline-line]', { scaleY: 0 }, { scaleY: 1, duration: stars.length }, 0);
        stars.forEach((star, i) => {
          tl.fromTo(
            star,
            { scale: 0.5, backgroundColor: '#2e0550', boxShadow: '0 0 0 0 rgba(253,186,116,0)' },
            { scale: 1, backgroundColor: '#fdba74', boxShadow: '0 0 22px 6px rgba(251,146,60,0.55)', duration: 0.3 },
            i + 0.05
          );
        });
      });
    },
    { scope: page }
  );

  return (
    <div ref={page} className="min-h-screen pb-24">
      <PageHeader title={t('about.header.title')} subtitle={t('about.header.subtitle')} glyph="lyra" />

      {/* Story */}
      <section data-story aria-labelledby="historia" className="section-container mb-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="historia" data-reveal="rise" className="display text-[clamp(2.25rem,4.6vw,3.5rem)]">
              {t('about.story.title')}
            </h2>
            <p data-reveal="rise" className="text-pretty mt-8 max-w-[58ch] text-xl font-light leading-relaxed text-dracon-starlight">
              {t('about.story.p1')}
            </p>
            <div className="mt-6 max-w-[62ch] space-y-5 text-lg leading-relaxed text-dracon-mist">
              <p data-reveal="rise">{t('about.story.p2')}</p>
              <p data-reveal="rise">{t('about.story.p3')}</p>
              <p data-reveal="rise">{t('about.story.p4')}</p>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div data-reveal="mask" className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-dracon-purple-900/80 via-dracon-cosmic/90 to-dracon-void/95">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(124,34,206,0.28),transparent_65%)]" />
              <div data-emblem className="absolute inset-0 flex items-center justify-center">
                <Astrolabe className="w-[86%]">
                  <div className="text-center">
                    <p className="starlight-fill font-display text-2xl font-bold tracking-[0.2em] md:text-3xl">DRACON</p>
                    <p className="mt-1 text-xs tracking-[0.25em] text-dracon-orange-200/80">{t('about.story.brandEst')}</p>
                  </div>
                </Astrolabe>
              </div>
              <div aria-hidden className="absolute bottom-6 left-1/2 w-1/2 -translate-x-1/2 opacity-40">
                <ConstellationGlyph id="draco" color="#fdba74" className="h-auto w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section aria-labelledby="habilidades" className="section-container relative mb-32 pt-16">
        <ConstellationDivider />
        <SectionHeading id="habilidades" title={t('about.skills.title')} subtitle={t('about.skills.subtitle')} />
        <ul className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillSlots.map((i) => (
            <li key={i} data-reveal="rise" className="flex items-center gap-5 border-b border-dracon-purple-100/15 py-7">
              <span
                aria-hidden
                className="relative h-9 w-9 shrink-0 rounded-full shadow-[inset_-4px_-5px_10px_rgba(5,0,16,0.7)]"
                style={{ background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${SKILL_TONES[i]} 32%, #2e0550 82%)` }}
              />
              <span className="font-display text-[1.35rem] font-semibold leading-snug text-dracon-starlight">{t(`about.skills.items.${i}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Timeline */}
      <section aria-labelledby="linha-do-tempo" className="section-container relative pt-16">
        <ConstellationDivider tone="orange" variant={2} />
        <SectionHeading id="linha-do-tempo" title={t('about.timeline.title')} subtitle={t('about.timeline.subtitle')} />

        <ol data-timeline className="relative mx-auto mt-20 max-w-4xl">
          <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-dracon-purple-100/15 md:left-1/2" />
          <span
            aria-hidden
            data-timeline-line
            className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b from-dracon-purple-300 via-dracon-orange-300 to-dracon-orange-300/0 md:left-1/2"
          />
          {timelineSteps.map((i) => {
            const right = i % 2 === 1;
            return (
              <li key={i} className="relative mb-16 pl-12 last:mb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                <span
                  aria-hidden
                  data-year-star
                  className="absolute left-[5px] top-3 h-[13px] w-[13px] rounded-full bg-dracon-orange-200 md:left-1/2 md:-translate-x-1/2"
                />
                <div data-reveal="rise" className={right ? 'md:col-start-2' : 'md:text-right'}>
                  <p className="num font-display text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-none text-dracon-orange-300/90">
                    {t(`about.timeline.items.${i}.year`)}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-dracon-starlight">{t(`about.timeline.items.${i}.title`)}</h3>
                  <p className={`text-pretty mt-3 max-w-[44ch] leading-relaxed text-dracon-mist ${right ? '' : 'md:ml-auto'}`}>
                    {t(`about.timeline.items.${i}.description`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
