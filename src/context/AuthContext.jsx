// src/utils/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Signup with Firestore profile creation
  const signup = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    // Save profile to Firestore
    await setDoc(doc(db, "users", newUser.uid), {
      uid: newUser.uid,
      email: newUser.email,
      name: name,
      createdAt: serverTimestamp(),
    });

    // Update local user state
    setUser({ ...newUser, name });
    return newUser;
  };

  // 🔹 Login with Firestore profile fetching
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const loggedInUser = userCredential.user;

    // Fetch profile from Firestore
    const docSnap = await getDoc(doc(db, "users", loggedInUser.uid));
    let profile = docSnap.exists() ? docSnap.data() : null;

    setUser({ ...loggedInUser, ...profile });
    return loggedInUser;
  };

  // 🔹 Logout
  const logout = () => signOut(auth);

  // 🔹 Reset Password
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // 🔹 Update User Profile (Firebase Auth + Firestore)
  const updateUserProfile = async (updates) => {
    if (!auth.currentUser) return null;

    try {
      // Update Firebase Auth profile
      if (updates.displayName || updates.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName,
          photoURL: updates.photoURL
        });
      }

      // Update Firestore profile (merge so we don't overwrite)
      const firestoreUpdates = { ...updates };
      delete firestoreUpdates.photoURL; // Remove photoURL if it exists
      
      await setDoc(
        doc(db, "users", auth.currentUser.uid), 
        firestoreUpdates, 
        { merge: true }
      );

      // Refresh local user state
      const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const firestoreData = docSnap.exists() ? docSnap.data() : {};
      
      setUser({ 
        ...auth.currentUser, 
        ...firestoreData,
        displayName: updates.displayName || auth.currentUser.displayName
      });

      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // 🔹 Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore
          const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          let profile = docSnap.exists() ? docSnap.data() : {};
          
          setUser({ 
            ...firebaseUser, 
            ...profile,
            // Ensure name is available for both Auth and Firestore
            name: profile.name || firebaseUser.displayName 
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};