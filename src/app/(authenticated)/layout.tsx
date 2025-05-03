// src/app/(authenticated)/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(`AuthenticatedLayout useEffect: loading=${loading}, user=${!!user}`);
    if (!loading && !user) {
      console.log('AuthenticatedLayout: No user found after loading, redirecting to /login');
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Show loader while checking auth state
  if (loading) {
    console.log('AuthenticatedLayout: Rendering loader while checking auth.');
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If loading is done AND user exists, render the page content
  if (user) {
    console.log('AuthenticatedLayout: Rendering authenticated content.');
    return (
      <>
        {children}
        {/* <Toaster /> */}
      </>
    );
  }

  // If loading is done but no user (should be handled by useEffect redirect), return null
  console.log('AuthenticatedLayout: Loading finished, but no user. Returning null (should redirect).');
  return null;
}
