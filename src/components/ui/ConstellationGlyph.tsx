'use client';

import { motion } from 'framer-motion';
import { CONSTELLATIONS, type ConstellationId } from '@/lib/constellations';

interface ConstellationGlyphProps {
  id: ConstellationId;
  className?: string;
  color?: string;
  /** Trace the lines when the glyph scrolls into view. */
  animate?: boolean;
  delay?: number;
}

/** Star chart drawing of a constellation (same data as the 3D scenes). */
export default function ConstellationGlyph({
  id,
  className = '',
  color = '#c4b5fd',
  animate = true,
  delay = 0,
}: ConstellationGlyphProps) {
  const shape = CONSTELLATIONS[id];
  const xs = shape.stars.map((s) => s[0]);
  const ys = shape.stars.map((s) => s[1]);
  const minX = Math.min(...xs);
  const maxY = Math.max(...ys);
  const pad = 0.6;
  const width = Math.max(...xs) - minX + pad * 2;
  const height = maxY - Math.min(...ys) + pad * 2;
  const unit = Math.max(width, height) / 100;
  const px = (x: number) => x - minX + pad;
  const py = (y: number) => maxY - y + pad;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      {shape.lines.map(([a, b], i) => (
        <motion.line
          key={`${a}-${b}`}
          x1={px(shape.stars[a][0])}
          y1={py(shape.stars[a][1])}
          x2={px(shape.stars[b][0])}
          y2={py(shape.stars[b][1])}
          stroke={color}
          strokeWidth={unit * 0.35}
          strokeLinecap="round"
          strokeOpacity={0.6}
          initial={animate ? { pathLength: 0, opacity: 0 } : false}
          whileInView={animate ? { pathLength: 1, opacity: 1 } : undefined}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: delay + 0.15 + i * 0.12, ease: 'easeOut' }}
        />
      ))}
      {shape.stars.map(([x, y, brightness], i) => (
        <g key={i}>
          <circle cx={px(x)} cy={py(y)} r={unit * 2.4 * brightness} fill={color} opacity={0.18} />
          <circle cx={px(x)} cy={py(y)} r={unit * 0.75 * brightness} fill="#ffffff" />
        </g>
      ))}
    </svg>
  );
}
