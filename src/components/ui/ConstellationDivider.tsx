'use client';

import { motion } from 'framer-motion';

// Star positions in a 1000×40 box; each pattern reads as a thin constellation band
const PATTERNS: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [[60, 22], [170, 12], [265, 26], [380, 16], [500, 8], [620, 24], [730, 14], [840, 28], [940, 18]],
  [[50, 16], [150, 28], [260, 14], [360, 22], [500, 30], [610, 12], [720, 20], [830, 10], [950, 22]],
  [[70, 26], [180, 18], [290, 8], [410, 20], [500, 14], [600, 26], [700, 12], [820, 20], [930, 10]],
];

interface ConstellationDividerProps {
  className?: string;
  tone?: 'purple' | 'orange';
  variant?: number;
}

/** Section separator drawn as a constellation that traces itself on view. */
export default function ConstellationDivider({ className = '', tone = 'purple', variant = 0 }: ConstellationDividerProps) {
  const points = PATTERNS[variant % PATTERNS.length];
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
  const stroke = tone === 'orange' ? 'rgba(251,146,60,0.45)' : 'rgba(192,132,252,0.45)';
  const star =
    tone === 'orange'
      ? 'bg-dracon-orange-100 shadow-[0_0_8px_2px_rgba(251,146,60,0.6)]'
      : 'bg-dracon-purple-50 shadow-[0_0_8px_2px_rgba(192,132,252,0.6)]';

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 h-10 -translate-y-1/2 mask-fade-x ${className}`}>
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <motion.path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth={1}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        />
      </svg>
      {points.map(([x, y], i) => (
        <span
          key={x}
          className={`absolute -ml-[1.5px] -mt-[1.5px] h-[3px] w-[3px] rounded-full animate-twinkle ${star}`}
          style={{ left: `${x / 10}%`, top: `${(y / 40) * 100}%`, animationDelay: `${i * 0.37}s` }}
        />
      ))}
    </div>
  );
}
