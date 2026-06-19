import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="border-b border-slate-700 bg-slate-800 shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🏋️</span>
          <span className="text-2xl font-bold text-white">
            Gym<span className="text-emerald-400">Flow</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-slate-200 transition hover:bg-slate-800 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/members/"
            className="rounded-lg px-4 py-2 text-slate-200 transition hover:bg-slate-800 hover:text-white"
          >
            View all members
          </Link>
          <Link
            href="/members/new"
            className="rounded-lg px-4 py-2 text-slate-200 transition hover:bg-slate-800 hover:text-white"
          >
            Add Member
          </Link>

          <Link
            href="/admin"
            className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white transition hover:bg-emerald-600"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
