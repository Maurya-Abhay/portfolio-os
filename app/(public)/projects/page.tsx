import { getPortfolioOwner } from '@/lib/portfolio-owner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/portfolio/footer';
import { ProjectCard } from '@/components/portfolio/project-card';
import { Layers, FolderGit2, ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Projects() {
  const owner = await getPortfolioOwner().catch(() => null);
  const projects = owner?.projects || [];

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans overflow-hidden">
      
      {/* Premium Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/15 via-blue-500/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 to-transparent blur-[140px] rounded-full" />
      </div>

      <Navbar />
      
      <main className="relative pt-20 mx-auto max-w-7xl px-6 py-12 md:py-16">
        
        {/* Header Section - Premium */}
        <div className="space-y-8 border-b border-slate-700/50 pb-12">
          
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              All Projects
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-light max-w-3xl">
              A comprehensive collection of engineered applications and systems. Each project showcases full-stack expertise, clean architecture, and production-ready code.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-4">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{projects.length}+</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Projects Built</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Open Source</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">Active</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Maintained</p>
            </div>
          </div>
        </div>

        {/* Projects Grid or Empty State */}
        <div className="mt-16">
          {projects.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-lg font-bold text-white inline-flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                  Featured & Published
                </h2>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="group relative"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Card */}
                    <div className="relative rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/50 to-slate-950/80 p-1 transition-all duration-300 group-hover:border-cyan-500/40 group-hover:shadow-2xl group-hover:shadow-cyan-500/10">
                      <div className="rounded-[13px] bg-slate-950/60 p-6 h-full backdrop-blur-sm">
                        <ProjectCard
                          slug={p.slug}
                          title={p.title}
                          description={p.description || ''}
                          tags={p.githubUrl || p.liveUrl ? ['Live Project'] : []}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State - Premium */
            <div className="group relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative flex flex-col items-center justify-center rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900/30 to-slate-950/60 p-16 md:p-20 text-center backdrop-blur-sm transition-all duration-300 group-hover:border-slate-600/60">
                
                {/* Icon */}
                <div className="flex size-16 items-center justify-center rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400 mb-6">
                  <FolderGit2 className="size-8 text-cyan-400" />
                </div>

                {/* Text */}
                <h3 className="text-2xl font-bold text-slate-200 mb-2">No Projects Published Yet</h3>
                <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-light mb-6">
                  Projects you publish from the admin dashboard will appear here in real-time. Start by adding your first project!
                </p>

                {/* CTA */}
                <a 
                  href="/#contact"
                  className="group/cta inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105 active:scale-100"
                >
                  <span>Get in Touch</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                </a>
              </div>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}