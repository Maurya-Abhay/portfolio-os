import { getPublishedProject } from '@/lib/portfolio-owner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/portfolio/footer';
import Link from 'next/link';
import { ArrowUpRight, Github, ArrowLeft, Terminal, CheckCircle2, Cpu, Code2, Zap } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getPublishedProject(slug).catch(() => null);

  if (!p) notFound();

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans overflow-hidden">
      
      {/* Premium Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/15 via-blue-500/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 to-transparent blur-[140px] rounded-full" />
      </div>

      <Navbar />
      
      <main className="relative pt-20 mx-auto max-w-7xl px-6 py-12 md:py-16">
        
        {/* Back Navigation Button */}
        <Link 
          href="/#work" 
          className="group inline-flex items-center gap-2.5 rounded-lg border border-slate-700/60 bg-slate-900/40 px-4 py-2 text-xs font-semibold text-slate-300 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-800/60 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
          <span>Back to Portfolio</span>
        </Link>

        {/* Hero Section with Project Title */}
        <div className="mt-12 space-y-6 border-b border-slate-700/50 pb-12">
          

          {/* Title with Gradient */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              {p.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-light max-w-3xl">
              {p.description}
            </p>
          </div>
        </div>

        {/* Main Content Grid - Bento Style */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Main Description Section - Left */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* System Overview Card - Premium */}
            <div className="group relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* Card */}
              <div className="relative rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-8 md:p-10 backdrop-blur-xl transition-all duration-300 group-hover:border-cyan-500/40 group-hover:shadow-2xl group-hover:shadow-cyan-500/10">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-700/50">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 text-cyan-400">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-300">System Overview</h2>
                    <p className="text-xs text-slate-500 font-mono mt-1">Implementation Details</p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="prose prose-invert max-w-none space-y-4">
                  <p className="text-base leading-relaxed text-slate-300 font-light whitespace-pre-wrap">
                    {p.longDescription || p.description || 'No detailed technical documentation provided for this project yet.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Project Links Card - Premium */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-6 backdrop-blur-xl">
                
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono flex items-center gap-2 mb-5">
                  <Code2 className="h-4 w-4 text-cyan-400" />
                  Project Links
                </h3>
                
                <div className="space-y-3">
                  {p.liveUrl && (
                    <a 
                      href={p.liveUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="group/btn flex items-center justify-between rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105 active:scale-100"
                    >
                      <span>Live Application</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                    </a>
                  )}

                  {p.githubUrl && (
                    <a 
                      href={p.githubUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="group/btn flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-800/60 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10 backdrop-blur-sm"
                    >
                      <span>Source Code</span>
                      <Github className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Tech Stack Card - Premium */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-6 backdrop-blur-xl">
                
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono flex items-center gap-2 mb-5">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  Tech Stack & Features
                </h3>
                
                <ul className="space-y-3">
                  {[
                    'Responsive & Modern UI',
                    'Optimized Database',
                    'Clean API Design',
                    'Scalable Architecture',
                    'Performance Tuned',
                    'Production Ready'
                  ].map((feature, i) => (
                    <li 
                      key={i}
                      className="group/feature flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-transparent border border-slate-700/40 transition-all duration-300 hover:border-cyan-500/40 hover:from-cyan-500/15"
                    >
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 transition-transform group-hover/feature:scale-110" />
                      <span className="text-sm font-medium text-slate-300 group-hover/feature:text-cyan-300 transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Performance Metrics Card - Premium */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-6 backdrop-blur-xl">
                
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono flex items-center gap-2 mb-5">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  Performance
                </h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Page Speed', value: '98/100' },
                    { label: 'Best Practices', value: '95/100' },
                    { label: 'Accessibility', value: '92/100' },
                  ].map((metric, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300">{metric.label}</span>
                        <span className="font-bold text-emerald-400">{metric.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800/50 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                          style={{ width: `${parseInt(metric.value) / 100 * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* CTA Section */}
        <div className="mt-20 rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900/40 to-slate-950/60 p-8 md:p-12 backdrop-blur-xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Interested in this project?
          </h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            Let's discuss how I can help build something amazing for your next project.
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105 active:scale-100"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}