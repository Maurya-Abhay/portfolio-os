import { getPortfolioOwner } from '@/lib/portfolio-owner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/portfolio/footer';
import { ProjectCard } from '@/components/portfolio/project-card';
import { FolderGit2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Projects() {
  const owner = await getPortfolioOwner().catch(() => null);
  const projects = owner?.projects || [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080b11] text-slate-100 antialiased selection:bg-cyan-400/20 selection:text-cyan-100">
      {/* Subtle page background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_5%,rgba(34,211,238,0.035),transparent_24%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.025),transparent_24%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <Navbar />

      <main>
        {/* =========================================================
            PAGE HEADER
        ========================================================== */}
        <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 sm:pb-14 sm:pt-14 lg:px-8 lg:pb-16 lg:pt-16">
          <div className="flex flex-col gap-7 border-b border-slate-800 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Work
              </p>

              <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                Projects I&apos;ve built.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                A collection of web applications and systems built across
                frontend, backend, APIs, and data.
              </p>
            </div>

            <div className="shrink-0">
              <p className="text-2xl font-semibold tracking-tight text-white">
                {projects.length}
              </p>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                Projects
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            PROJECTS
        ========================================================== */}
        <section className="mx-auto max-w-7xl px-6 pb-16 sm:pb-20 lg:px-8 lg:pb-24">
          {projects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((project, index) => (
                <article
                  key={project.id}
                  className={`
                    rounded-2xl border border-slate-800
                    bg-slate-900/25 p-5
                    transition-colors duration-200
                    hover:border-slate-700 hover:bg-slate-900/40
                    sm:p-6
                    ${index === 0 ? 'md:col-span-2' : ''}
                  `}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="flex items-center gap-4">
                      {project.liveUrl && (
                        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600">
                          Live
                        </span>
                      )}

                      {project.githubUrl && (
                        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600">
                          Source
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={index === 0 ? 'max-w-4xl' : 'max-w-2xl'}>
                    <ProjectCard
                      slug={project.slug}
                      title={project.title}
                      description={project.description || ''}
                      tags={[]}
                    />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-slate-800 px-6 py-14 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-cyan-400">
                <FolderGit2 className="h-4 w-4" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                No projects yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Projects published from the admin dashboard will appear here.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}