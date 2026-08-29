import { AuthForm } from '@/components/app/auth-form';
import { getRegistrationEnabled } from '@/lib/site-settings';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, UserPlus } from 'lucide-react';

export default async function Register() {
  const registrationEnabled = await getRegistrationEnabled();

  return (
    <main className="relative grid min-h-screen place-items-center bg-[#060911] px-5 py-10 text-slate-100 overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <Link href="/" className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-cyan-400">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to portfolio</span>
        </Link>

        <div className="mt-8">
          <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <UserPlus className="size-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Create Account</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 font-normal">
            Your private portfolio OS workspace starts here.
          </p>
        </div>

        {!registrationEnabled ? (
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-300" />
              <div>
                <p className="font-bold">Registration is temporarily disabled.</p>
                <p className="mt-1 text-amber-100/80">
                  Admin has blocked new user creation. Please contact the admin or sign in if you already have an account.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <AuthForm mode="register" />
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-cyan-400 transition-colors hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}