import Link from 'next/link';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { ArrowRight, BookOpen, BriefcaseBusiness, WalletCards } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const user = await requireUser();
  const projects = await prisma.project.count({ where: { userId: user.id } });

  return (
    <div className="mx-auto">
      <section className="rounded border border-slate-200/80 bg-white/80 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Private workspace</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
          Welcome{user.name ? `, ${user.name}` : ''}.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Your private workspace for portfolio management and study. Track income, expenses, budgets and your current balance.
        </p>
      </section>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Link
          href="/dashboard/portfolio"
          className="group rounded border border-slate-200/80 bg-white/80 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(37,99,235,0.08)] dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            <BriefcaseBusiness className="size-4" />
          </div>
          <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-slate-100">Portfolio</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage published projects.</p>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{projects}</p>
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Projects</p>
            </div>
            <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
          </div>
        </Link>

        <Link
          href="/dashboard/study"
          className="group rounded border border-slate-200/80 bg-white/80 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
            <BookOpen className="size-4" />
          </div>
          <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-slate-100">Study</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tracks, topics, notes and progress.</p>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white">Built-in flow</p>
            </div>
            <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-600" />
          </div>
        </Link>

        <Link
          href="/dashboard/finance"
          className="group rounded border border-slate-200/80 bg-white/80 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            <WalletCards className="size-4" />
          </div>
          <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-slate-100">Finance</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Income, expenses, budgets and analytics.</p>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white">Healthy overview</p>
            </div>
            <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
          </div>
        </Link>
      </div>
    </div>
  );
}
