"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
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

type C = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
};

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

const COLORS = [
  "#2563eb",
  "#8b5cf6",
  "#f97316",
  "#10b981",
  "#e11d48",
  "#64748b",
];

const today = () => new Date().toISOString().slice(0, 10);

const cents = (value: string | number) =>
  Math.round(Number(value || 0) * 100);

const money = (valueInCents: number) =>
  `₹${(valueInCents / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const monthName = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    month: "short",
  });

const inputClass = `
  h-10 w-full rounded-lg
  border border-slate-200
  bg-white px-3
  text-sm text-slate-900
  outline-none
  transition-colors
  placeholder:text-slate-400
  focus:border-blue-500
  focus:ring-2 focus:ring-blue-500/10
  dark:border-slate-700
  dark:bg-slate-950
  dark:text-slate-100
  dark:placeholder:text-slate-600
`;

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
    setMessage("");

    try {
      const [transactionsRes, categoriesRes, budgetsRes] =
        await Promise.all([
          fetch("/api/finance/transactions", {
            cache: "no-store",
          }),
          fetch("/api/finance/categories", {
            cache: "no-store",
          }),
          fetch("/api/finance/budgets", {
            cache: "no-store",
          }),
        ]);

      const [transactions, categories, budgetRows] =
        await Promise.all([
          transactionsRes.json(),
          categoriesRes.json(),
          budgetsRes.json(),
        ]);

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

          if (item.type === "INCOME") {
            result.income += value;
          } else {
            result.expense += value;
          }

          return result;
        },
        { income: 0, expense: 0 },
      ),
    [tx],
  );

  const balance = totals.income - totals.expense;

  const visible = useMemo(() => {
    return tx
      .filter((item) => {
        const searchable = `${item.description || ""} ${
          item.category?.name || ""
        } ${item.paymentMethod || ""}`.toLowerCase();

        return (
          (type === "ALL" || item.type === type) &&
          (category === "ALL" || item.category?.id === category) &&
          (!from || item.date >= from) &&
          (!to || item.date <= `${to}T23:59:59`) &&
          searchable.includes(query.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sort === "amount-desc") {
          return cents(b.amount) - cents(a.amount);
        }

        if (sort === "amount-asc") {
          return cents(a.amount) - cents(b.amount);
        }

        if (sort === "date-asc") {
          return (
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
          );
        }

        return (
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
        );
      });
  }, [
    tx,
    type,
    category,
    from,
    to,
    query,
    sort,
  ]);

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
              .reduce(
                (sum, item) => sum + cents(item.amount),
                0,
              ) / 100,
          expense:
            rows
              .filter((item) => item.type === "EXPENSE")
              .reduce(
                (sum, item) => sum + cents(item.amount),
                0,
              ) / 100,
        };
      }),
    [tx],
  );

  const spending = useMemo(() => {
    const map = new Map<string, number>();

    tx
      .filter((item) => item.type === "EXPENSE")
      .forEach((item) => {
        const name = item.category?.name || "Other";

        map.set(
          name,
          (map.get(name) || 0) + cents(item.amount),
        );
      });

    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({
        name,
        value: value / 100,
      }));
  }, [tx]);

  const budgetRows = currentBudgets.map((budget) => {
    const spent = tx
      .filter((item) => {
        if (item.type !== "EXPENSE") return false;

        const itemDate = new Date(item.date);

        return (
          (!budget.category ||
            item.category?.id === budget.category.id) &&
          itemDate.getMonth() === current.getMonth() &&
          itemDate.getFullYear() === current.getFullYear()
        );
      })
      .reduce(
        (sum, item) => sum + cents(item.amount),
        0,
      );

    const amount = cents(budget.amount);

    return {
      ...budget,
      amount,
      spent,
      remaining: amount - spent,
      percent: amount
        ? Math.round((spent / amount) * 100)
        : 0,
    };
  });

  async function saveTransaction(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        editing
          ? `/api/finance/transactions/${editing}`
          : "/api/finance/transactions",
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            amount: Number(form.amount),
            categoryId: form.categoryId || null,
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        setMessage(
          data.error || "Could not save transaction.",
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
    } catch {
      setMessage("Could not save transaction.");
    }
  }

  async function removeTransaction(id: string) {
    if (!confirm("Delete this transaction?")) return;

    try {
      const response = await fetch(
        `/api/finance/transactions/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        setMessage("Could not delete transaction.");
        return;
      }

      await load();
    } catch {
      setMessage("Could not delete transaction.");
    }
  }

  async function saveBudget(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "/api/finance/budgets",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            ...budgetForm,
            amount: Number(budgetForm.amount),
            month: Number(budgetForm.month),
            year: Number(budgetForm.year),
            categoryId: budgetForm.categoryId || null,
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        setMessage(
          data.error || "Could not save budget.",
        );
        return;
      }

      setBudgetForm((current) => ({
        ...current,
        amount: "",
      }));

      setModal(null);

      await load();
    } catch {
      setMessage("Could not save budget.");
    }
  }

  async function deleteBudget(id: string) {
    try {
      const response = await fetch(
        `/api/finance/budgets/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        setMessage("Could not delete budget.");
        return;
      }

      await load();
    } catch {
      setMessage("Could not delete budget.");
    }
  }

  function resetTransactionForm() {
    setEditing(null);

    setForm({
      type: "EXPENSE",
      amount: "",
      categoryId: "",
      description: "",
      date: today(),
      paymentMethod: "",
    });
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-3">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-80 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Finance
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Track your money with clarity.
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Monitor cash flow, understand spending, and keep monthly
              budgets under control.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                resetTransactionForm();
                setModal("transaction");
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Plus className="h-4 w-4" />
              Add transaction
            </button>

            <button
              type="button"
              onClick={() => setModal("budget")}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add budget
            </button>
          </div>
        </div>
      </section>

      {/* Message */}
      {message && (
        <div
          role="alert"
          className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300"
        >
          {message}
        </div>
      )}

      {/* =========================================================
          SUMMARY
      ========================================================== */}
      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current balance"
          value={money(balance)}
          icon={<Wallet className="h-4 w-4" />}
          featured
        />

        <StatCard
          label="Income"
          value={money(totals.income)}
          icon={<ArrowUpRight className="h-4 w-4" />}
          tone="income"
        />

        <StatCard
          label="Expenses"
          value={money(totals.expense)}
          icon={<ArrowDownLeft className="h-4 w-4" />}
          tone="expense"
        />

        <StatCard
          label="Transactions"
          value={String(tx.length)}
          icon={<BarChart3 className="h-4 w-4" />}
        />
      </section>

      {/* =========================================================
          ANALYTICS
      ========================================================== */}
      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Income vs expenses"
          description="Last six months"
          empty={!monthly.some((item) => item.income || item.expense)}
        >
          <ResponsiveContainer width="100%" height={230}>
            <BarChart
              data={monthly}
              margin={{
                top: 5,
                right: 4,
                left: -18,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
              />

              <Bar
                dataKey="income"
                name="Income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />

              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Cash flow trend"
          description="Income and spending over time"
          empty={!monthly.some((item) => item.income || item.expense)}
        >
          <ResponsiveContainer width="100%" height={230}>
            <LineChart
              data={monthly}
              margin={{
                top: 5,
                right: 8,
                left: -18,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
              />

              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Spending by category"
          description="Top expense categories"
          empty={!spending.length}
        >
          <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-center">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={spending}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {spending.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2">
              {spending.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          COLORS[index % COLORS.length],
                      }}
                    />

                    <span className="truncate text-slate-500 dark:text-slate-400">
                      {item.name}
                    </span>
                  </div>

                  <span className="shrink-0 font-semibold text-slate-800 dark:text-slate-200">
                    ₹
                    {item.value.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Current month budget"
          description={`${current.toLocaleDateString(
            "en-IN",
            { month: "long", year: "numeric" },
          )}`}
          empty={!budgetRows.length}
        >
          <div className="space-y-4">
            {budgetRows.map((budget) => (
              <div key={budget.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {budget.category?.name ||
                        "Monthly total"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Spent {money(budget.spent)}
                    </p>
                  </div>

                  <p
                    className={`shrink-0 text-sm font-semibold ${
                      budget.percent > 100
                        ? "text-red-600 dark:text-red-400"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {budget.percent}%
                  </p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      budget.percent > 100
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, budget.percent),
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                  <span>Budget {money(budget.amount)}</span>

                  <span>
                    {budget.remaining >= 0
                      ? `${money(
                          budget.remaining,
                        )} remaining`
                      : `${money(
                          Math.abs(budget.remaining),
                        )} over`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      {/* =========================================================
          TRANSACTIONS
      ========================================================== */}
      <section className="mt-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Transactions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {visible.length} result
                {visible.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative min-w-[200px] flex-1 sm:flex-none">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />

                <input
                  className={`${inputClass} pl-9`}
                  placeholder="Search transactions"
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                />
              </div>

              <select
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >
                <option value="ALL">All types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>

              <select
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option value="ALL">All categories</option>

                {cats.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date filters */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
              <CalendarDays className="h-3.5 w-3.5" />
              Date
            </div>

            <input
              type="date"
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              value={from}
              onChange={(e) =>
                setFrom(e.target.value)
              }
            />

            <span className="text-xs text-slate-400">
              to
            </span>

            <input
              type="date"
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              value={to}
              onChange={(e) =>
                setTo(e.target.value)
              }
            />

            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] text-slate-500">
                Sort
              </span>

              <select
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
              >
                <option value="date-desc">
                  Newest first
                </option>
                <option value="date-asc">
                  Oldest first
                </option>
                <option value="amount-desc">
                  Highest amount
                </option>
                <option value="amount-asc">
                  Lowest amount
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction list */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  item.type === "INCOME"
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                {item.type === "INCOME" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {item.description ||
                    "Untitled transaction"}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                  {item.category?.name ||
                    "Uncategorized"}{" "}
                  ·{" "}
                  {new Date(
                    item.date,
                  ).toLocaleDateString("en-IN")}{" "}
                  ·{" "}
                  {item.paymentMethod ||
                    "No payment method"}
                </p>
              </div>

              <p
                className={`text-sm font-semibold ${
                  item.type === "INCOME"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {item.type === "INCOME" ? "+" : "-"}
                {money(cents(item.amount))}
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Edit transaction"
                  onClick={() => {
                    setEditing(item.id);
                    setForm({
                      type: item.type,
                      amount: String(item.amount),
                      categoryId:
                        item.category?.id || "",
                      description:
                        item.description || "",
                      date: new Date(item.date)
                        .toISOString()
                        .slice(0, 10),
                      paymentMethod:
                        item.paymentMethod || "",
                    });
                    setModal("transaction");
                  }}
                  className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  aria-label="Delete transaction"
                  onClick={() =>
                    removeTransaction(item.id)
                  }
                  className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-900/50 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {!visible.length && (
            <div className="px-6 py-12 text-center">
              <CalendarDays className="mx-auto h-5 w-5 text-slate-400" />

              <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                No matching transactions
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Try changing the filters or search term.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          MODALS
      ========================================================== */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
                  Finance
                </p>

                <h2 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                  {modal === "transaction"
                    ? editing
                      ? "Edit transaction"
                      : "Add transaction"
                    : "Add monthly budget"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setModal(null);

                  if (modal === "transaction") {
                    resetTransactionForm();
                  }
                }}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-5">
              {modal === "transaction" ? (
                <form
                  onSubmit={saveTransaction}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                        Type
                      </span>

                      <select
                        className={inputClass}
                        value={form.type}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            type: e.target.value,
                            categoryId: "",
                          })
                        }
                      >
                        <option value="EXPENSE">
                          Expense
                        </option>
                        <option value="INCOME">
                          Income
                        </option>
                      </select>
                    </label>

                    <label>
                      <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                        Amount
                      </span>

                      <input
                        className={inputClass}
                        required
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        value={form.amount}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            amount: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>

                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                      Category
                    </span>

                    <select
                      className={inputClass}
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          categoryId:
                            e.target.value,
                        })
                      }
                    >
                      <option value="">
                        No category
                      </option>

                      {cats
                        .filter(
                          (item) =>
                            item.type === form.type,
                        )
                        .map((item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                        Date
                      </span>

                      <input
                        className={inputClass}
                        required
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            date: e.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                        Payment method
                      </span>

                      <input
                        className={inputClass}
                        placeholder="UPI, cash, card..."
                        value={form.paymentMethod}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            paymentMethod:
                              e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>

                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                      Description
                    </span>

                    <input
                      className={inputClass}
                      placeholder="What was this transaction for?"
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description:
                            e.target.value,
                        })
                      }
                    />
                  </label>

                  <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setModal(null);
                        resetTransactionForm();
                      }}
                      className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      <Plus className="h-4 w-4" />

                      {editing
                        ? "Save changes"
                        : "Add transaction"}
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={saveBudget}
                  className="space-y-4"
                >
                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                      Budget amount
                    </span>

                    <input
                      className={inputClass}
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={budgetForm.amount}
                      onChange={(e) =>
                        setBudgetForm({
                          ...budgetForm,
                          amount: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                      Category
                    </span>

                    <select
                      className={inputClass}
                      value={budgetForm.categoryId}
                      onChange={(e) =>
                        setBudgetForm({
                          ...budgetForm,
                          categoryId:
                            e.target.value,
                        })
                      }
                    >
                      <option value="">
                        All expenses
                      </option>

                      {cats
                        .filter(
                          (item) =>
                            item.type === "EXPENSE",
                        )
                        .map((item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                        Month
                      </span>

                      <select
                        className={inputClass}
                        value={budgetForm.month}
                        onChange={(e) =>
                          setBudgetForm({
                            ...budgetForm,
                            month: e.target.value,
                          })
                        }
                      >
                        {Array.from(
                          { length: 12 },
                          (_, index) => (
                            <option
                              key={index + 1}
                              value={String(
                                index + 1,
                              )}
                            >
                              {new Date(
                                2000,
                                index,
                                1,
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  month: "long",
                                },
                              )}
                            </option>
                          ),
                        )}
                      </select>
                    </label>

                    <label>
                      <span className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
                        Year
                      </span>

                      <input
                        className={inputClass}
                        type="number"
                        min="2020"
                        value={budgetForm.year}
                        onChange={(e) =>
                          setBudgetForm({
                            ...budgetForm,
                            year: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>

                  <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setModal(null)}
                      className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      <Plus className="h-4 w-4" />
                      Add budget
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
  featured,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone?: "income" | "expense";
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        featured
          ? "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>

        <span
          className={`${
            tone === "income"
              ? "text-emerald-500"
              : tone === "expense"
                ? "text-red-500"
                : "text-slate-400"
          }`}
        >
          {icon}
        </span>
      </div>

      <p className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  description,
  empty,
  children,
}: {
  title: string;
  description?: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {empty ? (
          <div className="grid h-[230px] place-items-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-500 dark:border-slate-800">
            No data available yet.
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}