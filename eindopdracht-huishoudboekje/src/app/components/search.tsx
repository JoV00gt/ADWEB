'use client';

import { useState, useEffect } from 'react';

export function SearchInput({ placeholder = 'Zoeken...', onSearch }: { placeholder?: string, onSearch: (query: string) => void}) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(value.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [value, onSearch]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full md:w-1/3 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
