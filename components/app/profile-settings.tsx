'use client';

import { useEffect, useState } from 'react';
import { Check, Github, Linkedin, Mail, Save, Sparkles, Twitter, Upload } from 'lucide-react';

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
    async function load() {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return;
      const data = await res.json();
      setForm({
        name: data.user?.name || '',
        email: data.user?.email || '',
        image: data.user?.image || DEFAULT_PROFILE_IMAGE,
        githubUrl: data.user?.githubUrl || '',
        xUrl: data.user?.xUrl || '',
        linkedinUrl: data.user?.linkedinUrl || '',
      });
    }

    void load();
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');

    const res = await fetch('/api/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => null);
    setBusy(false);

    if (!res.ok) {
      setError(data?.error || 'Could not save profile settings.');
      return;
    }

    setSuccess('Profile updated successfully.');
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Profile & social links</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Controls the public hero, contact CTA and social identity.</p>
        </div>
      </div>

      <form onSubmit={save} className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-800">
              <img src={form.image || DEFAULT_PROFILE_IMAGE} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Default profile image</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{form.image || DEFAULT_PROFILE_IMAGE}</p>
            </div>
          </div>
        </div>

        <label>
          <span className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950" />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">Email</span>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950" />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300"><Github className="mr-1 inline size-3.5" /> GitHub URL</span>
          <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950" placeholder="https://github.com/username" />
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300"><Twitter className="mr-1 inline size-3.5" /> X / Twitter URL</span>
          <input value={form.xUrl} onChange={(e) => setForm({ ...form, xUrl: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950" placeholder="https://twitter.com/username" />
        </label>

        <label className="md:col-span-2">
          <span className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300"><Linkedin className="mr-1 inline size-3.5" /> LinkedIn URL</span>
          <input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950" placeholder="https://linkedin.com/in/username" />
        </label>

        {error && <p className="md:col-span-2 text-sm font-semibold text-red-600">{error}</p>}
        {success && <p className="md:col-span-2 text-sm font-semibold text-emerald-600">{success}</p>}

        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-slate-950">
            {busy ? 'Saving...' : <><Save className="size-4" /> Save profile</>}
          </button>
        </div>
      </form>
    </section>
  );
}
