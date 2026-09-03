import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  CircleX,
  Clock3,
  RotateCcw,
  Target,
} from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

const dateLabel = (value: Date | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date';

const timeLabel = (started: Date, completed: Date | null) => {
  if (!completed) return 'Not recorded';

  const seconds = Math.max(
    0,
    Math.round((completed.getTime() - started.getTime()) / 1000),
  );

  return seconds < 60
    ? `${seconds}s`
    : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};

export default async function Result({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { attempt } = await searchParams;

  if (!attempt) {
    return (
      <div className="mx-auto max-w-5xl py-8">
        <p className="text-sm text-red-600 dark:text-red-400">
          Missing attempt.
        </p>
      </div>
    );
  }

  const [result, history] = await Promise.all([
    prisma.testAttempt.findFirst({
      where: {
        id: attempt,
        testId: id,
        userId: user.id,
      },
      include: {
        test: {
          select: {
            title: true,
            passingScore: true,
          },
        },
        answers: {
          include: {
            question: {
              select: {
                question: true,
                answer: true,
                explanation: true,
                topic: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    }),

    prisma.testAttempt.findMany({
      where: {
        testId: id,
        userId: user.id,
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: 8,
      select: {
        id: true,
        score: true,
        correctAnswers: true,
        totalQuestions: true,
        completedAt: true,
        startedAt: true,
      },
    }),
  ]);

  if (!result) {
    return (
      <div className="mx-auto max-w-5xl py-8">
        <p className="text-sm text-red-600 dark:text-red-400">
          Attempt not found.
        </p>
      </div>
    );
  }

  const weakTopics = new Map<
    string,
    {
      id: string;
      title: string;
      misses: number;
    }
  >();

  result.answers
    .filter((answer) => !answer.isCorrect && answer.question.topic)
    .forEach((answer) => {
      const topic = answer.question.topic!;

      const previous = weakTopics.get(topic.id);

      weakTopics.set(topic.id, {
        id: topic.id,
        title: topic.title,
        misses: (previous?.misses || 0) + 1,
      });
    });

  const passed = result.score >= result.test.passingScore;

  const recommendations = Array.from(weakTopics.values())
    .sort((a, b) => b.misses - a.misses)
    .slice(0, 3);

  const answeredCount = result.correctAnswers + result.wrongAnswers;
  const accuracy =
    answeredCount > 0
      ? Math.round((result.correctAnswers / answeredCount) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <Link
          href="/dashboard/study/test"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Test library
        </Link>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
              Test result
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-white sm:text-3xl">
              {result.test.title}
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Attempted {dateLabel(result.completedAt)}
            </p>
          </div>

          <div
            className={[
              'flex items-center gap-3 border-l-2 pl-4',
              passed
                ? 'border-emerald-500'
                : 'border-red-500',
            ].join(' ')}
          >
            {passed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <CircleX className="h-5 w-5 text-red-500" />
            )}

            <div>
              <p
                className={[
                  'text-2xl font-semibold tracking-tight',
                  passed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400',
                ].join(' ')}
              >
                {result.score}%
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {passed ? 'Passed' : 'Failed'}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-2 border-y border-slate-200 dark:border-slate-800 sm:grid-cols-5">
          <div className="border-b border-slate-200 py-3 sm:border-b-0 sm:border-r dark:border-slate-800">
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {result.correctAnswers}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">Correct</p>
          </div>

          <div className="border-b border-slate-200 py-3 pl-4 sm:border-b-0 sm:border-r dark:border-slate-800">
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              {result.wrongAnswers}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">Incorrect</p>
          </div>

          <div className="border-b border-slate-200 py-3 sm:border-b-0 sm:border-r sm:pl-4 dark:border-slate-800">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              {result.skipped}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">Skipped</p>
          </div>

          <div className="border-b border-slate-200 py-3 pl-4 sm:border-b-0 sm:border-r dark:border-slate-800">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {accuracy}%
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Answer accuracy
            </p>
          </div>

          <div className="py-3 sm:pl-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
              <Clock3 className="h-3.5 w-3.5 text-slate-400" />
              {timeLabel(result.startedAt, result.completedAt)}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">Time used</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/dashboard/study/test/${id}`}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-900 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </Link>

          <Link
            href="/dashboard/study/test"
            className="inline-flex h-9 items-center rounded-md border border-slate-200 px-3.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
          >
            Test library
          </Link>
        </div>
      </div>

      {/* Analysis */}
      <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          {/* Recommendations */}
          <section>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />

              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                What to revise
              </h2>
            </div>

            {recommendations.length > 0 ? (
              <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {recommendations.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/dashboard/study/topic/${topic.id}`}
                    className="group flex items-center justify-between gap-4 py-3.5 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800 transition-colors group-hover:text-cyan-600 dark:text-slate-200 dark:group-hover:text-cyan-400">
                        {topic.title}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {topic.misses}{' '}
                        {topic.misses === 1 ? 'incorrect answer' : 'incorrect answers'}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                      Revise →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                No specific weak topic stood out in this attempt. Keep
                reviewing the material and test yourself again later.
              </p>
            )}
          </section>

          {/* Answer review */}
          <section className="mt-10">
            <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Answer review
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Review each answer and compare it with the expected response.
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {result.answers.map((answer, index) => (
                <article
                  key={answer.id}
                  className="py-6"
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      {answer.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <CircleX className="h-4 w-4 text-red-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Question {index + 1}
                        </p>

                        <span className="text-slate-300 dark:text-slate-700">
                          /
                        </span>

                        <p
                          className={[
                            'text-[10px] font-semibold uppercase tracking-[0.14em]',
                            answer.isCorrect
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : answer.selectedAnswer
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-slate-500',
                          ].join(' ')}
                        >
                          {answer.isCorrect
                            ? 'Correct'
                            : answer.selectedAnswer
                              ? 'Incorrect'
                              : 'Skipped'}
                        </p>
                      </div>

                      <h3 className="mt-2 text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                        {answer.question.question}
                      </h3>

                      <div className="mt-4 space-y-2 text-sm">
                        <p className="text-slate-500 dark:text-slate-400">
                          Your answer:{' '}
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {answer.selectedAnswer || 'Skipped'}
                          </span>
                        </p>

                        <p className="text-slate-500 dark:text-slate-400">
                          Correct answer:{' '}
                          <span className="font-medium text-emerald-700 dark:text-emerald-300">
                            {answer.question.answer}
                          </span>
                        </p>
                      </div>

                      {answer.question.explanation && (
                        <div className="mt-4 border-l-2 border-slate-200 pl-4 dark:border-slate-700">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                            Explanation
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {answer.question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        {/* History */}
        <aside className="lg:border-l lg:border-slate-200 lg:pl-8 dark:lg:border-slate-800">
          <div className="lg:sticky lg:top-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Previous attempts
            </p>

            <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {dateLabel(item.completedAt)}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {item.correctAnswers}/{item.totalQuestions} correct
                      {' · '}
                      {timeLabel(item.startedAt, item.completedAt)}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-slate-900 dark:text-white">
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Passing score
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                {result.test.passingScore}%
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Your result is compared against this threshold.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}