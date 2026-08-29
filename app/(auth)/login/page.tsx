import { AuthForm } from '@/components/app/auth-form';
import Link from 'next/link';
import { ArrowLeft, Terminal, Lock } from 'lucide-react';

export default function Login() {
  return (
    <main className="relative grid min-h-screen place-items-center bg-[#060911] px-5 py-10 text-slate-100 overflow-hidden font-sans">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-cyan-400"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> 
          <span>Back to portfolio</span>
        </Link>

        {/* Heading & Icon */}
        <div className="mt-8">
          <div className="inline-flex size-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 mb-4">
            <Lock className="size-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Admin Access</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 font-normal">
            Authenticate to manage your private portfolio workspace.
          </p>
        </div>

        {/* Auth Form Component */}
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>

        {/* Register / Footer Link */}
        <p className="mt-6 text-center text-xs text-slate-500">
          New here?{' '}
          <Link href="/register" className="font-bold text-cyan-400 transition-colors hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </main>
  );
}