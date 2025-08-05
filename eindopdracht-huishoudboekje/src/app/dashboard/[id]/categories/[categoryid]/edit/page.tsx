import EditCategoryForm from '@/app/components/category/category-edit-form';
import { getCategoryById } from '@/app/lib/actions/category-actions'; 
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({params}: {params: Promise<{ id: string; categoryid: string }>}) {
const { id: budgetBookId, categoryid } = await params;

  const category = await getCategoryById(budgetBookId, categoryid);
  if (!category) return notFound();

  return <EditCategoryForm category={category} budgetBookId={budgetBookId} />;
}
