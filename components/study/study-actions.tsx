'use client';

import { useState } from 'react';

type ProgressStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export function ProgressButton({
  topicId,
  initialStatus,
}: {
  topicId: string;
  initialStatus: ProgressStatus;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [busy, setBusy] = useState(false);

  async function update(next: ProgressStatus) {
    setBusy(true);

    try {
      const response = await fetch('/api/study/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId,
          status: next,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      setStatus(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== 'IN_PROGRESS' && status !== 'COMPLETED' && (
        <button
          type="button"
          disabled={busy}
          onClick={() => update('IN_PROGRESS')}
          className="inline-flex h-9 items-center rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900 dark:hover:text-white"
        >
          {busy ? 'Updating…' : 'Start'}
        </button>
      )}

      {status === 'IN_PROGRESS' && (
        <button
          type="button"
          disabled={busy}
          onClick={() => update('COMPLETED')}
          className="inline-flex h-9 items-center rounded-md bg-cyan-500 px-3 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Updating…' : 'Mark complete'}
        </button>
      )}

      {status === 'COMPLETED' && (
        <button
          type="button"
          disabled={busy}
          onClick={() => update('NOT_STARTED')}
          className="inline-flex h-9 items-center rounded-md border border-emerald-200 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
        >
          Completed
        </button>
      )}

      {status !== 'NOT_STARTED' && (
        <button
          type="button"
          disabled={busy}
          onClick={() => update('NOT_STARTED')}
          className="inline-flex h-9 items-center rounded-md px-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-red-400"
        >
          Reset
        </button>
      )}
    </div>
  );
}

export function NoteBox({
  topicId,
}: {
  topicId: string;
}) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    if (!content.trim()) return;

    setBusy(true);
    setDone(false);
    setError('');

    try {
      const response = await fetch('/api/study/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId,
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      setContent('');
      setTitle('');
      setDone(true);
    } catch {
      setError('Could not save the note. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-slate-200 dark:border-slate-800">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Add a note
        </p>

        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Capture something worth remembering from this topic.
        </p>
      </div>

      <div className="p-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Optional title"
          className="h-10 w-full border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400"
        />

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write what you want to remember..."
          rows={5}
          className="mt-3 w-full resize-y border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-400"
        />

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5">
            {done && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Note saved.
              </p>
            )}

            {error && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={save}
            disabled={busy || !content.trim()}
            className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {busy ? 'Saving…' : 'Save note'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TargetForm() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    if (!title.trim()) return;

    setBusy(true);
    setDone(false);
    setError('');

    try {
      const response = await fetch('/api/study/targets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          dueDate: dueDate || null,
          type: 'STUDY',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save target');
      }

      setTitle('');
      setDueDate('');
      setDone(true);
    } catch {
      setError('Could not add the target. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Set a study target
        </p>

        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Give yourself a concrete outcome and, optionally, a deadline.
        </p>
      </div>

      <div className="p-4">
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_160px_auto]">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Finish JavaScript fundamentals"
            className="h-10 min-w-0 border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="h-10 border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={save}
            disabled={busy || !title.trim()}
            className="h-10 rounded-md bg-slate-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {busy ? 'Saving…' : 'Add target'}
          </button>
        </div>

        <div className="mt-2 min-h-5">
          {done && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Target saved.
            </p>
          )}

          {error && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}