import { AuthForm } from '@/components/app/auth-form';
import { getRegistrationEnabled } from '@/lib/site-settings';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldAlert,
  UserPlus,
} from 'lucide-react';

export default async function Register() {
  const registrationEnabled = await getRegistrationEnabled();

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#080b11] px-5 py-10 text-slate-100">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.045),transparent_30%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.018)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="w-full max-w-[400px]">
        {/* Back */}
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to portfolio
        </Link>

        {/* Main panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl sm:p-7">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-cyan-400">
              <UserPlus className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Admin
              </p>

              <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.025em] text-white">
                Create account
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Set up access to manage your portfolio.
              </p>
            </div>
          </div>

          {/* Registration state */}
          {!registrationEnabled ? (
            <div className="mt-7">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

                  <div>
                    <p className="text-sm font-medium text-amber-200">
                      Registration is currently unavailable.
                    </p>

                    <p className="mt-1.5 text-xs leading-6 text-amber-100/60">
                      New accounts are not being accepted right now. Sign in
                      with an existing account or contact the portfolio owner.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/login"
                className="group mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
              >
                Sign in
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : (
            <>
              {/* Form */}
              <div className="mt-7">
                <AuthForm mode="register" />
              </div>

              {/* Login link */}
              <div className="mt-6 border-t border-slate-800 pt-5">
                <p className="text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="group inline-flex items-center gap-1 font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                  >
                    Sign in
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Small footer */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-600">
          <span>Portfolio admin</span>
          <span className="text-slate-800">•</span>
          <span>Account access</span>
        </div>
      </div>
    </main>
  );
}