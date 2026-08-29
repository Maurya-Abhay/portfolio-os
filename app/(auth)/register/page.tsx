import { AuthForm } from '@/components/app/auth-form';
import { getRegistrationEnabled } from '@/lib/site-settings';
import Link from 'next/link';
import { ArrowLeft, UserPlus, ArrowRight, ShieldAlert } from 'lucide-react';

export default async function Register() {
  const registrationEnabled = await getRegistrationEnabled();

  return (
    <main className="relative grid min-h-screen place-items-center bg-[#0a0e17] px-5 py-10 text-slate-100 overflow-hidden font-sans">
      
      {/* Premium Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/20 via-blue-500/5 to-transparent blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/15 to-transparent blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b05_1px,transparent_1px),linear-gradient(to_bottom,#1e293b05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-all duration-300 hover:text-cyan-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to portfolio</span>
        </Link>

        {/* Main Card */}
        <div className="group relative">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          {/* Card Container */}
          <div className="relative rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950/80 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:border-cyan-500/40 group-hover:shadow-2xl group-hover:shadow-cyan-500/20">

            {/* Heading with Icon */}
            <div className="space-y-4 mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-500/40 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 text-cyan-400 shadow-lg shadow-cyan-500/20">
                <UserPlus className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Create Account</h1>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  Start your private portfolio OS workspace and take full control of your content.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-8" />

            {/* Content Section */}
            {!registrationEnabled ? (
              <div className="space-y-6">
                {/* Disabled Alert */}
                <div className="rounded-lg border border-amber-500/40 bg-gradient-to-br from-amber-500/15 to-transparent p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-bold text-amber-200">Registration Disabled</p>
                      <p className="text-sm text-amber-100/80 leading-relaxed">
                        The admin has temporarily disabled new user registrations. Please contact the portfolio owner or sign in if you already have an account.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sign In Link */}
                <Link
                  href="/login"
                  className="group/btn flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105 active:scale-100"
                >
                  <span>Go to Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            ) : (
              <>
                {/* Auth Form Component */}
                <div className="mb-8">
                  <AuthForm mode="register" />
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-6" />

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-normal">
                    Already have an account?{' '}
                    <Link 
                      href="/login" 
                      className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors duration-300 inline-flex items-center gap-1 group/link"
                    >
                      Sign in
                      <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* Security Badge */}
            <div className="mt-6 rounded-lg bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 p-3 text-center">
              <p className="text-xs text-emerald-300 font-medium flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Secure & Encrypted
              </p>
            </div>

          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center text-xs text-slate-600 mt-6 font-light">
          Your data is encrypted and protected. We prioritize your privacy and security.
        </p>
      </div>
    </main>
  );
}