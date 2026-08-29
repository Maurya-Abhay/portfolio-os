'use client';

import { useEffect } from 'react';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application error');
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center text-slate-900 dark:text-white">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-500">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-black">The page could not be loaded.</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">Try again. Your saved data is not changed by this screen.</p>
      <button onClick={() => reset()} className="mt-7 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400">
        Try again
      </button>
    </main>
  );
}
