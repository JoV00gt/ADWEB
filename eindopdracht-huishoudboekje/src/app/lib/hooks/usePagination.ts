import { useState, useMemo } from 'react';
import { paginate } from '../utils/pagination';

export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const { paginatedItems, totalPages } = useMemo(() => {
    return paginate(items, currentPage, itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalPages
  };
}
