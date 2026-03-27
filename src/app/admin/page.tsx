import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  let stats = { portfolio: 0, categories: 0, messages: 0, unreadMessages: 0, services: 0 };

  try {
    const [portfolio, categories, messages, unreadMessages, services] = await Promise.all([
      prisma.portfolioItem.count(),
      prisma.category.count(),
      prisma.message.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.service.count(),
    ]);
    stats = { portfolio, categories, messages, unreadMessages, services };
  } catch {
    // Database might not be set up yet
  }

  const statCards = [
    { label: 'Obras no Portfólio', value: stats.portfolio, icon: '🖼️', color: 'purple' },
    { label: 'Categorias', value: stats.categories, icon: '📁', color: 'blue' },
    { label: 'Serviços Ativos', value: stats.services, icon: '💼', color: 'orange' },
    { label: 'Mensagens', value: stats.messages, icon: '💬', color: 'green' },
    { label: 'Não Lidas', value: stats.unreadMessages, icon: '📩', color: 'red' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white glow-text mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400">
          Bem-vindo ao painel administrativo do Dracon.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
        {statCards.map((stat) => (
          <div key={stat.label} className="card-arcane p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-display font-bold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/portfolio" className="card-arcane p-6 hover:border-dracon-purple-500/50 transition-all group">
            <span className="text-2xl block mb-2">➕</span>
            <h3 className="text-white font-medium group-hover:text-dracon-purple-300 transition-colors">Nova Obra</h3>
            <p className="text-gray-500 text-sm">Adicionar ao portfólio</p>
          </a>
          <a href="/admin/messages" className="card-arcane p-6 hover:border-dracon-purple-500/50 transition-all group">
            <span className="text-2xl block mb-2">📬</span>
            <h3 className="text-white font-medium group-hover:text-dracon-purple-300 transition-colors">Ver Mensagens</h3>
            <p className="text-gray-500 text-sm">{stats.unreadMessages} não lida(s)</p>
          </a>
          <a href="/admin/services" className="card-arcane p-6 hover:border-dracon-purple-500/50 transition-all group">
            <span className="text-2xl block mb-2">🔧</span>
            <h3 className="text-white font-medium group-hover:text-dracon-purple-300 transition-colors">Gerenciar Serviços</h3>
            <p className="text-gray-500 text-sm">{stats.services} serviço(s) ativo(s)</p>
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="card-arcane p-6">
        <h2 className="text-lg font-display font-bold text-white mb-4">ℹ️ Informações do Sistema</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Logado como:</span>
            <span className="text-dracon-purple-300">{session.email}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Framework:</span>
            <span className="text-gray-300">Next.js 14</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Banco de Dados:</span>
            <span className="text-gray-300">PostgreSQL + Prisma</span>
          </div>
        </div>
      </div>
    </div>
  );
}
