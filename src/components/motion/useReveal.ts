'use client';

import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, EASE } from '@/lib/gsap';

/**
 * Scroll reveals for everything inside `scope`:
 *  - `data-reveal="rise"` rises into place, batched so siblings stagger together
 *  - `data-reveal="mask"` is uncovered by an iris wipe while its image settles from a slight zoom
 *  - `data-reveal="line"` draws from the left (rules and constellation lines)
 * Content stays fully visible without JS and for reduced-motion visitors.
 */
export function useReveal(scope: RefObject<HTMLElement>, dependencies: unknown[] = []) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rise = gsap.utils.toArray<HTMLElement>('[data-reveal="rise"]');
        if (rise.length) {
          gsap.set(rise, { autoAlpha: 0, y: 36 });
          ScrollTrigger.batch(rise, {
            start: 'top 90%',
            once: true,
            onEnter: (els) =>
              gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.09, overwrite: true }),
          });
        }

        gsap.utils.toArray<HTMLElement>('[data-reveal="mask"]').forEach((el) => {
          const media = el.querySelector('img, [data-reveal-media]');
          const tl = gsap.timeline({
            defaults: { ease: EASE },
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
          tl.fromTo(
            el,
            { clipPath: 'inset(14% 10% 14% 10% round 24px)', autoAlpha: 0 },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', autoAlpha: 1, duration: 1.5 }
          );
          if (media) tl.fromTo(media, { scale: 1.16 }, { scale: 1, duration: 1.9 }, 0);
          tl.set(el, { clearProps: 'clipPath' });
          // Hand the image back to CSS so hover transforms keep working
          if (media) tl.set(media, { clearProps: 'transform' });
        });

        gsap.utils.toArray<HTMLElement>('[data-reveal="line"]').forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0, transformOrigin: '0% 50%' },
            { scaleX: 1, duration: 1.6, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }
          );
        });
      });
    },
    { scope, dependencies, revertOnUpdate: true }
  );
}
