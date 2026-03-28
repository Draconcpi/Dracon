'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MagicButton from '@/components/ui/MagicButton';

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

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch('/api/constellation');
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

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'characters', label: 'Personagens', icon: '⭐' },
    { key: 'lines', label: 'Conexões', icon: '🔗' },
    { key: 'lore', label: 'Lore', icon: '📜' },
    { key: 'gallery', label: 'Galeria', icon: '🖼️' },
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
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'characters' && (
        <CharactersTab characters={characters} onRefresh={fetchAll} />
      )}
      {tab === 'lines' && (
        <LinesTab lines={lines} characters={characters} onRefresh={fetchAll} />
      )}
      {tab === 'lore' && <LoreTab lore={lore} onRefresh={fetchAll} />}
      {tab === 'gallery' && <GalleryTab gallery={gallery} onRefresh={fetchAll} />}

      {/* Live Preview */}
      <div className="mt-12 border border-dracon-purple-800/20 rounded-xl p-6 bg-dracon-midnight/50">
        <h2 className="text-lg font-display font-bold text-white mb-4">
          Pré-visualização da Constelação
        </h2>
        <ConstellationPreview characters={characters} lines={lines} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHARACTERS TAB
   ═══════════════════════════════════════════════════════════════ */
function CharactersTab({
  characters,
  onRefresh,
}: {
  characters: Character[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Character | null>(null);

  // Form fields
  const [charId, setCharId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#a855f4');
  const [cx, setCx] = useState(400);
  const [cy, setCy] = useState(200);
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);

  const resetForm = () => {
    setCharId('');
    setName('');
    setRole('');
    setDescription('');
    setColor('#a855f4');
    setCx(400);
    setCy(200);
    setImageUrl('');
    setOrder(0);
    setActive(true);
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (c: Character) => {
    setCharId(c.charId);
    setName(c.name);
    setRole(c.role);
    setDescription(c.description);
    setColor(c.color);
    setCx(c.cx);
    setCy(c.cy);
    setImageUrl(c.imageUrl || '');
    setOrder(c.order);
    setActive(c.active);
    setEditing(c);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      charId,
      name,
      role,
      description,
      color,
      cx: Number(cx),
      cy: Number(cy),
      imageUrl: imageUrl || null,
      order: Number(order),
      active,
    };

    const url = editing
      ? `/api/constellation/characters/${editing.id}`
      : '/api/constellation/characters';
    const method = editing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      resetForm();
      onRefresh();
    } else {
      const data = await res.json();
      alert(data.error || 'Erro');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este personagem? Todas as conexões serão removidas também.')) return;
    await fetch(`/api/constellation/characters/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{characters.length} personagem(ns)</p>
        <MagicButton
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          ➕ Novo Personagem
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
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: c.color }}
              />
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
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Pos: ({c.cx}, {c.cy}) | Ordem: {c.order}
              </span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(c)} className="text-dracon-purple-400 hover:text-white transition-colors">
                  ✏️
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-red-400/60 hover:text-red-400 transition-colors">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
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
              className="bg-dracon-midnight border border-dracon-purple-800/30 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-display font-bold text-white mb-6">
                {editing ? 'Editar Personagem' : 'Novo Personagem'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>ID (slug)</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={charId}
                      onChange={(e) => setCharId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      placeholder="ex: lyra"
                      required
                      disabled={!!editing}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Nome</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ex: Lyra"
                      required
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
                      <input
                        type="text"
                        className={inputClass}
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Posição X (cx)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={cx}
                      onChange={(e) => setCx(Number(e.target.value))}
                      min={0}
                      max={850}
                    />
                    <input
                      type="range"
                      min={0}
                      max={850}
                      value={cx}
                      onChange={(e) => setCx(Number(e.target.value))}
                      className="w-full mt-1 accent-purple-500"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Posição Y (cy)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={cy}
                      onChange={(e) => setCy(Number(e.target.value))}
                      min={0}
                      max={420}
                    />
                    <input
                      type="range"
                      min={0}
                      max={420}
                      value={cy}
                      onChange={(e) => setCy(Number(e.target.value))}
                      className="w-full mt-1 accent-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>URL da Imagem</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="/images/dragon-eyes/..."
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
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        className="accent-purple-500 w-4 h-4"
                      />
                      <span className="text-sm text-gray-300">Ativo</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
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
        <MagicButton onClick={handleAdd}>➕ Conectar</MagicButton>
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
              <span className="text-dracon-purple-500">→</span>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: l.to?.color || '#a855f4' }}
              />
              <span className="text-white">{l.to?.name || l.toId}</span>
            </div>
            <button
              onClick={() => handleDelete(l.id)}
              className="text-red-400/60 hover:text-red-400 transition-colors text-sm"
            >
              🗑️
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
          ➕ Nova Seção
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
              <div className="flex gap-2">
                <button onClick={() => openEdit(l)} className="text-dracon-purple-400 hover:text-white">
                  ✏️
                </button>
                <button onClick={() => handleDelete(l.id)} className="text-red-400/60 hover:text-red-400">
                  🗑️
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
          ➕ Novo Item
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
            {g.imageUrl && (
              <img
                src={g.imageUrl}
                alt={g.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
            )}
            {!g.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <polygon
                    points="50,5 63,35 95,35 70,57 78,90 50,72 22,90 30,57 5,35 37,35"
                    fill="none"
                    stroke={g.accent}
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-sm text-gray-300 font-display">{g.title}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(g)}
                className="bg-dracon-void/80 text-dracon-purple-400 hover:text-white rounded p-1 text-xs"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(g.id)}
                className="bg-dracon-void/80 text-red-400/60 hover:text-red-400 rounded p-1 text-xs"
              >
                🗑️
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
                <div>
                  <label className={labelClass}>URL da Imagem</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/images/dragon-eyes/..."
                  />
                </div>
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

/* ═══════════════════════════════════════════════════════════════
   CONSTELLATION PREVIEW (live SVG)
   ═══════════════════════════════════════════════════════════════ */
function ConstellationPreview({
  characters,
  lines,
}: {
  characters: Character[];
  lines: Line[];
}) {
  const getChar = (id: string) => characters.find((c) => c.id === id);

  return (
    <svg
      viewBox="0 0 850 420"
      className="w-full h-auto rounded-lg"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(168,85,244,0.03) 0%, rgba(10,0,21,0.8) 100%)',
      }}
    >
      {/* Lines */}
      {lines.map((l) => {
        const from = getChar(l.fromId);
        const to = getChar(l.toId);
        if (!from || !to) return null;
        return (
          <line
            key={l.id}
            x1={from.cx}
            y1={from.cy}
            x2={to.cx}
            y2={to.cy}
            stroke="rgba(168,85,244,0.25)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Stars */}
      {characters.map((c) => (
        <g key={c.id}>
          <circle cx={c.cx} cy={c.cy} r={12} fill={c.color} opacity={0.1} />
          <circle cx={c.cx} cy={c.cy} r={5} fill={c.color} opacity={0.8} />
          <circle cx={c.cx} cy={c.cy} r={2} fill="white" opacity={0.7} />
          <text
            x={c.cx}
            y={c.cy - 18}
            textAnchor="middle"
            fill="rgba(200,180,255,0.5)"
            fontSize={10}
            fontFamily="var(--font-cinzel)"
          >
            {c.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
