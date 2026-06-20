import Link from "next/link";
import { pauseSubscription, resumeSubscription } from "@/actions/action";

type MemberWithMembership = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  memberships: Array<{
    id: string;
    plan: {
      id: string;
      name: string;
      durationDays: number;
      price: number;
    };
    startDate: Date;
    endDate: Date;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    memberId: string;
    planId: string;
  }>;
  _count: {
    memberships: number;
  };
};

interface TableViewProps {
  members: MemberWithMembership[];
}

export default function TableView({ members }: TableViewProps) {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <>
      <div className="border-b border-slate-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Members</h2>
      </div>

      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
              Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
              Phone
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
              Email
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
              Plan
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
              Renewed
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
              Expires
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">
              Time Left
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-slate-400">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {members.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-12 text-center text-slate-500"
              >
                No members found. Click{" "}
                <span className="font-medium text-slate-300">Add Member</span>{" "}
                to get started.
              </td>
            </tr>
          ) : (
            members.map((member) => {
              const membership = member.memberships[0];

              const isPaused = membership ? !membership.active : false;

              const isExpired = membership
                ? membership.endDate.getTime() < now.getTime()
                : false;

              const daysLeft = membership
                ? (() => {
                    const expiry = new Date(membership.endDate);
                    expiry.setHours(0, 0, 0, 0);
                    return Math.round(
                      (expiry.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                  })()
                : null;

              return (
                <tr
                  key={member.id}
                  className="border-t border-slate-700 transition hover:bg-slate-800"
                >
                  <td className="px-6 py-4 font-medium text-white capitalize">
                    {member.firstName} {member.lastName}
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    {member.phone}
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    {member.email || "—"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {membership?.plan.name ?? "No Plan"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {membership
                      ? membership.startDate.toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {membership
                      ? membership.endDate.toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-6 py-4">
                    {!membership ? (
                      <span className="text-slate-500">—</span>
                    ) : isPaused ? (
                      <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-400">
                        Paused
                      </span>
                    ) : isExpired ? (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">
                        Expired
                      </span>
                    ) : daysLeft! <= 7 ? (
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                        {daysLeft} days
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                        {daysLeft} days
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/members/${member.id}/edit`}
                        className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/membercard/${member.id}`}
                        className="rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700 transition"
                      >
                        Card
                      </Link>

                      {membership && (
                        membership.active ? (
                          <form action={pauseSubscription}>
                            <input
                              type="hidden"
                              name="membershipId"
                              value={membership.id}
                            />
                            <button
                              type="submit"
                              className="rounded-md bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600 transition"
                            >
                              Pause
                            </button>
                          </form>
                        ) : (
                          <form action={resumeSubscription}>
                            <input
                              type="hidden"
                              name="membershipId"
                              value={membership.id}
                            />
                            <button
                              type="submit"
                              className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700 transition"
                            >
                              Resume
                            </button>
                          </form>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
}