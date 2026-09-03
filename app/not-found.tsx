import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
          404
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-white">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          The page you requested does not exist or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back home
        </Link>
      </div>
    </main>
  );
}