import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  slug: string;
}

export function ProjectCard({
  title,
  description,
  tags,
  slug,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="
        group block h-full
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-400/50
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#080b11]
      "
    >
      <div className="flex h-full flex-col">
        {/* Project heading */}
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Project
            </p>

            <h3
              className="
                break-words text-xl font-semibold tracking-[-0.02em]
                text-white transition-colors duration-200
                group-hover:text-cyan-300
              "
            >
              {title}
            </h3>
          </div>

          <span
            className="
              mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center
              rounded-full border border-slate-800
              text-slate-500 transition-all duration-200
              group-hover:border-cyan-400/40
              group-hover:bg-cyan-400/5
              group-hover:text-cyan-300
            "
            aria-hidden="true"
          >
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* Description */}
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          {description}
        </p>

        {/* Technologies */}
        {tags.length > 0 && (
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-800/80 pt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="
                  text-[11px] font-medium tracking-wide
                  text-slate-500 transition-colors duration-200
                  group-hover:text-slate-400
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom action */}
        <div className="mt-auto pt-6">
          <span
            className="
              inline-flex items-center gap-2 text-sm font-medium
              text-slate-300 transition-colors duration-200
              group-hover:text-white
            "
          >
            View project
            <ArrowUpRight
              className="
                h-4 w-4 transition-transform duration-200
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </span>
        </div>
      </div>
    </Link>
  );
}