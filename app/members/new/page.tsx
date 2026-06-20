import AddForm from "@/app/components/AddForm";
import { prisma } from "@/lib/prisma";

export default async function NewMemberPage() {
  const plans = await prisma.plan.findMany({
    orderBy: {
      durationDays: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <AddForm plans={plans}/>
    </main>
  );
}
