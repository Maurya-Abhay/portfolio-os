import { requireUser } from '@/lib/auth/session';
import { PortfolioCrud } from '@/components/app/portfolio-crud';
import { ProfileSettings } from '@/components/app/profile-settings';

export const dynamic = 'force-dynamic';

export default async function Portfolio() {
  await requireUser();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
          Portfolio
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900 dark:text-white sm:text-3xl">
          Manage your public portfolio.
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Update your profile, projects, skills, experience, education, and
          achievements from one workspace.
        </p>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        <section className="py-6">
          <ProfileSettings />
        </section>

        <section className="py-6">
          <PortfolioCrud kind="projects" />
        </section>

        <section className="py-6">
          <PortfolioCrud kind="skills" />
        </section>

        <section className="py-6">
          <PortfolioCrud kind="experience" />
        </section>

        <section className="py-6">
          <PortfolioCrud kind="education" />
        </section>

        <section className="py-6">
          <PortfolioCrud kind="achievements" />
        </section>
      </div>
    </div>
  );
}