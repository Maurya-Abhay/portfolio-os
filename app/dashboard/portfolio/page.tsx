import { requireUser } from '@/lib/auth/session';
import { PortfolioCrud } from '@/components/app/portfolio-crud';
import { ProfileSettings } from '@/components/app/profile-settings';

export const dynamic = 'force-dynamic';

export default async function Portfolio() {
  await requireUser();

  return (
    <div className="mx-auto">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Portfolio CMS</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">Manage your public presence.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">Create and update every public portfolio section from one organized workspace.</p>
      </div>

      <div className="space-y-4">
        <ProfileSettings />
        <PortfolioCrud kind="projects" />
        <PortfolioCrud kind="skills" />
        <PortfolioCrud kind="experience" />
        <PortfolioCrud kind="education" />
        <PortfolioCrud kind="achievements" />
      </div>
    </div>
  );
}
