import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your gym&apos;s data and settings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Members Card */}
          <Link
            href="/admin/members"
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500 hover:bg-slate-800/50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-600/20 p-3">
                <svg
                  className="h-8 w-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white group-hover:text-emerald-400">
                  Members
                </h2>
                <p className="text-sm text-slate-400">
                  View and manage all members
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-emerald-400 opacity-0 transition group-hover:opacity-100">
              Click to manage →
            </div>
          </Link>

          {/* Plans Card */}
          <Link
            href="/admin/plans"
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500 hover:bg-slate-800/50"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-emerald-600/20 p-3">
                <svg
                  className="h-8 w-8 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white group-hover:text-emerald-400">
                  Plans
                </h2>
                <p className="text-sm text-slate-400">
                  Manage subscription plans and pricing
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-emerald-400 opacity-0 transition group-hover:opacity-100">
              Click to manage →
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}