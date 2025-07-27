import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZmSPFYBr5QYQVmtSyGTs0bQISrqdi_KU",
  authDomain: "adweb-huishoudboekje-josvoogt.firebaseapp.com",
  projectId: "adweb-huishoudboekje-josvoogt",
  storageBucket: "adweb-huishoudboekje-josvoogt.firebasestorage.app",
  messagingSenderId: "1002496861425",
  appId: "1:1002496861425:web:c9a33b9426252237047550"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);