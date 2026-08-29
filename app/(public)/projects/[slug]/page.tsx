import { getPublishedProject } from '@/lib/portfolio-owner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/portfolio/footer';
import Link from 'next/link';
import { ArrowUpRight, Github, ArrowLeft, Terminal, CheckCircle2, Cpu } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getPublishedProject(slug).catch(() => null);

  if (!p) notFound();

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-3 py-6 md:py-10">
        
        {/* Top Navigation Back Link */}
        <Link 
          href="/#work" 
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-xs font-semibold text-slate-400 transition-all hover:border-cyan-500/40 hover:text-cyan-300"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> 
          <span>Back to Portfolio</span>
        </Link>

        {/* Header Title Section */}
        <div className="mt-8 border-b border-slate-800/80 pb-8">
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
            {p.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            {p.description}
          </p>
        </div>

        {/* Bento Grid Structure Layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Main Description Column (Left - 8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/30 p-6 sm:p-10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-6 font-mono">
                <Terminal className="h-4 w-4" /> System Overview & Implementation
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-300 font-normal">
                  {p.longDescription || p.description || 'No detailed technical documentation provided for this project yet.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Metadata Column (Right - 4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions Card */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Project Links</h3>
              <div className="mt-4 flex flex-col gap-3">
                {p.liveUrl && (
                  <a 
                    href={p.liveUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-between rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 shadow-md"
                  >
                    <span>View Live Application</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}

                {p.githubUrl && (
                  <a 
                    href={p.githubUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-slate-700 hover:bg-slate-900"
                  >
                    <span>Source Repository</span>
                    <Github className="h-4 w-4 text-slate-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Architecture Highlights Card */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" /> Tech Stack & Features
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Responsive UI & Layout Design</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Optimized Database Architecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Clean API & State Management</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}