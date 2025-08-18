import BudgetBookEditClient from '@/app/components/budgetbook-edit-client';
import { getBudgetBookById } from '@/app/lib/actions/budgetbook-actions';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const book = await getBudgetBookById(id);

  if (!book) notFound();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Huishoudboekje bewerken</h1>
      <BudgetBookEditClient book={book} />
    </div>
  );
}
