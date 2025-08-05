import { Timestamp } from "firebase/firestore";

export type BudgetBook = {
  id: string;
  name: string;
  ownerId: string;
  description: string;
  archived: boolean;
  participants: string[];
  createdAt: Timestamp
};

export type Category = {
  id: string;
  name: string;
  budget: number;
  endDate?: Date;
  budgetBookId: string;
};

export type Transaction = {
  id: string; 
  amount: number;
  type: 'uitgave' | 'inkomen'; 
  date: Date; 
  categoryId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
}