'use client';

import { deleteTransaction } from '@/app/lib/actions/transactions-actions';
import type { Transaction } from '@/app/lib/definitions';
import Link from 'next/link';
import { useState } from 'react';
import { ConfirmDeleteModal } from '../confirm-delete-modal';
import { Pagination } from '../pagination';
import { paginate } from '@/app/lib/utils/pagination';
import ErrorMessage from '../error';

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
  const [showModal, setShowModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    setError('');
    try {
      await deleteTransaction(budgetBookId, transactionToDelete.id);
      setShowModal(false);
      setTransactionToDelete(null);
    } catch (error) {
      setError('Fout bij het verwijderen');
    }
  };

  const { paginatedItems: paginatedTransactions, totalPages: totalPages} = paginate(
    transactions,
    currentPage,
    ITEMS_PER_PAGE
  );

  return (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h3 className="text-lg font-semibold mb-4">Transacties</h3>
      <ErrorMessage message={error} />
      <ul className="space-y-2">
        {paginatedTransactions.map((tx, id) => {
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
                    onClick={() => handleDeleteClick(tx)}
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

      {totalPages > 1 && (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showModal}
        title="Transactie verwijderen?"
        message={`Weet je zeker dat je deze transactie van €${Number(transactionToDelete?.amount).toFixed(2)} wilt verwijderen?`}
        onCancel={() => setShowModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
