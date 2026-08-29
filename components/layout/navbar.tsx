'use client';

import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Contact', href: '/#contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-2xl transition-all">
      
      {/* Subtle top light trace effect */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none" />

      {/* Compact padding */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        
        {/* Brand Logo - Updated to AP & Abhay.dev */}
        <Link href="/" className="group flex items-center gap-2 text-base font-black tracking-tight text-white">
          <span className="flex size-7 items-center justify-center rounded-lg border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-slate-900 text-xs font-bold text-cyan-300 shadow-inner shadow-cyan-500/20 transition-transform group-hover:scale-105">
            AP
          </span>
          <span className="text-sm tracking-normal font-extrabold text-slate-100">
            Abhay<span className="text-cyan-400">.</span>dev
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 rounded-full border border-slate-800/80 bg-slate-900/40 px-3 py-1 backdrop-blur-md md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide text-slate-300 transition-all hover:bg-slate-800/60 hover:text-cyan-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Button */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="group inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-300 shadow-sm transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500 hover:text-slate-950 hover:shadow-cyan-500/25 active:scale-[0.98]"
          >
            <span>Admin Portal</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-200 transition-colors hover:border-slate-700 hover:text-white md:hidden"
        >
          {open ? <X className="size-4 text-cyan-400" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 text-sm font-medium text-slate-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2 transition-all hover:bg-slate-900/80 hover:text-cyan-300 font-semibold text-xs"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2.5 mt-2 border-t border-slate-800/80">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-center text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20"
              >
                <span>Admin Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}