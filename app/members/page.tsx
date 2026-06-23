import NavBar from "../components/NavBar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchForm from "../components/SearchForm";
import TableView from "../components/TableView";
import Pagination from "../components/Pagination";


// import { revalidatePath } from "next/cache";

// export async function deleteAllMembers() {
//   // Delete memberships first because of foreign keys
//   await prisma.membership.deleteMany();

//   // Then delete members
//   await prisma.member.deleteMany();

//   revalidatePath("/");
//   revalidatePath("/members");
// }

export default async function MemberPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    plan?: string;
    page?: string;
  }>;
}) {
  const { search, status, plan, page } = await searchParams;

  const currentPage = Number(page ?? "1");
  const pageSize = 14;

  // Lowercase + trim so Greek names match regardless of how they're typed.
  // Names are stored lowercase at save time (in actions), so this stays consistent.
  const normalizedSearch = search?.trim().toLowerCase();

  // Membership filters
  const membershipFilters: object[] = [
    ...(plan ? [{ planId: plan }] : []),
    ...(status === "active"
      ? [{ active: true, endDate: { gte: new Date() } }]
      : []),
    ...(status === "paused"
      ? [{ active: false, endDate: { gte: new Date() } }]
      : []),
    ...(status === "expired" ? [{ endDate: { lt: new Date() } }] : []),
  ];

  const where = {
    ...(normalizedSearch && {
      OR: [
        { firstName: { contains: normalizedSearch } },
        { lastName: { contains: normalizedSearch } },
        { phone: { contains: normalizedSearch } },
      ],
    }),
    ...(membershipFilters.length > 0 && {
      AND: membershipFilters.map((f) => ({ memberships: { some: f } })),
    }),
  };

  // Pagiantion
  const totalMembers = await prisma.member.count({ where });
  const totalPages = Math.ceil(totalMembers / pageSize);
  const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));

  //  Data fetch
  const members = await prisma.member.findMany({
    where,
    skip: (safePage - 1) * pageSize,
    take: pageSize,
    include: {
      _count: {
        select: { memberships: true },
      },
      memberships: {
        include: { plan: true },
        orderBy: { endDate: "desc" },
        take: 1,
      },
    },
    orderBy: { firstName: "asc" },
  });

  // Plan dropdown options
  const plans = await prisma.plan.findMany({
    orderBy: { durationDays: "asc" },
  });

  //  Pagination URL builder
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (plan) params.set("plan", plan);
    params.set("page", pageNumber.toString());
    return `/members?${params.toString()}`;
  };

  // Pagination display range
  const rangeStart = totalMembers === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalMembers);

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
          {/* <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Member Management
              </h1>
              <p className="text-slate-500">
                Search, edit and manage gym members.
              </p>
            </div>

            <div className="flex gap-3">
              <form action={deleteAllMembers}>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
                >
                  Delete All Members
                </button>
              </form>

              <Link
                href="/members/new"
                className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
              >
                + Add Member
              </Link>
            </div>
          </div> */}

          <SearchForm
            search={search}
            plan={plan}
            status={status}
            plans={plans}
          />

          <div className="overflow-hidden rounded-xl bg-slate-900 shadow-sm">
            <TableView members={members} />

            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalMembers={totalMembers}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              createPageURL={createPageURL}
            />
          </div>
        </div>
      </main>
    </>
  );
}
