import NavBar from "../components/NavBar";
import Link from "next/link";
import { pauseSubscription, resumeSubscription } from "@/actions/action";
import { prisma } from "@/lib/prisma";

export default async function MemberPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    plan?: string;
  }>;
}) {
  const { search, status, plan } = await searchParams;

  const plans = await prisma.plan.findMany({
    orderBy: {
      durationDays: "asc",
    },
  });

  const normalizedSearch = search?.trim().toLowerCase();

  const members = await prisma.member.findMany({
    where: {
      ...(search && {
        OR: [
          {
            firstName: {
              contains: normalizedSearch,
            },
          },
          {
            lastName: {
              contains: normalizedSearch,
            },
          },
          {
            phone: {
              contains: normalizedSearch,
            },
          },
        ],
      }),

      ...(plan && {
        memberships: {
          some: {
            planId: plan,
          },
        },
      }),

      ...(status === "active" && {
        memberships: {
          some: {
            active: true,
            endDate: {
              gte: new Date(),
            },
          },
        },
      }),

      ...(status === "paused" && {
        memberships: {
          some: {
            active: false,
          },
        },
      }),

      ...(status === "expired" && {
        memberships: {
          some: {
            endDate: {
              lt: new Date(),
            },
          },
        },
      }),
    },

    include: {
      _count: {
        select: {
          memberships: true,
        },
      },

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
      firstName: "asc",
    },
  });

  const now = new Date();

  return (
    <>
      <NavBar />

      <main className="min-h-screen bg-slate-950 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Member Management
              </h1>
              <p className="text-slate-500">
                Search, edit and manage gym members.
              </p>
            </div>

            <Link
              href="/members/new"
              className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
            >
              + Add Member
            </Link>
          </div>

          <form className="mb-6 rounded-xl bg-white p-5 shadow">
            <div className="grid gap-4 md:grid-cols-4">
              <input
                name="search"
                defaultValue={search}
                placeholder="Search name or phone..."
                className="rounded-lg border p-3 text-black"
              />

              <select
                name="plan"
                defaultValue={plan}
                className="rounded-lg border p-3 text-black"
              >
                <option value="">All Plans</option>

                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                name="status"
                defaultValue={status}
                className="rounded-lg border p-3 text-black"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="expired">Expired</option>
              </select>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-900">Members</h2>
            </div>

            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Renewed
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Expires
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Time Left
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No members found. Click{" "}
                      <span className="font-medium">Add Member</span> to get
                      started.
                    </td>
                  </tr>
                ) : (
                  members.map((member) => {
                    const membership = member.memberships[0];

                    const isPaused = membership ? false : false;

                    const isExpired = membership
                      ? membership.endDate.getTime() < now.getTime()
                      : false;

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const daysLeft = membership
                      ? (() => {
                          const expiry = new Date(membership.endDate);
                          expiry.setHours(0, 0, 0, 0);

                          return Math.round(
                            (expiry.getTime() - today.getTime()) /
                              (1000 * 60 * 60 * 24),
                          );
                        })()
                      : null;

                    return (
                      <tr
                        key={member.id}
                        className="border-t transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {member.firstName} {member.lastName}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {member.phone}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {member.email || "—"}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {membership?.plan.name ?? "No Plan"}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {membership
                            ? membership.startDate.toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {membership
                            ? membership.endDate.toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-4">
                          {!membership ? (
                            <span className="text-gray-500">—</span>
                          ) : isPaused ? (
                            <span className="font-semibold text-yellow-600">
                              Paused
                            </span>
                          ) : isExpired ? (
                            <span className="font-semibold text-red-600">
                              Expired
                            </span>
                          ) : daysLeft! <= 7 ? (
                            <span className="font-semibold text-amber-600">
                              {daysLeft} days
                            </span>
                          ) : (
                            <span className="font-semibold text-emerald-600">
                              {daysLeft} days
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/members/${member.id}/edit`}
                              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                            >
                              Edit
                            </Link>

                            <Link
                              href={`/membercard/${member.id}`}
                              className="rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700"
                            >
                              Card
                            </Link>

                            {membership &&
                              (membership.active ? (
                                <form action={pauseSubscription}>
                                  <input
                                    type="hidden"
                                    name="membershipId"
                                    value={membership.id}
                                  />
                                  <button
                                    type="submit"
                                    className="rounded-md bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
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
                                    className="rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                                  >
                                    Resume
                                  </button>
                                </form>
                              ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
