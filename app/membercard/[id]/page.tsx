import { prisma } from "@/lib/prisma";
import Link from "next/link";
import QRCode from "react-qr-code";

export default async function MemberCardPage({
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
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Member not found</h1>
      </main>
    );
  }

  const membership = member.memberships[0];
  const expired = membership && membership.endDate.getTime() < Date.now();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-8">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Gym Member Card
        </h1>

        <div className="space-y-3 text-slate-200">
          <p>
            <strong>Name:</strong> {member.firstName} {member.lastName}
          </p>

          <p>
            <strong>Email:</strong> {member.email}
          </p>

          <p>
            <strong>Plan:</strong> {membership?.plan.name ?? "No subscription"}
          </p>

          <p>
            <strong>Expires: </strong>{" "}
            {membership ? membership.endDate.toLocaleDateString() : "-"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {!membership
              ? "No Plan"
              : !membership.active
                ? "Paused"
                : expired
                  ? "Expired"
                  : "Active"}
          </p>

          <div className="mt-6 flex justify-center rounded-lg bg-white p-4">
            {/* <QRCode value={`http://localhost:3000/membercard/${member.id}`} size={180}/> */}
            <QRCode value={member.id} size={180} />
          </div>
        </div>
      </div>
    </main>
  );
}
