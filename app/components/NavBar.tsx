import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-8 py-4">
      <div>
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-bold text-white">
            🏋️ Gym
            <span className="text-emerald-500">Flow</span>
          </h1>
        </Link>
      </div>

      {/* <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Home
        </Link>
        <Link
          href="/members"
          className="rounded-lg px-4 py-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Members
        </Link>
        <Link
          href="/members/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
        >
          + Add Member
        </Link>
        <Link
          href="/scan"
          className="rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700"
        >
          Scan Card
        </Link>

        <Link
          href="/admin"
          className="rounded-lg bg-sky-800 px-6 py-3 font-semibold text-white"
        >
          Admin
        </Link>
      </div> */}
    </nav>
  );
}
