'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Images,
  Link2,
  Pencil,
  Plus,
  ScrollText,
  Sparkles,
  Star,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import MagicButton from '@/components/ui/MagicButton';
import ArtImage from '@/components/ui/ArtImage';
import ConstellationGlyph from '@/components/ui/ConstellationGlyph';
import ImageUrlField from '@/components/admin/ImageUrlField';
import ConstellationEditor from '@/components/admin/ConstellationEditor';
import { slugify } from '@/lib/utils';

/* ─── Types ─────────────────────────────────────────────────── */
interface Character {
  id: string;
  charId: string;
  name: string;
  role: string;
  description: string;
  color: string;
  cx: number;
  cy: number;
  imageUrl: string | null;
  order: number;
  active: boolean;
}

interface Line {
  id: string;
  fromId: string;
  toId: string;
  from: Character;
  to: Character;
}

interface Lore {
  id: string;
  title: string;
  text: string;
  chapter: number;
  order: number;
}

interface Gallery {
  id: string;
  title: string;
  imageUrl: string | null;
  accent: string;
  order: number;
}

type Tab = 'characters' | 'lines' | 'lore' | 'gallery';

/* ─── Shared styles ─────────────────────────────────────────── */
const inputClass =
  'w-full bg-dracon-void border border-dracon-purple-800/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-dracon-purple-500 transition-colors';
const labelClass = 'block text-sm text-gray-300 mb-1';

/* ─── Main Page ─────────────────────────────────────────────── */
export default function AdminConstellationPage() {
  const [tab, setTab] = useState<Tab>('characters');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [lore, setLore] = useState<Lore[]>([]);
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [charForm, setCharForm] = useState<{ character: Character | null; cx?: number; cy?: number } | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch('/api/constellation?all=1');
      const json = await res.json();
      if (json.success) {
        setCharacters(json.data.characters);
        setLines(json.data.lines);
        setLore(json.data.lore);
        setGallery(json.data.gallery);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleMove = async (id: string, cx: number, cy: number) => {
    setCharacters((prev) => prev.map((c) => (c.id === id ? { ...c, cx, cy } : c)));
    const res = await fetch(`/api/constellation/characters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cx, cy }),
    });
    if (!res.ok) {
      alert('Não foi possível salvar a nova posição.');
      fetchAll();
    }
  };

  const handleConnect = async (fromId: string, toId: string) => {
    const res = await fetch('/api/constellation/lines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromId, toId }),
    });
    if (!res.ok) alert((await res.json()).error || 'Erro ao criar conexão');
    fetchAll();
  };

  const handleDisconnect = async (lineId: string) => {
    await fetch(`/api/constellation/lines/${lineId}`, { method: 'DELETE' });
    fetchAll();
  };

  const tabs: { key: Tab; label: string; icon: LucideIcon }[] = [
    { key: 'characters', label: 'Personagens', icon: Star },
    { key: 'lines', label: 'Conexões', icon: Link2 },
    { key: 'lore', label: 'Lore', icon: ScrollText },
    { key: 'gallery', label: 'Galeria', icon: Images },
  ];

  if (loading) return <div className="text-gray-400">Carregando...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white glow-text">
          Constelação — Dragon Eyes
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Gerencie personagens, conexões, lore e galeria da constelação.
        </p>
      </div>

      {/* Visual editor */}
      <div className="mb-10 rounded-xl border border-dracon-purple-800/20 bg-dracon-midnight/50 p-6">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-display font-bold text-white">
          <Sparkles className="h-5 w-5 text-dracon-purple-300" /> Editor Visual
        </h2>
        <p className="mb-4 text-sm text-gray-400">
          Monte a constelação direto no mapa — posições e conexões são salvas automaticamente.
        </p>
        <ConstellationEditor
          characters={characters}
          lines={lines}
          onMove={handleMove}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onEdit={(id) => setCharForm({ character: characters.find((c) => c.id === id) ?? null })}
          onCreateAt={(cx, cy) => setCharForm({ character: null, cx, cy })}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-dracon-purple-800/20 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
              tab === t.key
                ? 'bg-dracon-purple-600/20 text-dracon-purple-300 border border-dracon-purple-600/30 border-b-transparent'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'characters' && (
        <CharactersTab
          characters={characters}
          lines={lines}
          onRefresh={fetchAll}
          onEdit={(c) => setCharForm({ character: c })}
          onCreate={() => setCharForm({ character: null })}
        />
      )}
      {tab === 'lines' && (
        <LinesTab lines={lines} characters={characters} onRefresh={fetchAll} />
      )}
      {tab === 'lore' && <LoreTab lore={lore} onRefresh={fetchAll} />}
      {tab === 'gallery' && <GalleryTab gallery={gallery} onRefresh={fetchAll} />}

      <AnimatePresence>
        {charForm && (
          <CharacterFormModal
            key={charForm.character?.id ?? 'new'}
            character={charForm.character}
            initialCx={charForm.cx}
            initialCy={charForm.cy}
            onClose={() => setCharForm(null)}
            onSaved={() => {
              setCharForm(null);
              fetchAll();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHARACTERS TAB
   ═══════════════════════════════════════════════════════════════ */
function CharactersTab({
  characters,
  lines,
  onRefresh,
  onEdit,
  onCreate,
}: {
  characters: Character[];
  lines: Line[];
  onRefresh: () => void;
  onEdit: (c: Character) => void;
  onCreate: () => void;
}) {
  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este personagem? Todas as conexões serão removidas também.')) return;
    await fetch(`/api/constellation/characters/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{characters.length} personagem(ns)</p>
        <MagicButton onClick={onCreate}>
          <Plus className="h-4 w-4" /> Novo Personagem
        </MagicButton>
      </div>

      {/* Character cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border p-4"
            style={{
              borderColor: `${c.color}33`,
              background: `linear-gradient(135deg, ${c.color}08 0%, transparent 60%), rgba(10,0,21,0.8)`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border"
                style={{ borderColor: `${c.color}66`, background: `${c.color}22` }}
              >
                <ArtImage
                  src={c.imageUrl}
                  alt={c.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                  fallback={
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color, boxShadow: `0 0 10px ${c.color}` }} />
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold truncate">{c.name}</h3>
                <p className="text-xs truncate" style={{ color: c.color }}>
                  {c.role}
                </p>
              </div>
              {!c.active && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                  Inativo
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs mb-3 line-clamp-2">{c.description}</p>
            {(() => {
              const connCount = lines.filter(l => l.fromId === c.id || l.toId === c.id).length;
              return connCount === 0 ? (
                <p className="mb-2 flex items-center gap-1.5 text-xs text-amber-400/80">
                  <TriangleAlert className="h-3.5 w-3.5" /> Sem conexões — ligue no Editor Visual
                </p>
              ) : (
                <p className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
                  <Link2 className="h-3.5 w-3.5" /> {connCount} conexão(ões)
                </p>
              );
            })()}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Pos: ({c.cx}, {c.cy}) | Ordem: {c.order}
              </span>
              <div className="flex gap-1">
                <button onClick={() => onEdit(c)} title="Editar" className="rounded p-1.5 text-dracon-purple-300 hover:bg-white/5 hover:text-white transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} title="Excluir" className="rounded p-1.5 text-red-400/60 hover:bg-white/5 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHARACTER FORM (shared by the list and the visual editor)
   ═══════════════════════════════════════════════════════════════ */
function CharacterFormModal({
  character,
  initialCx,
  initialCy,
  onClose,
  onSaved,
}: {
  character: Character | null;
  initialCx?: number;
  initialCy?: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [charId, setCharId] = useState(character?.charId ?? '');
  const [slugTouched, setSlugTouched] = useState(!!character);
  const [name, setName] = useState(character?.name ?? '');
  const [role, setRole] = useState(character?.role ?? '');
  const [description, setDescription] = useState(character?.description ?? '');
  const [color, setColor] = useState(character?.color ?? '#a855f4');
  const [cx, setCx] = useState(character?.cx ?? initialCx ?? 425);
  const [cy, setCy] = useState(character?.cy ?? initialCy ?? 210);
  const [imageUrl, setImageUrl] = useState(character?.imageUrl ?? '');
  const [order, setOrder] = useState(character?.order ?? 0);
  const [active, setActive] = useState(character?.active ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      charId,
      name,
      role,
      description,
      color,
      cx: Number(cx),
      cy: Number(cy),
      imageUrl: imageUrl.trim() || null,
      order: Number(order),
      active,
    };

    const res = await fetch(
      character ? `/api/constellation/characters/${character.id}` : '/api/constellation/characters',
      {
        method: character ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    setSaving(false);
    if (res.ok) onSaved();
    else alert((await res.json()).error || 'Erro ao salvar personagem.');
  };

  const handleDelete = async () => {
    if (!character || !confirm('Deletar este personagem? Todas as conexões serão removidas também.')) return;
    await fetch(`/api/constellation/characters/${character.id}`, { method: 'DELETE' });
    onSaved();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dracon-void/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-dracon-midnight border border-dracon-purple-800/30 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-display font-bold text-white mb-6">
          {character ? 'Editar Personagem' : 'Novo Personagem'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome</label>
              <input
                type="text"
                className={inputClass}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setCharId(slugify(e.target.value));
                }}
                placeholder="ex: Lyra"
                required
              />
            </div>
            <div>
              <label className={labelClass}>ID (gerado a partir do nome)</label>
              <input
                type="text"
                className={inputClass}
                value={charId}
                onChange={(e) => {
                  setSlugTouched(true);
                  setCharId(slugify(e.target.value));
                }}
                placeholder="ex: lyra"
                required
                disabled={!!character}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Cargo / Título</label>
            <input
              type="text"
              className={inputClass}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="ex: A Vidente Estelar"
              required
            />
          </div>

          <div>
            <label className={labelClass}>Descrição</label>
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Cor da Estrela</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                />
                <input type="text" className={inputClass} value={color} onChange={(e) => setColor(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Posição X</label>
              <input
                type="range"
                min={0}
                max={850}
                value={cx}
                onChange={(e) => setCx(Number(e.target.value))}
                className="w-full mt-3 accent-purple-500"
              />
            </div>
            <div>
              <label className={labelClass}>Posição Y</label>
              <input
                type="range"
                min={0}
                max={420}
                value={cy}
                onChange={(e) => setCy(Number(e.target.value))}
                className="w-full mt-3 accent-purple-500"
              />
            </div>
          </div>
          <p className="-mt-2 text-xs text-gray-500">Dica: é mais fácil posicionar arrastando a estrela no Editor Visual.</p>

          <ImageUrlField value={imageUrl} onChange={setImageUrl} label="Imagem do personagem (opcional)" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ordem</label>
              <input type="number" className={inputClass} value={order} onChange={(e) => setOrder(Number(e.target.value))} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="accent-purple-500 w-4 h-4"
                />
                <span className="text-sm text-gray-300">Visível no site</span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <MagicButton type="submit" variant="primary" disabled={saving}>
              {character ? 'Salvar' : 'Criar'}
            </MagicButton>
            <MagicButton type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </MagicButton>
            {character && (
              <button
                type="button"
                onClick={handleDelete}
                className="ml-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" /> Excluir
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LINES TAB
   ═══════════════════════════════════════════════════════════════ */
function LinesTab({
  lines,
  characters,
  onRefresh,
}: {
  lines: Line[];
  characters: Character[];
  onRefresh: () => void;
}) {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');

  const handleAdd = async () => {
    if (!fromId || !toId || fromId === toId) {
      alert('Selecione dois personagens diferentes.');
      return;
    }
    const res = await fetch('/api/constellation/lines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromId, toId }),
    });
    if (res.ok) {
      setFromId('');
      setToId('');
      onRefresh();
    } else {
      const data = await res.json();
      alert(data.error || 'Erro ao criar conexão');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover esta conexão?')) return;
    await fetch(`/api/constellation/lines/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div>
      <p className="text-gray-400 text-sm mb-6">{lines.length} conexão(ões)</p>

      {/* Add connection */}
      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <div>
          <label className={labelClass}>De</label>
          <select
            className={inputClass}
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
          >
            <option value="">Selecione...</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.charId})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Para</label>
          <select
            className={inputClass}
            value={toId}
            onChange={(e) => setToId(e.target.value)}
          >
            <option value="">Selecione...</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.charId})
              </option>
            ))}
          </select>
        </div>
        <MagicButton onClick={handleAdd}>
          <Link2 className="h-4 w-4" /> Conectar
        </MagicButton>
      </div>

      {/* Existing lines */}
      <div className="space-y-2">
        {lines.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between bg-dracon-void/50 border border-dracon-purple-800/20 rounded-lg px-4 py-3"
          >
            <div className="flex items-center gap-3 text-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: l.from?.color || '#a855f4' }}
              />
              <span className="text-white">{l.from?.name || l.fromId}</span>
              <ArrowRight className="h-4 w-4 text-dracon-purple-400" />
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: l.to?.color || '#a855f4' }}
              />
              <span className="text-white">{l.to?.name || l.toId}</span>
            </div>
            <button
              onClick={() => handleDelete(l.id)}
              title="Remover conexão"
              className="rounded p-1.5 text-red-400/60 hover:bg-white/5 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {lines.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            Nenhuma conexão ainda. Adicione acima para criar linhas na constelação.
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LORE TAB
   ═══════════════════════════════════════════════════════════════ */
function LoreTab({ lore, onRefresh }: { lore: Lore[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Lore | null>(null);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [chapter, setChapter] = useState(0);
  const [order, setOrder] = useState(0);

  const resetForm = () => {
    setTitle('');
    setText('');
    setChapter(0);
    setOrder(0);
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (l: Lore) => {
    setTitle(l.title);
    setText(l.text);
    setChapter(l.chapter);
    setOrder(l.order);
    setEditing(l);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { title, text, chapter: Number(chapter), order: Number(order) };
    const url = editing ? `/api/constellation/lore/${editing.id}` : '/api/constellation/lore';
    const method = editing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      resetForm();
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar esta seção de lore?')) return;
    await fetch(`/api/constellation/lore/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{lore.length} seção(ões)</p>
        <MagicButton
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Nova Seção
        </MagicButton>
      </div>

      <div className="space-y-4">
        {lore.map((l, i) => (
          <div
            key={l.id}
            className="border border-dracon-purple-800/20 rounded-xl p-5 bg-dracon-void/30"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-dracon-purple-400 text-xs tracking-wider uppercase">
                  Capítulo {l.chapter || i + 1}
                </span>
                <h3 className="text-white font-bold">{l.title}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(l)} title="Editar" className="rounded p-1.5 text-dracon-purple-300 hover:bg-white/5 hover:text-white">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(l.id)} title="Excluir" className="rounded p-1.5 text-red-400/60 hover:bg-white/5 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-sm line-clamp-3">{l.text}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dracon-void/90 backdrop-blur-sm"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-dracon-midnight border border-dracon-purple-800/30 rounded-xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-display font-bold text-white mb-6">
                {editing ? 'Editar Seção' : 'Nova Seção de Lore'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Título</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Capítulo</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={chapter}
                        onChange={(e) => setChapter(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Ordem</label>
                      <input
                        type="number"
                        className={inputClass}
                        value={order}
                        onChange={(e) => setOrder(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Texto</label>
                  <textarea
                    className={`${inputClass} min-h-[150px] resize-y`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <MagicButton type="submit" variant="primary">
                    {editing ? 'Salvar' : 'Criar'}
                  </MagicButton>
                  <MagicButton type="button" variant="secondary" onClick={resetForm}>
                    Cancelar
                  </MagicButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GALLERY TAB
   ═══════════════════════════════════════════════════════════════ */
function GalleryTab({
  gallery,
  onRefresh,
}: {
  gallery: Gallery[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Gallery | null>(null);

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [accent, setAccent] = useState('#a855f4');
  const [order, setOrder] = useState(0);

  const resetForm = () => {
    setTitle('');
    setImageUrl('');
    setAccent('#a855f4');
    setOrder(0);
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (g: Gallery) => {
    setTitle(g.title);
    setImageUrl(g.imageUrl || '');
    setAccent(g.accent);
    setOrder(g.order);
    setEditing(g);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { title, imageUrl: imageUrl || null, accent, order: Number(order) };
    const url = editing
      ? `/api/constellation/gallery/${editing.id}`
      : '/api/constellation/gallery';
    const method = editing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      resetForm();
      onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este item da galeria?')) return;
    await fetch(`/api/constellation/gallery/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{gallery.length} item(ns)</p>
        <MagicButton
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Novo Item
        </MagicButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((g) => (
          <div
            key={g.id}
            className="aspect-[4/3] rounded-xl overflow-hidden border relative group"
            style={{
              borderColor: `${g.accent}33`,
              background: `radial-gradient(ellipse at 40% 40%, ${g.accent}15 0%, transparent 70%), linear-gradient(135deg, #0a0015 0%, #1a0030 100%)`,
            }}
          >
            <ArtImage
              src={g.imageUrl}
              alt={g.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              fallback={
                <div className="absolute inset-[18%] opacity-30">
                  <ConstellationGlyph id="draco" color={g.accent} animate={false} className="h-full w-full" />
                </div>
              }
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-sm text-gray-300 font-display">{g.title}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(g)}
                title="Editar"
                className="rounded bg-dracon-void/80 p-1.5 text-dracon-purple-300 hover:text-white"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(g.id)}
                title="Excluir"
                className="rounded bg-dracon-void/80 p-1.5 text-red-400/70 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dracon-void/90 backdrop-blur-sm"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-dracon-midnight border border-dracon-purple-800/30 rounded-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-display font-bold text-white mb-6">
                {editing ? 'Editar Item' : 'Novo Item de Galeria'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Título</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <ImageUrlField value={imageUrl} onChange={setImageUrl} label="Imagem" />
                <div>
                  <label className={labelClass}>Cor de Destaque</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                    />
                    <input
                      type="text"
                      className={inputClass}
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Ordem</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <MagicButton type="submit" variant="primary">
                    {editing ? 'Salvar' : 'Criar'}
                  </MagicButton>
                  <MagicButton type="button" variant="secondary" onClick={resetForm}>
                    Cancelar
                  </MagicButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
