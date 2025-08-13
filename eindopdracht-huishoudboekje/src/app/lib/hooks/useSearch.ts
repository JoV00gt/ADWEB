import { useState, useMemo } from 'react';

export function useSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean
) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    return items.filter(item => searchFn(item, searchQuery));
  }, [items, searchQuery, searchFn]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems
  };
}
