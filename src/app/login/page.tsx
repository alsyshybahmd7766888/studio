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
  const [username, setUsername] = React.useState('717168802'); // Default username
  const [password, setPassword] = React.useState('12345678'); // Default password
  const [isLoading, setIsLoading] = React.useState(false); // Loading state for login button
  const router = useRouter();
  const { toast } = useToast();
  const { fetchBalance } = useBalance(); // Get fetchBalance function

   // Convert phone number to email format if needed for Email/Password auth
   const formatEmail = (input: string): string => {
     // Check if input is already an email
     if (input.includes('@')) {
       return input;
     }
     const phoneRegex = /^\d+$/; // Simple check if it's just digits
     if (phoneRegex.test(input)) {
        // IMPORTANT: Using Email/Password provider requires an email format.
        // Use a consistent domain. Using `@4now.app` as a placeholder.
        return `${input}@4now.app`; // Use your configured domain
     }
     return input; // Return as is if not email or phone format (will likely fail auth)
   };

   const handleLogin = async () => {
     setIsLoading(true);
     console.log('LoginPage: handleLogin initiated with:', username);

      // --- Firebase Authentication Logic ---
     try {
       const email = formatEmail(username);
       console.log('LoginPage: Attempting Firebase signInWithEmailAndPassword with email:', email);

       // Attempt sign in using the Email/Password method
       await signInWithEmailAndPassword(auth, email, password);

       // Auth state change listener in useAuth will handle user update
       console.log('LoginPage: Firebase login successful. Auth state change should trigger redirection via Layout.');
       toast({
         title: "نجاح تسجيل الدخول",
         description: "جارٍ التوجيه إلى لوحة التحكم...", // This message appears, but redirection relies on layout
         variant: 'default',
       });

       // Fetch balance after successful login. Listener in useBalance handles updates.
       // We can trigger an explicit fetch here if needed, but rely on listener primarily.
       console.log('LoginPage: Triggering balance fetch...');
       fetchBalance(); // No need to await if relying on listener

       // --- IMPORTANT ---
       // No explicit router.push here. AuthenticatedLayout handles redirection based on auth state.

     } catch (error: any) {
       console.error('LoginPage: Login failed:', error.code, error.message);
       let errorMessage = "فشل تسجيل الدخول. يرجى التحقق من بياناتك.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = "اسم المستخدم أو كلمة المرور غير صحيحة.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "تنسيق اسم المستخدم (بريد إلكتروني/هاتف) غير صحيح.";
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = "تم حظر الدخول مؤقتاً بسبب محاولات كثيرة خاطئة. حاول مرة أخرى لاحقاً.";
        } else if (error.code === 'auth/network-request-failed') {
             errorMessage = "فشل الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.";
        } else if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
            errorMessage = "طريقة تسجيل الدخول هذه غير مفعلة. يرجى مراجعة مسؤول النظام.";
        } else if (error.code === 'auth/api-key-not-valid') {
             errorMessage = "مفتاح Firebase API غير صحيح. يرجى التحقق من إعدادات المشروع.";
        } else if (error.code === 'auth/invalid-value-(password),-starting-an-object-value') {
             errorMessage = "كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى."; // Specific message for this error
        }
       // Add other specific Firebase error codes as needed

       toast({
         title: "فشل تسجيل الدخول",
         description: errorMessage,
         variant: "destructive",
       });
     } finally {
       console.log('LoginPage: handleLogin finished.');
       setIsLoading(false);
     }
   };

  const handleFingerprintLogin = () => {
    // --- Simulate WebAuthn/Biometric Login ---
    console.log('LoginPage: Fingerprint login initiated (simulation)');
    toast({
      title: "الدخول بالبصمة",
      description: "ميزة الدخول بالبصمة قيد التطوير.",
      variant: 'default',
    });
    // Placeholder for actual WebAuthn implementation
  };

  const handleFaceIdLogin = () => {
     // --- Simulate Face ID Login (Similar to Fingerprint) ---
    console.log('LoginPage: Face ID login initiated (simulation)');
     toast({
      title: "الدخول بالوجه",
      description: "ميزة الدخول بالوجه قيد التطوير.",
      variant: 'default',
    });
    // Placeholder for actual implementation
  };

  const handleForgotPassword = () => {
     console.log('LoginPage: Forgot password clicked');
     toast({
      title: "استعادة كلمة السر",
      description: "سيتم توجيهك لصفحة استعادة كلمة المرور قريباً.",
      variant: 'default',
    });
     // router.push('/forgot-password'); // Implement forgot password page
  }

  // Initial render log
  console.log('LoginPage: Rendering...');

  return (
    // Background: Use primary color (#007B8A)
    <div className="flex min-h-screen flex-col items-center bg-primary px-4 pt-[32px] text-primary-foreground">
      {/* Status Bar Area */}
      <div className="h-[24px] w-full"></div>

      {/* Logo Header */}
       <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-card shadow-lg">
          <span className="text-3xl font-bold">
              <span className="text-primary">٤</span> {/* Primary color */}
              <span className="text-accent">Now</span> {/* Accent color */}
          </span>
       </div>


      {/* Card Container - White bg (#FFFFFF), rounded 24px, dark grey text (#333333) */}
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
                 // h-12, rounded-lg (8px), border (#E0E0E0), bg-input (#F9F9F9 / theme input), text-base (16px), placeholder (#9E9E9E / muted-foreground)
                 "h-12 rounded-lg border border-border bg-input pr-10 text-base placeholder:text-muted-foreground text-foreground",
              )}
              dir="rtl" // RTL for placeholder and input alignment
              disabled={isLoading}
            />
             {/* User Icon: Medium grey (#B0B0B0 / muted-foreground) */}
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
             {/* Lock Icon: Medium grey (#B0B0B0 / muted-foreground) */}
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
          </div>
        </div>

        {/* Login Button - Teal background (#007B8A / primary), White text */}
        <Button
           className="mt-4 h-12 w-full rounded-lg bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90 active:bg-primary/80"
           onClick={handleLogin}
           disabled={isLoading || !username || !password} // Disable if loading or fields empty
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'دخول'}
        </Button>

        {/* Biometric Icons */}
        <div className="mt-4 flex items-center justify-center space-x-6 rtl:space-x-reverse">
          {/* Face ID Button - Orange background (#FF6F3C / accent) */}
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-accent shadow active:opacity-80 disabled:opacity-50"
            aria-label="الدخول باستخدام الوجه"
            onClick={handleFaceIdLogin}
            disabled={isLoading} // Disable biometric buttons during login attempt
          >
            <Smile className="h-8 w-8 text-accent-foreground" /> {/* White icon */}
          </button>
           {/* Fingerprint Button - Dark Blue background (#004E66 / secondary) */}
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow active:opacity-80 disabled:opacity-50"
            aria-label="الدخول باستخدام البصمة"
             onClick={handleFingerprintLogin}
             disabled={isLoading}
          >
            <Fingerprint className="h-8 w-8 text-secondary-foreground" /> {/* White icon */}
          </button>
        </div>

        {/* Secondary Buttons - Dark Blue background (#004E66 / secondary) */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Link href="/register" passHref>
             <Button
                variant="secondary" // Use secondary variant
                className={cn("h-12 w-full rounded-lg text-base font-normal", isLoading && "opacity-50 pointer-events-none")}
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

        {/* Privacy Link - Teal text (#007B8A / primary) */}
         <div className="mt-4 space-y-2 text-center">
           {/* Removed link to /privacy as it's not implemented */}
           {/* <Link href="/privacy" passHref> */}
              <span className={cn("cursor-default text-sm font-light text-primary", isLoading && "opacity-50")}>
                 تعليمات | سياسة الخصوصية
              </span>
           {/* </Link> */}
         </div>
      </div>

      {/* Footer - White text */}
      <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-primary-foreground">
         برمجة وتصميم (يمن روبوت) 774541452
      </footer>
    </div>
  );
}
