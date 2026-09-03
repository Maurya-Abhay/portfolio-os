import { requireUser } from '@/lib/auth/session';
import {
  getRegistrationEnabled,
  setRegistrationEnabled,
} from '@/lib/site-settings';

export const dynamic = 'force-dynamic';

export default async function Settings() {
  const user = await requireUser();
  const registrationEnabled = await getRegistrationEnabled();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
            Account
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Settings
          </h1>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Manage account information and public registration access.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          {/* Account details */}
          <section>
            <div className="mb-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Account details
              </h2>
            </div>

            <div className="grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-800">
              <div className="bg-white p-4 dark:bg-slate-950">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                  Name
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user.name || 'Not set'}
                </p>
              </div>

              <div className="bg-white p-4 dark:bg-slate-950">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                  Email
                </p>

                <p className="mt-2 break-all text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user.email}
                </p>
              </div>
            </div>
          </section>

          {/* Registration */}
          <section className="mt-7">
            <div className="mb-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Registration
              </h2>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        registrationEnabled
                          ? 'bg-emerald-500'
                          : 'bg-slate-400 dark:bg-slate-600'
                      }`}
                    />

                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {registrationEnabled
                        ? 'Registration is enabled'
                        : 'Registration is disabled'}
                    </p>
                  </div>

                  <p className="mt-1.5 max-w-xl text-xs leading-6 text-slate-500 dark:text-slate-400">
                    {registrationEnabled
                      ? 'Visitors can create a new account from the registration page.'
                      : 'New account creation is currently unavailable.'}
                  </p>
                </div>

                <form
                  action={async () => {
                    'use server';

                    await setRegistrationEnabled(
                      !registrationEnabled,
                    );
                  }}
                  className="shrink-0"
                >
                  <button
                    type="submit"
                    className="
                      inline-flex h-9 min-w-[88px]
                      items-center justify-center
                      rounded-md
                      border border-slate-300
                      bg-white
                      px-3.5
                      text-xs font-semibold
                      text-slate-700
                      transition-colors
                      hover:border-slate-400
                      hover:bg-slate-50
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-slate-200
                      dark:hover:border-slate-600
                      dark:hover:bg-slate-800
                    "
                  >
                    {registrationEnabled ? 'Disable' : 'Enable'}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Note */}
          <div className="mt-7 border-t border-slate-200 pt-5 dark:border-slate-800">
            <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
              Changes to registration affect whether new users can create
              accounts through the public registration page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}