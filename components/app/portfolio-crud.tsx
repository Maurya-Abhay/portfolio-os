'use client';

import { useEffect, useState } from 'react';
import { Check, Eye, EyeOff, Pencil, Plus, Star, Trash2, X } from 'lucide-react';

type Kind = 'projects' | 'skills' | 'experience' | 'education' | 'achievements';
type Row = Record<string, any> & { id: string };
type Field = { name: string; label: string; type?: 'date' | 'textarea' | 'url'; required?: boolean };

const cfg: Record<Kind, { title: string; singular: string; fields: Field[] }> = {
  projects: { title: 'Projects', singular: 'project', fields: [
    { name: 'title', label: 'Title', required: true }, { name: 'slug', label: 'Slug', required: true },
    { name: 'description', label: 'Short description', type: 'textarea' }, { name: 'longDescription', label: 'Long description', type: 'textarea' },
    { name: 'githubUrl', label: 'GitHub URL', type: 'url' }, { name: 'liveUrl', label: 'Live URL', type: 'url' }, { name: 'sortOrder', label: 'Order' },
  ] },
  skills: { title: 'Skills', singular: 'skill', fields: [{ name: 'name', label: 'Skill name', required: true }, { name: 'category', label: 'Category' }, { name: 'sortOrder', label: 'Order' }] },
  experience: { title: 'Experience', singular: 'experience', fields: [
    { name: 'company', label: 'Company', required: true }, { name: 'role', label: 'Role', required: true }, { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'startDate', label: 'Start date', type: 'date', required: true }, { name: 'endDate', label: 'End date', type: 'date' },
  ] },
  education: { title: 'Education', singular: 'education', fields: [
    { name: 'institution', label: 'Institution', required: true }, { name: 'degree', label: 'Degree', required: true }, { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'startDate', label: 'Start date', type: 'date' }, { name: 'endDate', label: 'End date', type: 'date' },
  ] },
  achievements: { title: 'Achievements', singular: 'achievement', fields: [{ name: 'title', label: 'Title', required: true }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'url', label: 'URL', type: 'url' }, { name: 'date', label: 'Date', type: 'date' }] },
};

function displayName(row: Row) { return row.title || row.name || row.role || row.degree || row.company || row.institution || 'Untitled record'; }

export function PortfolioCrud({ kind }: { kind: Kind }) {
  const c = cfg[kind];
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Record<string, any>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => { const res = await fetch(`/api/portfolio/${kind}`); const data = res.ok ? await res.json() : []; setRows(Array.isArray(data) ? data : []); };
  useEffect(() => { void load(); }, [kind]);
  const close = () => { setOpen(false); setEditing(null); setForm({}); setError(''); };
  const openNew = () => { setEditing(null); setForm({}); setError(''); setOpen(true); };
  const openEdit = (row: Row) => { setEditing(row.id); setForm(Object.fromEntries(c.fields.map((field) => [field.name, row[field.name] ?? '']))); setOpen(true); };

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    const res = await fetch(`/api/portfolio/${kind}`, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing ? { ...form, id: editing } : form) });
    if (!res.ok) { const data = await res.json().catch(() => null); setError(data?.error || `Could not save ${c.singular}.`); setBusy(false); return; }
    await load(); close(); setBusy(false);
  };

  const updateProject = async (row: Row, changes: Record<string, any>) => { await fetch('/api/portfolio/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...row, ...changes }) }); await load(); };
  const remove = async (row: Row) => { if (!confirm(`Delete ${displayName(row)}?`)) return; await fetch(`/api/portfolio/${kind}?id=${row.id}`, { method: 'DELETE' }); await load(); };

  return <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-5">
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
      <div><h2 className="text-lg font-black text-slate-900 dark:text-white">{c.title}</h2><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{rows.length} {rows.length === 1 ? 'record' : 'records'} in your portfolio</p></div>
      <button type="button" onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-200"><Plus className="size-4" /> Add {c.singular}</button>
    </div>
    <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
      {rows.length === 0 ? <div className="border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No {c.title.toLowerCase()} added yet.</div> : rows.map((row, index) => <div key={row.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-300">{index + 1}</div>
        <div className="min-w-0 flex-1"><p className="break-words text-sm font-bold text-slate-900 dark:text-white">{displayName(row)}</p><p className="mt-0.5 break-words text-xs leading-5 text-slate-500 dark:text-slate-400">{row.description || row.category || row.company || row.institution || 'No description added'}</p></div>
        {kind === 'projects' && <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold"><button type="button" onClick={() => updateProject(row, { published: !row.published })} className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${row.published ? 'border-emerald-200 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}>{row.published ? <Eye className="size-3" /> : <EyeOff className="size-3" />} {row.published ? 'Published' : 'Draft'}</button><button type="button" onClick={() => updateProject(row, { featured: !row.featured })} className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${row.featured ? 'border-amber-200 text-amber-700 dark:border-amber-500/30 dark:text-amber-300' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}><Star className="size-3" /> {row.featured ? 'Featured' : 'Feature'}</button></div>}
        <div className="flex items-center gap-1"><button type="button" onClick={() => openEdit(row)} aria-label={`Edit ${displayName(row)}`} className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300"><Pencil className="size-3.5" /></button><button type="button" onClick={() => remove(row)} aria-label={`Delete ${displayName(row)}`} className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:text-slate-300"><Trash2 className="size-3.5" /></button></div>
      </div>)}
    </div>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800"><div><h3 className="font-black text-slate-900 dark:text-white">{editing ? `Edit ${c.singular}` : `Add ${c.singular}`}</h3><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Update the content shown on your public portfolio.</p></div><button type="button" onClick={close} className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 dark:border-slate-700"><X className="size-4" /></button></div>
      <form onSubmit={save} className="grid gap-4 p-4 md:grid-cols-2">{c.fields.map((field) => <label key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}><span className="mb-1.5 block text-xs font-bold text-slate-600 dark:text-slate-300">{field.label}</span>{field.type === 'textarea' ? <textarea required={field.required} value={form[field.name] ?? ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} className="min-h-24 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950" /> : <input required={field.required} type={field.type || 'text'} value={form[field.name] ?? ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950" />}</label>)}
        {kind === 'projects' && <div className="flex gap-4 md:col-span-2"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.published !== false} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label></div>}
        {error && <p className="text-sm font-semibold text-red-600 md:col-span-2">{error}</p>}<div className="flex justify-end gap-2 border-t border-slate-200 pt-4 md:col-span-2 dark:border-slate-800"><button type="button" onClick={close} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold dark:border-slate-700">Cancel</button><button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 dark:bg-white dark:text-slate-950">{busy ? 'Saving...' : <><Check className="size-4" /> Save {c.singular}</>}</button></div>
      </form>
    </div></div>}
  </section>;
}
