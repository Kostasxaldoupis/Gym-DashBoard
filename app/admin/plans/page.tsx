import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: {
      durationDays: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>

            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >Back to admin</Link>
            
            <h1 className="text-3xl font-bold text-white">Membership Plans</h1>
            <p className="text-sm text-slate-400">{plans.length} total plans</p>
          </div>

          <Link
            href="/admin/plans/new"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            + New Plan
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          {plans.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">No plans found.</p>
              <Link
                href="/admin/plans/new"
                className="mt-4 inline-block text-emerald-400 hover:text-emerald-300"
              >
                Create your first plan →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Price
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {plans.map((plan) => (
                    <tr
                      key={plan.id}
                      className="border-t border-slate-800 transition hover:bg-slate-800/50"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {plan.name}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {plan.durationDays} days
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        ${plan.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/plans/${plan.id}/edit`}
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
