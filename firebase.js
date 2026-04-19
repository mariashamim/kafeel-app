import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwkK2Mkwdb3yrZKZR1XBR73XXUyVs5FAU",
  authDomain: "kafeel-5eec8.firebaseapp.com",
  projectId: "kafeel-5eec8",
  storageBucket: "kafeel-5eec8.firebasestorage.app",
  messagingSenderId: "836194421738",
  appId: "1:836194421738:web:9de2ed0ba31937a22f0093"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);