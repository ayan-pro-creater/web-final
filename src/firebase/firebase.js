// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import the Storage function

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChyjot4JT--PYTfbBAhdFZJYM_CsiSu3M",
  authDomain: "web-ecom-58064.firebaseapp.com",
  projectId: "web-ecom-58064",
  storageBucket: "web-ecom-58064.firebasestorage.app",
  messagingSenderId: "867317078312",
  appId: "1:867317078312:web:0a5855c69270b4db95d81d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication, Firestore, and Storage services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Initialize Storage

export default app;
