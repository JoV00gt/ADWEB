import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return await signOut(auth);
}
