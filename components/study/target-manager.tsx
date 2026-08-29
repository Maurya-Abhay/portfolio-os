'use client';

import { useEffect, useState } from 'react';

type Target = { id: string; title: string; type: string; dueDate: string | null; status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' };

const button = 'rounded-md px-2 py-1 text-xs font-bold transition hover:bg-slate-200 dark:hover:bg-slate-700';

export function TargetManager() {
  const [rows, setRows] = useState<Target[]>([]);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => { fetch('/api/study/targets').then((r) => r.json()).then((value) => Array.isArray(value) && setRows(value)); }, []);

  async function save() {
    if (!title.trim()) return;
    setBusy(true);
    const body = { title, type: 'STUDY', dueDate: due ? new Date(`${due}T12:00:00`).toISOString() : null, status: 'NOT_STARTED' };
    const response = await fetch(`/api/study/targets${editing ? `?id=${editing}` : ''}`, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing ? { ...body, id: editing } : body) });
    if (response.ok) {
      const value = await response.json();
      setRows(editing ? rows.map((target) => target.id === editing ? value : target) : [value, ...rows]);
      setEditing(null); setTitle(''); setDue('');
    }
    setBusy(false);
  }

  async function toggle(target: Target) {
    const status = target.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    const response = await fetch('/api/study/targets', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: target.id, title: target.title, type: target.type, dueDate: target.dueDate, status }) });
    if (response.ok) { const value = await response.json(); setRows(rows.map((item) => item.id === target.id ? value : item)); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this target?')) return;
    const response = await fetch(`/api/study/targets?id=${id}`, { method: 'DELETE' });
    if (response.ok) setRows(rows.filter((target) => target.id !== id));
  }

  function edit(target: Target) { setEditing(target.id); setTitle(target.title); setDue(target.dueDate ? new Date(target.dueDate).toISOString().slice(0, 10) : ''); }

  return <div className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
    <div className="flex items-center justify-between"><div className="font-black text-slate-900 dark:text-white">Study targets</div><span className="text-xs text-slate-500 dark:text-slate-400">{rows.length} total</span></div>
    <div className="mt-3 grid gap-2 md:grid-cols-[1fr_160px_auto]">
      <input className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" placeholder="Finish JavaScript fundamentals" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
      <button onClick={save} disabled={busy || !title.trim()} className="h-10 rounded-lg bg-slate-950 px-4 text-xs font-bold text-white disabled:opacity-50 dark:bg-white dark:text-slate-950">{editing ? 'Save target' : 'Add target'}</button>
    </div>
    {editing && <button onClick={() => { setEditing(null); setTitle(''); setDue(''); }} className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-300">Cancel edit</button>}
    <div className="mt-4 space-y-2">{rows.length ? rows.map((target) => <div key={target.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/60"><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold text-slate-900 dark:text-white">{target.title}</div><div className="text-xs text-slate-500 dark:text-slate-400">{target.dueDate ? new Date(target.dueDate).toLocaleDateString() : 'No due date'} · {target.status.replace('_', ' ').toLowerCase()}</div></div><button onClick={() => toggle(target)} className={`${button} text-blue-600 dark:text-blue-300`}>{target.status === 'COMPLETED' ? 'Reopen' : 'Complete'}</button><button onClick={() => edit(target)} className={`${button} text-slate-600 dark:text-slate-300`}>Edit</button><button onClick={() => remove(target.id)} className={`${button} text-red-600 dark:text-red-300`}>Delete</button></div>) : <p className="py-3 text-sm text-slate-500 dark:text-slate-400">No targets yet.</p>}</div>
  </div>;
}
