import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { notFound } from 'next/navigation';

import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { NoteBox, ProgressButton } from '@/components/study/study-actions';
import { NotesList } from '@/components/study/notes-list';

export const revalidate = 60;

const getTopicData = unstable_cache(
  async (userId: string, topicId: string) => {
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
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        resources: {
          select: {
            id: true,
            title: true,
            url: true,
            type: true,
          },
        },
      },
    });

    if (!topic) return null;

    const [progress, notes] = await Promise.all([
      prisma.studyProgress.findUnique({
        where: {
          userId_topicId: {
            userId,
            topicId,
          },
        },
        select: {
          status: true,
        },
      }),
      prisma.studyNote.findMany({
        where: {
          userId,
          topicId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          content: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      topic,
      progress,
      notes,
    };
  },
  ['study-topic'],
  {
    revalidate: 60,
  }
);

function ContentSection({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-slate-200 pt-6 dark:border-slate-800 ${className}`}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {title}
      </h2>

      <div className="mt-3">{children}</div>
    </section>
  );
}

function TextContent({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <p
      className={[
        'whitespace-pre-wrap text-sm leading-7',
        muted
          ? 'text-slate-500 dark:text-slate-400'
          : 'text-slate-600 dark:text-slate-300',
      ].join(' ')}
    >
      {children}
    </p>
  );
}

export default async function Topic({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const data = await getTopicData(user.id, id);

  if (!data) {
    notFound();
  }

  const { topic, progress, notes } = data;

  const status = progress?.status || 'NOT_STARTED';

  const statusLabel = status
    .replaceAll('_', ' ')
    .toLowerCase();

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <Link
          href={`/dashboard/study/${topic.module.category.slug}`}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {topic.module.category.name}
        </Link>

        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              <span>{topic.module.name}</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span>Level {topic.difficulty}</span>
            </div>

            <h1 className="mt-2 max-w-4xl text-2xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              {topic.title}
            </h1>

            {topic.description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                {topic.description}
              </p>
            )}
          </div>

          <div className="shrink-0">
            <ProgressButton
              topicId={id}
              initialStatus={status}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        <main className="min-w-0">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
              Overview
            </p>

            <div className="mt-4 max-w-3xl">
              <TextContent>
                {topic.content ||
                  topic.description ||
                  'No overview has been added for this topic yet.'}
              </TextContent>
            </div>
          </section>

          <ContentSection title="Mental model">
            <TextContent>
              {topic.diagram || 'No mental model has been added yet.'}
            </TextContent>
          </ContentSection>

          <ContentSection title="Practical example">
            <TextContent>
              {topic.example || 'No example has been added yet.'}
            </TextContent>
          </ContentSection>

          <div className="grid gap-8 sm:grid-cols-2">
            <ContentSection title="Common mistakes">
              <TextContent>
                {topic.commonMistakes ||
                  'No common mistakes have been added yet.'}
              </TextContent>
            </ContentSection>

            <ContentSection title="Practice method">
              <TextContent>
                {topic.practice ||
                  'No practice method has been added yet.'}
              </TextContent>
            </ContentSection>
          </div>

          <ContentSection title="Your notes">
            <NoteBox topicId={id} />
          </ContentSection>

          {notes.length > 0 && (
            <ContentSection title="Saved notes">
              <NotesList
                initial={notes.map((note) => ({
                  id: note.id,
                  title: note.title,
                  content: note.content,
                  updatedAt: String(note.updatedAt),
                }))}
              />
            </ContentSection>
          )}
        </main>

        {/* Sidebar */}
        <aside className="lg:border-l lg:border-slate-200 lg:pl-8 dark:lg:border-slate-800">
          <div className="lg:sticky lg:top-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Topic details
              </p>

              <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    Module
                  </dt>
                  <dd className="text-right text-xs font-medium text-slate-800 dark:text-slate-200">
                    {topic.module.name}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    Difficulty
                  </dt>
                  <dd className="text-right text-xs font-medium text-slate-800 dark:text-slate-200">
                    Level {topic.difficulty}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    Status
                  </dt>
                  <dd className="flex items-center gap-1.5 text-right text-xs font-medium capitalize text-slate-800 dark:text-slate-200">
                    {statusLabel}
                    {status === 'COMPLETED' && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            {topic.resources.length > 0 && (
              <div className="mt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Resources
                </p>

                <div className="mt-3 space-y-1">
                  {topic.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-3 border-b border-slate-200 py-3 text-xs font-medium text-slate-600 transition-colors hover:text-cyan-600 dark:border-slate-800 dark:text-slate-400 dark:hover:text-cyan-400"
                    >
                      <span className="min-w-0 truncate">
                        {resource.title}
                      </span>

                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-cyan-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}