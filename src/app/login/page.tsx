'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Fingerprint, Lock, Mail, User, Smile } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"; // Import useToast

export default function LoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter(); // Initialize useRouter
  const { toast } = useToast(); // Initialize useToast

  const handleLogin = () => {
    // Check if the credentials match the hardcoded values
    if (username === '717168802' && password === '12345678') {
      console.log('Login successful, redirecting to dashboard...');
      toast({
        title: "نجاح تسجيل الدخول",
        description: "جارٍ التوجيه إلى لوحة التحكم...",
        variant: 'default', // Use primary color style
      });
      // Redirect to the dashboard page
      router.push('/dashboard');
    } else {
      console.log('Login failed: Invalid credentials');
      // Show an error message (optional)
      toast({
        title: "فشل تسجيل الدخول",
        description: "اسم المستخدم أو كلمة المرور غير صحيحة.",
        variant: "destructive", // Use destructive (red) style
      });
    }
  };

  const handleFingerprintLogin = () => {
    console.log('Fingerprint login initiated (simulation)');
    toast({
      title: "الدخول بالبصمة",
      description: "جاري محاولة الدخول باستخدام البصمة... (ميزة قيد التطوير)",
      variant: 'default',
    });
    // In a real app, you would initiate the WebAuthn API flow here.
    // For now, it's just a placeholder.
  };

  const handleFaceIdLogin = () => {
    console.log('Face ID login initiated (simulation)');
     toast({
      title: "الدخول بالوجه",
      description: "جاري محاولة الدخول باستخدام الوجه... (ميزة قيد التطوير)",
      variant: 'default',
    });
    // Similar placeholder for Face ID
  };

  const handleForgotPassword = () => {
     console.log('Forgot password clicked');
     toast({
      title: "استعادة كلمة السر",
      description: "هذه الميزة قيد التطوير.",
      variant: 'default',
    });
  }


  return (
    // Use bg-background
    <div className="flex min-h-screen flex-col items-center bg-[#00A651] px-4 pt-[32px] text-foreground"> {/* Main background color */}
      {/* Status Bar Area (Placeholder) - Assumed transparent bg */}
      <div className="h-[24px] w-full"></div>

      {/* Logo Header */}
       {/* Container: 120x120px, white bg, centered, top padding 32px */}
      <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-white shadow-lg">
        {/* 4NOW Logo */}
         <span className="text-3xl font-bold">
           <span className="text-[#009944]">٤</span> {/* Darker Green for 4 */}
           <span className="text-[#FF6F3C]">Now</span> {/* Accent Orange for Now */}
         </span>
         {/* Alternatively, use an Image component if you have a logo file */}
         {/* <Image src="/logos/4now-logo.svg" alt="4NOW Logo" width={96} height={96} /> */}
      </div>

      {/* Card Container */}
       {/* Container: White bg, rounded-2xl (24px), full width minus padding, internal padding 16px */}
      <div className="w-full max-w-md rounded-[24px] bg-white p-4 shadow-xl"> {/* p-4 for 16px padding */}
        {/* Input Fields */}
        <div className="space-y-3"> {/* space-y-3 for 12px gap */}
           {/* Username/Phone Input */}
           <div className="relative">
             {/* Input: h-12 (48px), rounded-lg (8px), bg #F9F9F9, text-base, placeholder #9E9E9E */}
            <Input
              type="text"
              placeholder="اسم الدخول أو رقم الهاتف"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // Use cn to combine base styles with specific needs
               className={cn(
                 "h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] pr-10 text-base placeholder-[#9E9E9E]", // pr-10 for icon space
                 "text-[#333333]" // Text color
              )}
              dir="rtl" // Ensure placeholder is RTL
            />
             {/* Icon: User/Mail, 20px size, color #B0B0B0 */}
            <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" /> {/* Icon */}
          </div>

           {/* Password Input */}
           <div className="relative">
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                 "h-12 rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] pr-10 text-base placeholder-[#9E9E9E]",
                 "text-[#333333]"
              )}
              dir="rtl"
            />
             {/* Icon: Lock/Shield, 20px size, color #B0B0B0 */}
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#B0B0B0]" /> {/* Icon */}
          </div>
        </div>

        {/* Login Button */}
         {/* Button: h-48px, full width, bg #009944, text white 16sp/500, rounded 8px, mt-16px */}
        <Button
           variant="default" // Use default variant which will use primary color
           className="mt-4 h-12 w-full rounded-lg bg-[#009944] text-base font-medium text-white hover:bg-[#008833]" // Specific styles as requested
           onClick={handleLogin} // Call handleLogin on click
        >
          دخول
        </Button>

        {/* Biometric Icons */}
         {/* Icons: 64px diameter, Yellow (#FFC107) & Light Green (#A5F6A0) bg, white icons, 24px gap, mt-16px */}
        <div className="mt-4 flex items-center justify-center space-x-6 rtl:space-x-reverse"> {/* space-x-6 for 24px gap */}
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFC107]" // Yellow background
            aria-label="الدخول باستخدام الوجه"
            onClick={handleFaceIdLogin} // Added onClick handler
          >
            <Smile className="h-8 w-8 text-white" /> {/* White icon */}
          </button>
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#A5F6A0]" // Light Green background
            aria-label="الدخول باستخدام البصمة"
             onClick={handleFingerprintLogin} // Call handleFingerprintLogin on click
          >
            <Fingerprint className="h-8 w-8 text-white" /> {/* White icon */}
          </button>
        </div>

        {/* Secondary Buttons */}
         {/* Buttons: h-48px, ~half width each, bg #009944, text white 16sp/400, rounded 8px, 16px gap, mt-16px */}
        <div className="mt-4 grid grid-cols-2 gap-4"> {/* gap-4 for 16px */}
          <Link href="/register" passHref>
             <Button variant="secondary" className="h-12 w-full rounded-lg bg-[#009944] text-base font-normal text-white hover:bg-[#008833]">
               فتح حساب
             </Button>
          </Link>
          <Button variant="secondary" className="h-12 w-full rounded-lg bg-[#009944] text-base font-normal text-white hover:bg-[#008833]" onClick={handleForgotPassword}>
            استعادة كلمة السر
          </Button>
        </div>

        {/* Contact Info & Links */}
         <div className="mt-4 space-y-2 text-center"> {/* mt-16px, space-y-8px */}
           {/* Contact info removed */}
           {/* Link: 14sp/300, primary color, mt-8px */}
           <Link href="/privacy" passHref>
              <span className="cursor-pointer text-sm font-light text-[#0066CC] underline hover:text-[#0055AA]"> {/* Blue link color */}
                 تعليمات | سياسة الخصوصية
              </span>
           </Link>
         </div>
      </div>

      {/* Footer */}
       {/* Footer: 12sp/300, white text, bottom aligned */}
      <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-white">
         {/* Footer content removed as requested */}
         برمجة وتصميم (يمن روبوت) 774541452
      </footer>
    </div>
  );
}
