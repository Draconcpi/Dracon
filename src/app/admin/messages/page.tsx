'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id: string) => {
    await fetch(`/api/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar esta mensagem?')) return;
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    if (selectedMessage?.id === id) setSelectedMessage(null);
    fetchData();
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) return <div className="text-gray-400">Carregando...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white glow-text">Mensagens</h1>
        <p className="text-gray-400 text-sm mt-1">
          {messages.length} mensagem(ns) • {unreadCount} não lida(s)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              whileHover={{ x: 4 }}
              onClick={() => {
                setSelectedMessage(msg);
                if (!msg.read) markAsRead(msg.id);
              }}
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                selectedMessage?.id === msg.id
                  ? 'bg-dracon-purple-900/30 border-dracon-purple-600/50'
                  : msg.read
                  ? 'bg-dracon-midnight/50 border-dracon-purple-800/20 hover:border-dracon-purple-800/40'
                  : 'bg-dracon-purple-900/20 border-dracon-purple-600/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-medium">{msg.name}</span>
                {!msg.read && <span className="w-2 h-2 rounded-full bg-dracon-orange-500" />}
              </div>
              <p className="text-gray-400 text-xs truncate">{msg.subject}</p>
              <p className="text-gray-600 text-xs mt-1">{formatDate(msg.createdAt)}</p>
            </motion.div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-4">📭</p>
              <p>Nenhuma mensagem recebida.</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <motion.div
              key={selectedMessage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-arcane p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-display font-bold text-white mb-1">
                    {selectedMessage.subject}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    De: <span className="text-dracon-purple-300">{selectedMessage.name}</span>
                    {' '}({selectedMessage.email})
                  </p>
                  <p className="text-gray-600 text-xs mt-1">{formatDate(selectedMessage.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="px-3 py-1 text-sm text-red-400/60 hover:text-red-400 border border-red-800/20 rounded hover:border-red-600/40 transition-all"
                >
                  Deletar
                </button>
              </div>
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
              <div className="mt-6 pt-6 border-t border-dracon-purple-800/20">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="btn-primary inline-block text-sm"
                >
                  📧 Responder por Email
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="card-arcane p-12 text-center text-gray-500">
              <p className="text-4xl mb-4">💬</p>
              <p>Selecione uma mensagem para visualizar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
