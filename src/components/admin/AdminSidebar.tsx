'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/portfolio', label: 'Portfólio', icon: '🖼️' },
  { href: '/admin/categories', label: 'Categorias', icon: '📁' },
  { href: '/admin/services', label: 'Serviços', icon: '💼' },
  { href: '/admin/constellation', label: 'Constelação', icon: '⭐' },
  { href: '/admin/messages', label: 'Mensagens', icon: '💬' },
  { href: '/admin/settings', label: 'Configurações', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-dracon-midnight to-dracon-void border-r border-dracon-purple-800/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dracon-purple-800/20">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="text-2xl font-display font-bold glow-text text-dracon-purple-300">
            DRACON
          </span>
        </Link>
        <p className="text-dracon-purple-600 text-xs mt-1 tracking-wider">ADMIN PANEL</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-dracon-purple-600/20 text-dracon-purple-300 border border-dracon-purple-600/30'
                  : 'text-gray-400 hover:bg-dracon-purple-900/20 hover:text-gray-300'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="admin-sidebar-indicator"
                  className="w-1 h-4 bg-dracon-purple-500 rounded-full ml-auto"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-dracon-purple-800/20">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-gray-400 transition-colors"
        >
          <span>🌐</span>
          Ver Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-sm text-red-400/60 hover:text-red-400 transition-colors w-full"
        >
          <span>🚪</span>
          Sair
        </button>
      </div>
    </aside>
  );
}
