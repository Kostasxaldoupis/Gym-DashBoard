import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { renewMembership } from "@/actions/action";

export default async function RenewMembershipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      memberships: {
        include: {
          plan: true,
        },
        orderBy: {
          endDate: "desc",
        },
        take: 1,
      },
    },
  });

  if (!member) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Member not found.
      </main>
    );
  }

  const plans = await prisma.plan.findMany({
    orderBy: {
      durationDays: "asc",
    },
  });

  const latest = member.memberships[0];

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-xl rounded-xl bg-slate-900 p-8 shadow-xl">
        <Link
          href="/members"
          className="text-sm text-emerald-400 hover:underline"
        >
          ← Back
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-white">Renew Membership</h1>

        <div className="mt-6 space-y-2 text-slate-300">
          <p>
            <strong>Name:</strong> {member.firstName} {member.lastName}
          </p>

          <p>
            <strong>Current Plan:</strong> {latest?.plan.name ?? "None"}
          </p>

          <p>
            <strong>Expires:</strong>{" "}
            {latest ? latest.endDate.toLocaleDateString() : "No membership"}
          </p>
        </div>

        <form action={renewMembership} className="mt-8 space-y-6">
          <input type="hidden" name="memberId" value={member.id} />

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              New Plan
            </label>

            <select
              name="planId"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
              defaultValue={latest?.planId ?? ""}
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} (€{plan.price})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Renew Membership
          </button>
        </form>
      </div>
    </main>
  );
}
