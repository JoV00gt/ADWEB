'use client';

import { useState, useEffect } from 'react';

type SearchInputProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
};

export function SearchInput({ placeholder = 'Zoeken...', onSearch }: SearchInputProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(value.trim().toLowerCase());
    }, 300); // Debounced for 300ms

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
