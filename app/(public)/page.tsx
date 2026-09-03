import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  Code2,
  Database,
  Github,
  GraduationCap,
  Layout,
  Linkedin,
  Mail,
  Terminal,
  Twitter,
} from 'lucide-react';
import type { Metadata } from 'next';

import { getPortfolioOwner } from '@/lib/portfolio-owner';
import { ProjectCard } from '@/components/portfolio/project-card';
import { Footer } from '@/components/portfolio/footer';
import { Navbar } from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'Full-Stack Developer & Software Architect',
  description:
    'Full-stack developer building reliable web applications, APIs, and practical digital products.',
};

export const dynamic = 'force-dynamic';

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-semibold text-white sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-[15px]">
          {description}
        </p>
      )}
    </div>
  );
}

export default async function Home() {
  const owner = await getPortfolioOwner().catch(() => null);

  const projects = owner?.projects || [];
  const skills = owner?.skills || [];
  const experiences = owner?.experiences || [];
  const education = owner?.education || [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080b11] text-slate-100 antialiased selection:bg-cyan-400/20 selection:text-cyan-100">
      {/* =========================================================
          BACKGROUND
      ========================================================== */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.05),transparent_25%),radial-gradient(circle_at_88%_18%,rgba(59,130,246,0.035),transparent_25%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <Navbar />

      <main>
        {/* =========================================================
            1. HERO
        ========================================================== */}
        <section className="mx-auto max-w-7xl px-6 pb-14 pt-12 sm:pb-16 sm:pt-14 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            {/* Left */}
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Full-Stack Developer
                </p>
              </div>

              <h1 className="mt-4 max-w-3xl text-[2.75rem] font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-5xl lg:text-[4.35rem]">
                I build dependable software{' '}
                <span className="text-slate-400">
                  from interface to backend.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-400 sm:text-base sm:leading-8">
                I design and develop modern web applications across the
                frontend, backend, APIs, and data layer — combining thoughtful
                interfaces with practical engineering that is built to scale
                with the product.
              </p>

              {/* Actions */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="#work"
                  className="group inline-flex h-11 items-center gap-2 rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition-colors duration-200 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                >
                  Explore my work
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <a
                  href="https://drive.google.com/file/d/1G6pPYL-wMnGp6K3BJzn4SOmFdXYjacBH/edit"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-5 text-sm font-medium text-slate-200 transition-colors duration-200 hover:border-slate-700 hover:bg-slate-900"
                >
                  View resume
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                {owner?.email && (
                  <a
                    href={`mailto:${owner.email}`}
                    className="inline-flex h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    <Mail className="h-4 w-4" />
                    Contact
                  </a>
                )}
              </div>

              {/* Stack */}
              <div className="mt-9 border-t border-slate-800 pt-5">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Working across
                  </span>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-400">
                    <span>React</span>
                    <span className="text-slate-700">•</span>
                    <span>Next.js</span>
                    <span className="text-slate-700">•</span>
                    <span>Node.js</span>
                    <span className="text-slate-700">•</span>
                    <span>APIs</span>
                    <span className="text-slate-700">•</span>
                    <span>Databases</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="lg:justify-self-end lg:w-full lg:max-w-[390px]">
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30">
                {owner?.image ? (
                  <div className="relative aspect-[4/4.4] overflow-hidden bg-slate-950">
                    <Image
                      src={owner.image}
                      alt={owner.name || 'Profile'}
                      fill
                      priority
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 390px"
                      className="object-cover object-center"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/4.4] items-center justify-center bg-slate-950">
                    <span className="font-mono text-xs text-slate-600">
                      profile image unavailable
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 border-t border-slate-800 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {owner?.name || 'Developer'}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Full-Stack Developer
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      Focus
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Product · Engineering
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. ABOUT
        ========================================================== */}
        <section
          id="about"
          className="scroll-mt-20 border-t border-slate-800/80"
        >
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              {/* Left */}
              <div className="lg:pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  About
                </p>

                <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                  I care about how software is built, not just how it looks.
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
                  Good products need both thoughtful interfaces and solid
                  engineering underneath them. That balance shapes the way I
                  work.
                </p>
              </div>

              {/* Right */}
              <div className="max-w-3xl">
                <p className="text-base leading-7 text-slate-300 sm:text-[17px] sm:leading-8">
                  I enjoy turning ideas into software that feels simple to use
                  and makes sense to maintain. My work spans the interface,
                  application logic, APIs, and data layer, so I can think about
                  a product as a complete system rather than a collection of
                  separate parts.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-[15px]">
                  I usually start with the real problem, keep the architecture
                  as simple as the requirements allow, and give extra attention
                  to the details that affect usability and long-term
                  maintainability.
                </p>

                {/* Principles */}
                <div className="mt-8 border-y border-slate-800">
                  <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-slate-800">
                    <div className="py-5 sm:pr-6">
                      <div className="flex items-center gap-3">
                        <Layout className="h-4 w-4 text-cyan-400" />
                        <h3 className="text-sm font-semibold text-white">
                          Clear interfaces
                        </h3>
                      </div>

                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        Interfaces should guide people naturally, not make them
                        think about the interface itself.
                      </p>
                    </div>

                    <div className="border-t border-slate-800 py-5 sm:border-t-0 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Code2 className="h-4 w-4 text-cyan-400" />
                        <h3 className="text-sm font-semibold text-white">
                          Simple architecture
                        </h3>
                      </div>

                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        Prefer understandable systems and abstractions that
                        solve a real problem.
                      </p>
                    </div>

                    <div className="border-t border-slate-800 py-5 sm:border-t-0 sm:pl-6">
                      <div className="flex items-center gap-3">
                        <Database className="h-4 w-4 text-cyan-400" />
                        <h3 className="text-sm font-semibold text-white">
                          Built to evolve
                        </h3>
                      </div>

                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        Code, APIs, and data models should remain useful as the
                        product grows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. WORK
        ========================================================== */}
        <section
          id="work"
          className="scroll-mt-20 border-t border-slate-800/80"
        >
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8 lg:py-20">
            {/* Header */}
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Selected Work
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                  Projects that show how I build.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-[15px]">
                  A selection of applications and systems built across product
                  interfaces, backend services, APIs, and data.
                </p>
              </div>

              <Link
                href="/projects"
                className="group hidden shrink-0 items-center gap-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white sm:inline-flex"
              >
                All projects
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Projects */}
            {projects.length > 0 ? (
              <div className="mt-9 grid gap-5 md:grid-cols-2">
                {projects.map((project, index) => (
                  <article
                    key={project.id}
                    className={`
                      group rounded-2xl border border-slate-800
                      bg-slate-900/25 p-5
                      transition-colors duration-200
                      hover:border-slate-700 hover:bg-slate-900/40
                      sm:p-6
                      ${index === 0 ? 'md:col-span-2' : ''}
                    `}
                  >
                    <div className={index === 0 ? 'max-w-4xl' : 'max-w-2xl'}>
                      <div className="mb-5 flex items-center justify-between">
                        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        {(project.liveUrl || project.githubUrl) && (
                          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
                            {project.liveUrl && project.githubUrl
                              ? 'Live · Source'
                              : project.liveUrl
                                ? 'Live'
                                : 'Source'}
                          </span>
                        )}
                      </div>

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
              <div className="mt-9 rounded-2xl border border-dashed border-slate-800 p-8">
                <p className="text-sm text-slate-500">
                  Projects will appear here once they are added.
                </p>
              </div>
            )}

            {/* Mobile all-projects link */}
            <div className="mt-7 sm:hidden">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
              >
                View all projects
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            4. SKILLS
        ========================================================== */}
        <section
          id="skills"
          className="scroll-mt-20 border-t border-slate-800/80"
        >
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
              {/* Intro */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Skills
                </p>

                <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                  The stack I work with.
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
                  A practical set of technologies I use across interfaces,
                  application logic, APIs, databases, and delivery.
                </p>
              </div>

              {/* Skills */}
              <div>
                {skills.length > 0 ? (
                  (() => {
                    const frontendKeywords = [
                      'HTML',
                      'CSS',
                      'Tailwind',
                      'React',
                      'Next',
                      'JavaScript',
                      'TypeScript',
                    ];

                    const backendKeywords = [
                      'Node',
                      'Express',
                      'API',
                      'REST',
                      'Authentication',
                    ];

                    const dataKeywords = [
                      'PostgreSQL',
                      'MySQL',
                      'Mongo',
                      'Prisma',
                      'Redis',
                      'Database',
                    ];

                    const toolsKeywords = [
                      'Git',
                      'GitHub',
                      'Docker',
                      'AWS',
                      'CI/CD',
                      'Testing',
                    ];

                    const includesAny = (
                      name: string,
                      keywords: string[],
                    ) =>
                      keywords.some((keyword) =>
                        name.toLowerCase().includes(keyword.toLowerCase()),
                      );

                    const groups = [
                      {
                        title: 'Frontend',
                        items: skills.filter((skill) =>
                          includesAny(skill.name, frontendKeywords),
                        ),
                      },
                      {
                        title: 'Backend',
                        items: skills.filter((skill) =>
                          includesAny(skill.name, backendKeywords),
                        ),
                      },
                      {
                        title: 'Data',
                        items: skills.filter((skill) =>
                          includesAny(skill.name, dataKeywords),
                        ),
                      },
                      {
                        title: 'Tools',
                        items: skills.filter((skill) =>
                          includesAny(skill.name, toolsKeywords),
                        ),
                      },
                    ];

                    const groupedIds = new Set(
                      groups.flatMap((group) =>
                        group.items.map((item) => item.id),
                      ),
                    );

                    const otherSkills = skills.filter(
                      (skill) => !groupedIds.has(skill.id),
                    );

                    if (otherSkills.length) {
                      groups.push({
                        title: 'Other',
                        items: otherSkills,
                      });
                    }

                    return (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {groups
                          .filter((group) => group.items.length > 0)
                          .map((group) => (
                            <div key={group.title}>
                              <div className="mb-3 flex items-center gap-3">
                                <span className="h-px w-5 bg-cyan-400/70" />

                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                  {group.title}
                                </h3>
                              </div>

                              <div className="rounded-xl border border-slate-800 bg-slate-900/25">
                                {group.items.map((skill, index) => (
                                  <div
                                    key={skill.id}
                                    className={`flex items-center justify-between px-4 py-3 ${
                                      index !== group.items.length - 1
                                        ? 'border-b border-slate-800/80'
                                        : ''
                                    }`}
                                  >
                                    <span className="text-sm font-medium text-slate-300">
                                      {skill.name}
                                    </span>

                                    <span className="text-[10px] text-slate-600">
                                      {String(index + 1).padStart(2, '0')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    );
                  })()
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-800 p-7">
                    <p className="text-sm text-slate-500">
                      Skills will appear here once they are added.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. EDUCATION
        ========================================================== */}
        {education.length > 0 && (
          <section
            id="education"
            className="scroll-mt-20 border-t border-slate-800/80"
          >
            <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8 lg:py-20">
              <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
                {/* Intro */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Education
                  </p>

                  <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                    Academic background.
                  </h2>

                  <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
                    The academic path behind my technical foundation and
                    current learning journey.
                  </p>
                </div>

                {/* Education */}
                <div className="space-y-4">
                  {education.map((item, index) => {
                    const startYear = item.startDate
                      ? new Date(item.startDate).getFullYear()
                      : null;

                    const endYear = item.endDate
                      ? new Date(item.endDate).getFullYear()
                      : 'Present';

                    const isPrimary = index === 0;

                    return (
                      <article
                        key={item.id}
                        className={
                          isPrimary
                            ? 'rounded-2xl border border-slate-700 bg-slate-900/45 p-6 sm:p-7'
                            : 'rounded-xl border border-slate-800 bg-slate-900/20 px-5 py-4'
                        }
                      >
                        {isPrimary ? (
                          <>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-cyan-400">
                                  <GraduationCap className="h-4 w-4" />
                                </span>

                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
                                    Current education
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {startYear
                                      ? `${startYear} — ${endYear}`
                                      : endYear}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-white">
                              {item.degree}
                            </h3>

                            <p className="mt-1 text-sm font-medium text-cyan-400">
                              {item.institution}
                            </p>

                            {item.description && (
                              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                                {item.description}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-5">
                              <div className="min-w-0">
                                <h3 className="text-base font-semibold text-white">
                                  {item.degree}
                                </h3>

                                <p className="mt-1 text-sm font-medium text-slate-400">
                                  {item.institution}
                                </p>
                              </div>

                              <span className="shrink-0 text-[11px] text-slate-600">
                                {startYear
                                  ? `${startYear} — ${endYear}`
                                  : endYear}
                              </span>
                            </div>

                            {item.description && (
                              <p className="mt-3 text-sm leading-6 text-slate-500">
                                {item.description}
                              </p>
                            )}
                          </>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            6. EXPERIENCE
        ========================================================== */}
        {experiences.length > 0 && (
          <section
            id="experience"
            className="scroll-mt-20 border-t border-slate-800/80"
          >
            <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8 lg:py-20">
              <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
                {/* Intro */}
                <div className="lg:pt-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Experience
                  </p>

                  <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                    Experience that shaped how I build.
                  </h2>

                  <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
                    Roles, responsibilities, and the kind of work I have taken
                    on across products and development projects.
                  </p>
                </div>

                {/* Experience list */}
                <div className="divide-y divide-slate-800 border-y border-slate-800">
                  {experiences.map((experience) => {
                    const startYear = experience.startDate
                      ? new Date(experience.startDate).getFullYear()
                      : null;

                    const endYear = experience.isCurrent
                      ? 'Present'
                      : experience.endDate
                        ? new Date(experience.endDate).getFullYear()
                        : null;

                    return (
                      <article
                        key={experience.id}
                        className="grid gap-4 py-6 sm:py-7 md:grid-cols-[130px_1fr] md:gap-8"
                      >
                        {/* Date */}
                        <div className="pt-1">
                          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                            {startYear && endYear
                              ? `${startYear} — ${endYear}`
                              : startYear || endYear || 'Experience'}
                          </p>
                        </div>

                        {/* Content */}
                        <div>
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <h3 className="text-lg font-semibold tracking-[-0.015em] text-white sm:text-xl">
                              {experience.role}
                            </h3>

                            <span className="text-sm font-medium text-cyan-400">
                              {experience.company}
                            </span>
                          </div>

                          {experience.description && (
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                              {experience.description}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            7. CONTACT
        ========================================================== */}
        <section
          id="contact"
          className="scroll-mt-20 border-t border-slate-800/80"
        >
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:gap-16">
              {/* Left */}
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Contact
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-[2.7rem]">
                  Let&apos;s talk about what you&apos;re building.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-[15px]">
                  Have a product idea, a technical challenge, or an
                  opportunity worth discussing? Send me a message and I&apos;ll
                  get back to you.
                </p>
              </div>

              {/* Right */}
              <div className="lg:justify-self-end lg:w-full lg:max-w-md">
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/25">
                  {/* Email */}
                  {owner?.email && (
                    <a
                      href={`mailto:${owner.email}`}
                      className="group block border-b border-slate-800 p-5 transition-colors duration-200 hover:bg-slate-900/60"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Email
                          </p>

                          <p className="mt-2 break-all text-sm font-medium text-slate-200 transition-colors group-hover:text-cyan-300 sm:text-[15px]">
                            {owner.email}
                          </p>
                        </div>

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-800 text-slate-500 transition-colors group-hover:border-cyan-400/30 group-hover:text-cyan-300">
                          <Mail className="h-4 w-4" />
                        </span>
                      </div>
                    </a>
                  )}

                  {/* Social links */}
                  <div className="grid sm:grid-cols-3">
                    {owner?.githubUrl && (
                      <a
                        href={owner.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between border-b border-slate-800 px-5 py-4 transition-colors duration-200 hover:bg-slate-900/60 sm:border-b-0 sm:border-r"
                      >
                        <span className="text-sm font-medium text-slate-400 transition-colors group-hover:text-white">
                          GitHub
                        </span>

                        <Github className="h-4 w-4 text-slate-600 transition-colors group-hover:text-cyan-300" />
                      </a>
                    )}

                    {owner?.linkedinUrl && (
                      <a
                        href={owner.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between border-b border-slate-800 px-5 py-4 transition-colors duration-200 hover:bg-slate-900/60 sm:border-b-0 sm:border-r"
                      >
                        <span className="text-sm font-medium text-slate-400 transition-colors group-hover:text-white">
                          LinkedIn
                        </span>

                        <Linkedin className="h-4 w-4 text-slate-600 transition-colors group-hover:text-cyan-300" />
                      </a>
                    )}

                    {owner?.xUrl && (
                      <a
                        href={owner.xUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between px-5 py-4 transition-colors duration-200 hover:bg-slate-900/60"
                      >
                        <span className="text-sm font-medium text-slate-400 transition-colors group-hover:text-white">
                          X
                        </span>

                        <Twitter className="h-4 w-4 text-slate-600 transition-colors group-hover:text-cyan-300" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-slate-600">
                  Prefer email for project and collaboration enquiries.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}