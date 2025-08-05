'use client'

import CategoryForm from '@/app/components/category/category-create-form';
import { notFound, useParams } from 'next/navigation';

export default function CreateCategoryPage() {
  const { id } = useParams();
  if (!id || typeof id !== 'string') return notFound();

  return <CategoryForm budgetBookId={id} />;
}
