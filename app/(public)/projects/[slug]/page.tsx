import { getPublishedProject } from '@/lib/portfolio-owner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/portfolio/footer';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  Code2,
} from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const p = await getPublishedProject(slug).catch(() => null);

  if (!p) notFound();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080b11] text-slate-100 antialiased selection:bg-cyan-400/20 selection:text-cyan-100">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_5%,rgba(34,211,238,0.035),transparent_25%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.025),transparent_25%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <Navbar />

      <main>
        {/* =========================================================
            PROJECT HEADER
        ========================================================== */}
        <section className="mx-auto max-w-7xl px-6 pb-12 pt-10 sm:pb-14 sm:pt-12 lg:px-8 lg:pb-16 lg:pt-10">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to work
          </Link>

          <div className="mt-8 max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Project
            </p>

            <h1 className="mt-3 text-3xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-3xl lg:text-4xl">
              {p.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
              {p.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-11 items-center gap-2 rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
                >
                  Open live project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}

              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-900 hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  Source code
                </a>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            PROJECT CONTENT
        ========================================================== */}
        <section className="border-t border-slate-800/80">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
              {/* Main content */}
              <article className="min-w-0">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Code2 className="h-4 w-4 text-cyan-400" />

                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Overview
                    </p>
                  </div>

                  <div className="mt-6 max-w-3xl">
                    <p className="whitespace-pre-wrap text-[15px] leading-8 text-slate-300 sm:text-base">
                      {p.longDescription ||
                        p.description ||
                        'No detailed project overview has been added yet.'}
                    </p>
                  </div>
                </div>

                {/* Project details */}
                <div className="mt-12 border-t border-slate-800 pt-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                        What I built
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        A complete product experience spanning interface,
                        application logic, and supporting backend systems.
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                        Engineering focus
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Clear architecture, practical APIs, maintainable code,
                        and an experience that works well across screen sizes.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:border-l lg:border-slate-800 lg:pl-8">
                <div className="lg:sticky lg:top-24">
                  {/* Links */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                      Project links
                    </p>

                    <div className="mt-4 space-y-2">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-900/60 hover:text-white"
                        >
                          <span>Live application</span>

                          <ArrowUpRight className="h-4 w-4 text-slate-600 transition-colors group-hover:text-cyan-300" />
                        </a>
                      )}

                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-900/60 hover:text-white"
                        >
                          <span>Source code</span>

                          <Github className="h-4 w-4 text-slate-600 transition-colors group-hover:text-cyan-300" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Technical summary */}
                  <div className="mt-8 border-t border-slate-800 pt-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                      Technical focus
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-sm text-slate-400">
                          Frontend
                        </span>

                        <span className="text-right text-sm font-medium text-slate-300">
                          React / Next.js
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-sm text-slate-400">
                          Backend
                        </span>

                        <span className="text-right text-sm font-medium text-slate-300">
                          APIs / Node.js
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <span className="text-sm text-slate-400">
                          Data
                        </span>

                        <span className="text-right text-sm font-medium text-slate-300">
                          Database / ORM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* =========================================================
            NEXT STEP
        ========================================================== */}
        <section className="border-t border-slate-800/80">
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Next step
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-white">
                  Have a similar problem to solve?
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Let&apos;s talk about the product, the problem, and what
                  needs to be built.
                </p>
              </div>

              <Link
                href="/#contact"
                className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
              >
                Start a conversation
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}