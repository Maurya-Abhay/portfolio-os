import { Sidebar } from '@/components/layout/sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="h-full lg:pl-56">
        <DashboardHeader
          title="Portfolio OS"
          description={`Private workspace${user.name ? ` · ${user.name}` : ''}`}
        />

        <main className="h-full overflow-y-auto pt-14">
          <div className="min-h-[calc(100vh-3.5rem)] px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}