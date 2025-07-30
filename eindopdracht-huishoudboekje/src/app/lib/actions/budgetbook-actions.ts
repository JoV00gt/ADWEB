'use server'

import { addDoc, collection, Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { redirect } from 'next/navigation';

export async function createBudgetBook(formData: FormData, userId: any) {
  const name = formData.get('name')?.toString();
  const description = formData.get('description')?.toString() || '';

  if (!name || name.trim() == '') {
    throw new Error('Naam is verplicht');
  }

  if(!userId) {
     throw new Error('Gebruiker is niet ingelogd');
  }

  await addDoc(collection(db, 'budgetBooks'), {
    name,
    description,
    archived: false,
    ownerId: userId,
    createdAt: Timestamp.now(),
  });

  redirect('/dashboard');
}

export async function updateBudgetBook(id: string, formData: FormData) {
  const name = formData.get('name')?.toString();
  const description = formData.get('description')?.toString() || '';

  if (!name || name.trim() == '') {
    throw new Error('Naam is verplicht');
  }

  await updateDoc(doc(db, 'budgetBooks', id), {
    name,
    description,
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
  const docRef = doc(db, 'budgetBooks', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();

  return {
    id: docSnap.id,
    name: data.name,
    ownerId: data.ownerId,
    archived: data.archived,
    description: data.description,
  };
}