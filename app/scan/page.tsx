"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import NavBar from "../components/NavBar";

export default function ScanPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  return (
    <>
      <NavBar />
      <main>
        <h1 className="mb-4 text-3xl font-bold">Scan Member</h1>
        <input
          className="rounded border p-3 text-white"
          placeholder="Paste or scan member ID"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`/membercard/${code}`);
            }
          }}
        />
      </main>
    </>
  );
}
