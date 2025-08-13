'use client';

import { useState, useEffect } from 'react';

export function useDebounced(onInput: (query: string) => void, delay = 300) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => { 
      onInput(value.trim().toLowerCase());
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, onInput]);

  return { value, setValue };
}
