import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dracon: {
          purple: {
            50: '#f3e8ff',
            100: '#e0cffc',
            200: '#c9a5f5',
            300: '#a855f4',
            400: '#9333ea',
            500: '#7c22ce',
            600: '#6b21a8',
            700: '#581c87',
            800: '#3b0764',
            900: '#2e0550',
            950: '#1a0033',
          },
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
          },
          dark: '#0a0015',
          cosmic: '#0d0628',
          midnight: '#110a24',
          void: '#050010',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ['var(--font-cinzel)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        arcane: ['var(--font-cinzel-decorative)', 'serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at center, #1a0033 0%, #0d0628 40%, #050010 100%)',
        'purple-glow': 'radial-gradient(circle, rgba(124,34,206,0.3) 0%, transparent 70%)',
        'orange-glow': 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)',
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'constellation': 'constellation 4s ease-in-out infinite',
        'cosmic-dust': 'cosmic-dust 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,34,206,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124,34,206,0.6), 0 0 80px rgba(124,34,206,0.2)' },
        },
        constellation: {
          '0%, 100%': { strokeDashoffset: '1000' },
          '50%': { strokeDashoffset: '0' },
        },
        'cosmic-dust': {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '100%': { transform: 'translateX(-100px) translateY(-100px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'arcane': '0 0 15px rgba(124,34,206,0.4), 0 0 45px rgba(124,34,206,0.1)',
        'arcane-lg': '0 0 30px rgba(124,34,206,0.5), 0 0 90px rgba(124,34,206,0.2)',
        'fire': '0 0 15px rgba(249,115,22,0.4), 0 0 45px rgba(249,115,22,0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
