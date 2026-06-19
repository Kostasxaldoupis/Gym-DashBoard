import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { editMember } from "@/actions/action";
import QRCode from "react-qr-code";

export default async function EditMemberPage({
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

  const plans = await prisma.plan.findMany({
    orderBy: {
      durationDays: "asc",
    },
  });

  const membership = member?.memberships[0];

  if (!member) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Member not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-xl rounded-xl bg-slate-300 p-8 shadow">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="mb-6 text-3xl font-bold text-slate-900">Edit Member</h1>

        <form action={editMember} className="space-y-4">
          <input type="hidden" name="id" value={member.id} />

          <input
            name="firstName"
            type="text"
            defaultValue={member.firstName}
            placeholder="First Name"
            className="w-full rounded-lg border border-gray-500 bg-white p-3 text-black"
          />

          <input
            name="lastName"
            type="text"
            defaultValue={member.lastName}
            placeholder="Last Name"
            className="w-full rounded-lg border border-gray-500 bg-white p-3 text-black"
          />

          <input
            name="phone"
            type="text"
            defaultValue={member.phone}
            placeholder="Phone"
            className="w-full rounded-lg border border-gray-500 bg-white p-3 text-black"
          />

          <input
            name="email"
            type="email"
            defaultValue={member.email ?? ""}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-500 bg-white p-3 text-black"
          />

          <textarea
            name="notes"
            defaultValue={member.notes ?? ""}
            placeholder="Notes"
            rows={4}
            className="w-full rounded-lg border border-gray-500 bg-white p-3 text-black resize-none"
          />

          <div className="rounded-lg border border-gray-300 bg-slate-50 p-4">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              Subscription
            </h2>

            <select
              name="planId"
              defaultValue={membership?.planId ?? ""}
              className="mb-3 w-full rounded-lg border border-gray-300 bg-white p-3 text-black"
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} (€{plan.price})
                </option>
              ))}
            </select>

            <p className="text-sm text-slate-600">
              Started:{" "}
              {membership
                ? membership.startDate.toLocaleDateString()
                : "No active subscription"}
            </p>

            <p className="text-sm text-slate-600">
              Expires:{" "}
              {membership
                ? membership.endDate.toLocaleDateString()
                : "No active subscription"}
            </p>
          </div>
                
          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Save Changes
            </button>

            <Link
              href="/members"
              className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white "
            >
              Cancel
            </Link>
          </div>
        </form>
        
        <div className="mt-6 flex flex-col items-center">
          <QRCode value={member.id} size={180} />
          <p className="mt-2 text-sm text-slate-500">
            
          </p>
        </div>

      </div>
    </main>
  );
}
