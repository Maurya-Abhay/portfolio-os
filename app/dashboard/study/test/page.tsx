import Link from 'next/link';
import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';

import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export default async function TestLibrary() {
  const user = await requireUser();

  const [tests, attempts] = await Promise.all([
    prisma.test.findMany({
      orderBy: [
        {
          category: {
            sortOrder: 'asc',
          },
        },
        {
          title: 'asc',
        },
      ],
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
    }),

    prisma.testAttempt.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: 5,
      include: {
        test: {
          select: {
            title: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <header className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <Link
          href="/dashboard/study"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Study dashboard
        </Link>

        <div className="mt-5 flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
            Knowledge checks
          </p>

          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-white sm:text-3xl">
            Tests
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Check what you know and review your previous attempts.
          </p>
        </div>
      </header>

      {/* Test library */}
      <main className="py-8">
        <section>
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Available tests
            </h2>

            <span className="text-xs tabular-nums text-slate-400 dark:text-slate-600">
              {tests.length}
            </span>
          </div>

          {tests.length > 0 ? (
            <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {tests.map((test, index) => (
                <Link
                  key={test.id}
                  href={`/dashboard/study/test/${test.id}`}
                  className="group flex flex-col gap-4 py-5 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center sm:px-3 dark:hover:bg-slate-900/40"
                >
                  <span className="w-7 shrink-0 text-[10px] font-medium tabular-nums text-slate-400 dark:text-slate-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
                        {test.title}
                      </h3>

                      {test.category?.name && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">
                            /
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-500">
                            {test.category.name}
                          </span>
                        </>
                      )}
                    </div>

                    {test.description && (
                      <p className="mt-1 line-clamp-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-500">
                        {test.description}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        {test._count.questions} questions
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {test.durationMin || 30} min
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-500 sm:block" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-800">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                No tests available
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Tests added to the study database will appear here.
              </p>
            </div>
          )}
        </section>

        {/* History */}
        <section className="mt-12">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Recent attempts
            </h2>

            {attempts.length > 0 && (
              <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400 dark:text-slate-600">
                Last 5
              </span>
            )}
          </div>

          {attempts.length > 0 ? (
            <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {attempts.map((attempt) => (
                <Link
                  key={attempt.id}
                  href={`/dashboard/study/test/${attempt.testId}/result?attempt=${attempt.id}`}
                  className="group flex items-center gap-4 py-4 transition-colors hover:bg-slate-50/70 sm:px-3 dark:hover:bg-slate-900/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800 transition-colors group-hover:text-cyan-600 dark:text-slate-200 dark:group-hover:text-cyan-400">
                      {attempt.test.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                      {attempt.completedAt
                        ? new Date(attempt.completedAt).toLocaleDateString()
                        : 'In progress'}
                      {' · '}
                      {attempt.correctAnswers}/{attempt.totalQuestions} correct
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                      {attempt.score}%
                    </span>

                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="border-y border-slate-200 py-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-500">
              No test attempts yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}