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
import type { Transaction } from '@/app/lib/definitions';
import { groupByDay } from '../lib/utils/chart-utils';
import { currencyFormatter } from '../lib/utils/number-utility';

export function DailyBalanceChart({transactions, selectedMonth,}: {  transactions: Transaction[], selectedMonth: number}) {
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
          <Tooltip formatter={currencyFormatter} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#4ade80" name="Inkomen" />
          <Line type="monotone" dataKey="expense" stroke="#f87171" name="Uitgaven" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
