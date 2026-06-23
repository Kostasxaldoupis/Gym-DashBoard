"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import NavBar from "../components/NavBar";

export default function ScanPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError("Please enter a member ID or card code");
      return;
    }

    if (trimmedCode.length < 3) {
      setError("Invalid member ID format. Please check and try again.");
      return;
    }

    setError("");
    setIsLoading(true);
    router.push(`/membercard/${trimmedCode}`);
  };

  const handleClear = () => {
    setCode("");
    setError("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <NavBar />

      <main className="min-h-screen bg-slate-950 p-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Find Member</h1>
            <p className="text-slate-400">
              Enter a member&apos;s card code to view their profile
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
            {/* QR Code Scanner Preview */}
            <div className="mb-6 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-slate-800">
                <span className="text-6xl">🔍</span>
              </div>
              <p className="text-sm text-slate-400">Enter member code manually</p>
              <p className="text-xs text-slate-500 mt-1">
                QR scanning coming soon
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-600/10 border border-red-600 p-3">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Manual Input Form */}
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    🔍
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter member ID or card code..."
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError("");
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-10 pr-12 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={isLoading}
                  />
                  {code && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 w-full rounded-lg bg-emerald-600 py-3 font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Look Up Member"}
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => router.push("/members")}
                className="rounded-lg border border-slate-700 bg-slate-800/50 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Browse All Members
              </button>
              <button
                type="button"
                onClick={() => router.push("/members/new")}
                className="rounded-lg border border-emerald-600 bg-emerald-600/10 py-2 text-sm text-emerald-400 transition hover:bg-emerald-600/20"
              >
                + Add New Member
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 rounded-lg bg-slate-800/30 p-4 border border-slate-700">
            <h3 className="mb-2 text-sm font-medium text-white">💡 Tips</h3>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Enter the card code displayed on the member&apos;s physical card</li>
              <li>• Codes are case-sensitive</li>
              <li>• Press Enter after typing to quickly look up a member</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}