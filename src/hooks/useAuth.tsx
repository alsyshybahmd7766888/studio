// src/hooks/useAuth.tsx
"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Changed back to alias path
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
    console.log('AuthProvider: Setting up onAuthStateChanged listener.');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('AuthProvider: onAuthStateChanged triggered.');
      setUser(currentUser); // Set user state immediately

      try {
        if (currentUser) {
          console.log('AuthProvider: User detected:', currentUser.uid);
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            console.log('AuthProvider: User data found.');
            setUserData(userDocSnap.data() as UserData);
          } else {
            console.log("AuthProvider: No user document found!");
            setUserData(null);
          }
        } else {
          console.log('AuthProvider: No user detected.');
          setUserData(null);
        }
      } catch (error) {
        console.error("AuthProvider: Error fetching user data:", error);
        setUserData(null); // Ensure userData is null on error
      } finally {
        // Ensure loading is set to false AFTER all async operations are done
        console.log('AuthProvider: Finished processing auth state change, setting loading to false.');
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('AuthProvider: Cleaning up onAuthStateChanged listener.');
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    console.log('AuthProvider: logout called.');
    try {
      await firebaseSignOut(auth);
      console.log('AuthProvider: Firebase sign out successful.');
      // State updates are handled by onAuthStateChanged
    } catch (error) {
      console.error("AuthProvider: Error signing out: ", error);
    }
  };

  // Log initial provider state
  console.log(`AuthProvider: Initial state - loading=${loading}, user=${!!user}`);

  return (
    <AuthContext.Provider value={{ user, loading, userData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
