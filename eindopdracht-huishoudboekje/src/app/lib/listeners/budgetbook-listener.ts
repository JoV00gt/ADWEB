import { collection, onSnapshot} from 'firebase/firestore';
import type { BudgetBook } from '../definitions';
import { db } from '../firebase';

export function listenBudgetBooks(listener: (data: BudgetBook[]) => void) {
  const unsubscribe = onSnapshot(collection(db, 'budgetBooks'), (snapshot) => {
    const books: BudgetBook[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<BudgetBook, 'id'>),
    }));
    listener(books);
  });

  return unsubscribe;
}