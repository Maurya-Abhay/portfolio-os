'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from 'lucide-react';

type Kind =
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'achievements';

type Row = Record<string, any> & {
  id: string;
};

type Field = {
  name: string;
  label: string;
  type?: 'date' | 'textarea' | 'url';
  required?: boolean;
};

const cfg: Record<
  Kind,
  {
    title: string;
    singular: string;
    fields: Field[];
  }
> = {
  projects: {
    title: 'Projects',
    singular: 'project',
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'slug', label: 'Slug', required: true },
      {
        name: 'description',
        label: 'Short description',
        type: 'textarea',
      },
      {
        name: 'longDescription',
        label: 'Long description',
        type: 'textarea',
      },
      {
        name: 'githubUrl',
        label: 'GitHub URL',
        type: 'url',
      },
      {
        name: 'liveUrl',
        label: 'Live URL',
        type: 'url',
      },
      { name: 'sortOrder', label: 'Order' },
    ],
  },

  skills: {
    title: 'Skills',
    singular: 'skill',
    fields: [
      {
        name: 'name',
        label: 'Skill name',
        required: true,
      },
      {
        name: 'category',
        label: 'Category',
      },
      {
        name: 'sortOrder',
        label: 'Order',
      },
    ],
  },

  experience: {
    title: 'Experience',
    singular: 'experience',
    fields: [
      {
        name: 'company',
        label: 'Company',
        required: true,
      },
      {
        name: 'role',
        label: 'Role',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
      },
      {
        name: 'startDate',
        label: 'Start date',
        type: 'date',
        required: true,
      },
      {
        name: 'endDate',
        label: 'End date',
        type: 'date',
      },
    ],
  },

  education: {
    title: 'Education',
    singular: 'education',
    fields: [
      {
        name: 'institution',
        label: 'Institution',
        required: true,
      },
      {
        name: 'degree',
        label: 'Degree',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
      },
      {
        name: 'startDate',
        label: 'Start date',
        type: 'date',
      },
      {
        name: 'endDate',
        label: 'End date',
        type: 'date',
      },
    ],
  },

  achievements: {
    title: 'Achievements',
    singular: 'achievement',
    fields: [
      {
        name: 'title',
        label: 'Title',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
      },
      {
        name: 'url',
        label: 'URL',
        type: 'url',
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
      },
    ],
  },
};

function displayName(row: Row) {
  return (
    row.title ||
    row.name ||
    row.role ||
    row.degree ||
    row.company ||
    row.institution ||
    'Untitled record'
  );
}

function displaySecondary(row: Row) {
  return (
    row.description ||
    row.category ||
    row.company ||
    row.institution ||
    row.role ||
    'No description added'
  );
}

function formatDate(value: unknown) {
  if (!value) return '';

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
}

function inputValue(value: unknown) {
  if (value === null || value === undefined) return '';

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
}

export function PortfolioCrud({ kind }: { kind: Kind }) {
  const c = cfg[kind];

  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Record<string, any>>({});
  const [editing, setEditing] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  const load = async () => {
    setLoading(true);
    setLoadError('');

    try {
      const res = await fetch(`/api/portfolio/${kind}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Could not load portfolio data.');
      }

      const data = await res.json();

      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
      setLoadError(`Could not load your ${c.title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [kind]);

  const close = () => {
    if (busy) return;

    setOpen(false);
    setEditing(null);
    setForm({});
    setError('');
  };

  const openNew = () => {
    setEditing(null);
    setForm({
      published: true,
      featured: false,
    });
    setError('');
    setOpen(true);
  };

  const openEdit = (row: Row) => {
    const nextForm: Record<string, any> = {};

    c.fields.forEach((field) => {
      nextForm[field.name] = inputValue(row[field.name]);
    });

    if (kind === 'projects') {
      nextForm.published = row.published !== false;
      nextForm.featured = Boolean(row.featured);
    }

    setEditing(row.id);
    setForm(nextForm);
    setError('');
    setOpen(true);
  };

  const updateField = (name: string, value: any) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (busy) return;

    setBusy(true);
    setError('');

    try {
      const payload = editing
        ? {
            ...form,
            id: editing,
          }
        : form;

      const res = await fetch(`/api/portfolio/${kind}`, {
        method: editing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          data?.error ||
            `Could not save ${c.singular}.`,
        );
        return;
      }

      await load();
      close();
    } catch {
      setError(
        `Could not save ${c.singular}. Please try again.`,
      );
    } finally {
      setBusy(false);
    }
  };

  const updateProject = async (
    row: Row,
    changes: Record<string, any>,
  ) => {
    try {
      const res = await fetch('/api/portfolio/projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...row,
          ...changes,
        }),
      });

      if (!res.ok) {
        throw new Error('Could not update project.');
      }

      await load();
    } catch {
      setLoadError('Could not update the project.');
    }
  };

  const remove = async (row: Row) => {
    const name = displayName(row);

    if (!window.confirm(`Delete ${name}?`)) {
      return;
    }

    try {
      const res = await fetch(
        `/api/portfolio/${kind}?id=${encodeURIComponent(row.id)}`,
        {
          method: 'DELETE',
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        setLoadError(
          data?.error ||
            `Could not delete ${c.singular}.`,
        );

        return;
      }

      await load();
    } catch {
      setLoadError(
        `Could not delete ${c.singular}. Please try again.`,
      );
    }
  };

  return (
    <>
      <section>
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-baseline gap-3">
              <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                {c.title}
              </h2>

              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {rows.length}{' '}
                {rows.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Manage the {c.title.toLowerCase()} shown on your public
              portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={openNew}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-slate-900 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Add {c.singular}
          </button>
        </div>

        {/* Error */}
        {loadError && (
          <div className="mt-4 flex items-center justify-between gap-4 border-l-2 border-red-500 bg-red-50 px-3 py-2.5 dark:bg-red-950/20">
            <p className="text-xs text-red-700 dark:text-red-300">
              {loadError}
            </p>

            <button
              type="button"
              onClick={() => void load()}
              className="shrink-0 text-xs font-semibold text-red-700 underline underline-offset-2 dark:text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        <div className="mt-1">
          {loading ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 py-4"
                >
                  <div className="h-7 w-7 shrink-0 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3.5 w-40 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-3 w-64 max-w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                No {c.title.toLowerCase()} yet.
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Add your first {c.singular} to get started.
              </p>

              <button
                type="button"
                onClick={openNew}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400"
              >
                <Plus className="h-3.5 w-3.5" />
                Add {c.singular}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="group flex flex-col gap-3 py-4 sm:flex-row sm:items-center"
                >
                  {/* Index */}
                  <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 text-[10px] font-semibold text-slate-400 sm:flex dark:border-slate-800 dark:text-slate-500">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Main information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="min-w-0 truncate text-sm font-medium text-slate-900 dark:text-white">
                        {displayName(row)}
                      </p>

                      {kind === 'experience' &&
                        row.startDate && (
                          <span className="hidden shrink-0 text-[10px] text-slate-400 md:inline">
                            {formatDate(row.startDate)}
                            {row.endDate
                              ? ` — ${formatDate(row.endDate)}`
                              : ' — Present'}
                          </span>
                        )}

                      {kind === 'education' &&
                        row.startDate && (
                          <span className="hidden shrink-0 text-[10px] text-slate-400 md:inline">
                            {formatDate(row.startDate)}
                            {row.endDate
                              ? ` — ${formatDate(row.endDate)}`
                              : ''}
                          </span>
                        )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {displaySecondary(row)}
                    </p>
                  </div>

                  {/* Project controls */}
                  {kind === 'projects' && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          void updateProject(row, {
                            published: !row.published,
                          })
                        }
                        className={[
                          'inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[10px] font-semibold transition-colors',
                          row.published
                            ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/10'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900',
                        ].join(' ')}
                      >
                        {row.published ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}

                        {row.published ? 'Published' : 'Draft'}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void updateProject(row, {
                            featured: !row.featured,
                          })
                        }
                        className={[
                          'inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[10px] font-semibold transition-colors',
                          row.featured
                            ? 'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-900',
                        ].join(' ')}
                      >
                        <Star className="h-3 w-3" />
                        {row.featured ? 'Featured' : 'Feature'}
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      aria-label={`Edit ${displayName(row)}`}
                      className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-900 dark:hover:text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => void remove(row)}
                      aria-label={`Delete ${displayName(row)}`}
                      className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/30 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-crud-title"
        >
          <button
            type="button"
            aria-label="Close dialog"
            onClick={close}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
            {/* Modal header */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
                  Portfolio
                </p>

                <h3
                  id="portfolio-crud-title"
                  className="mt-1 text-base font-semibold text-slate-900 dark:text-white"
                >
                  {editing
                    ? `Edit ${c.singular}`
                    : `Add ${c.singular}`}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Update the information shown on your public portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={close}
                disabled={busy}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={save}
              className="min-h-0 overflow-y-auto"
            >
              <div className="grid gap-x-5 gap-y-4 p-5 sm:grid-cols-2">
                {c.fields.map((field) => {
                  const fullWidth =
                    field.type === 'textarea';

                  return (
                    <label
                      key={field.name}
                      className={
                        fullWidth ? 'sm:col-span-2' : ''
                      }
                    >
                      <span className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                        {field.label}
                        {field.required && (
                          <span className="ml-1 text-red-500">
                            *
                          </span>
                        )}
                      </span>

                      {field.type === 'textarea' ? (
                        <textarea
                          required={field.required}
                          value={form[field.name] ?? ''}
                          onChange={(event) =>
                            updateField(
                              field.name,
                              event.target.value,
                            )
                          }
                          rows={5}
                          className="w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"
                        />
                      ) : (
                        <input
                          required={field.required}
                          type={field.type || 'text'}
                          value={form[field.name] ?? ''}
                          onChange={(event) =>
                            updateField(
                              field.name,
                              event.target.value,
                            )
                          }
                          placeholder={
                            field.type === 'url'
                              ? 'https://...'
                              : undefined
                          }
                          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-600"
                        />
                      )}
                    </label>
                  );
                })}

                {/* Project flags */}
                {kind === 'projects' && (
                  <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:col-span-2 sm:flex-row dark:border-slate-800">
                    <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={form.published !== false}
                        onChange={(event) =>
                          updateField(
                            'published',
                            event.target.checked,
                          )
                        }
                        className="h-3.5 w-3.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-700"
                      />
                      Published
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={Boolean(form.featured)}
                        onChange={(event) =>
                          updateField(
                            'featured',
                            event.target.checked,
                          )
                        }
                        className="h-3.5 w-3.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-slate-700"
                      />
                      Featured
                    </label>
                  </div>
                )}

                {/* Form error */}
                {error && (
                  <div className="border-l-2 border-red-500 bg-red-50 px-3 py-2.5 sm:col-span-2 dark:bg-red-950/20">
                    <p className="text-xs leading-5 text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-950">
                <button
                  type="button"
                  onClick={close}
                  disabled={busy}
                  className="h-9 rounded-md border border-slate-200 px-3.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-900 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {busy ? (
                    'Saving...'
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Save {c.singular}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}