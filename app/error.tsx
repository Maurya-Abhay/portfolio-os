'use client';

import { useEffect } from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error');
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
              Application error
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
              Something went wrong.
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              The application could not complete this request. Try loading
              the page again.
            </p>

            <button
              type="button"
              onClick={() => reset()}
              className="mt-6 inline-flex h-9 items-center rounded-md bg-slate-900 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}