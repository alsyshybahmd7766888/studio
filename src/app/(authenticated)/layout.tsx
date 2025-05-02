// src/app/(authenticated)/layout.tsx
'use client'; // This layout needs client-side hooks

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // Import the useAuth hook
import { Loader2 } from 'lucide-react'; // Import a loader icon

// import '../globals.css'; // Globals are likely imported in the root layout already
import { Toaster } from "@/components/ui/toaster";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!loading && !user) {
      console.log('AuthenticatedLayout: No user found after loading, redirecting to /login');
      router.replace('/login'); // Use replace to avoid adding login to history stack
    } else if (!loading && user) {
        console.log('AuthenticatedLayout: User found, rendering children.');
    } else {
        console.log('AuthenticatedLayout: Still loading authentication state...');
    }
  }, [user, loading, router]);

  // While loading authentication state, show a loading indicator
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If user is authenticated, render the children (the actual authenticated page)
  // This condition ensures children are rendered only when loading is false AND user exists.
  if (!loading && user) {
    return (
      <>
        {children}
        {/* Toaster can remain here or in the root layout */}
        {/* <Toaster /> */}
      </>
    );
  }

  // If not loading and no user (should be caught by useEffect, but as a fallback)
  // Return null or a minimal placeholder to avoid rendering anything sensitive.
  // The useEffect redirect should handle the transition.
  return null;
}
