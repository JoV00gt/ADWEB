'use server'

import { collection, doc, updateDoc, Timestamp, writeBatch, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function addTransactions(transactions: { amount: string; type: string; date: Date }[], budgetBookId: string) {
try {
    const batch = writeBatch(db);
    const txCollection = collection(db, 'budgetBooks', budgetBookId, 'transactions');

    transactions.forEach(tx => {
      const newDoc = doc(txCollection);
      batch.set(newDoc, {
        amount: tx.amount,
        type: tx.type,
        date: Timestamp.fromDate(tx.date),
      });
    });

    await batch.commit();
  } catch (err) {
    console.error('Failed to add transactions:', err);
    throw new Error('Transacties konden niet worden opgeslagen.');
  }
}

export async function updateTransaction(budgetBookId: string, transactionId: string, updated: { amount: string; type: string; date: Date }) {
  await updateDoc(doc(db, 'budgetBooks', budgetBookId, 'transactions', transactionId), {
    amount: updated.amount,
    type: updated.type,
    date: Timestamp.fromDate(updated.date),
  });
}

export async function deleteTransaction(budgetBookId: string, transactionId: string) {
  await deleteDoc(doc(db, 'budgetBooks', budgetBookId, 'transactions', transactionId));
}

export async function getTransactionById(budgetBookId: string, transactionId: string) {
  try {
    const docRef = doc(db, 'budgetBooks', budgetBookId, 'transactions', transactionId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      date: data.date.toDate(),
    };
  } catch {
    return null;
  }
}


