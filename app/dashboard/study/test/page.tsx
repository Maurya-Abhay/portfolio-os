import Link from 'next/link';
import { ArrowRight, BookOpen, Clock3, Trophy } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export default async function TestLibrary() {
  const user = await requireUser();
  const [tests, attempts] = await Promise.all([
    prisma.test.findMany({ orderBy: [{ category: { sortOrder: 'asc' } }, { title: 'asc' }], include: { category: { select: { name: true, slug: true } }, _count: { select: { questions: true } } } }),
    prisma.testAttempt.findMany({ where: { userId: user.id }, orderBy: { completedAt: 'desc' }, take: 5, include: { test: { select: { title: true } } } }),
  ]);

  return <div className="mx-auto max-w-6xl">
    <Link href="/dashboard/study" className="text-sm font-bold text-slate-500 hover:text-violet-600 dark:text-slate-400">← Study dashboard</Link>
    <section className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Test engine</p><h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">Choose a knowledge check.</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Every test, question and passing score is loaded from your study database.</p></section>
    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{tests.map((test) => <Link key={test.id} href={`/dashboard/study/test/${test.id}`} className="group rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"><div className="flex items-center justify-between"><span className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">{test.category?.name || 'General'}</span><ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-500" /></div><h2 className="mt-4 font-black text-slate-900 dark:text-white">{test.title}</h2><p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{test.description || 'A database-powered practice test.'}</p><div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400"><span className="inline-flex items-center gap-1"><BookOpen className="size-3.5" /> {test._count.questions} questions</span><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" /> {test.durationMin || 30} min</span></div></Link>)}{tests.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No tests have been added to the database yet.</div>}</div>
    <section className="mt-5 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"><div className="flex items-center justify-between"><h2 className="font-black text-slate-900 dark:text-white">Test history</h2><Trophy className="size-4 text-amber-500" /></div><div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">{attempts.map((attempt) => <Link href={`/dashboard/study/test/${attempt.testId}/result?attempt=${attempt.id}`} key={attempt.id} className="flex items-center justify-between gap-3 py-3"><div><p className="text-sm font-bold text-slate-900 dark:text-white">{attempt.test.title}</p><p className="text-xs text-slate-500 dark:text-slate-400">{attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : 'In progress'} · {attempt.correctAnswers}/{attempt.totalQuestions} correct</p></div><span className="text-sm font-black text-violet-600 dark:text-violet-300">{attempt.score}%</span></Link>)}{attempts.length === 0 && <p className="py-3 text-sm text-slate-500 dark:text-slate-400">Your completed attempts will appear here.</p>}</div></section>
  </div>;
}
