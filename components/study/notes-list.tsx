'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

type Note = {
  id: string;
  title: string | null;
  content: string;
  updatedAt: string;
};

export function NotesList({
  initial,
}: {
  initial: Note[];
}) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    title: '',
    content: '',
  });
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return rows;

    return rows.filter((note) =>
      `${note.title || ''} ${note.content}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [rows, query]);

  function begin(note: Note) {
    setEditing(note.id);
    setDraft({
      title: note.title || '',
      content: note.content,
    });
    setError('');
  }

  function cancelEdit() {
    setEditing(null);
    setDraft({
      title: '',
      content: '',
    });
    setError('');
  }

  async function save(id: string) {
    if (!draft.content.trim()) return;

    setBusy(true);
    setError('');

    try {
      const response = await fetch('/api/study/notes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: draft.title.trim(),
          content: draft.content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      setRows((current) =>
        current.map((note) =>
          note.id === id
            ? {
                ...note,
                title: draft.title.trim(),
                content: draft.content.trim(),
                updatedAt: new Date().toISOString(),
              }
            : note,
        ),
      );

      cancelEdit();
    } catch {
      setError('Could not update this note.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this note?')) return;

    setBusy(true);
    setError('');

    try {
      const response = await fetch(`/api/study/notes?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setRows((current) =>
        current.filter((note) => note.id !== id),
      );

      if (editing === id) {
        cancelEdit();
      }
    } catch {
      setError('Could not delete this note.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Your notes
          </p>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {rows.length} saved note{rows.length === 1 ? '' : 's'}
          </p>
        </div>

        {rows.length > 0 && (
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes"
              aria-label="Search notes"
              className="h-9 w-full border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="border-b border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400">
          {error}
        </p>
      )}

      {filtered.length > 0 ? (
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {filtered.map((note) =>
            editing === note.id ? (
              <div key={note.id} className="p-4">
                <input
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Title"
                  className="h-10 w-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />

                <textarea
                  value={draft.content}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      content: event.target.value,
                    }))
                  }
                  rows={6}
                  className="mt-2 w-full resize-y border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-900 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy || !draft.content.trim()}
                    onClick={() => save(note.id)}
                    className="inline-flex h-9 items-center rounded-md bg-slate-900 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-40 dark:bg-white dark:text-slate-950"
                  >
                    {busy ? 'Saving…' : 'Save changes'}
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={cancelEdit}
                    className="inline-flex h-9 items-center rounded-md border border-slate-200 px-3.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <article key={note.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {note.title || 'Untitled note'}
                    </h3>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Updated{' '}
                      {new Date(note.updatedAt).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        },
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => begin(note)}
                      className="text-xs font-medium text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => remove(note.id)}
                      className="text-xs font-medium text-slate-500 transition-colors hover:text-red-600 disabled:opacity-40 dark:text-slate-400 dark:hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {note.content}
                </p>
              </article>
            ),
          )}
        </div>
      ) : (
        <p className="px-4 py-5 text-sm text-slate-500 dark:text-slate-400">
          {rows.length
            ? 'No notes match your search.'
            : 'No notes for this topic yet.'}
        </p>
      )}
    </div>
  );
}