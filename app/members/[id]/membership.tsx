import { prisma } from "@/lib/prisma";

export default async function MembershipPage({
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
          createdAt: "desc",
        },
      },
    },
  });

  if (!member) return <div>Member not found.</div>;

  const current = member.memberships[0];

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-3xl rounded-xl bg-slate-900 p-8">
        <h1 className="mb-6 text-3xl font-bold text-white">
          Membership Management
        </h1>

        <div className="rounded-lg bg-slate-800 p-5 text-white">
          <p>
            <strong>Current Plan:</strong>{" "}
            {current?.plan.name ?? "No Plan"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {current?.active ? "🟢 Active" : "🟡 Paused"}
          </p>

          <p>
            <strong>Expires:</strong>{" "}
            {current?.endDate.toLocaleDateString() ?? "-"}
          </p>
        </div>

        {/* Add renew / pause / resume buttons and plan selector here */}
      </div>
    </main>
  );
}