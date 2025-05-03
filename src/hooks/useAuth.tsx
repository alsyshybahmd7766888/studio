
// TODO: Change import path for firebase to two levels up
// In src/hooks/useAuth.tsx, update:
//   import { auth, db } from '../lib/firebase';
// to:
//   import { auth, db } from '../../lib/firebase';
// src/hooks/useAuth.tsx
"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Changed back to alias path
import { doc, getDoc, FirestoreError } from 'firebase/firestore'; // Import FirestoreError
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userData: UserData | null;
  logout: () => Promise<void>;
}

// Define a type for extra user data stored in Firestore
interface UserData {
  fullName?: string;
  businessActivity?: string;
  address?: string;
  usernameInput?: string; // Store original input for display if needed
  // Add other fields as needed (e.g., idType, verificationStatus)
}

// Firestore collections ('users') are created automatically
// when the first document is written (e.g., during registration).
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
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider: Setting up onAuthStateChanged listener.');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('AuthProvider: onAuthStateChanged triggered.');
      setUser(currentUser);
      setLoading(true); // Assume loading until user data is fetched or confirmed absent

      if (currentUser) {
        console.log('AuthProvider: User detected:', currentUser.uid);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          console.log("AuthProvider: Fetching user data from:", userDocRef.path);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            console.log('AuthProvider: User data found.');
            setUserData(userDocSnap.data() as UserData);
          } else {
            console.warn("AuthProvider: No user document found in Firestore for UID:", currentUser.uid);
            setUserData(null);
            // Maybe log out the user if data is critical and missing?
            // Or prompt for profile completion?
          }
        } catch (error: any) { // Use 'any' or specific FirestoreError
          console.error("AuthProvider: Error fetching user data:", error.code, error.message);
          // Check specifically for Firestore offline error
          if (error instanceof FirestoreError && (error.code === 'unavailable' || error.message.includes('offline'))) {
             toast({
               title: "غير متصل",
               description: "لا يمكن جلب بيانات المستخدم حالياً. يرجى التحقق من اتصالك بالإنترنت.",
               variant: "destructive",
               duration: 5000,
             });
          } else if (error.code === 'permission-denied') {
              toast({
                  title: "خطأ في الأذونات",
                  description: "ليس لديك إذن للوصول إلى بيانات المستخدم.",
                  variant: "destructive",
              });
          } else {
             toast({
               title: "خطأ في بيانات المستخدم",
               description: `حدث خطأ أثناء جلب بيانات المستخدم (${error.code || 'unknown'}).`,
               variant: "destructive",
             });
          }
          setUserData(null); // Ensure userData is null on error
        } finally {
           console.log('AuthProvider: Finished processing user data fetch, setting loading to false.');
           setLoading(false); // Set loading false after fetch attempt completes
        }
      } else {
        console.log('AuthProvider: No user detected.');
        setUserData(null);
        setLoading(false); // No user, not loading
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up onAuthStateChanged listener.');
      unsubscribe();
    };
  }, [toast]);

  const logout = async () => {
    console.log('AuthProvider: logout called.');
    try {
      await firebaseSignOut(auth);
      console.log('AuthProvider: Firebase sign out successful.');
      // State updates (user=null, userData=null, loading=false) handled by onAuthStateChanged
    } catch (error) {
      console.error("AuthProvider: Error signing out: ", error);
       toast({
         title: "خطأ",
         description: "حدث خطأ أثناء تسجيل الخروج.",
         variant: "destructive",
       });
    }
  };

  console.log(`AuthProvider: State updated - loading=${loading}, user=${!!user}, userData=${!!userData}`);

  return (
    <AuthContext.Provider value={{ user, loading, userData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);