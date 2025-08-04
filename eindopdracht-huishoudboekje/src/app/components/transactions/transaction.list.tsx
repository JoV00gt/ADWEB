import type { Transaction } from '@/app/lib/definitions';

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h3 className="text-lg font-semibold mb-4">Transacties</h3>
      <ul className="space-y-2">
        {transactions.map((tx, id) => (
          <li key={id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-sm text-gray-800">{tx.date.toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">{tx.type}</p>
            </div>
            <p
              className={`text-sm font-medium ${
                tx.type === 'inkomen' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              € {Number(tx.amount).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
