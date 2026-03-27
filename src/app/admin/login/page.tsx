'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MagicButton from '@/components/ui/MagicButton';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Erro ao fazer login.');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center cosmic-bg p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold glow-text text-dracon-purple-300 mb-2"
          >
            DRACON
          </motion.h1>
          <p className="text-gray-400">Painel Administrativo</p>
        </div>

        <div className="card-arcane p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-arcane"
                placeholder="admin@dracon.art"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-arcane"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-900/30 border border-red-600/30 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            <MagicButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? '✦ Entrando...' : '✦ Entrar'}
            </MagicButton>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Acesso restrito a administradores.
        </p>
      </motion.div>
    </div>
  );
}
