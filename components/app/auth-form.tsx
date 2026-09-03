'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export function AuthForm({
  mode,
}: {
  mode: 'login' | 'register';
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError('');

    const formData = Object.fromEntries(
      new FormData(e.currentTarget),
    );

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(json.error || 'Unable to complete the request.');
        setLoading(false);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1200);
    } catch {
      setError('Could not connect to the server. Please try again.');
      setLoading(false);
    }
  }

  /* =========================================================
      SUCCESS STATE
  ========================================================== */
  if (success) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-white">
          {mode === 'login'
            ? 'Signed in successfully'
            : 'Account created successfully'}
        </h3>

        <p className="mt-2 text-xs leading-6 text-slate-500">
          Taking you to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4"
    >
      {/* Full name */}
      {mode === 'register' && (
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-xs font-medium text-slate-400"
          >
            Full name
          </label>

          <input
            id="name"
            required
            name="name"
            autoComplete="name"
            placeholder="Abhay Sharma"
            className="
              h-11 w-full rounded-lg
              border border-slate-800
              bg-slate-950
              px-3.5
              text-sm text-slate-100
              placeholder:text-slate-600
              outline-none
              transition-colors duration-200
              focus:border-cyan-400/50
              focus:ring-1 focus:ring-cyan-400/20
            "
          />
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-xs font-medium text-slate-400"
        >
          Email address
        </label>

        <input
          id="email"
          required
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="
            h-11 w-full rounded-lg
            border border-slate-800
            bg-slate-950
            px-3.5
            text-sm text-slate-100
            placeholder:text-slate-600
            outline-none
            transition-colors duration-200
            focus:border-cyan-400/50
            focus:ring-1 focus:ring-cyan-400/20
          "
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs font-medium text-slate-400"
        >
          Password
        </label>

        <input
          id="password"
          required
          name="password"
          type="password"
          minLength={mode === 'register' ? 8 : 1}
          autoComplete={
            mode === 'login'
              ? 'current-password'
              : 'new-password'
          }
          placeholder="••••••••"
          className="
            h-11 w-full rounded-lg
            border border-slate-800
            bg-slate-950
            px-3.5
            text-sm text-slate-100
            placeholder:text-slate-600
            outline-none
            transition-colors duration-200
            focus:border-cyan-400/50
            focus:ring-1 focus:ring-cyan-400/20
          "
        />
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="
            rounded-lg
            border border-red-500/20
            bg-red-500/[0.05]
            px-3.5 py-3
            text-xs leading-5 text-red-300
          "
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="
          inline-flex h-11 w-full items-center justify-center gap-2
          rounded-lg
          bg-cyan-400
          px-5
          text-sm font-semibold text-slate-950
          transition-colors duration-200
          hover:bg-cyan-300
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-400/30
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>
              {mode === 'login'
                ? 'Signing in…'
                : 'Creating account…'}
            </span>
          </>
        ) : (
          <>
            <span>
              {mode === 'login'
                ? 'Sign in'
                : 'Create account'}
            </span>

            <ArrowUpRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}