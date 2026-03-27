'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MagicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'fire';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  href?: string;
}

export default function MagicButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: MagicButtonProps) {
  const baseStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    fire: 'btn-fire',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles[variant]} relative overflow-hidden group ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {!disabled && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: variant === 'fire'
              ? 'radial-gradient(circle at center, rgba(249,115,22,0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(168,85,244,0.2) 0%, transparent 70%)',
          }}
        />
      )}
    </motion.button>
  );
}
