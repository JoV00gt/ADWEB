import { collection, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase';

export function listenBudgetBooks(listener: (data: DocumentData[]) => void) {
  const unsubscribe = onSnapshot(collection(db, 'budgetBooks'), (snapshot) => {
    const books = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    listener(books);
  });

  return unsubscribe;
}
