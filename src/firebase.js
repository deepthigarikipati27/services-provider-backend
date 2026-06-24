// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOYGrBPEEYU_WvL-kzWCZM8EeAYpOHhvU",
  authDomain: "services-provider-db7dd.firebaseapp.com",
  projectId: "services-provider-db7dd",
  storageBucket: "services-provider-db7dd.firebasestorage.app",
  messagingSenderId: "923371568736",
  appId: "1:923371568736:web:5f38ff12bcef211d67cd05"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);