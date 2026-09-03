import Link from 'next/link';
import { requireUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  WalletCards,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const user = await requireUser();

  const [projects, skills, experience, education] = await Promise.all([
    prisma.project.count({
      where: { userId: user.id },
    }),
    prisma.skill.count({
      where: { userId: user.id },
    }),
    prisma.experience.count({
      where: { userId: user.id },
    }),
    prisma.education.count({
      where: { userId: user.id },
    }),
  ]);

  const sections = [
    {
      href: '/dashboard/portfolio',
      label: 'Portfolio',
      description:
        'Manage projects, skills, experience, education and achievements.',
      icon: BriefcaseBusiness,
      meta: `${projects} ${projects === 1 ? 'project' : 'projects'}`,
    },
    {
      href: '/dashboard/study',
      label: 'Study',
      description:
        'Continue learning through tracks, topics, notes and tests.',
      icon: BookOpen,
      meta: 'Learning workspace',
    },
    {
      href: '/dashboard/finance',
      label: 'Finance',
      description:
        'Track income, expenses, budgets and your financial activity.',
      icon: WalletCards,
      meta: 'Finance workspace',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
          Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-white sm:text-3xl">
          Welcome{user.name ? `, ${user.name}` : ''}.
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Your workspace for managing the portfolio, studying, and keeping
          track of your finances.
        </p>
      </div>

      {/* Workspace */}
      <section className="py-6">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Workspace
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Choose an area to continue.
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.href}
                href={section.href}
                className="group flex flex-col gap-4 py-5 transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors group-hover:border-cyan-500/40 group-hover:text-cyan-600 dark:border-slate-800 dark:text-slate-400 dark:group-hover:border-cyan-400/40 dark:group-hover:text-cyan-400">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
                        {section.label}
                      </h3>

                      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                        {section.meta}
                      </span>
                    </div>

                    <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {section.description}
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-500" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Portfolio snapshot */}
      <section className="border-t border-slate-200 py-6 dark:border-slate-800">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Portfolio snapshot
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Current content in your portfolio.
          </p>
        </div>

        <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 border border-slate-200 dark:divide-slate-800 dark:border-slate-800 sm:grid-cols-4 sm:divide-y-0">
          <div className="p-4">
            <p className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {projects}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Projects
            </p>
          </div>

          <div className="p-4">
            <p className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {skills}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Skills
            </p>
          </div>

          <div className="p-4">
            <p className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {experience}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Experience
            </p>
          </div>

          <div className="p-4">
            <p className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {education}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Education
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}