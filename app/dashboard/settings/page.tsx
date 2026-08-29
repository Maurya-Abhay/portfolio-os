import { requireUser } from '@/lib/auth/session';
import { getRegistrationEnabled, setRegistrationEnabled } from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

export default async function Settings() {
  const user = await requireUser();
  const registrationEnabled = await getRegistrationEnabled();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Account</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">Settings</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/80">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</div>
            <div className="mt-2 font-black text-slate-900 dark:text-slate-100">{user.name || 'Not set'}</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/80">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</div>
            <div className="mt-2 break-all font-black text-slate-900 dark:text-slate-100">{user.email}</div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-amber-900 dark:text-amber-200">Registration access</div>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                {registrationEnabled
                  ? 'Public users can create accounts from the register page.'
                  : 'New account creation is currently disabled.'}
              </p>
            </div>

            <form action={async () => {
              'use server';
              await setRegistrationEnabled(!registrationEnabled);
            }}>
              <button
                type="submit"
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  registrationEnabled
                    ? 'bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-amber-600 text-white hover:bg-amber-500'
                }`}
              >
                {registrationEnabled ? 'Disable' : 'Enable'}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          Your private workspace uses secure, server-side authentication and user-scoped data.
        </p>
      </div>
    </div>
  );
}

