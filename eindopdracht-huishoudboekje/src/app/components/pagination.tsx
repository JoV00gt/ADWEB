'use client';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
      >
        Vorige
      </button>

      <span className="px-3 py-1 text-gray-800">
        Pagina {currentPage} van {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
      >
        Volgende
      </button>
    </div>
  );
}
