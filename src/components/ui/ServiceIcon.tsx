import {
  BookOpen,
  Brush,
  Camera,
  Clapperboard,
  Crown,
  Eye,
  Feather,
  Film,
  Flame,
  Gamepad2,
  Gem,
  Heart,
  Image as ImageIcon,
  Layers,
  Moon,
  Mountain,
  Music,
  Orbit,
  Palette,
  PenTool,
  Shapes,
  Shield,
  Sparkles,
  Star,
  Sun,
  Swords,
  Telescope,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';

export const SERVICE_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  sparkles: { icon: Sparkles, label: 'Brilho' },
  palette: { icon: Palette, label: 'Paleta' },
  brush: { icon: Brush, label: 'Pincel' },
  'pen-tool': { icon: PenTool, label: 'Caneta' },
  clapperboard: { icon: Clapperboard, label: 'Animação' },
  film: { icon: Film, label: 'Filme' },
  camera: { icon: Camera, label: 'Câmera' },
  image: { icon: ImageIcon, label: 'Imagem' },
  layers: { icon: Layers, label: 'Camadas' },
  shapes: { icon: Shapes, label: 'Formas' },
  wand: { icon: WandSparkles, label: 'Magia' },
  gem: { icon: Gem, label: 'Gema' },
  crown: { icon: Crown, label: 'Coroa' },
  feather: { icon: Feather, label: 'Pena' },
  flame: { icon: Flame, label: 'Chama' },
  eye: { icon: Eye, label: 'Olho' },
  moon: { icon: Moon, label: 'Lua' },
  sun: { icon: Sun, label: 'Sol' },
  star: { icon: Star, label: 'Estrela' },
  orbit: { icon: Orbit, label: 'Órbita' },
  telescope: { icon: Telescope, label: 'Telescópio' },
  mountain: { icon: Mountain, label: 'Paisagem' },
  swords: { icon: Swords, label: 'Espadas' },
  shield: { icon: Shield, label: 'Escudo' },
  'book-open': { icon: BookOpen, label: 'Livro' },
  gamepad: { icon: Gamepad2, label: 'Jogos' },
  music: { icon: Music, label: 'Música' },
  heart: { icon: Heart, label: 'Coração' },
};

// Services saved before the icon picker stored an emoji
const LEGACY_EMOJI: Record<string, string> = {
  '🎨': 'palette',
  '✏️': 'pen-tool',
  '✏': 'pen-tool',
  '🖌️': 'brush',
  '🎬': 'clapperboard',
  '🐉': 'flame',
  '🔥': 'flame',
  '🏔️': 'mountain',
  '⭐': 'star',
  '🌟': 'star',
  '✨': 'sparkles',
  '🔮': 'gem',
  '🌙': 'moon',
  '📖': 'book-open',
  '🎮': 'gamepad',
};

export function resolveServiceIconKey(value: string | null | undefined): string {
  if (value && SERVICE_ICONS[value]) return value;
  return (value && LEGACY_EMOJI[value.trim()]) || 'sparkles';
}

export default function ServiceIcon({ name, className }: { name: string | null | undefined; className?: string }) {
  const Icon = SERVICE_ICONS[resolveServiceIconKey(name)].icon;
  return <Icon className={className} aria-hidden />;
}
