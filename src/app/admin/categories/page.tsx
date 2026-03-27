'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicButton from '@/components/ui/MagicButton';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { portfolioItems: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setName(''); setDescription(''); setEditingItem(null); setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingItem ? `/api/categories/${editingItem.id}` : '/api/categories';
    const method = editingItem ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (res.ok) { resetForm(); fetchData(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar esta categoria? Isto removerá também todas as obras vinculadas!')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  if (loading) return <div className="text-gray-400">Carregando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white glow-text">Categorias</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} categoria(s)</p>
        </div>
        <MagicButton onClick={() => { resetForm(); setShowForm(true); }}>
          ➕ Nova Categoria
        </MagicButton>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dracon-void/90 backdrop-blur-sm"
            onClick={() => resetForm()}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-dracon-midnight border border-dracon-purple-800/30 rounded-xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-display font-bold text-white mb-6">
                {editingItem ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Nome</label>
                  <input type="text" className="input-arcane" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Descrição</label>
                  <textarea className="input-arcane" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="flex gap-3 pt-2">
                  <MagicButton type="submit">{editingItem ? 'Salvar' : 'Criar'}</MagicButton>
                  <MagicButton variant="secondary" onClick={resetForm}>Cancelar</MagicButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="card-arcane p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium text-lg">{cat.name}</h3>
              <span className="text-dracon-purple-400 text-sm">{cat._count?.portfolioItems || 0} obras</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">{cat.description || 'Sem descrição'}</p>
            <div className="flex gap-2">
              <button onClick={() => { setName(cat.name); setDescription(cat.description || ''); setEditingItem(cat); setShowForm(true); }}
                className="px-3 py-1 text-sm text-dracon-purple-400 hover:text-dracon-purple-300 border border-dracon-purple-800/30 rounded hover:border-dracon-purple-600/50 transition-all">
                Editar
              </button>
              <button onClick={() => handleDelete(cat.id)}
                className="px-3 py-1 text-sm text-red-400/60 hover:text-red-400 border border-red-800/20 rounded hover:border-red-600/40 transition-all">
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
