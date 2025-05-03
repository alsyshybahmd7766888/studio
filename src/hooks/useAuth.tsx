// src/hooks/useAuth.tsx
"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Ensure alias path is correct
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast'; // Import useToast

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
  const { toast } = useToast(); // Get toast function

  useEffect(() => {
    console.log('AuthProvider: Setting up onAuthStateChanged listener.');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('AuthProvider: onAuthStateChanged triggered.');
      setUser(currentUser); // Set user state immediately
      setLoading(true); // Set loading to true while potentially fetching data

      if (currentUser) {
        console.log('AuthProvider: User detected:', currentUser.uid);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            console.log('AuthProvider: User data found.');
            setUserData(userDocSnap.data() as UserData);
          } else {
            console.log("AuthProvider: No user document found!");
            setUserData(null);
          }
        } catch (error: any) {
          console.error("AuthProvider: Error fetching user data:", error);
          // Check for offline error
          if (error.code === 'unavailable' || (error.message && error.message.includes('offline'))) {
             toast({
               title: "غير متصل",
               description: "لا يمكن جلب بيانات المستخدم حالياً. يرجى التحقق من اتصالك بالإنترنت.",
               variant: "destructive",
               duration: 5000, // Show for 5 seconds
             });
          } else {
             toast({
               title: "خطأ",
               description: "حدث خطأ أثناء جلب بيانات المستخدم.",
               variant: "destructive",
             });
          }
          setUserData(null); // Ensure userData is null on error
        } finally {
           console.log('AuthProvider: Finished processing user data fetch, setting loading to false.');
           setLoading(false); // Set loading false after fetch attempt
        }
      } else {
        console.log('AuthProvider: No user detected.');
        setUserData(null);
        setLoading(false); // No user, not loading
      }
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('AuthProvider: Cleaning up onAuthStateChanged listener.');
      unsubscribe();
    };
  }, [toast]); // Add toast to dependency array

  const logout = async () => {
    console.log('AuthProvider: logout called.');
    try {
      await firebaseSignOut(auth);
      console.log('AuthProvider: Firebase sign out successful.');
      // State updates (user, userData, loading) are handled by onAuthStateChanged
    } catch (error) {
      console.error("AuthProvider: Error signing out: ", error);
       toast({
         title: "خطأ",
         description: "حدث خطأ أثناء تسجيل الخروج.",
         variant: "destructive",
       });
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
