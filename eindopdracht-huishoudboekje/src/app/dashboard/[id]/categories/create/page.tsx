'use client'

import CategoryForm from '@/app/components/category/category-create-form';
import { useParams } from 'next/navigation';

export default function CreateCategoryPage() {
  const { id } = useParams();
  if (!id || typeof id !== 'string') return <p>Geen geldig ID</p>;

  return <CategoryForm budgetBookId={id} />;
}
