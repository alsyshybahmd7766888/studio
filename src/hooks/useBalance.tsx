// src/hooks/useBalance.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc, getDoc, FirestoreError } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Use alias path
import { useAuth } from './useAuth'; // Import useAuth to get user ID
import { useToast } from '@/hooks/use-toast'; // Import useToast

interface BalanceContextType {
  balance: number | null; // Allow null initially or on error
  loading: boolean;
  setBalance: (b: number) => Promise<void>; // Make async if setDoc is awaited
  deductBalance: (amount: number) => Promise<boolean>; // Keep as is for client-side check
  fetchBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType>({
  balance: null, // Start with null
  loading: true,
  setBalance: async () => {},
  deductBalance: async () => false,
  fetchBalance: async () => {},
});

// Firestore collections ('balances') are created automatically
// when the first document is written (e.g., during registration).

export const BalanceProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [balance, setBalanceState] = useState<number | null>(null); // Allow null
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    // Only set up listener if auth is finished loading AND a user exists
    if (!authLoading && user) {
      setLoading(true); // Start loading balance data
      const balanceDocRef = doc(db, 'balances', user.uid); // Use user.uid for the path
      console.log("BalanceProvider: Setting up balance listener for user:", user.uid, "at path:", balanceDocRef.path);

      unsubscribe = onSnapshot(balanceDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const newBalance = snapshot.data().amount ?? 0; // Default to 0 if amount is missing
          setBalanceState(newBalance);
          console.log("BalanceProvider: Balance updated via listener:", newBalance);
        } else {
          console.log("BalanceProvider: Balance document not found for user. Setting balance to 0.");
          setBalanceState(0); // Set state to 0 if document doesn't exist
          // Optionally try to create it, but rules might prevent this if not done during signup
          // setDoc(balanceDocRef, { amount: 0 }).catch(e => console.error("Error creating initial balance doc:", e));
        }
        setLoading(false); // Stop loading after successful read/handling non-existence
      }, (error: FirestoreError) => {
        console.error("BalanceProvider: Error listening to balance changes:", error.code, error.message);
        // Handle specific errors (offline, permissions)
         if (error.code === 'permission-denied') {
             toast({
                 title: "خطأ في الأذونات",
                 description: "ليس لديك إذن للوصول إلى بيانات الرصيد. تأكد من تطابق قواعد الأمان.",
                 variant: "destructive",
             });
         } else if (error.code === 'unauthenticated') {
              toast({ title: "غير مصرح", description: "يرجى تسجيل الدخول للوصول إلى الرصيد.", variant: "destructive" });
         } else if (error.code === 'unavailable' || error.message.includes('offline')) {
           toast({
             title: "غير متصل",
             description: "لا يمكن تحديث الرصيد حالياً. البيانات المعروضة قد تكون قديمة.",
             variant: "destructive",
             duration: 5000,
           });
        } else {
           toast({
             title: "خطأ في الرصيد",
             description: `حدث خطأ أثناء تحديث الرصيد (${error.code}).`,
             variant: "destructive",
           });
        }
        setBalanceState(null); // Set balance to null on error
        setLoading(false); // Stop loading even on error
      });
    } else if (!authLoading && !user) {
      // User is logged out or auth check finished with no user
      console.log("BalanceProvider: No authenticated user, resetting balance state.");
      setBalanceState(null); // Reset balance to null
      setLoading(false); // Not loading balance if no user
      if (unsubscribe) {
        console.log("BalanceProvider: Cleaning up listener on logout.");
        unsubscribe();
        unsubscribe = null;
      }
    } else if (authLoading) {
      // Auth is still loading, wait before setting up listener
      console.log("BalanceProvider: Waiting for authentication...");
      setLoading(true); // Keep loading balance state while auth loads
    }

    // Cleanup function for the effect
    return () => {
      if (unsubscribe) {
        console.log("BalanceProvider: Cleaning up balance listener on unmount/dependency change.");
        unsubscribe();
      }
    };
  }, [user, authLoading, toast]); // Re-run effect if user, authLoading, or toast changes

  // Function to manually set balance (e.g., admin tool), respecting security rules
  const setBalance = async (newBalance: number): Promise<void> => {
    if (!user) {
        console.error("Cannot set balance: User not authenticated.");
        toast({ title: "خطأ", description: "لا يمكن تحديث الرصيد: المستخدم غير مسجل الدخول.", variant: "destructive" });
        return;
    }
    if (typeof newBalance !== 'number' || newBalance < 0) {
        console.error("Cannot set balance: Invalid balance amount.");
        toast({ title: "خطأ", description: "مبلغ الرصيد غير صالح.", variant: "destructive" });
        return;
    }
    const balanceDocRef = doc(db, 'balances', user.uid);
    try {
        await setDoc(balanceDocRef, { amount: newBalance }, { merge: true }); // Use merge to avoid overwriting other fields if any
        console.log("BalanceProvider: Manually set balance successful for user:", user.uid);
        // State will update via the listener, no need to call setBalanceState here
    } catch (error: any) {
        console.error("BalanceProvider: Error setting balance manually:", error);
        toast({ title: "خطأ", description: `فشل تحديث الرصيد (${error.code || 'unknown'}).`, variant: "destructive" });
    }
  };

  // Client-side balance check before API call
  const deductBalance = async (amount: number): Promise<boolean> => {
     if (loading) {
         toast({ title: "انتظار", description: "جاري تحميل بيانات الرصيد...", variant: "default" });
         return false; // Don't proceed if balance is still loading
     }
     if (balance === null) {
        toast({ title: "خطأ", description: "لا يمكن التحقق من الرصيد حالياً.", variant: "destructive" });
        return false; // Don't proceed if balance is null (error state)
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
    console.log("BalanceProvider: Client-side balance check passed.");
    return true;
  };

  // Function to manually trigger a balance fetch
  const fetchBalance = async () => {
    if (!user) {
       console.log("BalanceProvider: Manual fetch skipped, no user.");
       setLoading(false);
       setBalanceState(null);
       return;
    }
    setLoading(true);
    const balanceDocRef = doc(db, 'balances', user.uid);
    console.log("BalanceProvider: Manually fetching balance for user:", user.uid);
    try {
      const docSnap = await getDoc(balanceDocRef);
      if (docSnap.exists()) {
        setBalanceState(docSnap.data().amount || 0);
        console.log("BalanceProvider: Manual fetch successful:", docSnap.data().amount || 0);
      } else {
        console.log("BalanceProvider: Manual fetch - balance document not found. Setting to 0.");
        setBalanceState(0); // Assume 0 if doc doesn't exist
        // Optionally try to create it here if rules allow
        // await setDoc(balanceDocRef, { amount: 0 });
      }
    } catch (error: any) {
      console.error("BalanceProvider: Error fetching balance manually:", error);
      setBalanceState(null); // Set to null on error
       if (error.code === 'unavailable' || error.message.includes('offline')) {
           toast({ title: "غير متصل", description: "لا يمكن جلب الرصيد حالياً.", variant: "destructive", duration: 5000 });
       } else if (error.code === 'permission-denied') {
           toast({ title: "خطأ في الأذونات", description: "لا يمكنك الوصول لبيانات الرصيد.", variant: "destructive"});
       } else {
           toast({ title: "خطأ", description: "فشل جلب الرصيد يدوياً.", variant: "destructive" });
       }
    } finally {
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
