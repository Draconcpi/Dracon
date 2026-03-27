export const SITE_NAME = 'Dracon';
export const SITE_DESCRIPTION = 'Portfólio de ilustração e animação — arte mística, fantasia e mundos arcanos.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dracon.art';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfólio' },
  { href: '/about', label: 'Sobre' },
  { href: '/services', label: 'Serviços' },
  { href: '/contact', label: 'Contato' },
] as const;

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/dracon',
  twitter: 'https://twitter.com/dracon',
  artstation: 'https://artstation.com/dracon',
  behance: 'https://behance.net/dracon',
} as const;

export const CATEGORIES = [
  'Ilustração',
  'Concept Art',
  'Animação',
  'Arte Digital Mística',
] as const;

export const SERVICE_ICONS: Record<string, string> = {
  illustration: '🎨',
  concept: '✏️',
  animation: '🎬',
  character: '🐉',
  environment: '🏔️',
  custom: '⭐',
};
