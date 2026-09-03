import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Clock3,
  Flame,
  RotateCcw,
  Target,
  Trophy,
} from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { TargetManager } from '@/components/study/target-manager';

export const revalidate = 60;

const getStudyDashboardData = unstable_cache(
  async (userId: string) => {
    const [categories, progress, targets, attempts] =
      await Promise.all([
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
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    sortOrder: true,
                  },
                },
              },
            },
          },
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
                module: {
                  select: {
                    category: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { completedAt: 'desc' },
        }),

        prisma.studyTarget.findMany({
          where: {
            userId,
            type: 'STUDY',
          },
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
          },
          orderBy: [
            { status: 'asc' },
            { dueDate: 'asc' },
          ],
        }),

        prisma.testAttempt.findMany({
          where: { userId },
          select: {
            id: true,
            score: true,
            totalQuestions: true,
            completedAt: true,
            test: {
              select: {
                title: true,
              },
            },
          },
          orderBy: {
            completedAt: 'desc',
          },
          take: 5,
        }),
      ]);

    return {
      categories,
      progress,
      targets,
      attempts,
    };
  },
  ['study-dashboard'],
  {
    revalidate: 60,
  },
);

const dateLabel = (
  value: Date | string | null | undefined,
) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No date';

export default async function Study() {
  const user = await requireUser();

  const {
    categories,
    progress,
    targets,
    attempts,
  } = await getStudyDashboardData(user.id);

  const allTopics = categories.flatMap((category) =>
    category.modules.flatMap((module) => module.topics),
  );

  const completed = progress.filter(
    (item) => item.status === 'COMPLETED',
  );

  const completedIds = new Set(
    completed.map((item) => item.topicId),
  );

  const overall = allTopics.length
    ? Math.round(
        (completedIds.size / allTopics.length) * 100,
      )
    : 0;

  const activeTargets = targets.filter(
    (target) => target.status !== 'COMPLETED',
  );

  const upcomingTargets = activeTargets
    .filter((target) => target.dueDate)
    .slice(0, 4);

  const revisionItems = progress
    .filter(
      (item) =>
        item.revisionCount > 0 ||
        item.status === 'COMPLETED',
    )
    .slice(0, 5);

  const recentActivity = progress
    .filter(
      (item) => item.startedAt || item.completedAt,
    )
    .slice(0, 6);

  const latestAttempt = attempts[0];

  return (
    <div className="mx-auto w-full">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}
      <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
              Study
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Keep the learning loop moving.
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Track your progress, keep targets visible, revisit
              important topics, and see how your test performance is
              changing.
            </p>
          </div>

          {/* Overall progress */}
          <div className="w-full max-w-sm rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/20 dark:bg-violet-500/10 lg:w-auto">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">
                  Overall progress
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {overall}%
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {completedIds.size}
                  <span className="text-slate-400">
                    {' '}
                    / {allTopics.length}
                  </span>
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  topics completed
                </p>
              </div>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-950/60">
              <div
                className="h-full rounded-full bg-violet-500 transition-[width]"
                style={{ width: `${overall}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORY PROGRESS
      ========================================================== */}
      <section className="mt-4">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Learning areas
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Progress across your study categories.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const topics = category.modules.flatMap(
              (module) => module.topics,
            );

            const count = topics.filter((topic) =>
              completedIds.has(topic.id),
            ).length;

            const percentage = topics.length
              ? Math.round((count / topics.length) * 100)
              : 0;

            return (
              <Link
                key={category.id}
                href={`/dashboard/study/${category.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                      <BookOpen className="h-4 w-4" />
                    </span>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {category.name}
                      </h3>

                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {count} of {topics.length} completed
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-500" />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {percentage}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          PROGRESS + TEST
      ========================================================== */}
      <section className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Completed */}
        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Recently completed
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your latest finished topics.
              </p>
            </div>

            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {completed.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/study/topic/${item.topicId}`}
                className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/50 sm:px-5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {item.topic.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                    {item.topic.module.category.name}
                    {' · '}
                    {dateLabel(item.completedAt)}
                  </p>
                </div>

                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              </Link>
            ))}

            {completed.length === 0 && (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Complete a topic to see it here.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Test score */}
        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Recent test
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Latest submitted attempt.
              </p>
            </div>

            <Trophy className="h-4 w-4 text-amber-500" />
          </div>

          <div className="p-4 sm:p-5">
            {latestAttempt ? (
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {latestAttempt.test.title}
                </p>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                      {latestAttempt.score}
                      <span className="text-base font-normal text-slate-400">
                        {' '}
                        / {latestAttempt.totalQuestions}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      correct answers
                    </p>
                  </div>

                  <span className="rounded-md bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                    {Math.round(
                      (latestAttempt.score /
                        latestAttempt.totalQuestions) *
                        100,
                    )}
                    %
                  </span>
                </div>

                <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
                  Completed{' '}
                  {dateLabel(latestAttempt.completedAt)}
                </p>
              </div>
            ) : (
              <div className="py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No test attempts yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>

      {/* =========================================================
          TARGETS
      ========================================================== */}
      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        {/* Active targets */}
        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Active targets
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {activeTargets.length} still in progress.
              </p>
            </div>

            <Target className="h-4 w-4 text-blue-500" />
          </div>

          <div className="space-y-2 p-4 sm:p-5">
            {activeTargets.slice(0, 4).map((target) => (
              <div
                key={target.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-800"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {target.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {target.dueDate
                      ? `Due ${dateLabel(target.dueDate)}`
                      : 'No due date'}
                  </p>
                </div>

                <CircleDot className="h-4 w-4 shrink-0 text-blue-500" />
              </div>
            ))}

            {activeTargets.length === 0 && (
              <p className="py-4 text-sm text-slate-500 dark:text-slate-400">
                No active targets.
              </p>
            )}
          </div>
        </section>

        {/* Upcoming */}
        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Upcoming deadlines
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Next dates from your study plan.
              </p>
            </div>

            <CalendarClock className="h-4 w-4 text-orange-500" />
          </div>

          <div className="space-y-2 p-4 sm:p-5">
            {upcomingTargets.map((target) => (
              <div
                key={target.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-orange-100 bg-orange-50/60 px-3 py-3 dark:border-orange-500/20 dark:bg-orange-500/10"
              >
                <span className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {target.title}
                </span>

                <span className="shrink-0 text-[11px] font-semibold text-orange-700 dark:text-orange-300">
                  {dateLabel(target.dueDate)}
                </span>
              </div>
            ))}

            {upcomingTargets.length === 0 && (
              <p className="py-4 text-sm text-slate-500 dark:text-slate-400">
                No upcoming deadlines.
              </p>
            )}
          </div>
        </section>
      </section>

      {/* =========================================================
          ACTIVITY + REVISION
      ========================================================== */}
      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        {/* Recent activity */}
        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Recent activity
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Latest changes in your study progress.
              </p>
            </div>

            <Flame className="h-4 w-4 text-orange-500" />
          </div>

          <div className="space-y-1 p-3 sm:p-4">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                  <Clock3 className="h-3.5 w-3.5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {item.topic.title}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {item.status === 'COMPLETED'
                      ? 'Completed'
                      : 'Started'}
                    {' · '}
                    {dateLabel(
                      item.completedAt ||
                        item.startedAt,
                    )}
                  </p>
                </div>
              </div>
            ))}

            {recentActivity.length === 0 && (
              <p className="px-2 py-5 text-sm text-slate-500 dark:text-slate-400">
                No activity yet.
              </p>
            )}
          </div>
        </section>

        {/* Revision */}
        <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Revision queue
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Topics that are worth revisiting.
              </p>
            </div>

            <RotateCcw className="h-4 w-4 text-violet-500" />
          </div>

          <div className="space-y-1 p-3 sm:p-4">
            {revisionItems.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/study/topic/${item.topicId}`}
                className="flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/50"
              >
                <span className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {item.topic.title}
                </span>

                <span className="shrink-0 rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                  {item.revisionCount}{' '}
                  {item.revisionCount === 1
                    ? 'revision'
                    : 'revisions'}
                </span>
              </Link>
            ))}

            {revisionItems.length === 0 && (
              <p className="px-2 py-5 text-sm text-slate-500 dark:text-slate-400">
                No revision items yet.
              </p>
            )}
          </div>
        </section>
      </section>

      {/* =========================================================
          TARGET MANAGER
      ========================================================== */}
      <section className="mt-4">
        <TargetManager />
      </section>
    </div>
  );
}