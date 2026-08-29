import { getPortfolioOwner } from '@/lib/portfolio-owner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/portfolio/footer';
import { ProjectCard } from '@/components/portfolio/project-card';
import { Layers, FolderGit2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Projects() {
  const owner = await getPortfolioOwner().catch(() => null);
  const projects = owner?.projects || [];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        
        {/* Header Section */}
        <div className="border-b border-slate-800/80 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono font-bold text-cyan-400">
            <Layers className="h-3.5 w-3.5" /> ARCHIVE & SHOWCASE
          </div>
          
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
            All Projects
          </h1>
          
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            A focused collection of engineered applications and systems. Managed and published directly via the private control center.
          </p>
        </div>

        {/* Projects Grid or Empty State */}
        {projects.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                slug={p.slug}
                title={p.title}
                description={p.description || ''}
                tags={['Next.js', 'TypeScript', 'Tailwind']}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-slate-800/80 bg-slate-900/30 p-12 text-center backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 mb-4">
              <FolderGit2 className="size-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">No Projects Published Yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Projects added from the admin dashboard will automatically appear here in real-time.
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}