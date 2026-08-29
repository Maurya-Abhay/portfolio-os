import { AuthForm } from '@/components/app/auth-form';
import Link from 'next/link';
import { ArrowLeft, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
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
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Admin Access</h1>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  Authenticate to manage your private portfolio workspace and content.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-8" />

            {/* Auth Form Component */}
            <div className="mb-8">
              <AuthForm mode="login" />
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-6" />

            {/* Register Link */}
            <div className="text-center">
              <p className="text-xs text-slate-500 font-normal">
                New here?{' '}
                <Link 
                  href="/register" 
                  className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors duration-300 inline-flex items-center gap-1 group/link"
                >
                  Create an account
                  <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                </Link>
              </p>
            </div>

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
          Your login credentials are encrypted and secure. We never share your data.
        </p>
      </div>
    </main>
  );
}