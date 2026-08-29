import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Code2, Database, Github, Layout, Linkedin, Mail, Sparkles, Terminal, Twitter } from 'lucide-react';
import { getPortfolioOwner } from '@/lib/portfolio-owner';
import { ProjectCard } from '@/components/portfolio/project-card';
import { Footer } from '@/components/portfolio/footer';
import { Navbar } from '@/components/layout/navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Full-Stack Developer & Software Architect',
  description: 'Building scalable web applications, robust APIs, and intuitive user experiences.',
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  const owner = await getPortfolioOwner().catch(() => null);

  const projects = owner?.projects || [];
  const skills = owner?.skills || [];
  const experiences = owner?.experiences || [];

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased">

      {/* Subtle Glowing Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-sky-500/5 to-indigo-500/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <Navbar />

      <main className="relative">

        {/* Hero Section */}
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pt-10 pb-10 lg:grid-cols-12 lg:pt-18">

          {/* Subtle Backglow */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="lg:col-span-7 relative z-10">

            <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-inner shadow-cyan-500/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              Available for full-stack roles & freelance contracts
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
              Hi, I'm {owner?.name || 'Developer'}
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-400 bg-clip-text text-transparent">
                Full-Stack Engineer.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed font-normal">
              I architect and build robust end-to-end web applications. Specializing in high-performance React/Next.js frontends, scalable APIs, and optimized databases.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#work"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]"
              >
                View My Work <ArrowUpRight className="h-4 w-4" />
              </Link>

              {owner?.email && (
                <a
                  href={`mailto:${owner.email}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-6 text-sm font-semibold text-slate-200 transition-all duration-300 hover:bg-slate-800 hover:border-slate-700 backdrop-blur-sm"
                >
                  <Mail className="h-4 w-4 text-cyan-400" /> Let's Talk
                </a>
              )}
            </div>

            {/* Quick Tech Highlights */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80">
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-white">Full-Stack</p>
                <p className="text-xs text-slate-400 font-medium">End-to-End Delivery</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-white">{projects.length}+ Proj.</p>
                <p className="text-xs text-slate-400 font-medium">Built & Shipped</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-white">Optimized</p>
                <p className="text-xs text-slate-400 font-medium">Clean & Scalable</p>
              </div>
            </div>
          </div>

          {/* Redesigned Sleek Profile Card Container */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative rounded border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 p-3.5 shadow-2xl backdrop-blur-2xl">

              {/* Card Inner Wrapper */}
              <div className="rounded border border-slate-800/80 bg-slate-950/90 p-5">

                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-cyan-400">
                    <Sparkles className="h-2 w-2" /> System Core
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                </div>

                {owner?.image ? (
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900 p-1.5">
                    <div className="relative h-80 w-full overflow-hidden rounded-xl bg-slate-950">
                      <Image
                        src={owner.image}
                        alt={owner.name || 'Profile'}
                        fill
                        className="object-cover object-center transition-transform duration-500 hover:scale-105"
                        unoptimized
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 text-xs font-mono text-slate-500">
                    // Profile image pending sync
                  </div>
                )}

                <div className="mt-4 space-y-2.5">
                  {[
                    { label: 'Frontend Architecture (React, Next.js)', icon: Layout },
                    { label: 'Backend Systems & REST/GraphQL APIs', icon: Code2 },
                    { label: 'Database Design (PostgreSQL, Prisma)', icon: Database },
                  ].map((tech, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-300 bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl transition-colors hover:border-cyan-500/40">
                      <tech.icon className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>{tech.label}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Redesigned About Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 border-t border-slate-900">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">

            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Background & Ethos
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
                Engineering software with purpose & precision.
              </h2>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-[2.5rem] border border-slate-800/80 bg-gradient-to-br from-slate-900/50 to-slate-950/80 p-8 md:p-10 backdrop-blur-md shadow-xl">
                <p className="text-base leading-relaxed text-slate-300 font-normal">
                  I bridge the gap between creative design and robust technical implementation. My philosophy focuses on writing clean, maintainable code that delivers high performance and a seamless user experience.
                </p>
                <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-xs font-mono text-slate-400">
                  <div>⚡ Clean Architecture</div>
                  <div>⚡ Scalable State Management</div>
                  <div>⚡ Secure API Design</div>
                  <div>⚡ Responsive UI/UX</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Projects Section */}
        <section id="work" className="relative mx-auto max-w-7xl px-6 py-20 border-t border-slate-900 overflow-hidden">

          {/* Subtle ambient light effect behind the section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Portfolio Showcase
                </div>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Featured Projects
                </h2>
                <p className="mt-2 text-sm text-slate-400 max-w-lg">
                  A selection of robust web applications, APIs, and digital tools built with clean architecture.
                </p>
              </div>

              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:border-cyan-500/40 hover:bg-slate-900 hover:text-cyan-300"
              >
                View all projects
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {projects.length ? (
                projects.map((p) => (
                  <div
                    key={p.id}
                    className="group relative rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/50 to-slate-950/80 p-1 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10"
                  >
                    <div className="h-full rounded-[1.35rem] bg-slate-950/60 p-2 transition-colors">
                      <ProjectCard
                        slug={p.slug}
                        title={p.title}
                        description={p.description || ''}
                        tags={p.githubUrl || p.liveUrl ? ['Live Project'] : []}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-3xl border border-dashed border-slate-800/80 bg-slate-900/20 p-12 text-center">
                  <p className="text-sm text-slate-400 font-mono">No projects found in database.</p>
                  <p className="text-xs text-slate-600 mt-1">Add your projects through your admin dashboard to display them here.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="relative mx-auto max-w-7xl px-6 py-20 border-t border-slate-900">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Technical Stack
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Technologies I Work With
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-lg">
            A comprehensive toolkit of languages, frameworks, and databases I use to build scalable products.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            {skills.length ? (
              skills.map((s) => (
                <div
                  key={s.id}
                  className="group relative flex items-center gap-3.5 rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-4 transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-cyan-500/5"
                >
                  <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400 transition-colors group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200 tracking-wide">{s.name}</span>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-800/80 bg-slate-900/20 p-8 text-center">
                <p className="text-sm text-slate-400 font-mono">Skills loading from database...</p>
              </div>
            )}
          </div>
        </section>

        {/* Experience Section */}
        {experiences.length > 0 && (
          <section id="experience" className="relative mx-auto max-w-7xl px-6 py-20 border-t border-slate-900">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Career Journey
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Professional Experience
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-lg">
              A timeline of my hands-on roles, enterprise projects, and engineering responsibilities.
            </p>

            <div className="mt-10 grid gap-6">
              {experiences.map((e) => (
                <div
                  key={e.id}
                  className="group relative rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/50 to-slate-950/80 p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {e.role}
                      </h3>
                      <p className="text-sm font-medium text-slate-400 mt-1">
                        at <span className="text-slate-200 font-semibold">{e.company}</span>
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs font-mono text-cyan-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      {e.isCurrent ? 'Present' : new Date(e.startDate).getFullYear()}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800/60">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300 font-normal">
                      {e.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="relative mx-auto max-w-7xl px-6 py-24 border-t border-slate-900 overflow-hidden">

          {/* Ambient Background Glows */}
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 p-8 sm:p-12 md:p-16 shadow-2xl backdrop-blur-xl">

            {/* Inner Decorative Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40 pointer-events-none" />

            <div className="relative z-10 max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Let's Connect & Build
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-[1.15]">
                Have an idea or project? <span className="block mt-1 bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-400 bg-clip-text text-transparent">Let's turn it into reality.</span>
              </h2>

              <p className="mt-4 text-base text-slate-400 leading-relaxed font-normal">
                Whether you want to discuss a full-stack project, collaborate on a technical challenge, or just say hello—my inbox is always open.
              </p>

              {/* Action Links Grid */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                {owner?.email && (
                  <a
                    href={`mailto:${owner.email}`}
                    className="group inline-flex items-center gap-2.5 rounded-2xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]"
                  >
                    <Mail className="h-4 w-4 transition-transform group-hover:-rotate-12" />
                    <span>{owner.email}</span>
                  </a>
                )}

                {owner?.githubUrl && (
                  <a
                    href={owner.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-800 hover:text-white"
                  >
                    <Github className="h-4 w-4 text-slate-400" /> GitHub
                  </a>
                )}

                {owner?.linkedinUrl && (
                  <a
                    href={owner.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-800 hover:text-white"
                  >
                    <Linkedin className="h-4 w-4 text-cyan-400" /> LinkedIn
                  </a>
                )}

                {owner?.xUrl && (
                  <a
                    href={owner.xUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-800 hover:text-white"
                  >
                    <Twitter className="h-4 w-4 text-sky-400" /> Twitter
                  </a>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}