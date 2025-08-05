'use server'

import { addDoc, collection, Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { redirect } from 'next/navigation';
import { validateName, validateUserId } from '../utils/validation-rules';

export async function createBudgetBook(formData: FormData, userId: any) {
  const name = formData.get('name')?.toString();
  const description = formData.get('description')?.toString() || '';
  const participantIds = formData.getAll('participantIds').map(id => id.toString());
  
  validateName(name);
  validateUserId(userId);

  await addDoc(collection(db, 'budgetBooks'), {
    name,
    description,
    archived: false,
    ownerId: userId,
    participants: participantIds,
    createdAt: Timestamp.now(),
  });

  redirect('/dashboard');
}


export async function updateBudgetBook(id: string, formData: FormData) {
  const name = formData.get('name')?.toString();
  const description = formData.get('description')?.toString() || '';
  const participantIds = Array.from(
    new Set(formData.getAll('participantIds').map(id => id.toString()))
  );

  validateName(name);

  await updateDoc(doc(db, 'budgetBooks', id), {
    name,
    description,
    participants: participantIds
  });

  redirect('/dashboard');
}


export async function archiveBudgetBook(id: string, archived: boolean) {
  const book = doc(db, 'budgetBooks', id);
  await updateDoc(book, {
    archived: archived,
  });
}

export async function getBudgetBookById(id: string) {
  const budgetBook = await getDoc(doc(db, 'budgetBooks', id));
  if (!budgetBook.exists()) return null;
  const data = budgetBook.data();

  return {
    id: budgetBook.id,
    name: data.name,
    ownerId: data.ownerId,
    archived: data.archived,
    description: data.description,
    participants: data.participants,
    createdAt: data.createdAt.toDate().toISOString(),
  };
}