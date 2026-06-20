interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalMembers: number;
  rangeStart: number;
  rangeEnd: number;
  createPageURL: (page: number) => string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalMembers,
  rangeStart,
  rangeEnd,
  createPageURL,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-between border-t border-slate-700 px-6 py-4">
      {/* Result count */}
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-300">{rangeStart}</span>–
        <span className="font-medium text-slate-300">{rangeEnd}</span> of{" "}
        <span className="font-medium text-slate-300">{totalMembers}</span>{" "}
        members
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        {currentPage > 1 ? (
          <a
            href={createPageURL(currentPage - 1)}
            className="flex items-center gap-1 rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            ← Prev
          </a>
        ) : (
          <span className="flex items-center gap-1 rounded-md border border-slate-800 px-3 py-2 text-sm text-slate-600 cursor-not-allowed select-none">
            ← Prev
          </span>
        )}

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 py-2 text-sm text-slate-600 select-none"
            >
              …
            </span>
          ) : (
            <a
              key={p}
              href={createPageURL(p)}
              className={`min-w-9 rounded-md border px-3 py-2 text-center text-sm font-medium transition
                ${
                  currentPage === p
                    ? "border-emerald-500 bg-emerald-600 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
            >
              {p}
            </a>
          )
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <a
            href={createPageURL(currentPage + 1)}
            className="flex items-center gap-1 rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            Next →
          </a>
        ) : (
          <span className="flex items-center gap-1 rounded-md border border-slate-800 px-3 py-2 text-sm text-slate-600 cursor-not-allowed select-none">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}