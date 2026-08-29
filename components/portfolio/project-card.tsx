import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  slug: string;
}

export function ProjectCard({ title, description, tags, slug }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold text-cyan-400">
            Featured project
          </span>
          <div className="rounded-full border border-slate-800 bg-slate-950/50 p-1.5 text-slate-400 group-hover:text-cyan-400">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <h3 className="break-words text-lg font-bold text-white group-hover:text-cyan-400">{title}</h3>
        <p className="mt-2 break-words text-sm leading-6 text-slate-400">{description}</p>
      </div>

      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-md border border-slate-800/60 bg-slate-950/60 px-2 py-1 text-[10px] font-medium text-slate-300">
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}