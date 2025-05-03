// src/app/(authenticated)/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
// Removed Toaster import as it's likely handled in the RootLayout

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect runs when loading or user state changes.
    console.log(`AuthenticatedLayout Effect Check: loading=${loading}, user=${!!user}`);
    // If loading is finished and there is NO user, redirect to login.
    if (!loading && !user) {
      console.log('AuthenticatedLayout: No user found after loading, redirecting to /login');
      router.replace('/login'); // Use replace to avoid adding login page to history
    }
  }, [user, loading, router]);

  // While the authentication state is loading, show a spinner.
  if (loading) {
    console.log('AuthenticatedLayout: Rendering loader while checking auth.');
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If loading is finished AND a user exists, render the children (the actual page).
  // The useEffect above handles the case where loading is finished but there's no user.
  if (user) {
    console.log('AuthenticatedLayout: User authenticated, rendering children.');
    return <>{children}</>;
    // Toaster should ideally be in RootLayout to persist across route changes
    // return (
    //   <>
    //     {children}
    //     <Toaster />
    //   </>
    // );
  }

  // If loading is finished, but there is no user,
  // the useEffect hook will handle the redirection.
  // Return null to render nothing while the redirect occurs.
  console.log('AuthenticatedLayout: Loading finished, no user. Waiting for redirect effect.');
  return null;
}
