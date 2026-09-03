export default function DashboardLoading() {
  return (
    <div
      className="mx-auto max-w-7xl animate-pulse space-y-6"
      aria-label="Loading dashboard"
    >
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 h-8 w-72 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="h-28 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" />
        <div className="h-28 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" />
        <div className="h-28 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" />
      </div>

      <div className="h-64 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" />
    </div>
  );
}