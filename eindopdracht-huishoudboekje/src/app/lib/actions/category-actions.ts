import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function addCategory(bookId: string, name: string, maxAmount: number, endDate?: string) {
  if (!name) throw new Error('Naam is verplicht');

  await addDoc(collection(db, 'budgetBooks', bookId, 'categories'), {
    name,
    maxAmount,
    endDate: endDate ? Timestamp.fromDate(new Date(endDate)) : null,
  });
}
