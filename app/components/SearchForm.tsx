"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

type SearchFormProps = {
  search?: string;
  plan?: string;
  status?: string;
  plans: {
    id: string;
    name: string;
  }[];
};

export default function SearchForm({
  search,
  plan,
  status,
  plans,
}: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateURL = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 on any filter change
      params.delete("page");

      startTransition(() => {
        router.replace(`/members?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return (
    <div className="mb-6 rounded-xl bg-slate-900 p-5 shadow">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Search input — live as you type */}
        <div className="relative">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search name or phone..."
            onChange={(e) => updateURL("search", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
          />
          {isPending && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-emerald-500" />
            </div>
          )}
        </div>

        {/* Plan filter */}
        <select
          name="plan"
          defaultValue={plan}
          onChange={(e) => updateURL("plan", e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
        >
          <option value="">All Plans</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          name="status"
          defaultValue={status}
          onChange={(e) => updateURL("status", e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="expired">Expired</option>
        </select>
      </div>
    </div>
  );
}