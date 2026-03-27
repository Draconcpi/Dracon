'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';

// Dracon logo SVG component
function DraconLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" className="text-dracon-purple-400">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#a855f4' }} />
          <stop offset="100%" style={{ stopColor: '#f97316' }} />
        </linearGradient>
      </defs>
      <path
        d="M50 10 L75 30 L85 55 L70 75 L50 90 L30 75 L15 55 L25 30 Z"
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth="2"
      />
      <path
        d="M50 20 L65 35 L72 52 L62 66 L50 76 L38 66 L28 52 L35 35 Z"
        fill="none"
        stroke="url(#logoGrad)"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <circle cx="50" cy="48" r="8" fill="url(#logoGrad)" opacity="0.8" />
      <circle cx="50" cy="48" r="3" fill="white" opacity="0.9" />
    </svg>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Hide navbar on admin pages
  if (pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-dracon-void/90 backdrop-blur-xl border-b border-dracon-purple-800/20 shadow-lg shadow-dracon-purple-900/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            <DraconLogo />
          </motion.div>
          <span className="text-2xl font-display font-bold glow-text text-dracon-purple-300 tracking-wider">
            DRACON
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium tracking-wide transition-colors duration-300 ${
                pathname === link.href
                  ? 'text-dracon-purple-300'
                  : 'text-gray-400 hover:text-dracon-purple-300'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-dracon-purple-500 to-dracon-orange-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
        >
          <motion.span
            animate={isMobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-dracon-purple-400 block"
          />
          <motion.span
            animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-dracon-purple-400 block"
          />
          <motion.span
            animate={isMobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-dracon-purple-400 block"
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dracon-void/95 backdrop-blur-xl border-b border-dracon-purple-800/20"
          >
            <div className="section-container py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block py-2 text-lg font-display tracking-wide ${
                      pathname === link.href
                        ? 'text-dracon-purple-300 glow-text'
                        : 'text-gray-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
