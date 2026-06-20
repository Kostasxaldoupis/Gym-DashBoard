import Link from "next/link";
import QRCode from "react-qr-code";
import MemberBarcode from "./MemberBarcode";
import PrintButton from "./PrintButton";

type MemberCardProps = {
  member: {
    firstName: string;
    lastName: string;
    email: string | null;
    cardCode: string;
    memberships: {
      active: boolean;
      endDate: Date;
      plan: {
        name: string;
      };
    }[];
  };
};

export default function MemberCard({ member }: MemberCardProps) {
  const membership = member.memberships[0];

  const expired =
    membership && membership.endDate.getTime() < Date.now();

  const daysLeft = membership
    ? Math.max(
        0,
        Math.ceil(
          (membership.endDate.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  return (
    <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-xl">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-blue-400 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="mb-6 text-center text-3xl font-bold text-white">
        Gym Member Card
      </h1>

      <div className="space-y-3 text-slate-200">
        <p>
          <strong>Name:</strong> {member.firstName} {member.lastName}
        </p>

        <p>
          <strong>Email:</strong> {member.email ?? "—"}
        </p>

        <p>
          <strong>Plan:</strong>{" "}
          {membership ? (
            <>
              {membership.plan.name}{" "}
              <span className="text-emerald-400">
                ({daysLeft === 0 ? "Expired" : `${daysLeft} days left`})
              </span>
            </>
          ) : (
            "No subscription"
          )}
        </p>

        <p>
          <strong>Expires:</strong>{" "}
          {membership
            ? membership.endDate.toLocaleDateString()
            : "-"}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {!membership
            ? "No Plan"
            : !membership.active
            ? "Paused"
            : expired
            ? "Expired"
            : "Active"}
        </p>
      </div>

      <div className="my-6 flex justify-center rounded-lg bg-white p-4">
        <QRCode value={member.cardCode} size={180} />
      </div>

      <div className="my-6 overflow-hidden rounded-lg bg-white p-4">
        <div className="flex justify-center">
          <MemberBarcode value={member.cardCode} />
        </div>
      </div>

      <p className="mb-6 text-center text-slate-300">
        <strong>Card ID:</strong> {member.cardCode}
      </p>

      <PrintButton />
    </div>
  );
}