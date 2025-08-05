import { onSnapshot, collection, query, where, Unsubscribe} from 'firebase/firestore';
import { db } from '../firebase';
import { Category } from '../definitions';

export function listenCategories(listener: (categories: Category[]) => void, budgetBookId: string): Unsubscribe {
    const q = query(collection(db, 'categories'), where('budgetBookId', '==', budgetBookId));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const categories: Category[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];

    listener(categories);
  });

  return unsubscribe;


}

