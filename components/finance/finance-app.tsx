"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Pencil,
  Plus,
  Search,
  Trash2,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type C = { id: string; name: string; type: "INCOME" | "EXPENSE" };
type T = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: string | number;
  description?: string | null;
  date: string;
  paymentMethod?: string | null;
  category?: C | null;
};
type B = {
  id: string;
  amount: string | number;
  month: number;
  year: number;
  category?: C | null;
};
const colors = [
  "#2563eb",
  "#8b5cf6",
  "#f97316",
  "#10b981",
  "#e11d48",
  "#64748b",
];
const today = () => new Date().toISOString().slice(0, 10);
const cents = (value: string | number) => Math.round(Number(value) * 100);
const money = (value: number) =>
  `₹${(value / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const monthName = (date: Date) =>
  date.toLocaleDateString("en-IN", { month: "short" });

export function FinanceApp() {
  const [tx, setTx] = useState<T[]>([]);
  const [cats, setCats] = useState<C[]>([]);
  const [budgets, setBudgets] = useState<B[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [modal, setModal] = useState<"transaction" | "budget" | null>(null);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("date-desc");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [form, setForm] = useState({
    type: "EXPENSE",
    amount: "",
    categoryId: "",
    description: "",
    date: today(),
    paymentMethod: "",
  });
  const [budgetForm, setBudgetForm] = useState({
    amount: "",
    categoryId: "",
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
  });

  async function load() {
    setLoading(true);
    try {
      const responses = await Promise.all(
        [
          "/api/finance/transactions",
          "/api/finance/categories",
          "/api/finance/budgets",
        ].map((url) => fetch(url)),
      );
      const [transactions, categories, budgetRows] = await Promise.all(
        responses.map((response) => response.json()),
      );
      setTx(Array.isArray(transactions) ? transactions : []);
      setCats(Array.isArray(categories) ? categories : []);
      setBudgets(Array.isArray(budgetRows) ? budgetRows : []);
    } catch {
      setMessage("Unable to load finance data.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  const totals = useMemo(
    () =>
      tx.reduce(
        (result, item) => {
          const value = cents(item.amount);
          item.type === "INCOME"
            ? (result.income += value)
            : (result.expense += value);
          return result;
        },
        { income: 0, expense: 0 },
      ),
    [tx],
  );
  const visible = useMemo(
    () =>
      tx
        .filter(
          (item) =>
            (type === "ALL" || item.type === type) &&
            (category === "ALL" || item.category?.id === category) &&
            (!from || item.date >= from) &&
            (!to || item.date <= `${to}T23:59:59`) &&
            `${item.description || ""} ${item.category?.name || ""} ${item.paymentMethod || ""}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "amount-desc"
            ? cents(b.amount) - cents(a.amount)
            : sort === "amount-asc"
              ? cents(a.amount) - cents(b.amount)
              : sort === "date-asc"
                ? new Date(a.date).getTime() - new Date(b.date).getTime()
                : new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    [tx, type, category, from, to, query, sort],
  );
  const current = new Date();
  const currentBudgets = budgets.filter(
    (item) =>
      item.month === current.getMonth() + 1 &&
      item.year === current.getFullYear(),
  );
  const monthly = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const date = new Date(
          current.getFullYear(),
          current.getMonth() - 5 + index,
          1,
        );
        const rows = tx.filter((item) => {
          const itemDate = new Date(item.date);
          return (
            itemDate.getFullYear() === date.getFullYear() &&
            itemDate.getMonth() === date.getMonth()
          );
        });
        return {
          month: monthName(date),
          income:
            rows
              .filter((item) => item.type === "INCOME")
              .reduce((sum, item) => sum + cents(item.amount), 0) / 100,
          expense:
            rows
              .filter((item) => item.type === "EXPENSE")
              .reduce((sum, item) => sum + cents(item.amount), 0) / 100,
        };
      }),
    [tx],
  );
  const spending = useMemo(() => {
    const map = new Map<string, number>();
    tx.filter((item) => item.type === "EXPENSE").forEach((item) =>
      map.set(
        item.category?.name || "Other",
        (map.get(item.category?.name || "Other") || 0) + cents(item.amount),
      ),
    );
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value: value / 100 }));
  }, [tx]);
  const budgetRows = currentBudgets.map((budget) => {
    const spent = tx
      .filter(
        (item) =>
          item.type === "EXPENSE" &&
          (!budget.category || item.category?.id === budget.category.id) &&
          new Date(item.date).getMonth() === current.getMonth() &&
          new Date(item.date).getFullYear() === current.getFullYear(),
      )
      .reduce((sum, item) => sum + cents(item.amount), 0);
    const amount = cents(budget.amount);
    return {
      ...budget,
      amount,
      spent,
      remaining: amount - spent,
      percent: amount ? Math.round((spent / amount) * 100) : 0,
    };
  });

  async function saveTransaction(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch(
      editing
        ? `/api/finance/transactions/${editing}`
        : "/api/finance/transactions",
      {
        method: editing ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          categoryId: form.categoryId || null,
        }),
      },
    );
    if (!response.ok) {
      setMessage(
        (await response.json().catch(() => ({}))).error ||
          "Could not save transaction.",
      );
      return;
    }
    setEditing(null);
    setModal(null);
    setForm({
      type: "EXPENSE",
      amount: "",
      categoryId: "",
      description: "",
      date: today(),
      paymentMethod: "",
    });
    await load();
  }
  async function removeTransaction(id: string) {
    if (!confirm("Delete this transaction?")) return;
    await fetch(`/api/finance/transactions/${id}`, { method: "DELETE" });
    await load();
  }
  async function saveBudget(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/finance/budgets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...budgetForm,
        amount: Number(budgetForm.amount),
        month: Number(budgetForm.month),
        year: Number(budgetForm.year),
        categoryId: budgetForm.categoryId || null,
      }),
    });
    if (!response.ok)
      setMessage(
        (await response.json().catch(() => ({}))).error ||
          "Could not save budget.",
      );
    else {
      setBudgetForm({ ...budgetForm, amount: "" });
      setModal(null);
      await load();
    }
  }

  if (loading)
    return (
      <div className="mx-auto max-w-6xl text-sm text-slate-500">
        Loading finance...
      </div>
    );
  return (
    <div className="mx-auto">
      <section className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">Finance system</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">Know where your money goes.</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Live cash flow, spending patterns and budget control from your stored transactions.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button type="button" onClick={() => { setEditing(null); setModal("transaction"); }} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white dark:bg-white dark:text-slate-950"><Plus className="size-4" /> Add transaction</button>
            <button type="button" onClick={() => setModal("budget")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><Plus className="size-4" /> Monthly budget</button>
          </div>
        </div>
      </section>
      {message && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {message}
        </div>
      )}
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Stat
          icon={<Wallet />}
          label="Current balance"
          value={money(totals.income - totals.expense)}
        />
        <Stat
          icon={<ArrowUpRight />}
          label="Total income"
          value={money(totals.income)}
        />
        <Stat
          icon={<ArrowDownLeft />}
          label="Total expenses"
          value={money(totals.expense)}
        />
        <Stat
          icon={<BarChart3 />}
          label="Net cash flow"
          value={money(totals.income - totals.expense)}
        />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Chart
          title="Income vs expense"
          empty={!monthly.some((item) => item.income || item.expense)}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => money(Number(value) * 100)} />
              <Bar dataKey="income" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
        <Chart
          title="Monthly trend"
          empty={!monthly.some((item) => item.income || item.expense)}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => money(Number(value) * 100)} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Spending by category" empty={!spending.length}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={spending}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={78}
                label
              >
                {spending.map((item, index) => (
                  <Cell key={item.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => money(Number(value) * 100)} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>
        <Chart title="Current budget usage" empty={!budgetRows.length}>
          <div className="space-y-3">
            {budgetRows.map((budget) => (
              <div key={budget.id}>
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>{budget.category?.name || "Monthly total"}</span>
                  <span className={budget.percent > 100 ? "text-red-600" : ""}>
                    {budget.percent}%
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${budget.percent > 100 ? "bg-red-500" : "bg-blue-500"}`}
                    style={{ width: `${Math.min(100, budget.percent)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Spent {money(budget.spent)} · Remaining{" "}
                  {money(budget.remaining)}
                </p>
              </div>
            ))}
          </div>
        </Chart>
      </div>
      <div className={modal ? "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm" : "hidden"}>
        <div className="w-full max-w-xl space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"><h2 className="font-black text-slate-900 dark:text-white">{modal === "transaction" ? (editing ? "Edit transaction" : "Add transaction") : "Monthly budgets"}</h2><button type="button" onClick={() => { setModal(null); setEditing(null); }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700">Close</button></div>
          <div className="w-full">
        <div className={modal === "transaction" ? "" : "hidden"}>
        <Panel title={editing ? "Edit transaction" : "Add transaction"}>
          <form onSubmit={saveTransaction} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <select
                className="input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
              <input
                className="input"
                required
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">No category</option>
              {cats
                .filter((item) => item.type === form.type)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
            <input
              className="input"
              required
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
              className="input"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <input
              className="input"
              placeholder="Payment method"
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
              }
            />
            <div className="flex gap-2">
              <button className="btn-primary">
                <Plus className="size-4" />{" "}
                {editing ? "Save changes" : "Add transaction"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      type: "EXPENSE",
                      amount: "",
                      categoryId: "",
                      description: "",
                      date: today(),
                      paymentMethod: "",
                    });
                  }}
                  className="rounded-lg border border-slate-200 px-3 text-xs font-bold dark:border-slate-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </Panel>
        </div>
        <div className={modal === "budget" ? "" : "hidden"}>
        <Panel title="Monthly budgets">
          <form onSubmit={saveBudget} className="grid gap-2 md:grid-cols-4">
            <input
              className="input"
              required
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Amount"
              value={budgetForm.amount}
              onChange={(e) =>
                setBudgetForm({ ...budgetForm, amount: e.target.value })
              }
            />
            <select
              className="input"
              value={budgetForm.categoryId}
              onChange={(e) =>
                setBudgetForm({ ...budgetForm, categoryId: e.target.value })
              }
            >
              <option value="">All expenses</option>
              {cats
                .filter((item) => item.type === "EXPENSE")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
            <input
              className="input"
              type="number"
              min="2020"
              value={budgetForm.year}
              onChange={(e) =>
                setBudgetForm({ ...budgetForm, year: e.target.value })
              }
            />
            <button className="btn-primary">
              <Plus className="size-4" /> Add budget
            </button>
          </form>
          <div className="mt-3 space-y-2">
            {budgetRows.map((budget) => (
              <div
                key={budget.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-950/50"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {budget.category?.name || "Monthly total"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {money(budget.amount)} ·{" "}
                    {budget.percent > 100
                      ? "Over budget"
                      : `${money(budget.remaining)} remaining`}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await fetch(`/api/finance/budgets/${budget.id}`, {
                      method: "DELETE",
                    });
                    await load();
                  }}
                  className="text-xs font-bold text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
            {!budgetRows.length && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No budget for the current month.
              </p>
            )}
          </div>
        </Panel>
        </div>
          </div>
        </div>
      </div>
      <Panel title={`Transactions (${visible.length})`}>
        <div className="grid gap-2 md:grid-cols-[1fr_130px_150px_130px_130px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search transactions"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="ALL">All types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="ALL">All categories</option>
            {cats.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            className="input"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <select
            className="input max-w-48"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </div>
        <div className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 py-3"
            >
              <div
                className={`grid size-8 place-items-center rounded-lg ${item.type === "INCOME" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-red-50 text-red-600 dark:bg-red-500/10"}`}
              >
                {item.type === "INCOME" ? (
                  <ArrowUpRight className="size-4" />
                ) : (
                  <ArrowDownLeft className="size-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {item.description || "Untitled transaction"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.category?.name || "Uncategorized"} ·{" "}
                  {new Date(item.date).toLocaleDateString()} ·{" "}
                  {item.paymentMethod || "No payment method"}
                </p>
              </div>
              <span
                className={`text-sm font-black ${item.type === "INCOME" ? "text-emerald-600" : "text-red-600"}`}
              >
                {item.type === "INCOME" ? "+" : "-"}
                {money(cents(item.amount))}
              </span>
              <button
                onClick={() => {
                  setEditing(item.id);
                  setForm({
                    type: item.type,
                    amount: String(item.amount),
                    categoryId: item.category?.id || "",
                    description: item.description || "",
                    date: new Date(item.date).toISOString().slice(0, 10),
                    paymentMethod: item.paymentMethod || "",
                  });
                }}
                className="grid size-8 place-items-center rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <Pencil className="size-3.5" />
              </button>
              <button
                onClick={() => removeTransaction(item.id)}
                className="grid size-8 place-items-center rounded-lg border border-slate-200 text-red-500 dark:border-slate-700"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          {!visible.length && (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              <CalendarDays className="mx-auto mb-2 size-5" />
              No transactions match your filters.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <h2 className="font-black text-slate-900 dark:text-white">{title}</h2>
      {children}
    </section>
  );
}
function Chart({
  title,
  empty,
  children,
}: {
  title: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <Panel title={title}>
      {empty ? (
        <div className="grid h-56 place-items-center text-sm text-slate-500 dark:text-slate-400">
          No data available yet.
        </div>
      ) : (
        <div className="mt-3">{children}</div>
      )}
    </Panel>
  );
}
function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
        <span className="text-xs font-bold uppercase tracking-wide">
          {label}
        </span>
        {icon}
      </div>
      <p className="mt-3 text-xl font-black text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
