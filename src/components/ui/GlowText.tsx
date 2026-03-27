'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowTextProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  color?: 'purple' | 'orange';
  animate?: boolean;
}

export default function GlowText({
  children,
  className = '',
  as: Tag = 'h2',
  color = 'purple',
  animate = true,
}: GlowTextProps) {
  const glowClass = color === 'purple' ? 'glow-text' : 'glow-text-orange';
  const colorClass = color === 'purple' ? 'text-dracon-purple-300' : 'text-dracon-orange-400';

  const content = (
    <Tag className={`${glowClass} ${colorClass} ${className}`}>
      {children}
    </Tag>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  );
}
