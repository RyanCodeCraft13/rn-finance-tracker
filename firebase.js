import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "rn-finance-tracker.firebaseapp.com",
  projectId: "rn-finance-tracker",
  storageBucket: "rn-finance-tracker.firebasestorage.app",
  messagingSenderId: "645028487506",
  appId: "1:645028487506:web:081ca83c28ee192593da8b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
