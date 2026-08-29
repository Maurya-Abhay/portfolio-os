'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

type Note = { id: string; title: string | null; content: string; updatedAt: string };

export function NotesList({ initial }: { initial: Note[] }) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: '', content: '' });
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => rows.filter((note) => `${note.title || ''} ${note.content}`.toLowerCase().includes(query.toLowerCase())), [rows, query]);
  function begin(note: Note) { setEditing(note.id); setDraft({ title: note.title || '', content: note.content }); }
  async function save(id: string) { const response = await fetch('/api/study/notes', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...draft }) }); if (!response.ok) return; setRows(rows.map((note) => note.id === id ? { ...note, ...draft, updatedAt: new Date().toISOString() } : note)); setEditing(null); }
  async function remove(id: string) { if (!confirm('Delete this note?')) return; const response = await fetch(`/api/study/notes?id=${id}`, { method: 'DELETE' }); if (response.ok) setRows(rows.filter((note) => note.id !== id)); }

  return <div className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="font-black text-slate-900 dark:text-white">Your notes</div><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{rows.length} saved note{rows.length === 1 ? '' : 's'}</p></div>{rows.length > 0 && <div className="relative w-full sm:w-56"><Search className="absolute left-3 top-2.5 size-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes" className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></div>}</div>
    {filtered.length ? <div className="mt-4 space-y-2">{filtered.map((note) => editing === note.id ? <div key={note.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950/60"><input className="input" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Title" /><textarea className="input mt-2 min-h-28" value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} /><div className="mt-2 flex gap-2"><button onClick={() => save(note.id)} className="btn-primary">Save</button><button onClick={() => setEditing(null)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold dark:border-slate-700">Cancel</button></div></div> : <div key={note.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950/60"><div className="flex items-start justify-between gap-3"><div className="font-bold text-slate-900 dark:text-white">{note.title || 'Untitled note'}</div><div className="flex gap-2"><button onClick={() => begin(note)} className="text-xs font-bold text-violet-600 dark:text-violet-300">Edit</button><button onClick={() => remove(note.id)} className="text-xs font-bold text-red-600">Delete</button></div></div><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">{note.content}</p></div>)}</div> : <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{rows.length ? 'No notes match your search.' : 'No notes for this topic yet.'}</p>}
  </div>;
}
