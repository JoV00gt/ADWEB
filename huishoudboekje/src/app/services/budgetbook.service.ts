import { Injectable } from '@angular/core';
import { BudgetBook } from '../models/budget-book.model';
import { Observable, Subscriber } from 'rxjs';

import { initializeApp } from "firebase/app";
import { Firestore, getFirestore, onSnapshot, collection, doc, addDoc, deleteDoc } from "firebase/firestore";
import { subscribe } from 'diagnostics_channel';

@Injectable({
  providedIn: 'root'
})

export class BudgetbookService {

  firestore: Firestore;

  constructor() {

  const firebaseConfig = {
    apiKey: "AIzaSyDime8q0kYGxyE8uBzYqy4sWAVJ-pMiABs",
    authDomain: "huishoudboekje-josvoogt.firebaseapp.com",
    projectId: "huishoudboekje-josvoogt",
    storageBucket: "huishoudboekje-josvoogt.appspot.com",
    messagingSenderId: "1057281856389",
    appId: "1:1057281856389:web:79b6f85239c16107796aec",
    measurementId: "G-VDWHGRNTKW"
  };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    this.firestore = getFirestore(app);
  }

  getBudgetBooks(): Observable<BudgetBook[]> {
    return new Observable((subscriber: Subscriber<any[]>) => {
      onSnapshot(collection(this.firestore, 'books'), (snapshot) => {
        let books: any[] = [];
        snapshot.forEach((doc) => {
          let book = doc.data();
          book['id'] = doc.id;
          books.push(book);
        });
        subscriber.next(books);
      });
    });
  }

  addBudgetBook(book: BudgetBook): void {
    const object = Object.assign({}, book);
    addDoc(collection(this.firestore, 'books'), object);
  }

  getBudgetBook(id: string): Observable<BudgetBook | undefined> {
    return new Observable((subscriber: Subscriber<any>) => {
      if (id == '') {
        subscriber.next(null);
      } else {
        onSnapshot(doc(this.firestore, 'books', id), (doc) => {
          let book = doc.data() ?? null;
          if (book) {
            book['id'] = doc.id;
          }
          subscriber.next(book);
        });
      }
    })
  }
}
