import { prisma } from "@/lib/prisma";
import MemberCard from "@/app/components/MemberCard";
import Link from "next/link";

export default async function MemberCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Try to find by cardCode first, then by id (fallback)
  const member = await prisma.member.findFirst({
    where: {
      OR: [
        { cardCode: id },
        { id: id }
      ]
    },
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-8">
        <div className="text-center max-w-md">
          <div className="mb-6 text-6xl">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Member Not Found
          </h1>
          <p className="text-slate-400 mb-2">
            We couldn&apos;t find a member with the code:
          </p>
          <div className="bg-slate-800 p-3 rounded-lg mb-6">
            <p className="font-mono text-emerald-400 text-sm break-all">
              {id}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/scan"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700 transition"
            >
              Try Again
            </Link>
            <Link
              href="/members"
              className="rounded-lg border border-slate-700 px-6 py-3 text-slate-300 hover:bg-slate-800 transition"
            >
              Browse All Members
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-8">
      <MemberCard member={member} />
    </main>
  );
}