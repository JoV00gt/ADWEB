import type { Transaction } from '@/app/lib/definitions';
import { getTotalExpenses, getTotalIncome } from '@/app/lib/utils/number-utils';


export function TransactionStats({ transactions }: { transactions: Transaction[] }) {
  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);

  return (
    <div className="flex gap-6 mb-6">
      <div className="p-4 bg-green-100 rounded-lg w-1/2">
        <h2 className="text-lg font-medium text-green-800">Totale inkomsten</h2>
        <p className="text-2xl font-bold text-green-900">€ {totalIncome.toFixed(2)}</p>
      </div>
      <div className="p-4 bg-red-100 rounded-lg w-1/2">
        <h2 className="text-lg font-medium text-red-800">Totale uitgaven</h2>
        <p className="text-2xl font-bold text-red-900">€ {totalExpenses.toFixed(2)}</p>
      </div>
    </div>
  );
}
