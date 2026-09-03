'use client';

import { useEffect, useState } from 'react';

type Target = {
  id: string;
  title: string;
  type: string;
  dueDate: string | null;
  status:
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'COMPLETED';
};

const formatDate = (value: string | null) => {
  if (!value) return 'No due date';

  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const statusLabel = (status: Target['status']) =>
  status
    .replaceAll('_', ' ')
    .toLowerCase();

export function TargetManager() {
  const [rows, setRows] = useState<Target[]>([]);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetch('/api/study/targets', {
      cache: 'no-store',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((value) => {
        if (!cancelled && Array.isArray(value)) {
          setRows(value);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load study targets.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function resetForm() {
    setEditing(null);
    setTitle('');
    setDue('');
  }

  async function save() {
    if (!title.trim()) return;

    setBusy(true);
    setError('');

    const body = {
      title: title.trim(),
      type: 'STUDY',
      dueDate: due
        ? new Date(`${due}T12:00:00`).toISOString()
        : null,
      status: 'NOT_STARTED',
    };

    try {
      const response = await fetch(
        `/api/study/targets${editing ? `?id=${editing}` : ''}`,
        {
          method: editing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            editing
              ? {
                  ...body,
                  id: editing,
                }
              : body,
          ),
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      const value = await response.json();

      setRows((current) =>
        editing
          ? current.map((target) =>
              target.id === editing ? value : target,
            )
          : [value, ...current],
      );

      resetForm();
    } catch {
      setError(
        editing
          ? 'Could not update this target.'
          : 'Could not add this target.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggle(target: Target) {
    const status =
      target.status === 'COMPLETED'
        ? 'IN_PROGRESS'
        : 'COMPLETED';

    try {
      const response = await fetch('/api/study/targets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: target.id,
          title: target.title,
          type: target.type,
          dueDate: target.dueDate,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const value = await response.json();

      setRows((current) =>
        current.map((item) =>
          item.id === target.id ? value : item,
        ),
      );
    } catch {
      setError('Could not update this target.');
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this target?')) return;

    try {
      const response = await fetch(
        `/api/study/targets?id=${id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      setRows((current) =>
        current.filter((target) => target.id !== id),
      );

      if (editing === id) {
        resetForm();
      }
    } catch {
      setError('Could not delete this target.');
    }
  }

  function edit(target: Target) {
    setEditing(target.id);
    setTitle(target.title);

    setDue(
      target.dueDate
        ? new Date(target.dueDate)
            .toISOString()
            .slice(0, 10)
        : '',
    );

    setError('');
  }

  return (
    <div className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Study targets
          </p>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {rows.length} target{rows.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="p-4">
        {error && (
          <p className="mb-3 text-xs font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_160px_auto]">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Finish JavaScript fundamentals"
            className="h-10 min-w-0 border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400"
          />

          <input
            type="date"
            value={due}
            onChange={(event) => setDue(event.target.value)}
            className="h-10 border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={save}
            disabled={busy || !title.trim()}
            className="h-10 rounded-md bg-slate-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {busy
              ? 'Saving…'
              : editing
                ? 'Save target'
                : 'Add target'}
          </button>
        </div>

        {editing && (
          <button
            type="button"
            onClick={resetForm}
            className="mt-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel edit
          </button>
        )}

        <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {rows.length > 0 ? (
            rows.map((target) => (
              <div
                key={target.id}
                className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {target.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(target.dueDate)}
                    {' · '}
                    {statusLabel(target.status)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggle(target)}
                    className="text-xs font-medium text-cyan-600 transition-colors hover:text-cyan-500 dark:text-cyan-400"
                  >
                    {target.status === 'COMPLETED'
                      ? 'Reopen'
                      : 'Complete'}
                  </button>

                  <button
                    type="button"
                    onClick={() => edit(target)}
                    className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(target.id)}
                    className="text-xs font-medium text-slate-500 transition-colors hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-sm text-slate-500 dark:text-slate-400">
              No targets yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}