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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-xl transition-all duration-300">
      
      {/* Premium top accent line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-2">
        
        {/* Logo - Premium Design */}
        <Link href="/" className="group flex items-center gap-2.5 transition-all duration-300 hover:opacity-80">
          {/* Logo Box */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/50 bg-gradient-to-br from-cyan-500/25 via-cyan-500/10 to-slate-950 text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-500/20 transition-all duration-300 group-hover:shadow-cyan-500/40 group-hover:border-cyan-400/80">
            AP
          </div>
          
          {/* Logo Text */}
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black tracking-tight text-slate-100 group-hover:text-cyan-300 transition-colors">
              Abhay<span className="text-cyan-400">.</span>dev
            </span>
            <span className="text-xs text-slate-600 font-medium tracking-wide group-hover:text-slate-500 transition-colors">Designer & Developer</span>
          </div>
        </Link>

        {/* Desktop Navigation - Premium */}
        <nav className="hidden md:flex items-center gap-2 rounded-full border border-slate-800/50 bg-slate-950/60 px-2 py-1.5 backdrop-blur-lg shadow-inner shadow-slate-900/50 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-950/80">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative px-4 py-2 text-xs font-semibold tracking-wide text-slate-300 transition-all duration-300 hover:text-cyan-300 rounded-full hover:bg-slate-800/60"
            >
              <span className="relative z-10">{item.label}</span>
              {/* Subtle underline on hover */}
              <div className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan-400/0 via-cyan-400/60 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop CTA - Premium */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 to-cyan-500/5 px-4 py-2 text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:border-cyan-400/70 hover:from-cyan-500/25 hover:to-cyan-500/10 hover:shadow-cyan-500/40 active:scale-95 overflow-hidden"
          >
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -left-full group-hover:left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 pointer-events-none" />
            
            <span className="relative">Admin</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 relative" />
          </Link>
        </div>

        {/* Mobile Menu Button - Premium */}
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-800/60 bg-slate-900/50 p-2 text-slate-200 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-800/60 hover:text-cyan-300 active:scale-95 backdrop-blur-sm"
        >
          {open ? (
            <X className="h-5 w-5 text-cyan-400 transition-transform duration-300 rotate-0" />
          ) : (
            <Menu className="h-5 w-5 transition-transform duration-300" />
          )}
        </button>
      </div>

      {/* Mobile Menu - Premium Dropdown */}
      {open && (
        <div className="border-t border-slate-800/50 bg-gradient-to-b from-slate-950/95 to-slate-950/80 backdrop-blur-xl md:hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm font-medium text-slate-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group relative rounded-lg px-4 py-3 transition-all duration-300 text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60 font-semibold text-xs uppercase tracking-wide overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                
                <span className="relative flex items-center justify-between">
                  {item.label}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 ml-2" />
                </span>
              </Link>
            ))}

            {/* Mobile Admin Button */}
            <div className="pt-4 mt-4 border-t border-slate-800/50">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-3 text-center text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 active:scale-95"
              >
                <span>Open Admin Portal</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </nav>
        </div>
      )}  
    </header>
  );
}