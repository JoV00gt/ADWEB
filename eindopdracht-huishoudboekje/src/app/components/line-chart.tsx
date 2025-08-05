'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { eachDayOfInterval, format, startOfMonth, endOfMonth } from 'date-fns';
import type { Transaction } from '@/app/lib/definitions';

type DailyBalanceChartProps = {
  transactions: Transaction[];
  selectedMonth: number; // 0-indexed (e.g., Jan = 0, Aug = 7)
};

function groupByDay(transactions: Transaction[], month: number) {
  if (transactions.length === 0) return [];

  // Derive year from the first transaction
  const year = new Date(transactions[0].date).getFullYear();

  const days = eachDayOfInterval({
    start: startOfMonth(new Date(year, month)),
    end: endOfMonth(new Date(year, month)),
  });

  const dayMap = new Map<string, { income: number; expense: number }>();

  // Initialize all days in the selected month
  days.forEach((day) => {
    const key = format(day, 'yyyy-MM-dd');
    dayMap.set(key, { income: 0, expense: 0 });
  });

  transactions.forEach(({ date, amount, type }) => {
    const dayKey = format(new Date(date), 'yyyy-MM-dd');
    if (!dayMap.has(dayKey)) return;

    const entry = dayMap.get(dayKey)!;
    if (type === 'inkomen') {
      entry.income += Number(amount);
    } else {
      entry.expense += Number(amount);
    }
  });

  return Array.from(dayMap.entries()).map(([date, { income, expense }]) => ({
    date: format(new Date(date), 'dd MMM'),
    income,
    expense,
  }));
}

export function DailyBalanceChart({
  transactions,
  selectedMonth,
}: DailyBalanceChartProps) {
  const data = groupByDay(transactions, selectedMonth);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Dagelijkse inkomsten / uitgaven</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" interval={Math.floor(data.length / 6)} />
          <YAxis
            tickFormatter={(value) => `€${value}`}
            width={60}
          />
          <Tooltip
            formatter={(value: any) =>
              typeof value === 'number' ? `€${value.toFixed(2)}` : value
            }
          />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#4ade80" name="Inkomen" />
          <Line type="monotone" dataKey="expense" stroke="#f87171" name="Uitgaven" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
