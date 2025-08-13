'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { Category, Transaction } from '@/app/lib/definitions';
import { calculateExpensesPerCategory } from '../lib/utils/chart-utils';
import { currencyFormatter } from '../lib/utils/number-utils';

export function CategoryExpensesChart({ categories, transactions }: {categories: Category[], transactions: Transaction[]}) {
  const data = calculateExpensesPerCategory(categories, transactions);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Uitgaven per categorie</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={currencyFormatter} />
                <Bar data-testid="bar-uitgaven" dataKey="expense" fill="#f87171" name="Uitgaven" />
                <Bar data-testid="bar-budget" dataKey="budget" fill="#069767ff" name="Budget" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
