import EditTransactionForm from '@/app/components/transactions/transaction-edit-form';
import { getTransactionById } from '@/app/lib/actions/transactions-actions';
import { notFound } from 'next/navigation';

export default async function EditTransactionPage({params}: {params: Promise<{ id: string; transactionid: string }>}) {
  const { id: budgetBookId, transactionid } = await params;

  const transaction = await getTransactionById(budgetBookId, transactionid);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Transactie bewerken</h1>
      <EditTransactionForm budgetBookId={budgetBookId} transaction={transaction} />
    </div>
  );
}
