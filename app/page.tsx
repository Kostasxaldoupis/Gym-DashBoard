import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "./components/NavBar";

export default async function HomePage() {
  const totalMembers = await prisma.member.count();

  const activeMembers = await prisma.member.count({
    where: {
      memberships: {
        some: {
          active: true,
          endDate: {
            gte: new Date(),
          },
        },
      },
    },
  });

  const pausedMembers = await prisma.membership.count({
    where: {
      active: false,
    },
  });

  const expiringSoon = await prisma.membership.count({
    where: {
      active: true,
      endDate: {
        gte: new Date(),
        lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-2 text-4xl font-bold">Gym Management Dashboard</h1>

          <p className="mb-8 text-slate-400">
            Welcome back. Here&apos;s an overview of your gym.
          </p>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-xl bg-slate-900 p-6">
              <p className="text-slate-400">Total Members</p>
              <h2 className="mt-2 text-4xl font-bold">{totalMembers}</h2>
            </div>

            <div className="rounded-xl bg-slate-900 p-6">
              <p className="text-slate-400">Active Memberships</p>
              <h2 className="mt-2 text-4xl font-bold text-green-400">
                {activeMembers}
              </h2>
            </div>

            <div className="rounded-xl bg-slate-900 p-6">
              <p className="text-slate-400">Paused</p>
              <h2 className="mt-2 text-4xl font-bold text-yellow-400">
                {pausedMembers}
              </h2>
            </div>

            <div className="rounded-xl bg-slate-900 p-6">
              <p className="text-slate-400">Expiring in 7 Days</p>
              <h2 className="mt-2 text-4xl font-bold text-red-400">
                {expiringSoon}
              </h2>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/members"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700"
            >
              Manage Members
            </Link>

            <Link
              href="/members/new"
              className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-700"
            >
              Add Member
            </Link>

            <Link
              href="/scan"
              className="rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
            >
              Scan QR Code
            </Link>

            <Link
              href="/admin"
              className="rounded-lg bg-sky-800 px-6 py-3 font-semibold text-white"
            >
              Admin
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
