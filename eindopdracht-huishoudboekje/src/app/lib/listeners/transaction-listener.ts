import { collection, onSnapshot, orderBy, query, Timestamp, Unsubscribe, where } from "firebase/firestore";
import { db } from "../firebase";
import { Transaction } from "../definitions";

export function listenTransactions(listener: any, budgetBookId: any, month: any): Unsubscribe {
    const transactionCollection = collection(db, 'budgetBooks', budgetBookId, 'transactions');

    const year = new Date().getFullYear();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    const q = query(
        transactionCollection,
        where('date', '>=', start),
        where('date', '<', end),
        orderBy('date', 'desc')
    );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const transactions: Transaction[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Transaction, 'id' | 'date'>),
      date: (doc.data().date as Timestamp).toDate(),
    }));

    listener(transactions);
  });

  return unsubscribe;
}