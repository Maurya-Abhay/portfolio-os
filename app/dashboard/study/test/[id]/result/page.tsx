import Link from 'next/link';
import { ArrowLeft, CheckCircle2, CircleX, Clock3, RotateCcw, Target } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

const dateLabel = (value: Date | null) => value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date';
const timeLabel = (started: Date, completed: Date | null) => {
  if (!completed) return 'Not recorded';
  const seconds = Math.max(0, Math.round((completed.getTime() - started.getTime()) / 1000));
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};

export default async function Result({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ attempt?: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const { attempt } = await searchParams;
  if (!attempt) return <div className="p-6 text-sm text-red-600">Missing attempt.</div>;

  const [result, history] = await Promise.all([
    prisma.testAttempt.findFirst({ where: { id: attempt, testId: id, userId: user.id }, include: { test: { select: { title: true, passingScore: true } }, answers: { include: { question: { select: { question: true, answer: true, explanation: true, topic: { select: { id: true, title: true } } } } } } } }),
    prisma.testAttempt.findMany({ where: { testId: id, userId: user.id }, orderBy: { completedAt: 'desc' }, take: 8, select: { id: true, score: true, correctAnswers: true, totalQuestions: true, completedAt: true, startedAt: true } }),
  ]);
  if (!result) return <div className="p-6 text-sm text-red-600">Attempt not found.</div>;

  const weakTopics = new Map<string, { id: string; title: string; misses: number }>();
  result.answers.filter((answer) => !answer.isCorrect && answer.question.topic).forEach((answer) => {
    const topic = answer.question.topic!;
    const previous = weakTopics.get(topic.id);
    weakTopics.set(topic.id, { id: topic.id, title: topic.title, misses: (previous?.misses || 0) + 1 });
  });
  const passed = result.score >= result.test.passingScore;
  const recommendations = Array.from(weakTopics.values()).slice(0, 3);

  return <div className="mx-auto max-w-5xl">
    <Link href="/dashboard/study/test" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 dark:text-slate-400"><ArrowLeft className="size-4" /> Test library</Link>
    <section className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Test analytics</p><h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">{result.test.title}</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Attempted {dateLabel(result.completedAt)}</p></div><div className={`rounded-lg px-5 py-3 text-center ${passed ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'}`}><p className="text-3xl font-black">{result.score}%</p><p className="text-xs font-bold uppercase tracking-[0.12em]">{passed ? 'Passed' : 'Failed'}</p></div></div>
      <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-5"><div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-950/50"><p className="text-lg font-black text-emerald-600">{result.correctAnswers}</p><p className="text-[11px] text-slate-500">Correct</p></div><div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-950/50"><p className="text-lg font-black text-red-600">{result.wrongAnswers}</p><p className="text-[11px] text-slate-500">Incorrect</p></div><div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-950/50"><p className="text-lg font-black text-slate-600 dark:text-slate-300">{result.skipped}</p><p className="text-[11px] text-slate-500">Skipped</p></div><div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-950/50"><p className="text-lg font-black text-slate-900 dark:text-white">{result.score}%</p><p className="text-[11px] text-slate-500">Percentage</p></div><div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-950/50"><p className="inline-flex items-center gap-1 text-lg font-black text-slate-900 dark:text-white"><Clock3 className="size-4" /> {timeLabel(result.startedAt, result.completedAt)}</p><p className="text-[11px] text-slate-500">Time used</p></div></div>
      <div className="mt-5 flex flex-wrap gap-2"><Link href={`/dashboard/study/test/${id}`} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-bold text-white"><RotateCcw className="size-4" /> Try again</Link><Link href="/dashboard/study/test" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold dark:border-slate-700 dark:text-slate-200">Test history</Link></div>
    </section>

    <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.85fr]">
      <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"><div className="flex items-center gap-2"><Target className="size-4 text-orange-500" /><h2 className="font-black text-slate-900 dark:text-white">Recommendations</h2></div><div className="mt-3 space-y-2">{recommendations.length ? recommendations.map((topic) => <Link key={topic.id} href={`/dashboard/study/topic/${topic.id}`} className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50/70 p-3 text-sm font-bold text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200"><span>Revise {topic.title}</span><span className="text-xs">{topic.misses} miss{topic.misses === 1 ? '' : 'es'}</span></Link>) : <p className="text-sm text-slate-500 dark:text-slate-400">Strong result. Keep reviewing the topics you have completed.</p>}</div></section>
      <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"><h2 className="font-black text-slate-900 dark:text-white">Previous attempts</h2><div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">{history.map((item) => <div key={item.id} className="flex items-center justify-between py-2.5"><div><p className="text-sm font-bold text-slate-900 dark:text-white">{dateLabel(item.completedAt)}</p><p className="text-xs text-slate-500 dark:text-slate-400">{item.correctAnswers}/{item.totalQuestions} correct · {timeLabel(item.startedAt, item.completedAt)}</p></div><span className="text-sm font-black text-violet-600 dark:text-violet-300">{item.score}%</span></div>)}</div></section>
    </div>

    <section className="mt-4 space-y-3"><h2 className="font-black text-slate-900 dark:text-white">Answer review</h2>{result.answers.map((answer, index) => <article key={answer.id} className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"><div className="flex items-start gap-3"><div className={answer.isCorrect ? 'text-emerald-500' : 'text-red-500'}>{answer.isCorrect ? <CheckCircle2 className="size-5" /> : <CircleX className="size-5" />}</div><div className="min-w-0 flex-1"><p className="text-xs font-bold text-slate-500 dark:text-slate-400">Question {index + 1} · {answer.isCorrect ? 'Correct' : answer.selectedAnswer ? 'Incorrect' : 'Skipped'}</p><h3 className="mt-1 text-sm font-black leading-6 text-slate-900 dark:text-white">{answer.question.question}</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Your answer: <span className="font-bold">{answer.selectedAnswer || 'Skipped'}</span></p><p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">Correct answer: <span className="font-bold">{answer.question.answer}</span></p>{answer.question.explanation && <p className="mt-3 border-t border-slate-200 pt-3 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:text-slate-400"><span className="font-bold text-slate-700 dark:text-slate-200">Explanation: </span>{answer.question.explanation}</p>}</div></div></article>)}</section>
  </div>;
}
