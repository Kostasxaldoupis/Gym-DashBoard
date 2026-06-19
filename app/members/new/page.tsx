import Link from "next/link";
import { createMember } from "../../../actions/action";
import { prisma } from "@/lib/prisma";

export default async function NewMemberPage() {
  const plans = await prisma.plan.findMany({
    orderBy: {
      durationDays: "asc",
    },
  });

  
  return (
    <main className="min-h-screen bg-slate-900 p-8">
      <div className="mx-auto max-w-xl rounded-lg bg-slate-800 p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold text-black">Add Member</h1>

        <Link
          href="/"
          className="mb-4 inline-block text-blue-600 hover:underline"
        >
          ← Go Back
        </Link>

        <form action={createMember} className="justify-center space-y-3">

          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>

            <input
            name="firstName"
            placeholder="First Name"
            required
            className="w-full rounded border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500"
            />

          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>

          <input
            name="lastName"
            placeholder="Last Name"
            required
            className="w-full rounded border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500"
          />
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>

          <input
            name="phone"
            placeholder="Phone Number"
            required
            className="w-full rounded border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500"
          />

          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            name="email"
            placeholder="Email (optional)"
            className="w-full rounded border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500"
          />

          <label className="block text-sm font-medium text-gray-700">
            Subscription
          </label>

          <select
            name="planId"
            required
            className="w-full rounded border border-gray-300 bg-white p-3 text-black"
          >
            <option value="">Choose a subscription plan</option>

            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} — €{plan.price}
              </option>
            ))}
          </select>

          <textarea
            name="notes"
            placeholder="Notes"
            className="w-full rounded border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 resize-none"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
            >
              Save Member
            </button>

            <Link
              href="/members"
              className="rounded bg-amber-700 px-5 py-3 text-white-700 hover:bg-amber-900"
            >
              Cancel
            </Link>
          </div>
        </form>

      </div>
    </main>
  );
}
