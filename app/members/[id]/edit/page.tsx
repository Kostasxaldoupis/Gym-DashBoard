import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EditForm from "@/app/components/EditForm";

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

  if (!member) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Member not found</h1>
          <Link
            href="/members"
            className="mb-6 inline-block text-sm text-emerald-400 transition hover:underline"
          >
            ← Back to Members
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <EditForm member={member} plans={plans} />
    </main>
  );
}
