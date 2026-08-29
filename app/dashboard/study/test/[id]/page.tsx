'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Flag, LoaderCircle, Send } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type Question = { id: string; question: string; options: unknown; type: string; difficulty: number };
type Test = { id: string; title: string; description: string | null; passingScore: number; questions: Question[] };

export default function TestPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [current, setCurrent] = useState(0);
  const [startedAt] = useState(() => new Date().toISOString());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/study/tests/${params.id}`).then((response) => response.json()).then((data) => data.error ? setError(data.error) : setTest(data)).catch(() => setError('Unable to load this test.')).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="mx-auto max-w-4xl p-6 text-sm text-slate-500">Loading test...</div>;
  if (error || !test) return <div className="mx-auto max-w-4xl p-6 text-sm font-semibold text-red-600">{error || 'Test not found.'}</div>;
  if (!test.questions.length) return <div className="mx-auto max-w-4xl p-6 text-sm text-slate-500">This test has no questions yet.</div>;

  const testId = test.id;
  const question = test.questions[current];
  const options = Array.isArray(question.options) ? question.options.filter((option): option is string => typeof option === 'string') : [];
  const answered = Object.values(answers).filter(Boolean).length;
  const isLast = current === test.questions.length - 1;

  async function submit() {
    setSubmitting(true); setError('');
    const response = await fetch(`/api/study/tests/${testId}/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers, startedAt }) });
    const data = await response.json();
    if (response.ok) router.push(`/dashboard/study/test/${testId}/result?attempt=${data.attemptId}`);
    else setError(data.error || 'Unable to submit test.');
    setSubmitting(false);
  }

  return <div className="mx-auto max-w-4xl">
    <div className="flex items-center justify-between gap-3"><button type="button" onClick={() => router.push('/dashboard/study/test')} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 dark:text-slate-400"><ArrowLeft className="size-4" /> Test library</button><span className="text-xs font-bold text-slate-500 dark:text-slate-400">{answered} of {test.questions.length} answered</span></div>
    <section className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">Knowledge check</p><h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{test.title}</h1></div><span className="rounded-md bg-violet-50 px-2.5 py-1.5 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">Pass {test.passingScore}%</span></div><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{test.description || 'Answer each question and submit when you are ready.'}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${((current + 1) / test.questions.length) * 100}%` }} /></div></section>
    <section className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-7"><div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400"><span>Question {current + 1} of {test.questions.length}</span><span className="inline-flex items-center gap-1"><Flag className="size-3.5" /> {question.type}</span></div><h2 className="mt-5 text-xl font-black leading-8 text-slate-900 dark:text-white">{question.question}</h2>{options.length ? <div className="mt-6 grid gap-2">{options.map((option) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 text-sm font-semibold transition ${answers[question.id] === option ? 'border-violet-400 bg-violet-50 text-violet-900 dark:border-violet-500 dark:bg-violet-500/10 dark:text-violet-100' : 'border-slate-200 text-slate-700 hover:border-violet-300 dark:border-slate-700 dark:text-slate-300'}`}><input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => setAnswers((value) => ({ ...value, [question.id]: option }))} className="accent-violet-600" />{option}</label>)}</div> : <textarea value={answers[question.id] || ''} onChange={(event) => setAnswers((value) => ({ ...value, [question.id]: event.target.value }))} placeholder="Write your answer..." className="mt-6 min-h-32 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800"><button type="button" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"><ArrowLeft className="size-4" /> Previous</button><div className="flex gap-2"><button type="button" onClick={() => setCurrent((value) => Math.min(value + 1, test.questions.length - 1))} disabled={isLast} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Skip <ArrowRight className="size-4" /></button>{isLast ? <button type="button" onClick={submit} disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 dark:bg-white dark:text-slate-950">{submitting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />} Submit test</button> : <button type="button" onClick={() => setCurrent((value) => value + 1)} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white">Next <ArrowRight className="size-4" /></button>}</div></div>{error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}</section>
    <div className="mt-4 flex flex-wrap gap-1.5">{test.questions.map((item, index) => <button key={item.id} type="button" onClick={() => setCurrent(index)} aria-label={`Go to question ${index + 1}`} className={`grid size-8 place-items-center rounded-md text-xs font-bold ${index === current ? 'bg-violet-600 text-white' : answers[item.id] ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400'}`}>{answers[item.id] ? <CheckCircle2 className="size-3.5" /> : index + 1}</button>)}</div>
  </div>;
}
