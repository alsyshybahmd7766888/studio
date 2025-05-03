// TODO: Change import path for firebase to two levels up
// In src/hooks/useAuth.tsx, update:
//   import { auth, db } from '../lib/firebase';
// to:
//   import { auth, db } from '@/lib/firebase'; // Use alias path
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
      // User state changed, start loading until data is fetched/confirmed
      setLoading(true);
      setUser(currentUser); // Update user state immediately

      if (currentUser) {
        console.log('AuthProvider: User detected:', currentUser.uid, 'Email:', currentUser.email);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          console.log("AuthProvider: Fetching user data from Firestore path:", userDocRef.path);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            console.log('AuthProvider: Firestore user document found.');
            setUserData(userDocSnap.data() as UserData);
          } else {
            console.warn("AuthProvider: Firestore user document NOT found for UID:", currentUser.uid);
            setUserData(null); // Explicitly set to null if not found
            // Optional: Logout user or redirect if critical data is missing
            // toast({ title: "خطأ في الحساب", description: "لم يتم العثور على بيانات المستخدم.", variant: "destructive" });
            // await logout(); // Example: Force logout if data is essential
          }
        } catch (error: any) { // Use 'any' or specific FirestoreError
          console.error("AuthProvider: Error fetching user data:", error.code, error.message);
          // Handle specific Firestore errors (offline, permissions)
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
           // Data fetch attempt complete (success or error), stop loading.
           console.log('AuthProvider: Finished Firestore data fetch attempt. Setting loading to false.');
           setLoading(false);
        }
      } else {
        // No user is logged in.
        console.log('AuthProvider: No user detected (logged out).');
        setUserData(null); // Clear user data
        setLoading(false); // Stop loading as auth state is confirmed (no user)
      }
    });

    // Cleanup function: Unsubscribe from the listener when the component unmounts.
    return () => {
      console.log('AuthProvider: Cleaning up onAuthStateChanged listener.');
      unsubscribe();
    };
  // Add toast to dependency array if used within useEffect, although typically not needed for side effects.
  }, [toast]); // Dependency array includes toast

  // Logout function
  const logout = async () => {
    console.log('AuthProvider: logout function called.');
    try {
      await firebaseSignOut(auth);
      console.log('AuthProvider: Firebase sign out successful. State updates handled by listener.');
      // The onAuthStateChanged listener will automatically handle setting user and userData to null.
    } catch (error) {
      console.error("AuthProvider: Error signing out: ", error);
       toast({
         title: "خطأ",
         description: "حدث خطأ أثناء تسجيل الخروج.",
         variant: "destructive",
       });
    }
  };

  // Log state changes for debugging purposes
  // This log might run frequently during state updates.
  // console.log(`AuthProvider: Context value updated - loading=${loading}, user=${!!user}, userData=${!!userData}`);

  return (
    <AuthContext.Provider value={{ user, loading, userData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
