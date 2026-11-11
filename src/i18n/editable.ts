import pt from './pt.json';
import en from './en.json';

export type ContentLocale = 'pt' | 'en';
export type ContentOverrides = Record<ContentLocale, Record<string, string>>;

// Legacy seed copy: this content is now managed in the database (portfolio, services, constellation)
const DB_MANAGED = [
  'home.works',
  'portfolio.items',
  'portfolio.categories',
  'services.items',
  'dragonEyes.characters',
  'dragonEyes.lore.chapters',
  'dragonEyes.gallery.items',
];

function flatten(value: unknown, prefix: string, out: Record<string, string>) {
  if (typeof value === 'string') {
    out[prefix] = value;
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) flatten(child, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

const isEditable = (key: string) => !DB_MANAGED.some((p) => key === p || key.startsWith(`${p}.`));

const editable = (messages: unknown) =>
  Object.fromEntries(Object.entries(flatten(messages, '', {})).filter(([key]) => isEditable(key)));

/** Every editable site text, keyed by its dotted i18n path. */
export const DEFAULT_TEXTS: ContentOverrides = { pt: editable(pt), en: editable(en) };

export const TEXT_SECTIONS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'home', label: 'Página Inicial' },
  { id: 'about', label: 'Sobre' },
  { id: 'portfolio', label: 'Portfólio' },
  { id: 'services', label: 'Serviços' },
  { id: 'contact', label: 'Contato' },
  { id: 'dragonEyes', label: 'Dragon Eyes' },
  { id: 'nav', label: 'Menu' },
  { id: 'footer', label: 'Rodapé' },
  { id: 'common', label: 'Geral' },
  { id: 'notFound', label: 'Página 404' },
  { id: 'error', label: 'Página de Erro' },
];

export function isEditableKey(locale: ContentLocale, key: string) {
  return Object.prototype.hasOwnProperty.call(DEFAULT_TEXTS[locale], key);
}
