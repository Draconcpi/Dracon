'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface MagicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'fire';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Renders a link styled as a button instead of a <button>. */
  href?: string;
}

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  fire: 'btn-fire',
};

export default function MagicButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  href,
}: MagicButtonProps) {
  const classes = `${VARIANTS[variant]} group relative inline-flex items-center justify-center overflow-hidden transition-transform duration-300 active:translate-y-px ${
    disabled ? 'cursor-not-allowed opacity-50' : ''
  } ${className}`;

  const inner = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {!disabled && <span aria-hidden className="btn-shine" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {inner}
    </button>
  );
}
