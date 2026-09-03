'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  BriefcaseBusiness,
  LayoutDashboard,
  WalletCards,
} from 'lucide-react';

const items = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/portfolio',
    label: 'Portfolio',
    icon: BriefcaseBusiness,
  },
  {
    href: '/dashboard/study',
    label: 'Study',
    icon: BookOpen,
  },
  {
    href: '/dashboard/finance',
    label: 'Finance',
    icon: WalletCards,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center border-b border-slate-200 px-4 dark:border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100"
        >
          <span>Portfolio</span>
          <span className="text-cyan-600 dark:text-cyan-400">OS</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex min-h-0 flex-1 flex-col px-3 py-4">
        <nav
          aria-label="Dashboard navigation"
          className="space-y-1"
        >
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/dashboard'
                ? pathname === href
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors duration-150',
                  active
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100',
                ].join(' ')}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom link */}
        <div className="mt-auto border-t border-slate-200 pt-3 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Public portfolio
          </Link>
        </div>
      </div>
    </aside>
  );
}