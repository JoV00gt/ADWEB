'use server'

import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { redirect } from 'next/navigation';

export async function createBudgetBook(formData: FormData) {
  const name = formData.get('name')?.toString();
  const description = formData.get('description')?.toString() || '';

  if (!name || name.trim() == '') {
    throw new Error('Naam is verplicht');
  }

  await addDoc(collection(db, 'budgetBooks'), {
    name,
    description,
    createdAt: Timestamp.now(),
  });

  redirect('/dashboard');
}