import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-800/50 bg-gradient-to-b from-[#0a0e17] to-[#060911] text-slate-400 overflow-hidden">
      
      {/* Subtle background accent grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b05_1px,transparent_1px),linear-gradient(to_bottom,#1e293b05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          
          {/* Brand & Status Section */}
          <div className="space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-slate-900 text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-500/20 transition-all group-hover:shadow-cyan-500/40">
                AP
              </div>
              <span className="text-sm font-black tracking-tight text-slate-100 group-hover:text-cyan-300 transition-colors">
                Abhay<span className="text-cyan-400">.</span>dev
              </span>
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed font-light max-w-xs">
              Engineering high-performance web applications with clean code, scalable architecture, and pixel-perfect UI.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400">Open for new opportunities</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Quick Navigation
            </h3>
            <div className="space-y-2.5 flex flex-col">
              {[
                { label: 'Featured Work', href: '/#work' },
                { label: 'About Me', href: '/#about' },
                { label: 'Skills & Tech Stack', href: '/#skills' },
                { label: 'Get in Touch', href: '/#contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-300 transition-colors duration-300 font-medium"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="h-3 w-3 transition-transform opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" />
                </Link>
              ))}
            </div>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Let's Build Together
            </h3>
            <div className="flex items-center gap-4">
              {[
                { 
                  icon: Github, 
                  href: 'https://github.com/your-username', 
                  label: 'GitHub',
                  color: 'text-slate-400 hover:text-slate-200'
                },
                { 
                  icon: Linkedin, 
                  href: 'https://linkedin.com/in/your-profile', 
                  label: 'LinkedIn',
                  color: 'text-slate-400 hover:text-sky-300'
                },
                { 
                  icon: Twitter, 
                  href: 'https://twitter.com/your-handle', 
                  label: 'Twitter',
                  color: 'text-slate-400 hover:text-sky-400'
                },
                { 
                  icon: Mail, 
                  href: 'mailto:abhay@yourdomain.com', 
                  label: 'Email',
                  color: 'text-slate-400 hover:text-cyan-400'
                },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target={social.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={social.href.startsWith('mailto') ? undefined : 'noreferrer'}
                    aria-label={social.label}
                    className={`group relative p-2.5 rounded-lg border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-cyan-500/10 ${social.color}`}
                  >
                    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </a>
                );
              })}
            </div>

            {/* Status Message */}
            <p className="text-xs text-slate-500 font-light pt-2">
              ⚡ <span className="text-slate-400">Typically replies within 12-24 hours</span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800/50 to-transparent my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-light">
          
          {/* Copyright */}
          <p>
            © {currentYear} <span className="text-slate-300 font-semibold">Abhay Pratap</span>. All rights reserved.
          </p>

          {/* Stack Info */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Designed & Built with <span className="text-cyan-400 font-semibold">Next.js</span> & <span className="text-blue-400 font-semibold">Tailwind CSS</span>
            </span>
          </div>

          {/* Additional Info */}
          <p className="text-slate-500 font-medium">
            Hosted securely on <span className="text-slate-300 font-semibold hover:text-cyan-300 transition-colors cursor-default">Vercel</span>
          </p>
        </div>
      </div>
    </footer>
  );
}