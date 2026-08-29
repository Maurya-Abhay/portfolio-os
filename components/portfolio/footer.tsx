import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-800/80 bg-[#060911] text-slate-400">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Brand & Status */}
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-white tracking-tight">Portfolio OS</span>
            <span className="text-slate-700">/</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          {/* Copyright Text */}
          <p className="text-slate-500 text-center">
            © {currentYear} All rights reserved. Built with Next.js.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3.5 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-cyan-400">
              <Github className="size-3.5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="transition-colors hover:text-cyan-400">
              <Twitter className="size-3.5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-cyan-400">
              <Linkedin className="size-3.5" />
            </a>
            <a href="mailto:hello@example.com" aria-label="Email" className="transition-colors hover:text-cyan-400">
              <Mail className="size-3.5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}