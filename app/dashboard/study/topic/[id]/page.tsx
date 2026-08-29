import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { ArrowLeft, BookOpen, BrainCircuit, CheckCircle2, ExternalLink, NotebookPen, Sparkles } from 'lucide-react';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { NoteBox, ProgressButton } from '@/components/study/study-actions';
import { NotesList } from '@/components/study/notes-list';

export const revalidate = 60;

const getTopicData = unstable_cache(async (userId: string, topicId: string) => {
  const topic = await prisma.studyTopic.findUnique({
    where: { id: topicId },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      diagram: true,
      example: true,
      commonMistakes: true,
      practice: true,
      difficulty: true,
      module: {
        select: {
          id: true,
          name: true,
          category: { select: { id: true, name: true, slug: true } }
        }
      },
      resources: {
        select: { id: true, title: true, url: true, type: true }
      }
    }
  });

  if (!topic) return null;

  const [progress, notes] = await Promise.all([
    prisma.studyProgress.findUnique({
      where: { userId_topicId: { userId: userId, topicId } },
      select: { status: true }
    }),
    prisma.studyNote.findMany({
      where: { userId: userId, topicId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, content: true, updatedAt: true }
    })
  ]);

  return { topic, progress, notes };
}, ['study-topic'], { revalidate: 60 });

const Section = ({ title, children, tone = 'slate' }: { title: string; children: React.ReactNode; tone?: 'slate' | 'violet' }) => <section className={`rounded-xl border p-4 ${tone === 'violet' ? 'border-violet-200 bg-violet-50/60 dark:border-violet-500/20 dark:bg-violet-500/10' : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/50'}`}><h2 className="text-sm font-black uppercase tracking-[0.12em] text-slate-800 dark:text-slate-100">{title}</h2>{children}</section>;

export default async function Topic({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const data = await getTopicData(user.id, id);
  if (!data) notFound();

  const { topic, progress, notes } = data;
  const status = progress?.status || 'NOT_STARTED';

  return <div className="mx-auto">
    <Link href={`/dashboard/study/${topic.module.category.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"><ArrowLeft className="size-4" /> {topic.module.category.name}</Link>
    <article className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300"><span>{topic.module.name}</span><span className="text-slate-400">/</span><span>Level {topic.difficulty}</span></div>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">{topic.title}</h1><ProgressButton topicId={id} initialStatus={status} /></div>
      <Section title="Overview" tone="violet"><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300"><Sparkles className="size-3.5" /> Core concept</div><p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{topic.content || topic.description || 'No overview has been added for this topic yet.'}</p></Section>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]"><div className="space-y-4"><Section title="Mental model"><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{topic.diagram || 'No mental model has been added yet.'}</p></Section><Section title="Practical example"><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{topic.example || 'No example has been added yet.'}</p></Section><div className="grid gap-4 md:grid-cols-2"><Section title="Common mistakes"><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{topic.commonMistakes || 'No common mistakes have been added yet.'}</p></Section><Section title="Practice method"><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{topic.practice || 'No practice method has been added yet.'}</p></Section></div></div><div className="space-y-4"><Section title="Your notes"><div className="mt-3"><NoteBox topicId={id} /></div></Section>{topic.resources.length > 0 && <Section title="Resources"><ul className="mt-3 space-y-2">{topic.resources.map((resource) => <li key={resource.id}><a href={resource.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm font-bold text-violet-600 hover:border-violet-300 dark:border-slate-700 dark:bg-slate-900 dark:text-violet-300"><span>{resource.title}</span><ExternalLink className="size-3.5" /></a></li>)}</ul></Section>}<div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400"><BrainCircuit className="size-4 text-violet-500" /> Status: {status.replace('_', ' ').toLowerCase()}<CheckCircle2 className="ml-auto size-4 text-emerald-500" /></div></div></div>
      <div className="mt-4"><NotesList initial={notes.map((note) => ({ id: note.id, title: note.title, content: note.content, updatedAt: String(note.updatedAt) }))} /></div>
    </article>
  </div>;
}
