'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fingerprint, Lock, User, Smile } from 'lucide-react'; // Removed Mail

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
// import { useBalance } from '@/hooks/use-balance'; // Import balance context hook if created

export default function LoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();
  const { toast } = useToast();
  // const { setBalance } = useBalance(); // Get setBalance function if using context

  const handleLogin = () => {
    // --- Simulate Backend Authentication ---
    // In a real app, you'd send username and password to your backend API
    // The backend would verify credentials against a database (e.g., using Firebase Auth)
    // It would return success/failure or a session token.
    console.log('Attempting login with:', username, password);

    if (username === '717168802' && password === '12345678') {
      console.log('Login successful, redirecting to dashboard...');
      toast({
        title: "نجاح تسجيل الدخول",
        description: "جارٍ التوجيه إلى لوحة التحكم...",
        variant: 'default', // Use default (primary) style
      });

      // --- Simulate Setting Initial Balance ---
      // In a real app, the user's balance would be fetched from the backend after login.
      // For simulation, we can set a default balance here if using context.
      // setBalance(50000); // Example: Set initial balance to 50,000 YER

      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      console.log('Login failed: Invalid credentials');
      toast({
        title: "فشل تسجيل الدخول",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة.",
        variant: "destructive",
      });
    }
  };

  const handleFingerprintLogin = () => {
    // --- Simulate WebAuthn/Biometric Login ---
    // This requires browser support and integration with the WebAuthn API.
    // It involves registering the user's biometric data first (usually during setup).
    // Then, on login, prompting the browser to authenticate using the stored biometric.
    console.log('Fingerprint login initiated (simulation)');
    toast({
      title: "الدخول بالبصمة",
      description: "جاري محاولة الدخول باستخدام البصمة... (تحقق من دعم المتصفح والجهاز)",
      variant: 'default', // Use default (primary) style
    });
    // Example: Simulate successful login after a delay
    setTimeout(() => {
        // Simulate success, set balance, and redirect
        toast({ title: "تم الدخول بالبصمة بنجاح!", variant: 'default' });
        // setBalance(50000); // Set balance on successful biometric login
        router.push('/dashboard');
    }, 1500);
  };

  const handleFaceIdLogin = () => {
     // --- Simulate Face ID Login (Similar to Fingerprint) ---
    console.log('Face ID login initiated (simulation)');
     toast({
      title: "الدخول بالوجه",
      description: "جاري محاولة الدخول باستخدام الوجه... (تحقق من دعم المتصفح والجهاز)",
      variant: 'default', // Use default (primary) style
    });
     // Example: Simulate successful login after a delay
    setTimeout(() => {
        // Simulate success, set balance, and redirect
        toast({ title: "تم الدخول بالوجه بنجاح!", variant: 'default' });
        // setBalance(50000); // Set balance on successful biometric login
        router.push('/dashboard');
    }, 1500);
  };

  const handleForgotPassword = () => {
     // --- Simulate Forgot Password Flow ---
     // In a real app, this would likely redirect to a password reset page
     // where the user enters their email/phone to receive a reset link/code.
     console.log('Forgot password clicked');
     toast({
      title: "استعادة كلمة السر",
      description: "سيتم توجيهك لصفحة استعادة كلمة المرور قريباً.",
      variant: 'default', // Use default (primary) style
    });
     // router.push('/forgot-password'); // Example redirect
  }


  return (
    // Background: Emerald Green (#00A651)
    <div className="flex min-h-screen flex-col items-center bg-[#00A651] px-4 pt-[32px] text-white"> {/* Use specific green */}
      {/* Status Bar Area (Placeholder) */}
      <div className="h-[24px] w-full"></div>

      {/* Logo Header */}
      {/* Container: 120x120px, white bg, centered */}
      <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-white shadow-lg"> {/* White background */}
        {/* 4NOW Logo */}
         <span className="text-3xl font-bold">
           <span className="text-[#00A651]">٤</span> {/* Use primary green */}
           <span className="text-[#FF6F3C]">Now</span> {/* Use accent orange */}
         </span>
         {/* <Image src="/logos/4now-logo.svg" alt="4NOW Logo" width={96} height={96} /> */}
      </div>

      {/* Card Container - White bg, rounded 24px */}
      <div className="w-full max-w-md rounded-[24px] bg-white p-4 shadow-xl text-[#333333]"> {/* White card, dark grey text */}
        {/* Input Fields */}
        <div className="space-y-3"> {/* 12px gap */}
           {/* Username/Phone Input */}
           <div className="relative">
             {/* Input: h-48px, rounded-lg (8px), bg #F9F9F9 or white + border, text-base, placeholder #9E9E9E */}
            <Input
              type="text"
              placeholder="اسم الدخول أو رقم الهاتف"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={cn(
                 "h-12 rounded-lg border border-[#E0E0E0] bg-white pr-10 text-base placeholder-[#9E9E9E] text-[#333333]", // Adjusted styles
                 // Focus state can remain default or be customized
              )}
              dir="rtl" // Ensure placeholder is RTL
            />
             {/* Icon: User, 20px size, color #B0B0B0 */}
            <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" /> {/* Specific grey */}
          </div>

           {/* Password Input */}
           <div className="relative">
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "h-12 rounded-lg border border-[#E0E0E0] bg-white pr-10 text-base placeholder-[#9E9E9E] text-[#333333]", // Adjusted styles
              )}
              dir="rtl"
            />
             {/* Icon: Lock, 20px size, color #B0B0B0 */}
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" /> {/* Specific grey */}
          </div>
        </div>

        {/* Login Button */}
         {/* Button: h-48px, full width, bg #009944, text white, rounded 8px, mt-16px */}
        <Button
           // Use a custom background color override or define a variant
           className="mt-4 h-12 w-full rounded-lg bg-[#009944] text-base font-medium text-white hover:bg-[#008833] active:bg-[#007722]" // Specific green shades
           onClick={handleLogin}
        >
          دخول
        </Button>

        {/* Biometric Icons */}
         {/* Icons: 64px diameter, Yellow (#FFC107) & Light Green (#A5F6A0) bg, white icons, 24px gap, mt-16px */}
        <div className="mt-4 flex items-center justify-center space-x-6 rtl:space-x-reverse"> {/* space-x-6 for 24px gap */}
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFC107] shadow active:opacity-80" // Yellow background
            aria-label="الدخول باستخدام الوجه"
            onClick={handleFaceIdLogin}
          >
            <Smile className="h-8 w-8 text-white" /> {/* White icon */}
          </button>
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#A5F6A0] shadow active:opacity-80" // Light Green background
            aria-label="الدخول باستخدام البصمة"
             onClick={handleFingerprintLogin}
          >
            <Fingerprint className="h-8 w-8 text-white" /> {/* White icon */}
          </button>
        </div>

        {/* Secondary Buttons */}
         {/* Buttons: h-48px, ~half width each, bg #009944, text white, rounded 8px, 16px gap, mt-16px */}
        <div className="mt-4 grid grid-cols-2 gap-4"> {/* gap-4 for 16px */}
          <Link href="/register" passHref>
             <Button className="h-12 w-full rounded-lg bg-[#009944] text-base font-normal text-white hover:bg-[#008833] active:bg-[#007722]">
               فتح حساب
             </Button>
          </Link>
          <Button className="h-12 w-full rounded-lg bg-[#009944] text-base font-normal text-white hover:bg-[#008833] active:bg-[#007722]" onClick={handleForgotPassword}>
            استعادة كلمة السر
          </Button>
        </div>

        {/* Contact Info & Links */}
         <div className="mt-4 space-y-2 text-center"> {/* mt-16px, space-y-8px */}
           {/* Contact info removed as requested */}
           {/* Link: 14sp/300, blue link color #0066CC, mt-8px */}
           <Link href="/privacy" passHref>
              <span className="cursor-pointer text-sm font-light text-[#0066CC] underline hover:text-[#0055AA]"> {/* Specific blue link color */}
                 تعليمات | سياسة الخصوصية
              </span>
           </Link>
         </div>
      </div>

      {/* Footer */}
       {/* Footer: 12sp/300, white text, bottom aligned */}
      <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-white">
         {/* Removed contact info as requested */}
         برمجة وتصميم (يمن روبوت)
      </footer>
    </div>
  );
}
