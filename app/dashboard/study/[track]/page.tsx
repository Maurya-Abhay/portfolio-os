import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, Layers3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { ProgressButton } from '@/components/study/study-actions';

export const revalidate = 60;

const getTrackData = unstable_cache(async (userId: string, track: string) => {
  const category = await prisma.studyCategory.findUnique({
    where: { slug: track },
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
          description: true,
          sortOrder: true,
          topics: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true, title: true, description: true, sortOrder: true }
          }
        }
      }
    }
  });

  if (!category) return null;

  const allTopics = category.modules.flatMap((module) => module.topics);
  const progress = await prisma.studyProgress.findMany({
    where: { userId, topicId: { in: allTopics.map((topic) => topic.id) } },
    select: { topicId: true, status: true }
  });

  return { category, progress };
}, ['study-track'], { revalidate: 60 });

export default async function Track({ params }: { params: Promise<{ track: string }> }) {
  const user = await requireUser();
  const { track } = await params;
  const data = await getTrackData(user.id, track);
  if (!data) notFound();

  const { category, progress } = data;
  const allTopics = category.modules.flatMap((module) => module.topics);
  const progressMap = new Map(progress.map((item) => [item.topicId, item.status]));
  const completed = allTopics.filter((topic) => progressMap.get(topic.id) === 'COMPLETED').length;
  const percentage = allTopics.length ? Math.round((completed / allTopics.length) * 100) : 0;

  return <div className="mx-auto">
    <Link href="/dashboard/study" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"><ArrowLeft className="size-4" /> Study dashboard</Link>
    <section className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-6"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Learning track</p><h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">{category.name}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{category.description}</p></div><div className="min-w-40 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-500/30 dark:bg-violet-500/10"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">Track progress</p><p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{percentage}%</p><p className="text-xs text-slate-500 dark:text-slate-400">{completed} / {allTopics.length} topics</p></div></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${percentage}%` }} /></div></section>
    <div className="mt-4 space-y-4">{category.modules.map((module, moduleIndex) => { const moduleDone = module.topics.filter((topic) => progressMap.get(topic.id) === 'COMPLETED').length; return <section key={module.id} className="rounded-xl border border-slate-200 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"><div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800"><div className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Layers3 className="size-4" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Module {moduleIndex + 1}</span><span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{moduleDone}/{module.topics.length} done</span></div><h2 className="truncate text-base font-black text-slate-900 dark:text-white">{module.name}</h2></div></div><div className="divide-y divide-slate-200 px-4 dark:divide-slate-800">{module.topics.map((topic, topicIndex) => { const status = (progressMap.get(topic.id) || 'NOT_STARTED') as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'; return <div key={topic.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center"><div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">{String(topicIndex + 1).padStart(2, '0')}</div><div className="min-w-0 flex-1"><Link href={`/dashboard/study/topic/${topic.id}`} className="inline-flex items-center gap-2 text-sm font-black text-slate-900 transition hover:text-violet-600 dark:text-white dark:hover:text-violet-300">{status === 'COMPLETED' ? <CheckCircle2 className="size-4 text-emerald-500" /> : status === 'IN_PROGRESS' ? <Circle className="size-4 text-violet-500" /> : <BookOpen className="size-4 text-slate-400" />}{topic.title}<ArrowRight className="size-3 text-slate-400" /></Link>{topic.description && <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{topic.description}</p>}</div><ProgressButton topicId={topic.id} initialStatus={status} /></div>;})}</div></section>; })}</div>
  </div>;
}
