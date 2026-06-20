"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="w-full rounded-lg bg-emerald-600 py-2 font-medium text-white hover:bg-emerald-700"
    >
      Print Member Card
    </button>
  );
}