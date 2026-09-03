'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flag,
  LoaderCircle,
  Send,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type Question = {
  id: string;
  question: string;
  options: unknown;
  type: string;
  difficulty: number;
};

type Test = {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  questions: Question[];
};

type AnswerMap = Record<string, string>;

export default function TestPage() {
  const params = useParams();
  const router = useRouter();

  const testId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [current, setCurrent] = useState(0);
  const [startedAt] = useState(() => new Date().toISOString());

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!testId) {
      setError('Invalid test.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadTest() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`/api/study/tests/${testId}`, {
          cache: 'no-store',
        });

        let data: Test & { error?: string };

        try {
          data = await response.json();
        } catch {
          throw new Error('Invalid server response.');
        }

        if (cancelled) return;

        if (!response.ok || data.error) {
          setError(data.error || 'Unable to load this test.');
          return;
        }

        setTest(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load this test.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTest();

    return () => {
      cancelled = true;
    };
  }, [testId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="border-y border-slate-200 py-10 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Loading test...
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="border-y border-red-200 py-10 text-sm font-medium text-red-600 dark:border-red-900/50 dark:text-red-400">
          {error || 'Test not found.'}
        </div>

        <button
          type="button"
          onClick={() => router.push('/dashboard/study/test')}
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to test library
        </button>
      </div>
    );
  }

  if (test.questions.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="border-y border-slate-200 py-10 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          This test has no questions yet.
        </div>

        <button
          type="button"
          onClick={() => router.push('/dashboard/study/test')}
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to test library
        </button>
      </div>
    );
  }

  const loadedTest = test;
  const total = loadedTest.questions.length;

  const safeCurrent = Math.min(
    Math.max(current, 0),
    total - 1
  );

  const question = test.questions[safeCurrent];

  const options = Array.isArray(question.options)
    ? question.options.filter(
        (option): option is string => typeof option === 'string'
      )
    : [];

  const answered = Object.values(answers).filter(
    (value) => value.trim().length > 0
  ).length;

  const currentAnswer = answers[question.id] ?? '';
  const isLast = safeCurrent === total - 1;
  const progress = Math.round(((safeCurrent + 1) / total) * 100);

  function setAnswer(value: string) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: value,
    }));

    setError('');
  }

  function goToQuestion(index: number) {
    setCurrent(Math.min(Math.max(index, 0), total - 1));
    setError('');
  }

  function previousQuestion() {
    if (safeCurrent > 0) {
      goToQuestion(safeCurrent - 1);
    }
  }

  function nextQuestion() {
    if (!isLast) {
      goToQuestion(safeCurrent + 1);
    }
  }

  async function submit() {
    if (submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(
        `/api/study/tests/${loadedTest.id}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers,
            startedAt,
          }),
        }
      );

      let data: {
        attemptId?: string;
        error?: string;
      };

      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid server response.');
      }

      if (!response.ok) {
        setError(data.error || 'Unable to submit test.');
        return;
      }

      if (!data.attemptId) {
        setError('No test result was returned.');
        return;
      }

      router.push(
        `/dashboard/study/test/${loadedTest.id}/result?attempt=${data.attemptId}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit test.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push('/dashboard/study/test')}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Test library
        </button>

        <span className="text-xs tabular-nums text-slate-500">
          {answered}/{total} answered
        </span>
      </div>

      {/* Test header */}
      <header className="mt-6 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Knowledge check
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-white sm:text-3xl">
              {test.title}
            </h1>

            {test.description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                {test.description}
              </p>
            )}
          </div>

          <span className="shrink-0 text-xs font-medium text-slate-500">
            Pass: {test.passingScore}%
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-1 flex-1 bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full bg-cyan-500 transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="w-9 text-right text-[10px] font-medium tabular-nums text-slate-500">
            {progress}%
          </span>
        </div>
      </header>

      {/* Question */}
      <main className="py-8">
        <section>
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Question {safeCurrent + 1} / {total}
            </span>

            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
              <Flag className="h-3.5 w-3.5" />
              {question.type}
            </span>
          </div>

          <h2 className="mt-7 max-w-3xl text-xl font-semibold leading-8 tracking-[-0.015em] text-slate-900 dark:text-white sm:text-2xl">
            {question.question}
          </h2>

          {options.length > 0 ? (
            <div className="mt-7 space-y-2">
              {options.map((option, index) => {
                const selected = currentAnswer === option;

                return (
                  <label
                    key={`${question.id}-${index}`}
                    className={[
                      'group flex cursor-pointer items-start gap-4 border px-4 py-4 transition-colors',
                      selected
                        ? 'border-cyan-500/60 bg-cyan-50/50 dark:border-cyan-500/50 dark:bg-cyan-500/5'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900/50',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={selected}
                      onChange={() => setAnswer(option)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-600"
                    />

                    <span className="flex min-w-0 gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      <span className="shrink-0 text-xs font-medium tabular-nums text-slate-400 dark:text-slate-600">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <span className="break-words">{option}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <textarea
              value={currentAnswer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Write your answer..."
              aria-label={`Answer for question ${safeCurrent + 1}`}
              className="mt-7 min-h-36 w-full resize-y border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
            />
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={safeCurrent === 0 || submitting}
              onClick={previousQuestion}
              className="inline-flex h-10 items-center justify-center gap-2 border border-slate-200 px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            <div className="flex gap-2">
              {!isLast ? (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={nextQuestion}
                  className="inline-flex h-10 items-center justify-center gap-2 border border-slate-200 px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="inline-flex h-10 items-center justify-center gap-2 bg-slate-950 px-5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Submit test
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 text-xs font-medium text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}
        </section>

        {/* Question navigation */}
        <section className="mt-10 border-t border-slate-200 pt-5 dark:border-slate-800">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            Questions
          </p>

          <div className="flex flex-wrap gap-1.5">
            {test.questions.map((item, index) => {
              const hasAnswer = Boolean(
                answers[item.id]?.trim()
              );

              const active = index === safeCurrent;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={submitting}
                  onClick={() => goToQuestion(index)}
                  aria-label={`Go to question ${index + 1}`}
                  aria-current={active ? 'step' : undefined}
                  className={[
                    'grid h-8 min-w-8 place-items-center px-2 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                    active
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                      : hasAnswer
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'border border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-800 dark:text-slate-500 dark:hover:border-slate-700',
                  ].join(' ')}
                >
                  {hasAnswer && !active ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    index + 1
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}