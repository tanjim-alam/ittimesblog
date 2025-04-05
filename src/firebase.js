import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBnyOCXgKcxYXaSoNM7l9y7cffSgqvdhBg",
  authDomain: "myblog-97291.firebaseapp.com",
  projectId: "myblog-97291",
  storageBucket: "myblog-97291.appspot.com", // ✅ Corrected this line
  messagingSenderId: "1035822544539",
  appId: "1:1035822544539:web:5c5a7c853259ccad80b83e",
  measurementId: "G-XXN6VLRZET"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
