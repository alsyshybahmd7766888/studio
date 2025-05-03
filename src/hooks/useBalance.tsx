// src/hooks/useBalance.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc, getDoc, FirestoreError } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Ensure alias path is correct
import { useAuth } from './useAuth'; // Import useAuth to get user ID
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface BalanceContextType {
  balance: number;
  loading: boolean;
  setBalance: (b: number) => void; // Keep for potential manual override if needed
  deductBalance: (amount: number) => Promise<boolean>; // Function to deduct balance
  fetchBalance: () => Promise<void>; // Function to explicitly fetch balance
}

const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  loading: true,
  setBalance: () => {},
  deductBalance: async () => false,
  fetchBalance: async () => {},
});

export const BalanceProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [balance, setBalanceState] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast(); // Get toast function

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (!authLoading && user) {
      setLoading(true); // Start loading when user is available
      const balanceDocRef = doc(db, 'balances', user.uid); // Use 'balances' collection, doc ID = user UID
      console.log("BalanceProvider: Setting up balance listener for user:", user.uid);

      unsubscribe = onSnapshot(balanceDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setBalanceState(docSnap.data().amount || 0);
          console.log("BalanceProvider: Balance updated:", docSnap.data().amount || 0);
        } else {
          // Initialize balance document if it doesn't exist
          console.log("BalanceProvider: Balance document not found, initializing with 0.");
          setDoc(balanceDocRef, { amount: 0 }).catch(console.error);
          setBalanceState(0);
        }
        setLoading(false); // Stop loading after successful read/init
      }, (error: FirestoreError) => {
        console.error("BalanceProvider: Error listening to balance changes:", error);
        // Check for offline error
        if (error.code === 'unavailable' || (error.message && error.message.includes('offline'))) {
           toast({
             title: "غير متصل",
             description: "لا يمكن تحديث الرصيد حالياً. البيانات المعروضة قد تكون قديمة.",
             variant: "destructive",
             duration: 5000, // Show for 5 seconds
           });
           // Keep the last known balance, but indicate loading might be stalled
           // setLoading(true); // Or set a specific offline state if needed
        } else {
           toast({
             title: "خطأ في الرصيد",
             description: "حدث خطأ أثناء تحديث الرصيد.",
             variant: "destructive",
           });
        }
        // Don't reset balance to 0 on error, keep last known value?
        // setBalanceState(0); // Reset balance on error might be misleading
        setLoading(false); // Stop loading even if there's an error
      });
    } else if (!authLoading && !user) {
      // User logged out, reset balance and loading state
      console.log("BalanceProvider: User logged out, resetting balance.");
      setBalanceState(0);
      setLoading(false);
      // Ensure listener is cleaned up if already active
       if (unsubscribe) {
         console.log("BalanceProvider: Cleaning up listener on logout.");
         unsubscribe();
         unsubscribe = null;
       }
    } else if (authLoading) {
        console.log("BalanceProvider: Waiting for authentication...");
        setLoading(true); // Ensure loading is true while auth is loading
    }

    // Cleanup listener on unmount or user change
    return () => {
      if (unsubscribe) {
        console.log("BalanceProvider: Cleaning up balance listener on unmount/user change.");
        unsubscribe();
      }
    };
  }, [user, authLoading, toast]); // Re-run when user, authLoading, or toast changes

  // Function to manually set balance (less common with Firestore listener)
  const setBalance = (newBalance: number) => {
    if (user) {
      const balanceDocRef = doc(db, 'balances', user.uid);
      setDoc(balanceDocRef, { amount: newBalance }).catch(console.error);
      // The listener will update the state, so no need to setBalanceState here
    }
  };

  // Function to deduct balance (relies on API route)
  const deductBalance = async (amount: number): Promise<boolean> => {
     if (!user) {
      console.error("User not authenticated to deduct balance.");
      toast({ title: "خطأ", description: "يرجى تسجيل الدخول أولاً.", variant: "destructive" });
      return false;
    }
    if (balance < amount) {
      console.error("Insufficient balance.");
       toast({
         title: "رصيد غير كافٍ",
         description: `رصيدك الحالي (${balance.toLocaleString()} ريال) غير كافٍ لهذه العملية.`,
         variant: "destructive"
       });
      return false;
    }
    // Assume API call will handle actual deduction and listener will update state
    console.log("BalanceProvider: deductBalance called, assuming API route will handle deduction.");
    return true;
  };

   // Function to explicitly fetch balance if needed
   const fetchBalance = async () => {
    if (user) {
      setLoading(true);
      const balanceDocRef = doc(db, 'balances', user.uid);
      console.log("BalanceProvider: Manually fetching balance for user:", user.uid);
      try {
        const docSnap = await getDoc(balanceDocRef);
        if (docSnap.exists()) {
          setBalanceState(docSnap.data().amount || 0);
          console.log("BalanceProvider: Manual fetch successful:", docSnap.data().amount || 0);
        } else {
          console.log("BalanceProvider: Manual fetch - balance document not found.");
          setBalanceState(0);
        }
      } catch (error: any) {
        console.error("BalanceProvider: Error fetching balance manually:", error);
         if (error.code === 'unavailable' || (error.message && error.message.includes('offline'))) {
             toast({
               title: "غير متصل",
               description: "لا يمكن جلب الرصيد حالياً. يرجى التحقق من اتصالك بالإنترنت.",
               variant: "destructive",
               duration: 5000,
             });
         } else {
             toast({ title: "خطأ", description: "فشل جلب الرصيد يدوياً.", variant: "destructive" });
         }
        // setBalanceState(0); // Keep last known balance?
      } finally {
        setLoading(false);
      }
    } else {
       console.log("BalanceProvider: Manual fetch skipped, no user.");
       setLoading(false); // Ensure loading is false if no user
    }
  };

  return (
    <BalanceContext.Provider value={{ balance, loading: loading || authLoading, setBalance, deductBalance, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);
