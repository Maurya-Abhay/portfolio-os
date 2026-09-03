import {
  Github,
  Linkedin,
  Mail,
  Twitter,
} from 'lucide-react';

import { getPortfolioOwner } from '@/lib/portfolio-owner';

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const owner = await getPortfolioOwner().catch(() => null);

  const socialLinks = [
    owner?.githubUrl
      ? {
          icon: Github,
          href: owner.githubUrl,
          label: 'GitHub',
        }
      : null,

    owner?.linkedinUrl
      ? {
          icon: Linkedin,
          href: owner.linkedinUrl,
          label: 'LinkedIn',
        }
      : null,

    owner?.xUrl
      ? {
          icon: Twitter,
          href: owner.xUrl,
          label: 'X',
        }
      : null,

    owner?.email
      ? {
          icon: Mail,
          href: `mailto:${owner.email}`,
          label: 'Email',
        }
      : null,
  ].filter(
    (
      social,
    ): social is {
      icon: typeof Github;
      href: string;
      label: string;
    } => Boolean(social),
  );

  return (
    <footer className="border-t border-slate-800/80 bg-[#080b11]">
      <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-xs text-slate-500">
              © {currentYear}{' '}
              <span className="text-slate-400">
                {owner?.name || 'Developer'}
              </span>
            </p>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <nav
              aria-label="Social links"
              className="flex items-center justify-center gap-1 sm:justify-end"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const isEmail = social.href.startsWith('mailto:');

                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target={isEmail ? undefined : '_blank'}
                    rel={isEmail ? undefined : 'noreferrer'}
                    aria-label={social.label}
                    className="
                      inline-flex h-9 w-9 items-center justify-center
                      rounded-md text-slate-500
                      transition-colors duration-200
                      hover:bg-slate-900 hover:text-cyan-300
                      focus:outline-none
                      focus:ring-2
                      focus:ring-cyan-400/30
                    "
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}