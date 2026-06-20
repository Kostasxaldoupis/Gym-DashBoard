import { createMember } from "@/actions/action";
import Link from "next/link";

type AddFormProps = {
  plans: {
    id: string;
    name: string;
    price: number;
  }[];
};

export default function AddForm({ plans }: AddFormProps) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
      <Link
        href="/members"
        className="mb-6 inline-block text-sm text-emerald-400 transition hover:underline"
      >
        ← Back to Members
      </Link>

      <h1 className="mb-2 text-4xl font-bold text-white">Add New Member</h1>

      <p className="mb-8 text-slate-400">
        Register a new gym member and create their subscription.
      </p>

      <form action={createMember} className="space-y-8">
        {/* Personal Information */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Personal Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                name="firstName"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="First Name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                name="lastName"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Last Name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="+1234567890"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Emergency Contact
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Emergency Contact Name
              </label>
              <input
                type="text"
                name="emergencyContactName"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Emergency Name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Emergency Contact Phone
              </label>
              <input
                type="text"
                name="emergencyContactPhone"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="+1234567890"
              />
            </div>
          </div>
        </div>

        {/* Membership */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Membership</h2>

          <label className="mb-2 block text-sm text-slate-300">
            Subscription Plan <span className="text-red-500">*</span>
          </label>

          <select
            name="planId"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <option value="">Select a plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} (${plan.price.toFixed(2)})
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">Notes</label>
          <textarea
            name="notes"
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="Any additional notes about this member..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Save Member
          </button>

          <Link
            href="/members"
            className="flex-1 rounded-lg bg-slate-600 py-3 text-center font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
