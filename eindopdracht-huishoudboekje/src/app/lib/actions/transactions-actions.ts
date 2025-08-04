'use server'

import { collection, doc, updateDoc, Timestamp, writeBatch, deleteDoc } from 'firebase/firestore';
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

export async function deleteTransaction(budgetBookId: string, transactionId: string) {
  await deleteDoc(doc(db, 'budgetBooks', budgetBookId, 'transactions', transactionId));
}

