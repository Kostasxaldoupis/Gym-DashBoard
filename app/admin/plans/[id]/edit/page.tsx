// app/admin/plans/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PlanForm from "../../../../components/PlanForm";

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const plan = await prisma.plan.findUnique({
    where: { id },
  });

  if (!plan) {
    return (
      <main className="min-h-screen bg-slate-950 p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-white">Plan not found</h1>
          <Link
            href="/admin/plans"
            className="mt-4 inline-block text-emerald-400 hover:text-emerald-300"
          >
            ← Back to Plans
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <PlanForm mode="edit" plan={plan} />
    </main>
  );
}