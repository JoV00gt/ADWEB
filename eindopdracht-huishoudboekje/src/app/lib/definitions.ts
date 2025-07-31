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

export type User = {
  id: string;
  name: string;
  email: string;
}