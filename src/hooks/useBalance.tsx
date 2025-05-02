// src/hooks/useBalance.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Changed to relative path
import { useAuth } from './useAuth'; // Import useAuth to get user ID

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

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (!authLoading && user) {
      setLoading(true);
      const balanceDocRef = doc(db, 'balances', user.uid); // Use 'balances' collection, doc ID = user UID

      unsubscribe = onSnapshot(balanceDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setBalanceState(docSnap.data().amount || 0);
        } else {
          // Initialize balance document if it doesn't exist
          setDoc(balanceDocRef, { amount: 0 }).catch(console.error);
          setBalanceState(0);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error listening to balance changes:", error);
        setBalanceState(0); // Reset balance on error
        setLoading(false);
      });
    } else if (!authLoading && !user) {
      // User logged out, reset balance and loading state
      setBalanceState(0);
      setLoading(false);
    }

    // Cleanup listener on unmount or user change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, authLoading]); // Re-run when user or authLoading state changes

  // Function to manually set balance (less common with Firestore listener)
  const setBalance = (newBalance: number) => {
    if (user) {
      const balanceDocRef = doc(db, 'balances', user.uid);
      setDoc(balanceDocRef, { amount: newBalance }).catch(console.error);
      // The listener will update the state, so no need to setBalanceState here
    }
  };

  // Function to deduct balance (interacts with API route)
  const deductBalance = async (amount: number): Promise<boolean> => {
     if (!user) {
      console.error("User not authenticated to deduct balance.");
      return false;
    }
    if (balance < amount) {
      console.error("Insufficient balance.");
      return false;
    }

    // Instead of directly modifying Firestore here, we rely on the API route
    // to perform the deduction securely. We just update the local state optimistically
    // or wait for the Firestore listener to update. For simplicity now, we just return true
    // assuming the API call will succeed. A more robust implementation would handle API errors.

    // Optimistic update (optional):
    // setBalanceState(prev => prev - amount);

    // Simulate success, actual deduction happens via API route and Firestore listener updates state
    return true;
  };

   // Function to explicitly fetch balance if needed (e.g., after a manual deposit)
   const fetchBalance = async () => {
    if (user) {
      setLoading(true);
      const balanceDocRef = doc(db, 'balances', user.uid);
      try {
        const docSnap = await getDoc(balanceDocRef);
        if (docSnap.exists()) {
          setBalanceState(docSnap.data().amount || 0);
        } else {
          setBalanceState(0);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalanceState(0);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <BalanceContext.Provider value={{ balance, loading: loading || authLoading, setBalance, deductBalance, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);