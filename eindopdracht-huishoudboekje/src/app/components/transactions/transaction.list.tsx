import { deleteTransaction } from '@/app/lib/actions/transactions-actions';
import type { Transaction } from '@/app/lib/definitions';
import Link from 'next/link';
import { useState } from 'react';

export function TransactionList({
  transactions,
  budgetBookId,
  currentUser,
  ownerId,
  categories,
}: {
  transactions: Transaction[];
  budgetBookId: string;
  currentUser: string | null;
  ownerId: string;
  categories: { id: string; name: string }[];
}) {
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
        {transactions.map((tx, id) => {
          const categoryName =
            categories.find((cat) => cat.id === tx.categoryId)?.name || 'Geen categorie';

          return (
            <li
              key={id}
              className="flex justify-between items-center border-b pb-2 flex-wrap sm:flex-nowrap gap-y-2"
            >
              <div>
                <p className="text-sm text-gray-800">{tx.date.toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">{tx.type}</p>
                <p className="text-sm text-gray-500 italic">{categoryName}</p>
              </div>

              <p
                className={`text-sm font-medium ${
                  tx.type === 'inkomen' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                € {Number(tx.amount).toFixed(2)}
              </p>

              {ownerId === currentUser && (
                <div className="flex items-center gap-8">
                  <Link
                    href={`/dashboard/${budgetBookId}/transactions/${tx.id}/edit`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Bewerken
                  </Link>
                  <button
                    onClick={() => handleDelete(budgetBookId, tx.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Verwijderen
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
