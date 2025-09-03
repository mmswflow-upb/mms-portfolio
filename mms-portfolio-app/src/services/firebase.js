import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../config/firebase-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "mms-portfolio");
export const storage = getStorage(app);
export const auth = getAuth(app);
