'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

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

      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);

    } catch {
      setError('Could not connect to the server. Please try again.');
      setLoading(false);
    }
  }

  // Success Animation View
  if (success) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative flex size-16 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 mb-5 shadow-lg shadow-emerald-500/20">
          {/* Rotating ring around success icon */}
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/60 border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
          <CheckCircle2 className="relative size-8 animate-bounce" />
        </div>
        
        <h3 className="text-xl font-extrabold text-white tracking-tight">
          {mode === 'login' ? 'Authentication Successful!' : 'Workspace Created!'}
        </h3>
        
        <p className="mt-1.5 text-xs text-slate-400 max-w-xs font-light">
          Verifying security tokens & initializing your private control center...
        </p>

        <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-400">
          <ShieldCheck className="size-3.5" />
          <span>Redirecting to Dashboard...</span>
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
        className="mt-2 relative group overflow-hidden inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:bg-cyan-400 hover:shadow-cyan-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
      >
        {/* Subtle glowing moving background sweep when loading */}
        {loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        )}

        {loading ? (
          <>
            {/* Rotating High-tech Icon */}
            <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
            <span className="relative z-10 tracking-wide">Establishing Secure Session...</span>
          </>
        ) : (
          <span className="relative z-10">{mode === 'login' ? 'Sign in to workspace' : 'Create account'}</span>
        )}
      </button>
    </form>
  );
}