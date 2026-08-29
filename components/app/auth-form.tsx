'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(json.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Trigger success animation state
      setSuccess(true);

      // Smooth delay before redirecting to dashboard
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1200);

    } catch {
      setError('Could not connect to the server. Please try again.');
      setLoading(false);
    }
  }

  // Success Animation View
  if (success) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-4 animate-bounce">
          <CheckCircle2 className="size-8" />
        </div>
        <h3 className="text-xl font-bold text-white">
          {mode === 'login' ? 'Welcome Back!' : 'Account Created!'}
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Initializing your private workspace...
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-cyan-400">
          <span>Redirecting to Dashboard</span>
          <ArrowRight className="size-3.5 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {mode === 'register' && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Full Name
          </label>
          <input
            required
            name="name"
            autoComplete="name"
            placeholder="Abhay Sharma"
            className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Email Address
        </label>
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Password
        </label>
        <input
          required
          name="password"
          type="password"
          minLength={mode === 'register' ? 8 : 1}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          placeholder="••••••••"
          className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-400 animate-in shake">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Please wait...</span>
          </>
        ) : (
          <span>{mode === 'login' ? 'Sign in to workspace' : 'Create account'}</span>
        )}
      </button>
    </form>
  );
}