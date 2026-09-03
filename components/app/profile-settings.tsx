'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  Github,
  Linkedin,
  Mail,
  Save,
  Twitter,
} from 'lucide-react';

type ProfileForm = {
  name: string;
  email: string;
  image: string;
  githubUrl: string;
  xUrl: string;
  linkedinUrl: string;
};

const DEFAULT_PROFILE_IMAGE = '/Abhay_photo.webp';

export function ProfileSettings() {
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    email: '',
    image: DEFAULT_PROFILE_IMAGE,
    githubUrl: '',
    xUrl: '',
    linkedinUrl: '',
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/auth/me', {
          cache: 'no-store',
        });

        if (!res.ok || cancelled) return;

        const data = await res.json();

        if (cancelled) return;

        setForm({
          name: data?.user?.name || '',
          email: data?.user?.email || '',
          image: data?.user?.image || DEFAULT_PROFILE_IMAGE,
          githubUrl: data?.user?.githubUrl || '',
          xUrl: data?.user?.xUrl || '',
          linkedinUrl: data?.user?.linkedinUrl || '',
        });
      } catch {
        if (!cancelled) {
          setError('Could not load profile settings.');
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(
    field: keyof ProfileForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) setError('');
    if (success) setSuccess('');
  }

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setBusy(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          data?.error || 'Could not save profile settings.',
        );
        return;
      }

      setSuccess('Profile updated successfully.');
    } catch {
      setError('Could not save profile settings.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
              Profile
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Profile & social links
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Update the information shown across your public portfolio.
            </p>
          </div>

          <span className="hidden text-[11px] text-slate-400 sm:block">
            Public profile
          </span>
        </div>
      </div>

      <form
        onSubmit={save}
        className="p-5 sm:p-6"
      >
        {/* Profile preview */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 sm:flex-row sm:items-center">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <img
              src={form.image || DEFAULT_PROFILE_IMAGE}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Public profile image
            </p>

            <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
              {form.image || DEFAULT_PROFILE_IMAGE}
            </p>

            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-500">
              Used in the portfolio hero and profile areas.
            </p>
          </div>
        </div>

        {/* Basic information */}
        <div className="mt-6">
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Basic information
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                Name
              </span>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  updateField('name', e.target.value)
                }
                autoComplete="name"
                placeholder="Your name"
                className="
                  h-10 w-full rounded-lg
                  border border-slate-200
                  bg-white px-3
                  text-sm text-slate-900
                  outline-none transition-colors
                  placeholder:text-slate-400
                  focus:border-cyan-500
                  focus:ring-1 focus:ring-cyan-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-slate-100
                  dark:placeholder:text-slate-600
                "
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <Mail className="h-3.5 w-3.5" />
                Email
              </span>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  updateField('email', e.target.value)
                }
                autoComplete="email"
                placeholder="name@example.com"
                className="
                  h-10 w-full rounded-lg
                  border border-slate-200
                  bg-white px-3
                  text-sm text-slate-900
                  outline-none transition-colors
                  placeholder:text-slate-400
                  focus:border-cyan-500
                  focus:ring-1 focus:ring-cyan-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-slate-100
                  dark:placeholder:text-slate-600
                "
              />
            </label>
          </div>
        </div>

        {/* Social links */}
        <div className="mt-7">
          <div className="mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Social links
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <Github className="h-3.5 w-3.5" />
                GitHub
              </span>

              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) =>
                  updateField('githubUrl', e.target.value)
                }
                placeholder="https://github.com/username"
                className="
                  h-10 w-full rounded-lg
                  border border-slate-200
                  bg-white px-3
                  text-sm text-slate-900
                  outline-none transition-colors
                  placeholder:text-slate-400
                  focus:border-cyan-500
                  focus:ring-1 focus:ring-cyan-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-slate-100
                  dark:placeholder:text-slate-600
                "
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <Twitter className="h-3.5 w-3.5" />
                X / Twitter
              </span>

              <input
                type="url"
                value={form.xUrl}
                onChange={(e) =>
                  updateField('xUrl', e.target.value)
                }
                placeholder="https://x.com/username"
                className="
                  h-10 w-full rounded-lg
                  border border-slate-200
                  bg-white px-3
                  text-sm text-slate-900
                  outline-none transition-colors
                  placeholder:text-slate-400
                  focus:border-cyan-500
                  focus:ring-1 focus:ring-cyan-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-slate-100
                  dark:placeholder:text-slate-600
                "
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </span>

              <input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) =>
                  updateField('linkedinUrl', e.target.value)
                }
                placeholder="https://linkedin.com/in/username"
                className="
                  h-10 w-full rounded-lg
                  border border-slate-200
                  bg-white px-3
                  text-sm text-slate-900
                  outline-none transition-colors
                  placeholder:text-slate-400
                  focus:border-cyan-500
                  focus:ring-1 focus:ring-cyan-500/20
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-slate-100
                  dark:placeholder:text-slate-600
                "
              />
            </label>
          </div>
        </div>

        {/* Status + save */}
        <div className="mt-7 flex flex-col-reverse gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="min-h-5">
            {error && (
              <p
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-400"
              >
                {error}
              </p>
            )}

            {!error && success && (
              <p
                role="status"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Check className="h-3.5 w-3.5" />
                {success}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="
              inline-flex h-10 items-center justify-center gap-2
              rounded-lg
              bg-slate-900 px-4
              text-sm font-medium text-white
              transition-colors
              hover:bg-slate-800
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500/30
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-white
              dark:text-slate-950
              dark:hover:bg-slate-200
            "
          >
            <Save className="h-3.5 w-3.5" />
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}