'use client';

import Link from 'next/link';
import { Menu, Moon, Sun, X, LogOut, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { LogoutButton } from '@/components/app/logout-button';

export function DashboardHeader({ title, description }: { title: string; description?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Logout Confirmation State
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 px-3 py-2.5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 md:px-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 md:text-xl">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMobileOpen((open) => !open)}
            className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 lg:hidden"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            aria-label="Toggle color mode"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {/* User Settings Link - Changed from YN to AB */}
          <Link
            href="/dashboard/settings"
            className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            AB
          </Link>

          {/* Custom Logout Trigger with Confirmation */}
          <button
            type="button"
            aria-label="Logout"
            onClick={() => setShowConfirm(true)}
            className="grid size-8 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileOpen && (
        <nav className="mt-2 grid grid-cols-2 gap-1 border-t border-slate-200 pt-2 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300 lg:hidden">
          <Link onClick={() => setMobileOpen(false)} href="/dashboard" className="rounded-lg px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Overview</Link>
          <Link onClick={() => setMobileOpen(false)} href="/dashboard/portfolio" className="rounded-lg px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Portfolio</Link>
          <Link onClick={() => setMobileOpen(false)} href="/dashboard/study" className="rounded-lg px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Study</Link>
          <Link onClick={() => setMobileOpen(false)} href="/dashboard/finance" className="rounded-lg px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Finance</Link>
        </nav>
      )}

      {/* Logout Confirmation Modal - Fixed with fixed positioning and full viewport centering */}
      {showConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Log out of account?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">You will need to sign in again to access your workspace.</p>
              </div>
            </div>
            
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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
    </header>
  );
}