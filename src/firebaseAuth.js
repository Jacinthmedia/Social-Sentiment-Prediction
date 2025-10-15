// src/firebaseAuth.js
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Signup function
export async function signup(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Save user email to Firestore
    await setDoc(doc(db, "users", user.uid), { email: user.email, createdAt: new Date() });
    return user;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// Login function
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// Logout function
export function logout() {
  return signOut(auth);
}