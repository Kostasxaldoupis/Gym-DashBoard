import Link from "next/link";
import MemberBarcode from "./MemberBarcode";
import QRCode from "react-qr-code";
import { editMember } from "@/actions/action";

type Plan = {
  id: string;
  name: string;
  price: number;
  durationDays: number;
};

type Membership = {
  id: string;
  planId: string;
  plan: Plan;
  startDate: Date;
  endDate: Date;
  active: boolean;
};

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  notes: string | null;
  dateOfBirth: Date | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  cardCode: string;
  memberships: Membership[];
};

type EditFormProps = {
  member: Member;
  plans: Plan[];
};

export default function EditForm({ member, plans }: EditFormProps) {
  const membership = member.memberships?.[0];

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
      <Link
        href="/members"
        className="mb-6 inline-block text-sm text-emerald-400 transition hover:underline"
      >
        ← Back to Members
      </Link>

      <h1 className="mb-2 text-4xl font-bold text-white">Edit Member</h1>
      <p className="mb-8 text-slate-400">
        Update member information and subscription details.
      </p>

      <form action={editMember} className="space-y-8">
        <input type="hidden" name="id" value={member.id} />

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
                type="text"
                defaultValue={member.firstName}
                placeholder="First Name"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                name="lastName"
                type="text"
                defaultValue={member.lastName}
                placeholder="Last Name"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Date of Birth
              </label>
              <input
                name="dateOfBirth"
                type="date"
                defaultValue={
                  member.dateOfBirth
                    ? member.dateOfBirth.toISOString().split("T")[0]
                    : ""
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                type="text"
                defaultValue={member.phone}
                placeholder="+1234567890"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                defaultValue={member.email ?? ""}
                placeholder="john@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                name="emergencyContactName"
                type="text"
                defaultValue={member.emergencyContactName ?? ""}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">
                Emergency Contact Phone
              </label>
              <input
                name="emergencyContactPhone"
                type="text"
                defaultValue={member.emergencyContactPhone ?? ""}
                placeholder="+1234567890"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Subscription
          </h2>

          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <label className="mb-2 block text-sm text-slate-300">
              Subscription Plan <span className="text-red-500">*</span>
            </label>

            <select
              name="planId"
              defaultValue={membership?.planId ?? ""}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} (${plan.price.toFixed(2)})
                </option>
              ))}
            </select>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Started</p>
                <p className="text-sm font-medium text-white">
                  {membership
                    ? membership.startDate.toLocaleDateString()
                    : "No active subscription"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Expires</p>
                <p className="text-sm font-medium text-white">
                  {membership
                    ? membership.endDate.toLocaleDateString()
                    : "No active subscription"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-2 block text-sm text-slate-300">Notes</label>
          <textarea
            name="notes"
            defaultValue={member.notes ?? ""}
            placeholder="Any additional notes about this member..."
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Save Changes
          </button>

          <Link
            href="/members"
            className="flex-1 rounded-lg bg-slate-600 py-3 text-center font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Member Access Card */}
      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h2 className="mb-4 text-center text-xl font-bold text-white">
          Member Access Card
        </h2>

        <div className="flex flex-col items-center gap-6">
          <div className="rounded-lg bg-white p-4">
            <QRCode value={member.cardCode} size={180} />
          </div>

          <div className="w-full max-w-md">
            <MemberBarcode value={member.cardCode} />
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-400">Card Code</p>
            <p className="font-mono text-lg font-semibold text-white">
              {member.cardCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}