'use client';

import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'About', href: '/#about' },
  { label: 'Work', href: '/#work' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Education', href: '/#education' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/80 bg-[#080b11]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-2.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-[10px] font-bold tracking-tight text-cyan-300 transition-colors group-hover:border-cyan-400/50">
              AP
            </span>

            <div className="leading-none">
              <p className="text-sm font-semibold tracking-tight text-white">
                Abhay Prasad
              </p>

              <p className="mt-1 text-[10px] font-medium tracking-wide text-slate-600">
               Full-Stack Developer
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-xs font-medium text-slate-400 transition-colors duration-200 hover:bg-slate-900 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-800 px-3.5 text-xs font-medium text-slate-400 transition-colors duration-200 hover:border-slate-700 hover:bg-slate-900 hover:text-white"
            >
              Admin
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/#contact"
              className="inline-flex h-9 items-center rounded-md bg-cyan-400 px-3.5 text-xs font-semibold text-slate-950 transition-colors duration-200 hover:bg-cyan-300"
            >
              Let&apos;s talk
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-800 bg-slate-900/50 text-slate-300 transition-colors duration-200 hover:border-slate-700 hover:bg-slate-900 hover:text-white lg:hidden"
          >
            {open ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {open && (
          <div className="border-t border-slate-800/80 bg-[#080b11] lg:hidden">
            <nav
              aria-label="Mobile navigation"
              className="mx-auto max-w-7xl px-6 py-4"
            >
              <div className="divide-y divide-slate-800/80">
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3.5 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-300"
                  >
                    <span>{item.label}</span>

                    <span className="text-[10px] text-slate-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-4">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-slate-800 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-900 hover:text-white"
                >
                  Admin
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-cyan-400 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
                >
                  Let&apos;s talk
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Fixed navbar spacer */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}