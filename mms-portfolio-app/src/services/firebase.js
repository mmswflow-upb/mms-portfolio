import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANdHMYmHXw2l0WV3sTRaM8puadeUesDaM",
  authDomain: "mms-portfolio.firebaseapp.com",
  projectId: "mms-portfolio",
  storageBucket: "mms-portfolio.firebasestorage.app",
  messagingSenderId: "496712903312",
  appId: "1:496712903312:web:9f350ae3bae90ff7998615",
  measurementId: "G-198RBQ33RP",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
