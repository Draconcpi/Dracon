'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicButton from '@/components/ui/MagicButton';

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  category: { id: string; name: string };
  tags: string[];
  featured: boolean;
  order: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([
        fetch('/api/portfolio'),
        fetch('/api/categories'),
      ]);
      const itemsData = await itemsRes.json();
      const catsData = await catsRes.json();
      if (itemsData.success) setItems(itemsData.data);
      if (catsData.success) setCategories(catsData.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setCategoryId('');
    setTags('');
    setFeatured(false);
    setOrder(0);
    setEditingItem(null);
    setShowForm(false);
  };

  const openEditForm = (item: PortfolioItem) => {
    setTitle(item.title);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    setCategoryId(item.categoryId);
    setTags(item.tags.join(', '));
    setFeatured(item.featured);
    setOrder(item.order);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      title,
      description,
      imageUrl,
      categoryId,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured,
      order,
    };

    const url = editingItem ? `/api/portfolio/${editingItem.id}` : '/api/portfolio';
    const method = editingItem ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      resetForm();
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;
    const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  if (loading) return <div className="text-gray-400">Carregando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white glow-text">Portfólio</h1>
          <p className="text-gray-400 text-sm mt-1">{items.length} obra(s) cadastrada(s)</p>
        </div>
        <MagicButton onClick={() => { resetForm(); setShowForm(true); }}>
          ➕ Nova Obra
        </MagicButton>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dracon-void/90 backdrop-blur-sm"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-dracon-midnight border border-dracon-purple-800/30 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-display font-bold text-white mb-6">
                {editingItem ? 'Editar Obra' : 'Nova Obra'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Título</label>
                  <input type="text" className="input-arcane" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Descrição</label>
                  <textarea className="input-arcane min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">URL da Imagem</label>
                  <input type="text" className="input-arcane" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required placeholder="/images/portfolio/example.jpg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Categoria</label>
                  <select className="input-arcane" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                    <option value="">Selecione...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Tags (separadas por vírgula)</label>
                  <input type="text" className="input-arcane" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="fantasia, magia, estrelas" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Ordem</label>
                    <input type="number" className="input-arcane" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4" />
                    <label htmlFor="featured" className="text-sm text-gray-300">Destaque</label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <MagicButton type="submit" variant="primary">
                    {editingItem ? 'Salvar Alterações' : 'Criar Obra'}
                  </MagicButton>
                  <MagicButton variant="secondary" onClick={resetForm}>
                    Cancelar
                  </MagicButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card-arcane p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-dracon-purple-900/30 flex items-center justify-center text-2xl">
                🖼️
              </div>
              <div>
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.category?.name} • Ordem: {item.order}</p>
                {item.featured && (
                  <span className="text-dracon-orange-400 text-xs">⭐ Destaque</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEditForm(item)} className="px-3 py-1 text-sm text-dracon-purple-400 hover:text-dracon-purple-300 border border-dracon-purple-800/30 rounded hover:border-dracon-purple-600/50 transition-all">
                Editar
              </button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1 text-sm text-red-400/60 hover:text-red-400 border border-red-800/20 rounded hover:border-red-600/40 transition-all">
                Deletar
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">🖼️</p>
            <p>Nenhuma obra cadastrada ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
