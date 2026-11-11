import { Globe } from 'lucide-react';
import { SiArtstation, SiBehance, SiInstagram, SiX } from 'react-icons/si';
import type { ComponentType } from 'react';

const BRAND_ICONS: Record<string, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  instagram: SiInstagram,
  twitter: SiX,
  x: SiX,
  artstation: SiArtstation,
  behance: SiBehance,
};

/** Brand logo for a social network key (falls back to a globe). */
export default function SocialIcon({ name, className = 'h-4 w-4' }: { name: string; className?: string }) {
  const Icon = BRAND_ICONS[name.toLowerCase()] ?? Globe;
  return <Icon className={className} aria-hidden />;
}
