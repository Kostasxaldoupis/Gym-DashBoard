import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteMember } from "../actions/action";
import Navbar from "./components/NavBar";
import DeleteButton from "./components/DeleteButton";

export default async function HomePage() {
  const members = await prisma.member.findMany({
    orderBy: {
      createdAt: "desc",
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
  const now = new Date();

  return (
    <>
    <Navbar />

    <main className="min-h-screen bg-slate-950"> 
      <p className="text-center">homepage</p>
    </main>
    </>
    // <main className="min-h-screen bg-slate-100">
    //   <Navbar />

    //   <div className="mx-auto max-w-7xl p-8">
    //     {/* Stats */}
    //     <div className="mb-8 grid gap-4 md:grid-cols-3">
    //       <div className="rounded-xl bg-white p-6 shadow-sm">
    //         <p className="text-sm text-gray-500">Total Members</p>
    //         <p className="mt-2 text-3xl font-bold text-slate-900">
    //           {members.length}
    //         </p>
    //       </div>

    //       <div className="rounded-xl bg-white p-6 shadow-sm">
    //         <p className="text-sm text-gray-500">Active Plans</p>
    //         <p className="mt-2 text-3xl font-bold text-emerald-600">
    //           Coming Soon
    //         </p>
    //       </div>

    //       <div className="rounded-xl bg-white p-6 shadow-sm">
    //         <p className="text-sm text-gray-500">Expired Plans</p>
    //         <p className="mt-2 text-3xl font-bold text-red-500">Coming Soon</p>
    //       </div>
    //     </div>

    //     {/* Members Table */}
    //     <div className="overflow-hidden rounded-xl bg-white shadow-sm">
    //       <div className="border-b px-6 py-4">
    //         <h2 className="text-xl font-semibold text-slate-900">Members</h2>
    //       </div>

    //       <table className="w-full">
    //         <thead className="bg-slate-50">
    //           <tr>
    //             <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
    //               Name
    //             </th>
    //             <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
    //               Phone
    //             </th>
    //             <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
    //               Email
    //             </th>
    //             <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
    //               Plan
    //             </th>
    //             <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
    //               Renewed
    //             </th>
    //             <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
    //               Expires
    //             </th>
    //             <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
    //               Time Left
    //             </th>
    //             <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
    //               Actions
    //             </th>
    //           </tr>
    //         </thead>

    //         <tbody>
    //           {members.length === 0 ? (
    //             <tr>
    //               <td
    //                 colSpan={4}
    //                 className="px-6 py-12 text-center text-gray-500"
    //               >
    //                 No members found. Click{" "}
    //                 <span className="font-medium">Add Member</span> to get
    //                 started.
    //               </td>
    //             </tr>
    //           ) : (
    //             members.map((member) => {
    //               const membership = member.memberships[0];

    //               const daysLeft = membership
    //                 ? Math.ceil(
    //                     (membership.endDate.getTime() - now.getTime()) /
    //                       (1000 * 60 * 60 * 24),
    //                   )
    //                 : null;

    //               return (
    //                 <tr
    //                   key={member.id}
    //                   className="border-t transition hover:bg-slate-50"
    //                 >
    //                   <td className="px-6 py-4 font-medium text-slate-900">
    //                     {member.firstName} {member.lastName}
    //                   </td>

    //                   <td className="px-6 py-4 text-gray-600">
    //                     {member.phone}
    //                   </td>

    //                   <td className="px-6 py-4 text-gray-600">
    //                     {member.email || "—"}
    //                   </td>

    //                   <td className="px-6 py-4 text-slate-700">
    //                     {membership?.plan.name ?? "No Plan"}
    //                   </td>

    //                   <td className="px-6 py-4 text-slate-700">
    //                     {membership
    //                       ? membership.startDate.toLocaleDateString()
    //                       : "—"}
    //                   </td>

    //                   <td className="px-6 py-4 text-slate-700">
    //                     {membership
    //                       ? membership.endDate.toLocaleDateString()
    //                       : "—"}
    //                   </td>

    //                   <td className="px-6 py-4">
    //                     {!membership ? (
    //                       <span className="text-gray-500">—</span>
    //                     ) : daysLeft! <= 0 ? (
    //                       <span className="font-semibold text-red-600">
    //                         Expired
    //                       </span>
    //                     ) : daysLeft! <= 7 ? (
    //                       <span className="font-semibold text-amber-600">
    //                         {daysLeft} days
    //                       </span>
    //                     ) : (
    //                       <span className="font-semibold text-emerald-600">
    //                         {daysLeft} days
    //                       </span>
    //                     )}
    //                   </td>

    //                   <td className="px-6 py-4">
    //                     <div className="flex justify-end gap-2">
    //                       <Link
    //                         href={`/members/${member.id}/edit`}
    //                         className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
    //                       >
    //                         Edit
    //                       </Link>

    //                       <form action={deleteMember}>
    //                         <input type="hidden" name="id" value={member.id} />
    //                         {/* <DeleteButton /> */}
    //                       </form>
    //                     </div>
    //                   </td>
    //                 </tr>
    //               );
    //             })
    //           )}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </main>
  );
}
