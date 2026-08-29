import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-500">404</p>
      <h1 className="mt-3 text-4xl font-black">Page not found</h1>
      <p className="mt-3 text-slate-500">The page you requested does not exist.</p>
      <Link href="/" className="mt-7 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Back home</Link>
    </main>
  );
}
