'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);
}

/** Animations only run for visitors who have not asked for reduced motion. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** House easing: a long, soft exponential settle, like light reaching the eye. */
export const EASE = 'expo.out';

export { gsap, ScrollTrigger, Flip, useGSAP };
