'use client';

import { useEffect, useMemo, useState } from 'react';
import { CircleCheck, LoaderCircle, RotateCcw, Save, Search, TriangleAlert, Type } from 'lucide-react';
import MagicButton from '@/components/ui/MagicButton';
import { DEFAULT_TEXTS, TEXT_SECTIONS, type ContentLocale, type ContentOverrides } from '@/i18n/editable';

const LOCALES: { id: ContentLocale; label: string }[] = [
  { id: 'pt', label: 'Português' },
  { id: 'en', label: 'English' },
];

const WORDS: Record<string, string> = {
  hero: 'Topo',
  header: 'Cabeçalho',
  title: 'Título',
  subtitle: 'Subtítulo',
  heading: 'Título',
  tag: 'Etiqueta',
  tagline: 'Chamada',
  description: 'Descrição',
  message: 'Mensagem',
  cta: 'Botão',
  form: 'Formulário',
  items: 'Item',
  placeholder: '(texto de exemplo)',
  carousel: 'Carrossel',
  featured: 'Destaques',
  about: 'Sobre',
  story: 'História',
  skills: 'Habilidades',
  timeline: 'Linha do tempo',
  process: 'Processo',
  steps: 'Etapa',
  info: 'Informações',
  lore: 'Lore',
  gallery: 'Galeria',
  constellation: 'Constelação',
  filters: 'Filtros',
};

const KEYS = Object.keys(DEFAULT_TEXTS.pt);
const clone = (o: ContentOverrides): ContentOverrides => ({ pt: { ...o.pt }, en: { ...o.en } });

/** "home.hero.ctaPortfolio" → "Topo › Botão Portfolio" */
function humanize(key: string) {
  return key
    .split('.')
    .slice(1)
    .map((part) => {
      if (/^\d+$/.test(part)) return `#${Number(part) + 1}`;
      return part
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map((w) => WORDS[w.toLowerCase()] ?? w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    })
    .join(' › ');
}

const rowsFor = (text: string) => Math.min(8, Math.max(1, Math.ceil(text.length / 70)));

export default function AdminContentPage() {
  const [section, setSection] = useState(TEXT_SECTIONS[0].id);
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<ContentOverrides>(() => clone(DEFAULT_TEXTS));
  const [values, setValues] = useState<ContentOverrides>(() => clone(DEFAULT_TEXTS));
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) return;
        const merged = clone(DEFAULT_TEXTS);
        for (const { id } of LOCALES) {
          for (const [key, value] of Object.entries(json.data[id] as Record<string, string>)) {
            if (key in merged[id]) merged[id][key] = value;
          }
        }
        setSaved(merged);
        setValues(clone(merged));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const changes = useMemo(
    () =>
      LOCALES.flatMap(({ id }) =>
        KEYS.filter((key) => values[id][key] !== saved[id][key]).map((key) => [id, key] as const)
      ),
    [values, saved]
  );

  const editedCount = (prefix: string) =>
    KEYS.filter(
      (key) =>
        key.startsWith(`${prefix}.`) &&
        LOCALES.some(({ id }) => values[id][key] !== DEFAULT_TEXTS[id][key])
    ).length;

  const visibleKeys = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return KEYS.filter((key) => key.startsWith(`${section}.`));
    return KEYS.filter(
      (key) =>
        key.toLowerCase().includes(q) ||
        values.pt[key].toLowerCase().includes(q) ||
        values.en[key].toLowerCase().includes(q)
    );
  }, [query, section, values]);

  const update = (locale: ContentLocale, key: string, value: string) => {
    setValues((prev) => ({ ...prev, [locale]: { ...prev[locale], [key]: value } }));
    setStatus('idle');
  };

  const restore = (key: string) => {
    setValues((prev) => ({
      pt: { ...prev.pt, [key]: DEFAULT_TEXTS.pt[key] },
      en: { ...prev.en, [key]: DEFAULT_TEXTS.en[key] },
    }));
  };

  const handleSave = async () => {
    setStatus('saving');
    const payload: Record<ContentLocale, Record<string, string | null>> = { pt: {}, en: {} };
    for (const [locale, key] of changes) {
      payload[locale][key] = values[locale][key] === DEFAULT_TEXTS[locale][key] ? null : values[locale][key];
    }
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSaved(clone(values));
      setStatus('saved');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (loading) return <div className="text-gray-400">Carregando...</div>;

  return (
    <div className="pb-24">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-display font-bold text-white glow-text">
          <Type className="h-7 w-7 text-dracon-purple-300" /> Textos do Site
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Edite qualquer texto do site em português e inglês. As alterações aparecem no site assim que você salvar.
        </p>
      </div>

      <div className="relative mb-6 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="search"
          className="input-arcane pl-10"
          placeholder="Buscar texto em todas as páginas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {!query && (
          <nav className="flex gap-2 overflow-x-auto lg:w-56 lg:flex-shrink-0 lg:flex-col lg:overflow-visible">
            {TEXT_SECTIONS.map((s) => {
              const edited = editedCount(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.id)}
                  className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${
                    section === s.id
                      ? 'bg-dracon-purple-600/20 text-white border border-dracon-purple-500/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                  }`}
                >
                  {s.label}
                  {edited > 0 && (
                    <span className="rounded-full bg-dracon-orange-500/20 px-2 text-[11px] text-dracon-orange-300">{edited}</span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        <div className="flex-1 space-y-4">
          {visibleKeys.length === 0 && <p className="text-gray-500">Nenhum texto encontrado.</p>}
          {visibleKeys.map((key) => {
            const isEdited = LOCALES.some(({ id }) => values[id][key] !== DEFAULT_TEXTS[id][key]);
            const hasPlaceholder = /\{\w+\}/.test(DEFAULT_TEXTS.pt[key]);
            return (
              <div key={key} className="card-arcane p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {query && <span className="text-dracon-purple-300">{TEXT_SECTIONS.find((s) => key.startsWith(`${s.id}.`))?.label} › </span>}
                      {humanize(key)}
                    </p>
                    <p className="font-mono text-[11px] text-gray-600">{key}</p>
                    {hasPlaceholder && (
                      <p className="mt-1 text-xs text-dracon-orange-300/80">
                        Mantenha os trechos entre chaves, como {'{year}'}: eles são preenchidos automaticamente.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {isEdited && (
                      <>
                        <span className="rounded-full bg-dracon-orange-500/15 px-2 py-0.5 text-[11px] text-dracon-orange-300">Editado</span>
                        <button
                          type="button"
                          onClick={() => restore(key)}
                          title="Restaurar texto original"
                          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {LOCALES.map(({ id, label }) => (
                    <label key={id} className="block">
                      <span className="text-[11px] uppercase tracking-wider text-gray-500">{label}</span>
                      <textarea
                        className="input-arcane mt-1 resize-y text-sm"
                        rows={rowsFor(values[id][key])}
                        value={values[id][key]}
                        onChange={(e) => update(id, key, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-4 right-6 z-40 flex items-center gap-4 rounded-xl border border-white/10 bg-dracon-midnight/95 px-5 py-3 shadow-arcane backdrop-blur">
        <span className="text-sm text-gray-300">
          {status === 'saved' && (
            <span className="flex items-center gap-2 text-green-400">
              <CircleCheck className="h-4 w-4" /> Textos salvos!
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-2 text-red-400">
              <TriangleAlert className="h-4 w-4" /> Erro ao salvar. Tente novamente.
            </span>
          )}
          {(status === 'idle' || status === 'saving') &&
            (changes.length > 0 ? `${changes.length} alteração(ões) não salva(s)` : 'Nenhuma alteração pendente')}
        </span>
        <MagicButton onClick={handleSave} disabled={changes.length === 0 || status === 'saving'}>
          {status === 'saving' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar
        </MagicButton>
      </div>
    </div>
  );
}
