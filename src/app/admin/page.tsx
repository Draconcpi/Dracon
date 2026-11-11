import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  FolderOpen,
  Images,
  Info,
  Mail,
  MailOpen,
  MessageSquare,
  Plus,
  Sparkles,
  Type,
} from 'lucide-react';
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
    { label: 'Obras no Portfólio', value: stats.portfolio, icon: Images },
    { label: 'Categorias', value: stats.categories, icon: FolderOpen },
    { label: 'Serviços Ativos', value: stats.services, icon: Briefcase },
    { label: 'Mensagens', value: stats.messages, icon: MessageSquare },
    { label: 'Não Lidas', value: stats.unreadMessages, icon: Mail },
  ];

  const quickActions = [
    { href: '/admin/content', icon: Type, title: 'Editar Textos', text: 'Títulos, descrições e botões do site' },
    { href: '/admin/portfolio', icon: Plus, title: 'Nova Obra', text: 'Adicionar ao portfólio' },
    { href: '/admin/constellation', icon: Sparkles, title: 'Editar Constelação', text: 'Arraste estrelas e conecte guardiões' },
    { href: '/admin/messages', icon: MailOpen, title: 'Ver Mensagens', text: `${stats.unreadMessages} não lida(s)` },
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
              <stat.icon className="h-6 w-6 text-dracon-purple-300" />
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-display font-bold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href + action.title}
              href={action.href}
              className="card-arcane p-6 hover:border-dracon-purple-500/50 transition-all group"
            >
              <action.icon className="mb-3 h-6 w-6 text-dracon-orange-300" />
              <h3 className="text-white font-medium group-hover:text-dracon-purple-300 transition-colors">{action.title}</h3>
              <p className="text-gray-500 text-sm">{action.text}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="card-arcane p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-display font-bold text-white">
          <Info className="h-5 w-5 text-dracon-purple-300" /> Informações do Sistema
        </h2>
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
