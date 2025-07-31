import { collection, onSnapshot, query, Unsubscribe, where} from 'firebase/firestore';
import type { BudgetBook } from '../definitions';
import { db } from '../firebase';

export function listenBudgetBooks(listener: (books: BudgetBook[]) => void, userId: string): Unsubscribe {
  const q1 = query(
    collection(db, 'budgetBooks'),
    where('archived', '==', false),
    where('ownerId', '==', userId),
  );

  const q2 = query(
    collection(db, 'budgetBooks'),
    where('archived', '==', false),
    where('participants', 'array-contains', userId)
  );

  const booksMap = new Map<string, BudgetBook>();

const unsubscribeOwner = onSnapshot(q1, (snapshot) => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'removed') {
      booksMap.delete(change.doc.id);
    } else {
      booksMap.set(change.doc.id, {
        id: change.doc.id,
        ...(change.doc.data() as Omit<BudgetBook, 'id'>),
      });
    }
  });
  listener(Array.from(booksMap.values()));
});

const unsubscribeParticipants = onSnapshot(q2, (snapshot) => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'removed') {
      booksMap.delete(change.doc.id);
    } else {
      booksMap.set(change.doc.id, {
        id: change.doc.id,
        ...(change.doc.data() as Omit<BudgetBook, 'id'>),
      });
    }
  });
  listener(Array.from(booksMap.values()));
});


  return () => {
    unsubscribeOwner();
    unsubscribeParticipants();
  };
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
