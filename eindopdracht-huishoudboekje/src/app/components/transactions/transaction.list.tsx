import { deleteTransaction } from '@/app/lib/actions/transactions-actions';
import type { Transaction } from '@/app/lib/definitions';
import { useState } from 'react';

export function TransactionList({ transactions, budgetBookId }: { transactions: Transaction[], budgetBookId: string }) {
  const [error, setError] = useState('');

  const handleDelete = async (bookId: string, transactionId: string) => {
    setError('');
    try {
      await deleteTransaction(bookId, transactionId);
    } catch (error) {
      setError('Fout bij het verwijderen');
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h3 className="text-lg font-semibold mb-4">Transacties</h3>
      {error && <p className="text-red-600">{error}</p>}
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
            <button onClick={() => handleDelete(budgetBookId, tx.id)}
              className="text-red-600 hover:text-red-800 text-sm">
              Verwijderen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
