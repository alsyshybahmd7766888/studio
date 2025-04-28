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

  return (
    // Use bg-background
    <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-[32px] text-foreground">
      {/* Status Bar Area (Placeholder) - Assumed transparent bg */}
      <div className="h-[24px] w-full"></div>

      {/* Logo Header */}
       {/* Container: 120x120px, card bg, centered, top padding 32px */}
      <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-card shadow-lg">
        {/* 4NOW Logo */}
         <span className="text-3xl font-bold">
           <span className="text-primary">٤</span> {/* Use primary color */}
           <span className="text-accent">Now</span> {/* Use accent color */}
         </span>
         {/* Alternatively, use an Image component if you have a logo file */}
         {/* <Image src="/logos/4now-logo.svg" alt="4NOW Logo" width={96} height={96} /> */}
      </div>

      {/* Card Container */}
       {/* Container: Card bg, rounded-lg (1rem), full width minus padding, internal padding 1rem */}
      <div className="w-full max-w-md rounded-[var(--radius-lg)] bg-card p-4 shadow-xl"> {/* p-4 for 16px padding */}
        {/* Input Fields */}
        <div className="space-y-3"> {/* space-y-3 for 12px gap */}
           {/* Username/Phone Input */}
           <div className="relative">
             {/* Input: h-12 (48px), rounded (0.5rem), input bg (white), text-base, placeholder muted */}
            <Input
              type="text"
              placeholder="اسم الدخول أو رقم الهاتف"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // Use cn to combine base styles with specific needs
               className={cn(
                 "h-12 rounded-[var(--radius)] border bg-input pr-10 text-base placeholder-muted-foreground", // pr-10 for icon space
                 "border-border text-foreground" // Ensure border color and text color from theme
              )}
              dir="rtl" // Ensure placeholder is RTL
            />
             {/* Icon: User/Mail, 20px size, color muted-foreground/70 */}
            <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" /> {/* Icon */}
          </div>

           {/* Password Input */}
           <div className="relative">
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                 "h-12 rounded-[var(--radius)] border bg-input pr-10 text-base placeholder-muted-foreground",
                 "border-border text-foreground"
              )}
              dir="rtl"
            />
             {/* Icon: Lock/Shield, 20px size, color muted-foreground/70 */}
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" /> {/* Icon */}
          </div>
        </div>

        {/* Login Button */}
         {/* Button: h-48px, full width, primary bg, primary-foreground text 16sp/500, rounded 0.5rem, mt-16px */}
        <Button
           variant="default" // Use primary variant
           className="mt-4 h-12 w-full rounded-[var(--radius)] text-base font-medium"
           onClick={handleLogin} // Call handleLogin on click
        >
          دخول
        </Button>

        {/* Biometric Icons */}
         {/* Icons: 64px diameter, accent (#FF6F3C) & secondary (#E0E0E0) bg, white/primary icons, 24px gap, mt-16px */}
        <div className="mt-4 flex items-center justify-center space-x-6 rtl:space-x-reverse"> {/* space-x-6 for 24px gap */}
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-accent" // Accent background
            aria-label="الدخول باستخدام الوجه"
            onClick={() => console.log('Face ID login')}
          >
            <Smile className="h-8 w-8 text-accent-foreground" /> {/* Use accent foreground */}
          </button>
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary" // Secondary background
            aria-label="الدخول باستخدام البصمة"
             onClick={() => console.log('Fingerprint login')}
          >
            <Fingerprint className="h-8 w-8 text-secondary-foreground" /> {/* Use secondary foreground */}
          </button>
        </div>

        {/* Secondary Buttons */}
         {/* Buttons: h-48px, ~half width each, secondary bg, secondary-foreground text 16sp/400, rounded 0.5rem, 16px gap, mt-16px */}
        <div className="mt-4 grid grid-cols-2 gap-4"> {/* gap-4 for 16px */}
          <Link href="/register" passHref>
             <Button variant="secondary" className="h-12 w-full rounded-[var(--radius)] text-base font-normal">
               فتح حساب
             </Button>
          </Link>
          <Button variant="secondary" className="h-12 w-full rounded-[var(--radius)] text-base font-normal" onClick={() => console.log('Forgot password')}>
            استعادة كلمة السر
          </Button>
        </div>

        {/* Contact Info & Links */}
         <div className="mt-4 space-y-2 text-center"> {/* mt-16px, space-y-8px */}
           {/* Contact info removed */}
           {/* Link: 14sp/300, primary color, mt-8px */}
           <Link href="/privacy" passHref>
              <span className="cursor-pointer text-sm font-light text-primary underline hover:text-primary/80">
                 تعليمات | سياسة الخصوصية
              </span>
           </Link>
         </div>
      </div>

      {/* Footer */}
       {/* Footer: 12sp/300, muted-foreground text, bottom aligned */}
      <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-muted-foreground">
         {/* Footer content removed */}
         برمجة وتصميم (يمن روبوت) 774541452
      </footer>
    </div>
  );
}
