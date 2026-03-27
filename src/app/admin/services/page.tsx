'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MagicButton from '@/components/ui/MagicButton';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string | null;
  priceNote: string | null;
  features: string[];
  icon: string;
  order: number;
  active: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceNote, setPriceNote] = useState('');
  const [features, setFeatures] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setShortDescription(''); setPrice('');
    setPriceNote(''); setFeatures(''); setIcon('⭐'); setOrder(0); setActive(true);
    setEditingItem(null); setShowForm(false);
  };

  const openEditForm = (s: Service) => {
    setTitle(s.title); setDescription(s.description); setShortDescription(s.shortDescription);
    setPrice(s.price || ''); setPriceNote(s.priceNote || '');
    setFeatures(s.features.join('\n')); setIcon(s.icon); setOrder(s.order); setActive(s.active);
    setEditingItem(s); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      title, description, shortDescription, price, priceNote,
      features: features.split('\n').map((f) => f.trim()).filter(Boolean),
      icon, order, active,
    };

    const url = editingItem ? `/api/services/${editingItem.id}` : '/api/services';
    const method = editingItem ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { resetForm(); fetchData(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este serviço?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (loading) return <div className="text-gray-400">Carregando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white glow-text">Serviços</h1>
          <p className="text-gray-400 text-sm mt-1">{services.length} serviço(s)</p>
        </div>
        <MagicButton onClick={() => { resetForm(); setShowForm(true); }}>➕ Novo Serviço</MagicButton>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dracon-void/90 backdrop-blur-sm"
            onClick={() => resetForm()}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-dracon-midnight border border-dracon-purple-800/30 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-display font-bold text-white mb-6">
                {editingItem ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Título</label>
                    <input type="text" className="input-arcane" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Ícone</label>
                    <input type="text" className="input-arcane" value={icon} onChange={(e) => setIcon(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Descrição Curta</label>
                  <input type="text" className="input-arcane" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Descrição Completa</label>
                  <textarea className="input-arcane min-h-[80px]" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Preço</label>
                    <input type="text" className="input-arcane" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="A partir de R$ 350" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Nota de Preço</label>
                    <input type="text" className="input-arcane" value={priceNote} onChange={(e) => setPriceNote(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Features (uma por linha)</label>
                  <textarea className="input-arcane min-h-[100px]" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Esboço incluído&#10;Alta resolução&#10;Prazo: 7 dias" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Ordem</label>
                    <input type="number" className="input-arcane" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input type="checkbox" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4" />
                    <label htmlFor="active" className="text-sm text-gray-300">Ativo</label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <MagicButton type="submit">{editingItem ? 'Salvar' : 'Criar'}</MagicButton>
                  <MagicButton variant="secondary" onClick={resetForm}>Cancelar</MagicButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="card-arcane p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <h3 className="text-white font-medium">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.shortDescription}</p>
                <p className="text-dracon-orange-400 text-sm font-medium">{s.price || 'Sem preço definido'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs ${s.active ? 'text-green-400 bg-green-900/20' : 'text-red-400 bg-red-900/20'}`}>
                {s.active ? 'Ativo' : 'Inativo'}
              </span>
              <button onClick={() => openEditForm(s)} className="px-3 py-1 text-sm text-dracon-purple-400 hover:text-dracon-purple-300 border border-dracon-purple-800/30 rounded hover:border-dracon-purple-600/50 transition-all">Editar</button>
              <button onClick={() => handleDelete(s.id)} className="px-3 py-1 text-sm text-red-400/60 hover:text-red-400 border border-red-800/20 rounded hover:border-red-600/40 transition-all">Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
