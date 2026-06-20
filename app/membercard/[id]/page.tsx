import { prisma } from "@/lib/prisma";
import MemberCard from "@/app/components/MemberCard";

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
      <main className="flex min-h-screen items-center justify-center bg-slate-900">
        <h1 className="text-2xl font-bold text-white">
          Member not found
        </h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-8">
      <MemberCard member={member} />
    </main>
  );
}