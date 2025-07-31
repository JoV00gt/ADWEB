import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import type { User } from '../definitions';

export function listenToUsers(listener: (users: User[]) => void) {
  const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
    const users: User[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<User, 'id'>),
    }));
    listener(users);
  });

  return unsubscribe;
}
