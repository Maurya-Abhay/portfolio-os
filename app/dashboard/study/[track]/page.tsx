import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { notFound } from 'next/navigation';

import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { ProgressButton } from '@/components/study/study-actions';

export const revalidate = 60;

const getTrackData = unstable_cache(
  async (userId: string, track: string) => {
    const category = await prisma.studyCategory.findUnique({
      where: {
        slug: track,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        sortOrder: true,
        modules: {
          orderBy: {
            sortOrder: 'asc',
          },
          select: {
            id: true,
            name: true,
            description: true,
            sortOrder: true,
            topics: {
              orderBy: {
                sortOrder: 'asc',
              },
              select: {
                id: true,
                title: true,
                description: true,
                sortOrder: true,
              },
            },
          },
        },
      },
    });

    if (!category) return null;

    const allTopics = category.modules.flatMap(
      (module) => module.topics
    );

    const progress =
      allTopics.length > 0
        ? await prisma.studyProgress.findMany({
            where: {
              userId,
              topicId: {
                in: allTopics.map((topic) => topic.id),
              },
            },
            select: {
              topicId: true,
              status: true,
            },
          })
        : [];

    return {
      category,
      progress,
    };
  },
  ['study-track'],
  {
    revalidate: 60,
  }
);

export default async function Track({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const user = await requireUser();
  const { track } = await params;

  const data = await getTrackData(user.id, track);

  if (!data) {
    notFound();
  }

  const { category, progress } = data;

  const allTopics = category.modules.flatMap(
    (module) => module.topics
  );

  const progressMap = new Map(
    progress.map((item) => [item.topicId, item.status])
  );

  const completed = allTopics.filter(
    (topic) => progressMap.get(topic.id) === 'COMPLETED'
  ).length;

  const percentage = allTopics.length
    ? Math.round((completed / allTopics.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <header className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <Link
          href="/dashboard/study"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Study dashboard
        </Link>

        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">
              Learning track
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-white sm:text-3xl">
              {category.name}
            </h1>

            {category.description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                {category.description}
              </p>
            )}
          </div>

          <div className="shrink-0 lg:min-w-48">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {percentage}%
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-500">
                  Complete
                </p>
              </div>

              <p className="pb-1 text-xs text-slate-500 dark:text-slate-400">
                {completed} of {allTopics.length} topics
              </p>
            </div>

            <div
              className="mt-3 h-1 overflow-hidden bg-slate-200 dark:bg-slate-800"
              aria-label={`${percentage}% complete`}
            >
              <div
                className="h-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Modules */}
      <main className="py-8">
        {category.modules.length === 0 ? (
          <div className="border border-dashed border-slate-300 px-6 py-14 text-center dark:border-slate-800">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No modules in this track yet.
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Modules added to this track will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {category.modules.map((module, moduleIndex) => {
              const moduleDone = module.topics.filter(
                (topic) =>
                  progressMap.get(topic.id) === 'COMPLETED'
              ).length;

              return (
                <section key={module.id}>
                  {/* Module heading */}
                  <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-baseline sm:justify-between dark:border-slate-800">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-600">
                          {String(moduleIndex + 1).padStart(2, '0')}
                        </span>

                        <h2 className="truncate text-base font-semibold text-slate-900 dark:text-white">
                          {module.name}
                        </h2>
                      </div>

                      {module.description && (
                        <p className="mt-2 max-w-2xl pl-8 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {module.description}
                        </p>
                      )}
                    </div>

                    <span className="pl-8 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-500 sm:pl-0">
                      {moduleDone}/{module.topics.length} complete
                    </span>
                  </div>

                  {/* Topics */}
                  {module.topics.length > 0 ? (
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {module.topics.map((topic, topicIndex) => {
                        const status =
                          (progressMap.get(topic.id) ||
                            'NOT_STARTED') as
                            | 'NOT_STARTED'
                            | 'IN_PROGRESS'
                            | 'COMPLETED';

                        return (
                          <div
                            key={topic.id}
                            className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-5"
                          >
                            <span className="w-6 shrink-0 text-[10px] font-medium tabular-nums text-slate-400 dark:text-slate-600">
                              {String(topicIndex + 1).padStart(2, '0')}
                            </span>

                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/dashboard/study/topic/${topic.id}`}
                                className="group inline-flex max-w-full items-center gap-2 text-sm font-medium text-slate-800 transition-colors hover:text-cyan-600 dark:text-slate-200 dark:hover:text-cyan-400"
                              >
                                {status === 'COMPLETED' ? (
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                ) : status === 'IN_PROGRESS' ? (
                                  <Circle className="h-4 w-4 shrink-0 text-cyan-500" />
                                ) : (
                                  <BookOpen className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                                )}

                                <span className="truncate">
                                  {topic.title}
                                </span>

                                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                              </Link>

                              {topic.description && (
                                <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-500 dark:text-slate-500">
                                  {topic.description}
                                </p>
                              )}
                            </div>

                            <div className="pl-6 sm:shrink-0 sm:pl-0">
                              <ProgressButton
                                topicId={topic.id}
                                initialStatus={status}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="py-5 pl-9 text-xs text-slate-500 dark:text-slate-500">
                      No topics in this module yet.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}