// src/firebase.js - WITH ANALYTICS FIXED

// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPQway8-7V1DU4NpotjOHUUq27obCFqLI",
  authDomain: "social-sentiment-prediction.firebaseapp.com",
  projectId: "social-sentiment-prediction",
  storageBucket: "social-sentiment-prediction.firebasestorage.appspot.com",
  messagingSenderId: "422776642253",
  appId: "1:422776642253:web:a9c0ef5c29edbc157c6784",
  measurementId: "G-LR3HVYDB0M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only in browser environment
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };