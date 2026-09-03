'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';

import { LogoutButton } from '@/components/app/logout-button';

const mobileItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/portfolio', label: 'Portfolio' },
  { href: '/dashboard/study', label: 'Study' },
  { href: '/dashboard/finance', label: 'Finance' },
];

export function DashboardHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <header
        className="
          fixed right-0 top-0 z-40
          h-14
          border-b border-slate-200
          bg-white/95 backdrop-blur-md
          dark:border-slate-800
          dark:bg-slate-950/95
          lg:left-56
        "
      >
        <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-5">
          {/* Title */}
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">
              {title}
            </h1>

            {description && (
              <p className="mt-0.5 hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
                {description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            {/* Mobile menu */}
            <button
              type="button"
              aria-label={
                mobileOpen ? 'Close navigation' : 'Open navigation'
              }
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
              className="
                grid h-8 w-8 place-items-center rounded-md
                border border-slate-200
                bg-white text-slate-600
                transition-colors
                hover:border-slate-300
                hover:text-slate-900
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:border-slate-600
                dark:hover:text-white
                lg:hidden
              "
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>

            {/* Theme */}
            <button
              type="button"
              aria-label="Toggle color mode"
              onClick={() =>
                setTheme(isDark ? 'light' : 'dark')
              }
              className="
                grid h-8 w-8 place-items-center rounded-md
                border border-slate-200
                bg-white text-slate-600
                transition-colors
                hover:border-slate-300
                hover:text-slate-900
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:border-slate-600
                dark:hover:text-white
              "
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Settings */}
            <Link
              href="/dashboard/settings"
              aria-label="Account settings"
              className="
                grid h-8 w-8 place-items-center rounded-md
                border border-slate-200
                bg-white
                text-[10px] font-semibold text-slate-700
                transition-colors
                hover:border-slate-300
                hover:text-slate-900
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-200
                dark:hover:border-slate-600
              "
            >
              AB
            </Link>

            {/* Logout */}
            <button
              type="button"
              aria-label="Log out"
              onClick={() => setShowConfirm(true)}
              className="
                grid h-8 w-8 place-items-center rounded-md
                border border-red-200
                bg-red-50
                text-red-600
                transition-colors
                hover:border-red-300
                hover:bg-red-100
                dark:border-red-900/50
                dark:bg-red-950/30
                dark:text-red-400
                dark:hover:bg-red-950/50
              "
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {mobileItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="
                    rounded-md border border-slate-200
                    px-3 py-2.5 text-center text-xs font-medium
                    text-slate-600
                    transition-colors
                    hover:bg-slate-50
                    hover:text-slate-900
                    dark:border-slate-800
                    dark:text-slate-300
                    dark:hover:bg-slate-900
                    dark:hover:text-white
                  "
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Logout modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>

              <div>
                <h2
                  id="logout-title"
                  className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  Log out?
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  You&apos;ll need to sign in again to access the dashboard.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-md px-3.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Cancel
              </button>

              <div onClick={() => setShowConfirm(false)}>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}