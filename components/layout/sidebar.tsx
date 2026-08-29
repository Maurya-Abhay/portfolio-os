 'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  BriefcaseBusiness,
  LayoutDashboard,
  WalletCards,
} from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/portfolio', label: 'Portfolio', icon: BriefcaseBusiness },
  { href: '/dashboard/study', label: 'Study', icon: BookOpen },
  { href: '/dashboard/finance', label: 'Finance', icon: WalletCards },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [pathname]);

  function navigate(href: string) {
    setPending(true);
    router.prefetch(href);
  }

  return (
    <aside className="hidden w-52 shrink-0 border-r border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:block">
      {pending && <div className="fixed left-0 top-0 z-[60] h-0.5 w-full overflow-hidden bg-blue-100 dark:bg-blue-950"><div className="h-full w-1/3 animate-[sidebar-progress_900ms_ease-in-out_infinite] bg-blue-500" /></div>}
      <div className="sticky top-0 flex h-screen flex-col p-3">
        <Link href="/" className="mb-4 flex items-center gap-2 px-2 py-1.5 text-sm font-black tracking-tight text-slate-900 dark:text-slate-100">
          <span className="text-slate-700 dark:text-slate-300">Portfolio</span>
          <span className="text-blue-600">OS</span>
        </Link>

        <nav className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                prefetch
                onMouseEnter={() => router.prefetch(href)}
                onFocus={() => router.prefetch(href)}
                onClick={() => navigate(href)}
                className={[
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                  active
                    ? 'bg-slate-900 text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                ].join(' ')}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-3 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <ArrowLeft className="size-3.5" />
            Public portfolio
          </Link>
        </div>
      </div>
    </aside>
  );
}
