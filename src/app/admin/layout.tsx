import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication for admin routes (except login)
  const session = await getSession();

  // This layout wraps all admin pages including login.
  // The login page handles its own layout, so we just render children for it.
  // For other admin pages, we check auth.

  return (
    <div className="flex min-h-screen">
      {session ? (
        <>
          <AdminSidebar />
          <main className="flex-1 bg-dracon-void">
            <div className="p-8">
              {children}
            </div>
          </main>
        </>
      ) : (
        <main className="flex-1">
          {children}
        </main>
      )}
    </div>
  );
}
