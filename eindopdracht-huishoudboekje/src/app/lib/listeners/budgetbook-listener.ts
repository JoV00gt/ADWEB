import { collection, onSnapshot, query, Unsubscribe, where} from 'firebase/firestore';
import type { BudgetBook } from '../definitions';
import { db } from '../firebase';

export function listenBudgetBooks(listener: any): Unsubscribe {
  const q = query(collection(db, 'budgetBooks'), where('archived', '==', false));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const books: BudgetBook[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<BudgetBook, 'id'>),
    }));
    listener(books);
  });

  return unsubscribe;
}

export function listenArchivedBudgetBooks(listener: any): Unsubscribe {
  const q = query(collection(db, 'budgetBooks'), where('archived', '==', true));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const books: BudgetBook[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<BudgetBook, 'id'>),
    }));
    listener(books);
  });

  return unsubscribe;
}
