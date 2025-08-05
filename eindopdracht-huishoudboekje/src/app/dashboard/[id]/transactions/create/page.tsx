'use client'

import TransactionForm from '@/app/components/transactions/transaction-create-form';
import { notFound, useParams } from 'next/navigation';

export default function TransactionsPage() {
  const { id } = useParams();

  if (!id || typeof id !== 'string') {
    return notFound();
  }

  return <TransactionForm budgetBookId={id} />;
}
