export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-4" aria-label="Loading dashboard">
      <div className="h-28 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-32 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-32 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
        <div className="h-32 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
      </div>
      <div className="h-48 rounded-xl bg-slate-200/80 dark:bg-slate-800/80" />
    </div>
  );
}