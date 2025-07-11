import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Your Firebase config object (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyANdHMYmHXw2l0WV3sTRaM8puadeUesDaM",
  authDomain: "mms-portfolio.firebaseapp.com",
  projectId: "mms-portfolio",
  storageBucket: "mms-portfolio.firebasestorage.app",
  messagingSenderId: "496712903312",
  appId: "1:496712903312:web:9f350ae3bae90ff7998615",
  measurementId: "G-198RBQ33RP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Now you can use Firestore
const db = getFirestore(app, "mms-portfolio");

const docRef = doc(db, "portfolio", "about-me");
getDoc(docRef)
  .then((snap) => {
    if (snap.exists()) {
      console.log(snap.data());
    } else {
      console.log("No such document!");
    }
  })
  .catch(console.error);
