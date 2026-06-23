import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "../../components/DeleteButton";

export default async function AdminMembersPage() {
  const members = await prisma.member.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          ← Back to Admin
        </Link>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin • Members</h1>
            <p className="text-sm text-slate-400">
              {members.length} total members
            </p>
          </div>

          <Link
            href="/members/new"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            + Add Member
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          {members.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">No members found.</p>
              <Link
                href="/members/new"
                className="mt-4 inline-block text-emerald-400 hover:text-emerald-300"
              >
                Add your first member →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Expires
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => {
                    const membership = member.memberships[0];
                    const isActive = membership
                      ? membership.active && membership.endDate > new Date()
                      : false;
                    const isExpired = membership
                      ? membership.endDate < new Date()
                      : false;

                    return (
                      <tr
                        key={member.id}
                        className="border-t border-slate-800 transition hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4 font-medium text-white">
                          {member.firstName} {member.lastName}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {member.phone}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {membership?.plan.name ?? "-"}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {membership
                            ? membership.endDate.toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              isActive
                                ? "bg-emerald-600/20 text-emerald-400"
                                : isExpired
                                ? "bg-red-600/20 text-red-400"
                                : "bg-yellow-600/20 text-yellow-400"
                            }`}
                          >
                            {isActive
                              ? "Active"
                              : isExpired
                              ? "Expired"
                              : "Inactive"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/members/${member.id}/edit`}
                              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                              Edit
                            </Link>

                            <Link
                              href={`/membercard/${member.cardCode}`}
                              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                              Card
                            </Link>

                            <DeleteButton
                              memberId={member.id}
                              memberName={`${member.firstName} ${member.lastName}`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}