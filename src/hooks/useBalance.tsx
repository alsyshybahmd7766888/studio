// src/hooks/useBalance.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc, getDoc, FirestoreError } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Use alias path
import { useAuth } from './useAuth'; // Import useAuth to get user ID
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface BalanceContextType {
  balance: number;
  loading: boolean;
  setBalance: (b: number) => void;
  deductBalance: (amount: number) => Promise<boolean>;
  fetchBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  loading: true,
  setBalance: () => {},
  deductBalance: async () => false,
  fetchBalance: async () => {},
});

// Firestore collections ('balances') are created automatically
// when the first document is written (e.g., during registration).

export const BalanceProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [balance, setBalanceState] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (!authLoading && user) {
      setLoading(true);
      const balanceDocRef = doc(db, 'balances', user.uid);
      console.log("BalanceProvider: Setting up balance listener for user:", user.uid, "at path:", balanceDocRef.path);

      unsubscribe = onSnapshot(balanceDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const newBalance = docSnap.data().amount || 0;
          setBalanceState(newBalance);
          console.log("BalanceProvider: Balance updated via listener:", newBalance);
        } else {
          console.log("BalanceProvider: Balance document not found for user. Initializing with 0.");
          // Firestore automatically creates the 'balances' collection if it doesn't exist
          // when we write the first document.
          setDoc(balanceDocRef, { amount: 0 })
            .then(() => {
                 console.log("BalanceProvider: Initial balance document created successfully.");
                 setBalanceState(0); // Set state after successful initialization
                 setLoading(false); // Ensure loading is false after init
             })
            .catch(error => {
                console.error("BalanceProvider: Error initializing balance document:", error);
                toast({ title: "خطأ", description: "فشل تهيئة رصيد المستخدم.", variant: "destructive" });
                setLoading(false); // Stop loading even if init fails
            });
           // Don't set loading false immediately here, wait for setDoc result
           return; // Exit early, loading state handled in setDoc promise/catch
        }
        setLoading(false); // Stop loading after successful read
      }, (error: FirestoreError) => {
        console.error("BalanceProvider: Error listening to balance changes:", error.code, error.message);
        if (error.code === 'unavailable' || error.message.includes('offline')) {
           toast({
             title: "غير متصل",
             description: "لا يمكن تحديث الرصيد حالياً. البيانات المعروضة قد تكون قديمة.",
             variant: "destructive",
             duration: 5000,
           });
        } else if (error.code === 'permission-denied') {
             toast({
                 title: "خطأ في الأذونات",
                 description: "ليس لديك إذن للوصول إلى بيانات الرصيد.",
                 variant: "destructive",
             });
        } else {
           toast({
             title: "خطأ في الرصيد",
             description: `حدث خطأ أثناء تحديث الرصيد (${error.code}).`,
             variant: "destructive",
           });
        }
        // Keep the last known balance, but stop loading indicator
        setLoading(false);
      });
    } else if (!authLoading && !user) {
      console.log("BalanceProvider: User logged out, resetting balance.");
      setBalanceState(0);
      setLoading(false);
      if (unsubscribe) {
         console.log("BalanceProvider: Cleaning up listener on logout.");
         unsubscribe();
         unsubscribe = null;
       }
    } else if (authLoading) {
        console.log("BalanceProvider: Waiting for authentication...");
        setLoading(true);
    }

    return () => {
      if (unsubscribe) {
        console.log("BalanceProvider: Cleaning up balance listener.");
        unsubscribe();
      }
    };
  }, [user, authLoading, toast]);

  const setBalance = (newBalance: number) => {
    if (user) {
      const balanceDocRef = doc(db, 'balances', user.uid);
      setDoc(balanceDocRef, { amount: newBalance }).catch(console.error);
    }
  };

  const deductBalance = async (amount: number): Promise<boolean> => {
    // This function is primarily for UI checks before calling the API.
    // The actual balance deduction happens within the API route's transaction.
     if (!user) {
      console.error("User not authenticated to deduct balance.");
      toast({ title: "خطأ", description: "يرجى تسجيل الدخول أولاً.", variant: "destructive" });
      return false;
    }
    if (balance < amount) {
      console.error("Insufficient balance checked on client-side.");
       toast({
         title: "رصيد غير كافٍ",
         description: `رصيدك الحالي (${balance.toLocaleString()} ريال) غير كافٍ لهذه العملية.`,
         variant: "destructive"
       });
      return false;
    }
    // Client-side check passed, allow API call
    console.log("BalanceProvider: Client-side balance check passed.");
    return true;
  };

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
          console.log("BalanceProvider: Manual fetch - balance document not found. Will attempt init.");
          await setDoc(balanceDocRef, { amount: 0 }); // Attempt to initialize
          setBalanceState(0);
        }
      } catch (error: any) {
        console.error("BalanceProvider: Error fetching balance manually:", error);
         if (error.code === 'unavailable' || error.message.includes('offline')) {
             toast({ title: "غير متصل", description: "لا يمكن جلب الرصيد حالياً.", variant: "destructive", duration: 5000 });
         } else {
             toast({ title: "خطأ", description: "فشل جلب الرصيد يدوياً.", variant: "destructive" });
         }
      } finally {
        setLoading(false);
      }
    } else {
       console.log("BalanceProvider: Manual fetch skipped, no user.");
       setLoading(false);
    }
  };

  return (
    <BalanceContext.Provider value={{ balance, loading: loading || authLoading, setBalance, deductBalance, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);
