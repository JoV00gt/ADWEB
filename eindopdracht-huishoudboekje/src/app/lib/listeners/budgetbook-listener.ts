import { collection, onSnapshot, query, Unsubscribe, where} from 'firebase/firestore';
import type { BudgetBook } from '../definitions';
import { db } from '../firebase';

export function listenBudgetBooks(listener: any, userId: any): Unsubscribe {
  const q = query(collection(db, 'budgetBooks'), where('archived', '==', false), where('ownerId', '==', userId),);

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const books: BudgetBook[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<BudgetBook, 'id'>),
    }));
    listener(books);
  });

  return unsubscribe;
}

export function listenArchivedBudgetBooks(listener: any, userId: any): Unsubscribe {
  const q = query(collection(db, 'budgetBooks'), where('archived', '==', true), where('ownerId', '==', userId),);

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const books: BudgetBook[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<BudgetBook, 'id'>),
    }));
    listener(books);
  });

  return unsubscribe;
}
