import { useState } from 'react';

export function useSelectedMonth() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  return { selectedMonth, setSelectedMonth };
}