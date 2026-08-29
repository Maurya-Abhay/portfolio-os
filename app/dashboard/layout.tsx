import { Sidebar } from '@/components/layout/sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.10),transparent_35%),#f8fafc] transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.10),transparent_35%),#020817] lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <DashboardHeader title="Portfolio OS" description={`Private workspace${user.name ? ` · ${user.name}` : ''}`} />
        <div className="px-0.5 py-0.5 md:px-1 md:py-1">{children}</div>
      </main>
    </div>
  );
}
