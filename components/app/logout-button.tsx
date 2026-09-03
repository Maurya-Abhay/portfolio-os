'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;

    setLoading(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      router.replace('/login');
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="
        inline-flex h-9 items-center justify-center
        rounded-md border border-slate-200
        px-3.5 text-xs font-semibold
        text-slate-600
        transition-colors duration-150
        hover:border-slate-300
        hover:bg-slate-100
        hover:text-slate-900
        disabled:cursor-not-allowed
        disabled:opacity-50
        dark:border-slate-800
        dark:text-slate-400
        dark:hover:border-slate-700
        dark:hover:bg-slate-900
        dark:hover:text-slate-100
      "
    >
      {loading ? 'Logging out…' : 'Logout'}
    </button>
  );
}