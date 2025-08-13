import { db } from '../firebase';
import { collection, addDoc, Timestamp, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { validateBudget, validateName } from '../utils/validation-rules';

export async function addCategory(bookId: string, name: string, budget: number, endDate?: string) {
  validateName(name);
  validateBudget(budget);

  await addDoc(collection(db, 'budgetBooks', bookId, 'categories'), {
    name,
    budget,
    endDate: endDate ? new Date(endDate) : null,
  });
}

export async function updateCategory(budgetBookId: string, categoryId: string, updated: { name: string; budget: number, endDate?: Date | null }) {
    validateName(updated.name);
    validateBudget(updated.budget);
  await updateDoc(doc(db, 'budgetBooks', budgetBookId, 'categories', categoryId), {
      name: updated.name,
      budget: updated.budget,
      endDate: updated.endDate,
  });
}

export async function deleteCategory(budgetBookId: string, categoryId: string) {
  await deleteDoc(doc(db, 'budgetBooks', budgetBookId, 'categories', categoryId));
}

export async function getCategoryById(budgetBookId: string, categoryId: string) {
  try {
    const snapshot = await getDoc(doc(db, 'budgetBooks', budgetBookId, 'categories', categoryId));
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