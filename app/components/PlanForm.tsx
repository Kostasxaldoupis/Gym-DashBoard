"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { createPlan, updatePlan } from "@/actions/action";

interface Plan {
  id: string;
  name: string;
  durationDays: number;
  price: number;
}

interface PlanFormProps {
  mode: "create" | "edit";
  plan?: Plan;
}

export default function PlanForm({ mode, plan }: PlanFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const isEdit = mode === "edit";

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError("");

    try {
      if (isEdit && plan) {
        formData.append("id", plan.id);
        await updatePlan(formData);
      } else {
        await createPlan(formData);
      }
      router.push("/admin/plans");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <Link
        href="/admin/plans"
        className="mb-6 inline-block text-sm text-emerald-400 transition hover:text-emerald-600"
      >
        ← Back to Plans
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-white">
        {isEdit ? "Edit Plan" : "Add New Plan"}
      </h1>
      <p className="mb-8 text-slate-400">
        {isEdit
          ? "Update subscription plan details"
          : "Create a new subscription plan"}
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-600 bg-red-600/10 p-3">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Plan Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            defaultValue={plan?.name || ""}
            required
            placeholder="e.g., Basic, Premium, Pro"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Duration (days) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="durationDays"
            defaultValue={plan?.durationDays || ""}
            required
            min="1"
            placeholder="e.g., 30"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            defaultValue={plan?.price || ""}
            required
            min="0"
            step="0.01"
            placeholder="e.g., 29.99"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving..." : isEdit ? "Update Plan" : "Create Plan"}
          </button>

          <Link
            href="/admin/plans"
            className="flex-1 rounded-lg bg-slate-600 py-3 text-center font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}