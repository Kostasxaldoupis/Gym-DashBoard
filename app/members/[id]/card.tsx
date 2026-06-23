import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MemberProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { plan: true },
        orderBy: { endDate: "desc" },
        take: 1,
      },
    },
  });

  if (!member) {
    return <div>Member not found.</div>;
  }

  const membership = member.memberships[0];

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-slate-900 p-8">
        <h1 className="mb-6 text-4xl font-bold text-white">
          {member.firstName} {member.lastName}
        </h1>

        <div className="grid gap-4 md:grid-cols-2 text-slate-300">
          <div>
            <p><strong>Phone:</strong> {member.phone}</p>
            <p><strong>Email:</strong> {member.email ?? "—"}</p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {member.dateOfBirth?.toLocaleDateString() ?? "—"}
            </p>
          </div>

          <div>
            <p>
              <strong>Plan:</strong>{" "}
              {membership?.plan.name ?? "No Membership"}
            </p>
            <p>
              <strong>Expires:</strong>{" "}
              {membership?.endDate.toLocaleDateString() ?? "—"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            href={`/members/${member.id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Edit Details
          </Link>

          <Link
            href={`/members/${member.id}/membership`}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
          >
            Manage Membership
          </Link>

          <Link
            href={`/membercard/${member.id}`}
            className="rounded-lg bg-purple-600 px-4 py-2 text-white"
          >
            Member Card
          </Link>
        </div>
      </div>
    </main>
  );
}