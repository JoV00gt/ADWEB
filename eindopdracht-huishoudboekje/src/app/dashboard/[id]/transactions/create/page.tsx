'use client'

import TransactionForm from '@/app/components/transactions/transaction-create-form';
import { useParams } from 'next/navigation';

export default function TransactionsPage() {
  const { id } = useParams();

  if (!id || typeof id !== 'string') {
    return <p>Geen geldig boek-ID</p>;
  }

  return <TransactionForm budgetBookId={id} />;
}
