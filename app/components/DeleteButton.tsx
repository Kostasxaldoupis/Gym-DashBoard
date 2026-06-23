// components/DeleteButton.tsx
"use client";

import { useTransition } from "react";
import { deleteMember } from "@/actions/action";

interface DeleteButtonProps {
  memberId: string;
  memberName: string;
}

export function DeleteButton({ memberId, memberName }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Delete ${memberName}? This action cannot be undone.`)) {
      return;
    }

    const formData = new FormData();
    formData.append("id", memberId);

    startTransition(async () => {
      await deleteMember(formData);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}