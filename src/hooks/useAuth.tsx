// src/hooks/useAuth.tsx
"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData: UserData | null; // Add userData state
  logout: () => Promise<void>;
}

// Define a type for extra user data stored in Firestore
interface UserData {
  fullName?: string;
  businessActivity?: string;
  address?: string;
  // Add other fields as needed
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userData: null,
  logout: async () => {},
});

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch additional user data from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as UserData);
          } else {
            console.log("No such user document!");
            setUserData(null); // Reset if document doesn't exist
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null); // Reset on error
        }
      } else {
        setUserData(null); // Clear user data on logout
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // State updates (user, userData) are handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle logout error (e.g., show toast)
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, userData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
