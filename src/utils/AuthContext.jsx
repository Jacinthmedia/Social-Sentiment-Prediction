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
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// 🔹 Helper: format user into plain JSON object
const formatUser = (firebaseUser, profile = {}) => {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName:
      firebaseUser.displayName || profile.name || firebaseUser.email?.split("@")[0],
    photoURL: firebaseUser.photoURL || profile.photoURL || null,
    emailVerified: firebaseUser.emailVerified,
    provider: profile.provider || 'email',
    ...profile,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔹 Google Auth Provider
  const googleProvider = new GoogleAuthProvider();

  // 🔹 Clear error
  const clearError = () => setError('');

  // 🔹 Signup with email/password
  const signup = async (email, password, name) => {
    try {
      clearError();
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Update Firebase Auth displayName
      if (name) {
        await updateProfile(newUser, { displayName: name });
      }

      // Create Firestore profile
      const profileData = {
        uid: newUser.uid,
        email: newUser.email,
        name: name,
        displayName: name,
        photoURL: null,
        emailVerified: newUser.emailVerified,
        provider: 'email',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", newUser.uid), profileData);

      console.log("✅ Email signup successful");
      return newUser;
    } catch (error) {
      console.error("❌ Signup error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login with email/password
  const login = async (email, password) => {
    try {
      clearError();
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login timestamp
      await updateDoc(doc(db, "users", userCredential.user.uid), {
        lastLoginAt: serverTimestamp(),
      });

      console.log("✅ Email login successful");
      return userCredential.user;
    } catch (error) {
      console.error("❌ Login error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google Sign-In
  const signInWithGoogle = async () => {
    try {
      clearError();
      setLoading(true);

      console.log("🔐 Attempting Google sign in");
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document for Google sign-in
        const profileData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          provider: 'google',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        };
        await setDoc(doc(db, "users", user.uid), profileData);
        
        console.log("✅ New Google user created in Firestore");
      } else {
        // Update last login for existing user
        await updateDoc(doc(db, "users", user.uid), {
          lastLoginAt: serverTimestamp(),
          photoURL: user.photoURL, // Update profile picture if changed
          displayName: user.displayName, // Update name if changed
        });
        console.log("✅ Existing Google user signed in");
      }

      return result;
    } catch (error) {
      console.error("❌ Google sign in error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      clearError();
      console.log("🚪 Attempting logout");
      
      await signOut(auth);
      setUser(null);
      
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
      setError(error.message);
      throw error;
    }
  };

  // 🔹 Reset password
  const resetPassword = async (email) => {
    try {
      clearError();
      setLoading(true);
      
      await sendPasswordResetEmail(auth, email);
      console.log("✅ Password reset email sent");
    } catch (error) {
      console.error("❌ Password reset error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update user profile (Firestore + Firebase Auth)
  const updateUserProfile = async (updates) => {
    if (!user) return;

    try {
      clearError();
      setLoading(true);

      // Update Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Update Firebase Auth profile (name/photo only)
      if (updates.name || updates.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: updates.name || auth.currentUser.displayName,
          photoURL: updates.photoURL || auth.currentUser.photoURL,
        });
      }

      // Refresh local state
      const updatedDoc = await getDoc(userRef);
      setUser(formatUser(auth.currentUser, updatedDoc.data()));

      console.log("✅ Profile updated successfully");
    } catch (error) {
      console.error("❌ Profile update error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("🔥 Auth state changed:", firebaseUser);
      
      if (firebaseUser) {
        let profile = {};
        try {
          const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (docSnap.exists()) {
            profile = docSnap.data();
          }
        } catch (err) {
          console.error("❌ Error fetching user profile:", err);
        }
        setUser(formatUser(firebaseUser, profile));
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
    signInWithGoogle,
    loading,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};