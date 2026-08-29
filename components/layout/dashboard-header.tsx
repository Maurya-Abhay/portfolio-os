'use client';

import Link from 'next/link';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { LogoutButton } from '@/components/app/logout-button';

export function DashboardHeader({ title, description }: { title: string; description?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 px-3 py-2.5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 md:px-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 md:text-xl">{title}</h1>
          {description && <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{description}</p>}
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-300 lg:hidden">
            <Link href="/dashboard">Home</Link><Link href="/dashboard/portfolio">Portfolio</Link><Link href="/dashboard/study">Study</Link><Link href="/dashboard/finance">Finance</Link>
          </nav>

          <button type="button" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMobileOpen((open) => !open)} className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 lg:hidden">
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>

          <button
            type="button"
            aria-label="Toggle color mode"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <Link
            href="/dashboard/settings"
            className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            YN
          </Link>

          <LogoutButton />
        </div>
      </div>
      {mobileOpen && <nav className="mt-2 grid grid-cols-2 gap-1 border-t border-slate-200 pt-2 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300 lg:hidden">
        <Link onClick={() => setMobileOpen(false)} href="/dashboard" className="rounded-lg px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Home</Link>
        <Link onClick={() => setMobileOpen(false)} href="/dashboard/portfolio" className="rounded-lg px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Portfolio</Link>
        <Link onClick={() => setMobileOpen(false)} href="/dashboard/study" className="rounded-lg px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Study</Link>
        <Link onClick={() => setMobileOpen(false)} href="/dashboard/finance" className="rounded-lg px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Finance</Link>
      </nav>}
    </header>
  );
}
