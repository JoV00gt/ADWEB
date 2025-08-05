import { db } from '../firebase';
import { collection, addDoc, Timestamp, updateDoc, doc, getDoc } from 'firebase/firestore';

export async function addCategory(bookId: string, name: string, budget: number, endDate?: string) {
  if (!name) throw new Error('Naam is verplicht');

  await addDoc(collection(db, 'budgetBooks', bookId, 'categories'), {
    name,
    budget,
    endDate: endDate ? Timestamp.fromDate(new Date(endDate)) : null,
  });
}

export async function updateCategory(budgetBookId: string, categoryId: string, updated: { name: string; budget: number, endDate?: Date | null }) {
  await updateDoc(doc(db, 'budgetBooks', budgetBookId, 'categories', categoryId), {
      name: updated.name,
      budget: updated.budget,
      endDate: updated.endDate,
  });
}

export async function getCategoryById(budgetBookId: string, categoryId: string) {
  try {
    const docRef = doc(db, 'budgetBooks', budgetBookId, 'categories', categoryId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      endDate: data.endDate ? data.endDate.toDate?.() || new Date(data.endDate) : null,
    };
  } catch {
    return null;
  }
}