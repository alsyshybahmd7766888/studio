'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fingerprint, Lock, User, Smile, Loader2 } from 'lucide-react'; // Added Loader2

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { auth } from '@/lib/firebase'; // Import Firebase auth instance using alias
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useBalance } from '@/hooks/useBalance'; // Import balance hook

export default function LoginPage() {
  const [username, setUsername] = React.useState(''); // Can be email or phone number
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false); // Loading state for login button
  const router = useRouter();
  const { toast } = useToast();
  const { fetchBalance } = useBalance(); // Get fetchBalance function

   // Convert phone number to email format if needed for Email/Password auth
   // Firebase treats phone number + password as Email/Password if registered that way.
   const formatEmail = (input: string): string => {
     // Check if input is already an email
     if (input.includes('@')) {
       return input;
     }
     // Assume it's a phone number and format it as an email
     // Replace '4now.app' with the actual domain used during registration if different
     const phoneRegex = /^\d+$/; // Simple check if it's just digits
     if (phoneRegex.test(input)) {
        // IMPORTANT: Firebase Email/Password with phone requires the phone number
        // to be formatted as email, but the exact format depends on how it was registered.
        // If the registration script `enable-firebase-auth.js` enabled phone sign-in,
        // Firebase might handle phone numbers directly or expect a specific email format.
        // Assuming registration creates an email like `phonenumber@<project-id>.firebaseapp.com`
        // or requires manual linking. Let's assume the registration process creates
        // an email like `phonenumber@<configured-domain>`.
        // Using '4now.app' as the placeholder domain. Replace if needed.
        return `${input}@4now.app`; // Use the domain configured during registration or a standard one
     }
     // If it's neither email nor phone number format, return as is (will likely fail Firebase auth)
     return input;
   };

   const handleLogin = async () => {
     setIsLoading(true);
     console.log('Attempting login with:', username, password);

      // Hardcoded login check (keep for testing/demo purposes)
      if (username === '717168802' && password === '12345678') {
          console.log('Hardcoded login successful, fetching balance and redirecting...');
          toast({
            title: "نجاح تسجيل الدخول (Hardcoded)",
            description: "جارٍ التوجيه إلى لوحة التحكم...",
            variant: 'default',
          });

          // Simulate fetching balance and user data for hardcoded login
          // Note: This bypasses real Firebase auth state, context might not update correctly
          // await fetchBalance(); // If balance logic is independent of real auth

          router.push('/dashboard'); // Manually redirect for hardcoded login
          setIsLoading(false);
          return; // Exit function after hardcoded login
      }


     // --- Firebase Authentication Logic (using Email/Password provider) ---
     try {
       // Format username input as email (handles both email and phone number inputs)
       const email = formatEmail(username);
       console.log('Formatted email for signInWithEmailAndPassword:', email);

       // Attempt sign in using the Email/Password method
       // Firebase Auth with Email/Password provider can accept either a registered email
       // OR the email representation of a phone number if phone sign-in is enabled and configured correctly.
       await signInWithEmailAndPassword(auth, email, password);

       console.log('Firebase login successful, fetching balance and redirecting...');
       toast({
         title: "نجاح تسجيل الدخول",
         description: "جارٍ التوجيه إلى لوحة التحكم...",
         variant: 'default',
       });

       // Fetch balance after successful login (assuming balance is linked to UID)
       // The hook should ideally fetch based on the authenticated user's UID.
       await fetchBalance();

       // Auth state change listener in AuthProvider should handle redirection automatically
       // router.push('/dashboard'); // Usually not needed here

     } catch (error: any) {
       console.error('Login failed:', error);
       let errorMessage = "فشل تسجيل الدخول. يرجى التحقق من بياناتك.";
       if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
           errorMessage = "اسم المستخدم أو كلمة المرور غير صحيحة.";
       } else if (error.code === 'auth/invalid-email') {
           // This might occur if the phone number formatting failed or the input wasn't a valid email
           errorMessage = "تنسيق اسم المستخدم (بريد إلكتروني/هاتف) غير صحيح.";
       } else if (error.code === 'auth/too-many-requests') {
           errorMessage = "تم حظر الدخول مؤقتاً بسبب محاولات كثيرة خاطئة. حاول مرة أخرى لاحقاً.";
       } else if (error.code === 'auth/network-request-failed') {
            errorMessage = "فشل الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.";
       } else if (error.code === 'auth/configuration-not-found') {
           errorMessage = "طريقة تسجيل الدخول هذه غير مفعلة. يرجى مراجعة مسؤول النظام."; // More specific error
       }
       // Add other specific Firebase error codes as needed

       toast({
         title: "فشل تسجيل الدخول",
         description: errorMessage,
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };

  const handleFingerprintLogin = () => {
    // --- Simulate WebAuthn/Biometric Login ---
    console.log('Fingerprint login initiated (simulation)');
    toast({
      title: "الدخول بالبصمة",
      description: "ميزة الدخول بالبصمة قيد التطوير.",
      variant: 'default',
    });
     // Placeholder for actual WebAuthn implementation
    // try {
    //    const credential = await navigator.credentials.get({publicKey: {...}});
    //    // Send credential to backend for verification
    //    // If verified, sign in user (e.g., with custom token) and redirect
    //    // await fetchBalance();
    //    // router.push('/dashboard');
    // } catch (error) {
    //    console.error("Fingerprint login failed:", error);
    //    toast({ title: "فشل الدخول بالبصمة", variant: "destructive" });
    // }
  };

  const handleFaceIdLogin = () => {
     // --- Simulate Face ID Login (Similar to Fingerprint) ---
    console.log('Face ID login initiated (simulation)');
     toast({
      title: "الدخول بالوجه",
      description: "ميزة الدخول بالوجه قيد التطوير.",
      variant: 'default',
    });
    // Placeholder for actual implementation
  };

  const handleForgotPassword = () => {
     console.log('Forgot password clicked');
     toast({
      title: "استعادة كلمة السر",
      description: "سيتم توجيهك لصفحة استعادة كلمة المرور قريباً.",
      variant: 'default',
    });
     // router.push('/forgot-password'); // Implement forgot password page
  }


  return (
    // Background: Use background color from theme
    <div className="flex min-h-screen flex-col items-center bg-primary px-4 pt-[32px] text-primary-foreground">
      {/* Status Bar Area (Placeholder) */}
      <div className="h-[24px] w-full"></div>

      {/* Logo Header */}
       <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-card shadow-lg">
          <span className="text-3xl font-bold">
              <span className="text-primary">٤</span>
              <span className="text-accent">Now</span>
          </span>
       </div>


      {/* Card Container - Use card colors, rounded 24px */}
      <div className="w-full max-w-md rounded-[24px] bg-card p-4 shadow-xl text-card-foreground">
        {/* Input Fields */}
        <div className="space-y-3">
           {/* Username/Phone Input */}
           <div className="relative">
            <Input
              type="text" // Use text, handles both email and phone number inputs
              placeholder="اسم الدخول أو رقم الهاتف"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={cn(
                 "h-12 rounded-lg border border-border bg-input pr-10 text-base placeholder:text-muted-foreground text-foreground", // Use theme colors
              )}
              dir="rtl"
              disabled={isLoading}
            />
            <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
          </div>

           {/* Password Input */}
           <div className="relative">
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "h-12 rounded-lg border border-border bg-input pr-10 text-base placeholder:text-muted-foreground text-foreground",
              )}
              dir="rtl"
              disabled={isLoading}
              onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }} // Allow login on Enter key
            />
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
          </div>
        </div>

        {/* Login Button */}
        <Button
           className="mt-4 h-12 w-full rounded-lg bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90 active:bg-primary/80"
           onClick={handleLogin}
           disabled={isLoading || !username || !password} // Disable if loading or fields empty
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'دخول'}
        </Button>

        {/* Biometric Icons */}
        <div className="mt-4 flex items-center justify-center space-x-6 rtl:space-x-reverse">
          {/* Use accent color for Face ID button background */}
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-accent shadow active:opacity-80 disabled:opacity-50"
            aria-label="الدخول باستخدام الوجه"
            onClick={handleFaceIdLogin}
            disabled={isLoading} // Disable biometric buttons during login attempt
          >
            <Smile className="h-8 w-8 text-accent-foreground" />
          </button>
           {/* Use secondary color for Fingerprint button background */}
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow active:opacity-80 disabled:opacity-50"
            aria-label="الدخول باستخدام البصمة"
             onClick={handleFingerprintLogin}
             disabled={isLoading}
          >
            <Fingerprint className="h-8 w-8 text-secondary-foreground" />
          </button>
        </div>

        {/* Secondary Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Link href="/register" passHref>
             <Button
                variant="secondary" // Use secondary variant
                className={cn("h-12 w-full rounded-lg text-base font-normal", isLoading && "opacity-50 pointer-events-none")}
                // disabled={isLoading} // Or use disabled attribute
             >
               فتح حساب
             </Button>
          </Link>
          <Button
             variant="secondary"
             className="h-12 w-full rounded-lg text-base font-normal"
             onClick={handleForgotPassword}
             disabled={isLoading}
          >
            استعادة كلمة السر
          </Button>
        </div>

        {/* Privacy Link */}
         <div className="mt-4 space-y-2 text-center">
           <Link href="/privacy" passHref>
              <span className={cn("cursor-pointer text-sm font-light text-primary underline hover:text-primary/80", isLoading && "opacity-50 pointer-events-none")}>
                 تعليمات | سياسة الخصوصية
              </span>
           </Link>
         </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-muted-foreground"> {/* Use muted foreground for footer */}
         برمجة وتصميم (يمن روبوت)
      </footer>
    </div>
  );
}
