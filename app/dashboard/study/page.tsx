import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { ArrowRight, BookOpen, CalendarClock, CheckCircle2, CircleDot, Clock3, Flame, RotateCcw, Target, Trophy } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { TargetManager } from '@/components/study/target-manager';

export const revalidate = 60;

const getStudyDashboardData = unstable_cache(async (userId: string) => {
  const [categories, progress, targets, attempts] = await Promise.all([
    prisma.studyCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        sortOrder: true,
        modules: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name: true,
            sortOrder: true,
            topics: {
              orderBy: { sortOrder: 'asc' },
              select: { id: true, title: true, slug: true, sortOrder: true }
            }
          }
        }
      }
    }),
    prisma.studyProgress.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        revisionCount: true,
        startedAt: true,
        completedAt: true,
        topicId: true,
        topic: {
          select: {
            id: true,
            title: true,
            module: { select: { category: { select: { name: true } } } }
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    }),
    prisma.studyTarget.findMany({
      where: { userId, type: 'STUDY' },
      select: { id: true, title: true, status: true, dueDate: true },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }]
    }),
    prisma.testAttempt.findMany({
      where: { userId },
      select: {
        id: true,
        score: true,
        totalQuestions: true,
        completedAt: true,
        test: { select: { title: true } }
      },
      orderBy: { completedAt: 'desc' },
      take: 5
    }),
  ]);

  return { categories, progress, targets, attempts };
}, ['study-dashboard'], { revalidate: 60 });

const dateLabel = (value: Date | string | null | undefined) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date';

export default async function Study() {
  const user = await requireUser();
  const { categories, progress, targets, attempts } = await getStudyDashboardData(user.id);

  const allTopics = categories.flatMap((category) => category.modules.flatMap((module) => module.topics));
  const completed = progress.filter((item) => item.status === 'COMPLETED');
  const completedIds = new Set(completed.map((item) => item.topicId));
  const overall = allTopics.length ? Math.round((completedIds.size / allTopics.length) * 100) : 0;
  const activeTargets = targets.filter((target) => target.status !== 'COMPLETED');
  const upcomingTargets = activeTargets.filter((target) => target.dueDate).slice(0, 4);
  const revisionItems = progress.filter((item) => item.revisionCount > 0 || item.status === 'COMPLETED').slice(0, 5);
  const recentActivity = progress.filter((item) => item.startedAt || item.completedAt).slice(0, 6);
  const latestAttempt = attempts[0];

  return (
    <div className="mx-auto">
      <section className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Study dashboard</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">Keep the learning loop moving.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">A live view of your topics, targets, revisions and test performance.</p>
          </div>
          <div className="min-w-36 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-500/30 dark:bg-violet-500/10">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">Overall completion</p>
            <p className="mt-1 text-3xl font-black text-slate-900 dark:text-white">{overall}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{completedIds.size} of {allTopics.length} topics</p>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        {categories.map((category) => {
          const topics = category.modules.flatMap((module) => module.topics);
          const count = topics.filter((topic) => completedIds.has(topic.id)).length;
          const percentage = topics.length ? Math.round((count / topics.length) * 100) : 0;
          return <Link key={category.id} href={`/dashboard/study/${category.slug}`} className="group rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-violet-500/40">
            <div className="flex items-center justify-between"><div className="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"><BookOpen className="size-4" /></div><ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-violet-500" /></div>
            <div className="mt-4 flex items-end justify-between"><div><h2 className="font-black text-slate-900 dark:text-white">{category.name}</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{count} / {topics.length} completed</p></div><span className="text-xl font-black text-slate-900 dark:text-white">{percentage}%</span></div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-violet-500" style={{ width: `${percentage}%` }} /></div>
          </Link>;
        })}
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900 dark:text-white">Completed topics</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Your latest finished lessons</p></div><CheckCircle2 className="size-4 text-emerald-500" /></div>
          <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">{completed.slice(0, 6).map((item) => <Link key={item.id} href={`/dashboard/study/topic/${item.topicId}`} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900 dark:text-white">{item.topic.title}</p><p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{item.topic.module.category.name} · Completed {dateLabel(item.completedAt)}</p></div><CheckCircle2 className="size-4 shrink-0 text-emerald-500" /></Link>)}{completed.length === 0 && <p className="py-5 text-sm text-slate-500 dark:text-slate-400">Complete a topic to see it here.</p>}</div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900 dark:text-white">Recent test score</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Latest submitted attempt</p></div><Trophy className="size-4 text-amber-500" /></div>
          {latestAttempt ? <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-950/50"><p className="text-sm font-bold text-slate-900 dark:text-white">{latestAttempt.test.title}</p><div className="mt-3 flex items-end justify-between"><span className="text-3xl font-black text-slate-900 dark:text-white">{latestAttempt.score}</span><span className="text-sm text-slate-500 dark:text-slate-400">/ {latestAttempt.totalQuestions} correct</span></div><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Completed {dateLabel(latestAttempt.completedAt)}</p></div> : <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No test attempts yet.</p>}
        </section>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900 dark:text-white">Active targets</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{activeTargets.length} targets still in progress</p></div><Target className="size-4 text-blue-500" /></div>
          <div className="mt-3 space-y-2">{activeTargets.slice(0, 4).map((target) => <div key={target.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-950/50"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900 dark:text-white">{target.title}</p><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{target.dueDate ? `Due ${dateLabel(target.dueDate)}` : 'No due date'} · {target.status.replace('_', ' ').toLowerCase()}</p></div><CircleDot className="size-4 shrink-0 text-blue-500" /></div>)}{activeTargets.length === 0 && <p className="py-4 text-sm text-slate-500 dark:text-slate-400">No active targets.</p>}</div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900 dark:text-white">Upcoming targets</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Next deadlines from your plan</p></div><CalendarClock className="size-4 text-orange-500" /></div>
          <div className="mt-3 space-y-2">{upcomingTargets.map((target) => <div key={target.id} className="flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50/60 p-3 dark:border-orange-500/20 dark:bg-orange-500/10"><span className="truncate text-sm font-bold text-slate-900 dark:text-white">{target.title}</span><span className="shrink-0 text-xs font-bold text-orange-700 dark:text-orange-300">{dateLabel(target.dueDate)}</span></div>)}{upcomingTargets.length === 0 && <p className="py-4 text-sm text-slate-500 dark:text-slate-400">No upcoming deadlines.</p>}</div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900 dark:text-white">Recent activity</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Latest progress changes</p></div><Flame className="size-4 text-orange-500" /></div>
          <div className="mt-3 space-y-2">{recentActivity.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-950/50"><div className="grid size-7 place-items-center rounded-md bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"><Clock3 className="size-3.5" /></div><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900 dark:text-white">{item.topic.title}</p><p className="text-xs text-slate-500 dark:text-slate-400">{item.status === 'COMPLETED' ? 'Completed' : 'Started'} · {dateLabel(item.completedAt || item.startedAt)}</p></div></div>)}{recentActivity.length === 0 && <p className="py-4 text-sm text-slate-500 dark:text-slate-400">No activity yet.</p>}</div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900 dark:text-white">Revision items</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Topics ready for another pass</p></div><RotateCcw className="size-4 text-violet-500" /></div>
          <div className="mt-3 space-y-2">{revisionItems.map((item) => <Link key={item.id} href={`/dashboard/study/topic/${item.topicId}`} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-950/50"><span className="truncate text-sm font-bold text-slate-900 dark:text-white">{item.topic.title}</span><span className="text-xs font-bold text-violet-600 dark:text-violet-300">{item.revisionCount} revisions</span></Link>)}{revisionItems.length === 0 && <p className="py-4 text-sm text-slate-500 dark:text-slate-400">No revision items yet.</p>}</div>
        </section>
      </div>

      <div className="mt-4"><TargetManager /></div>
    </div>
  );
}
