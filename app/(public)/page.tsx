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
    <div className="relative min-h-screen bg-[#0a0e17] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased overflow-hidden">

      {/* Premium Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Top-left accent */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/15 via-blue-500/5 to-transparent blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
        
        {/* Bottom-right accent */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-indigo-500/10 via-purple-500/5 to-transparent blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        
        {/* Center subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/5 via-transparent to-indigo-500/5 blur-[120px] rounded-full" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <Navbar />

      <main className="relative pt-0">

        {/* Hero Section - Premium Version */}
        <section className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pt-20 pb-24 lg:grid-cols-12 lg:pt-28">

          <div className="lg:col-span-7 relative z-10 space-y-8">

            {/* Status Badge - More Premium */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 to-cyan-500/5 px-4 py-2 text-xs font-semibold text-cyan-200 backdrop-blur-xl shadow-lg shadow-cyan-500/10 hover:border-cyan-500/60 transition-all duration-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span>Open for full-stack roles & collaboration</span>
            </div>

            {/* Premium Heading with Depth */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.15]">
                Hey, I'm {owner?.name || 'Developer'}
              </h1>
              <div className="inline-block">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-300 bg-clip-text text-transparent">
                  Full-Stack Engineer
                </p>
              </div>
            </div>

            {/* Premium Description */}
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl font-light tracking-wide">
              I craft elegant solutions for complex problems. Specializing in <span className="text-cyan-300 font-semibold">React/Next.js</span> frontends, <span className="text-cyan-300 font-semibold">scalable APIs</span>, and <span className="text-cyan-300 font-semibold">optimized databases</span> that perform at scale.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {/* Primary Button - Enhanced */}
              <Link
                href="#work"
                className="group relative inline-flex h-12 items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105 active:scale-100"
              >
                <span>View My Work</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              {/* Secondary Button - Elevated */}
              <Link
                href="https://drive.google.com/file/d/1G6pPYL-wMnGp6K3BJzn4SOmFdXYjacBH/edit"
                target="_blank"
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-lg border border-slate-700/80 bg-slate-900/40 px-6 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/60 hover:bg-slate-800/60 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <span>Download Resume</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              {/* Contact Button */}
              {owner?.email && (
                <a
                  href={`mailto:${owner.email}`}
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg border border-slate-700/80 bg-slate-900/30 px-6 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/40 hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  <span>Get in Touch</span>
                </a>
              )}
            </div>

            {/* Stats Section - Premium Version */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-slate-700/50">
              <div className="group space-y-2">
                <p className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">Full-Stack</p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">End-to-End Delivery</p>
              </div>
              <div className="group space-y-2">
                <p className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{projects.length}+</p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Projects Built</p>
              </div>
              <div className="group space-y-2">
                <p className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">Premium</p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Quality Assured</p>
              </div>
            </div>
          </div>

          {/* Premium Profile Card */}
          <div className="lg:col-span-5 relative z-10">
            <div className="group relative">
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* Main card */}
              <div className="relative rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950/80 p-1 backdrop-blur-xl shadow-2xl">
                
                {/* Inner content */}
                <div className="rounded-[14px] border border-slate-700/40 bg-slate-950/70 p-6 space-y-6 backdrop-blur-sm">

                  {/* Terminal Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-cyan-300">
                      <Sparkles className="h-3 w-3" />
                      <span>Profile Core</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                    </div>
                  </div>

                  {/* Profile Image */}
                  {owner?.image ? (
                    <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900">
                      <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                        <Image
                          src={owner.image}
                          alt={owner.name || 'Profile'}
                          fill
                          className="object-cover object-center transition-transform duration-700 hover:scale-110"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-72 rounded-xl border border-dashed border-slate-700/60 bg-slate-900/40 flex items-center justify-center">
                      <p className="text-xs text-slate-500 font-mono">awaiting image</p>
                    </div>
                  )}

                  {/* Tech Stack - Premium Cards */}
                  <div className="space-y-3">
                    {[
                      { label: 'React & Node.js', icon: Layout, accent: 'from-cyan-500/30 to-cyan-500/10' },
                      { label: 'APIs & Backend', icon: Code2, accent: 'from-blue-500/30 to-blue-500/10' },
                      { label: 'Databases & Prisma', icon: Database, accent: 'from-indigo-500/30 to-indigo-500/10' },
                    ].map((tech, i) => (
                      <div 
                        key={i} 
                        className={`group/tech flex items-center gap-3 text-xs font-semibold text-slate-200 bg-gradient-to-r ${tech.accent} border border-slate-700/60 p-3.5 rounded-xl transition-all duration-300 hover:border-cyan-500/40 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-cyan-500/5 hover:shadow-lg hover:shadow-cyan-500/10 cursor-default`}
                      >
                        <tech.icon className="h-4 w-4 text-cyan-300 shrink-0 group-hover/tech:text-cyan-200 transition-colors" />
                        <span className="group-hover/tech:text-cyan-200 transition-colors">{tech.label}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - Premium Redesign */}
        <section className="relative mx-auto max-w-7xl px-6 py-24 border-t border-slate-800/50">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-center">

            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                About & Philosophy
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Engineering with <span className="text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">purpose</span>.
              </h2>
            </div>

            <div className="lg:col-span-7">
              <div className="group relative">
                {/* Glow background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-indigo-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Card */}
                <div className="relative rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/80 p-8 md:p-10 backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:border-cyan-500/30">
                  <p className="text-base leading-relaxed text-slate-300 font-light tracking-wide">
                    I bridge creative design with robust technical architecture. My philosophy centers on crafting clean, maintainable code that delivers exceptional performance and seamless user experiences. Every project is an opportunity to push the boundaries of what's possible.
                  </p>
                  <div className="mt-8 pt-8 border-t border-slate-700/50 grid grid-cols-2 gap-6">
                    {[
                      { icon: '⚡', label: 'Clean Architecture' },
                      { icon: '🎯', label: 'Scalable Design' },
                      { icon: '🔒', label: 'Secure by Default' },
                      { icon: '✨', label: 'Delightful UX' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="text-xl">{item.icon}</div>
                        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Projects Section - Premium */}
        <section id="work" className="relative mx-auto max-w-7xl px-6 py-24 border-t border-slate-800/50 overflow-hidden">

          <div className="relative z-10 space-y-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-cyan-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  Featured Work
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  Showcase of Excellence
                </h2>
                <p className="text-sm text-slate-400 max-w-lg font-light leading-relaxed">
                  A curated selection of projects that demonstrate full-stack expertise, creative problem-solving, and attention to detail.
                </p>
              </div>

              <Link
                href="/projects"
                className="group inline-flex items-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-900/40 px-5 py-3 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-800/60 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <span>See All Projects</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-8 md:grid-cols-2">
              {projects.length ? (
                projects.map((p) => (
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
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-700/60 bg-slate-900/30 p-12 text-center">
                  <p className="text-sm text-slate-400 font-mono">No projects available yet</p>
                  <p className="text-xs text-slate-600 mt-2">Check back soon for latest projects</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Skills Section - Premium */}
        <section id="skills" className="relative mx-auto max-w-7xl px-6 py-24 border-t border-slate-800/50">
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Technical Arsenal
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                Technologies & Tools
              </h2>
              <p className="text-sm text-slate-400 max-w-lg font-light leading-relaxed">
                A comprehensive toolkit of modern technologies and frameworks that empower me to build exceptional digital products.
              </p>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {skills.length ? (
                skills.map((s) => (
                  <div
                    key={s.id}
                    className="group relative flex items-center gap-3 rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-900/40 to-slate-950/60 p-4 transition-all duration-300 hover:border-cyan-500/40 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-slate-950/80 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-105 cursor-default"
                  >
                    <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 p-2 text-cyan-300 transition-all group-hover:from-cyan-500/30 group-hover:to-cyan-500/10 group-hover:text-cyan-200">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors tracking-wide">{s.name}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-xl border border-dashed border-slate-700/60 bg-slate-900/30 p-8 text-center">
                  <p className="text-sm text-slate-400 font-mono">Skills coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Experience Section - Premium */}
        {experiences.length > 0 && (
          <section id="experience" className="relative mx-auto max-w-7xl px-6 py-24 border-t border-slate-800/50">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-cyan-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  Career Path
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  Professional Journey
                </h2>
                <p className="text-sm text-slate-400 max-w-lg font-light leading-relaxed">
                  A timeline of impactful roles, enterprise projects, and continuous growth in full-stack development.
                </p>
              </div>

              {/* Experience Timeline */}
              <div className="space-y-6">
                {experiences.map((e, idx) => (
                  <div
                    key={e.id}
                    className="group relative"
                  >
                    {/* Timeline line connector */}
                    {idx !== experiences.length - 1 && (
                      <div className="absolute left-6 top-20 w-0.5 h-12 bg-gradient-to-b from-cyan-500/40 to-transparent pointer-events-none" />
                    )}

                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-indigo-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Card */}
                    <div className="relative rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/50 to-slate-950/80 p-6 md:p-8 backdrop-blur-sm transition-all duration-300 group-hover:border-cyan-500/40 group-hover:shadow-xl group-hover:shadow-cyan-500/5">
                      
                      <div className="flex items-start gap-6">
                        {/* Timeline dot */}
                        <div className="mt-1 h-3 w-3 rounded-full border-2 border-cyan-400 bg-slate-950 flex-shrink-0 relative z-10 shadow-lg shadow-cyan-500/30" />
                        
                        {/* Content */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {e.role}
                              </h3>
                              <p className="text-sm text-slate-400 mt-1">
                                at <span className="text-cyan-300 font-semibold">{e.company}</span>
                              </p>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-xs font-mono text-cyan-400 whitespace-nowrap">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              {e.isCurrent ? 'Present' : new Date(e.startDate).getFullYear()}
                            </div>
                          </div>
                          
                          <p className="text-sm leading-relaxed text-slate-300 font-light">
                            {e.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section - Premium */}
        <section id="contact" className="relative mx-auto max-w-7xl px-6 py-28 border-t border-slate-800/50 overflow-hidden">

          {/* Background accents */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full" />
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-500/10 blur-[150px] rounded-full" />
          </div>

          <div className="relative z-10 space-y-8">
            {/* CTA Content */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 backdrop-blur-xl mb-6">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Let's Collaborate
              </div>

              <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-tight mb-4">
                Ready to <span className="text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">create something</span> amazing?
              </h2>

              <p className="text-lg text-slate-300 leading-relaxed font-light max-w-2xl">
                Whether you're starting a new project, need technical expertise, or want to explore innovative ideas—I'm here to help turn your vision into reality.
              </p>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {owner?.email && (
                <a
                  href={`mailto:${owner.email}`}
                  className="group inline-flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/40 transition-all duration-300 hover:shadow-cyan-500/60 hover:scale-105 active:scale-100"
                >
                  <Mail className="h-4 w-4" />
                  <span>{owner.email}</span>
                </a>
              )}

              {owner?.githubUrl && (
                <a
                  href={owner.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-lg border border-slate-700/60 bg-slate-900/40 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-800/60 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              )}

              {owner?.linkedinUrl && (
                <a
                  href={owner.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-lg border border-slate-700/60 bg-slate-900/40 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-800/60 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
              )}

              {owner?.xUrl && (
                <a
                  href={owner.xUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-lg border border-slate-700/60 bg-slate-900/40 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-sky-500/40 hover:bg-slate-800/60 hover:text-sky-300 hover:shadow-lg hover:shadow-sky-500/10"
                >
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </a>
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}