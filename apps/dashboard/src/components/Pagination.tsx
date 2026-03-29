import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
  paramName?: string;
}

export function Pagination({ totalPages, paramName = 'page' }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get(paramName)) || 1);

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const next = new URLSearchParams(searchParams);
    if (page === 1) {
      next.delete(paramName);
    } else {
      next.set(paramName, String(page));
    }
    setSearchParams(next, { replace: true });
  }

  // Generate page numbers to show
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-6" aria-label="Seitennavigation">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Vorherige Seite"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-1 text-xs text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`min-w-[32px] h-8 rounded text-xs font-medium transition-colors ${
              p === currentPage
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Nächste Seite"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
