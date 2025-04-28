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

export default function LoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = () => {
    if (username === '717168802' && password === '12345678') {
      console.log('Login successful, redirecting to dashboard...');
      toast({
        title: "نجاح تسجيل الدخول",
        description: "جارٍ التوجيه إلى لوحة التحكم...",
        variant: 'default',
      });
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
    console.log('Fingerprint login initiated (simulation)');
    toast({
      title: "الدخول بالبصمة",
      description: "جاري محاولة الدخول باستخدام البصمة... (ميزة قيد التطوير)",
      variant: 'default',
    });
    // In a real app, you would initiate the WebAuthn API flow here.
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
    // Use bg-primary (#007B8A Teal Dark) for the main background
    <div className="flex min-h-screen flex-col items-center bg-primary px-4 pt-[32px] text-primary-foreground"> {/* Main background Teal */}
      {/* Status Bar Area (Placeholder) - Assumed transparent bg */}
      <div className="h-[24px] w-full"></div>

      {/* Logo Header */}
       {/* Container: 120x120px, white bg, centered */}
      <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-card shadow-lg"> {/* White card bg */}
        {/* 4NOW Logo */}
         <span className="text-3xl font-bold">
           <span className="text-primary">٤</span> {/* Primary color (Teal) */}
           <span className="text-accent">Now</span> {/* Accent Orange for Now */}
         </span>
         {/* <Image src="/logos/4now-logo.svg" alt="4NOW Logo" width={96} height={96} /> */}
      </div>

      {/* Card Container - Use card background (White), rounded 24px */}
      <div className="w-full max-w-md rounded-[24px] bg-card p-4 shadow-xl"> {/* Use card bg, specific radius */}
        {/* Input Fields */}
        <div className="space-y-3"> {/* 12px gap */}
           {/* Username/Phone Input */}
           <div className="relative">
             {/* Input: h-12 (48px), rounded-lg (8px), bg-input, text-base, placeholder-muted-foreground */}
            <Input
              type="text"
              placeholder="اسم الدخول أو رقم الهاتف"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={cn(
                "h-12 rounded-lg border bg-input pr-10 text-base placeholder-muted-foreground text-foreground", // pr-10 for icon, use theme colors
                "border-border" // Ensure border color is from theme
              )}
              dir="rtl" // Ensure placeholder is RTL
            />
             {/* Icon: User, 20px size, color muted-foreground */}
            <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" /> {/* Adjusted color intensity */}
          </div>

           {/* Password Input */}
           <div className="relative">
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "h-12 rounded-lg border bg-input pr-10 text-base placeholder-muted-foreground text-foreground",
                "border-border"
              )}
              dir="rtl"
            />
             {/* Icon: Lock, 20px size, color muted-foreground */}
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
          </div>
        </div>

        {/* Login Button */}
         {/* Button: h-48px, full width, bg-primary, text-primary-foreground, rounded 8px, mt-16px */}
        <Button
           variant="default" // Use default variant (maps to primary)
           className="mt-4 h-12 w-full rounded-lg text-base font-medium" // Specific height, radius, use theme colors
           onClick={handleLogin}
        >
          دخول
        </Button>

        {/* Biometric Icons */}
         {/* Icons: 64px diameter, Yellow (#FFC107) & Light Green (#A5F6A0) bg (KEEPING THESE FOR NOW), white icons, 24px gap, mt-16px */}
        <div className="mt-4 flex items-center justify-center space-x-6 rtl:space-x-reverse"> {/* space-x-6 for 24px gap */}
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFC107] shadow" // Yellow background (kept for visual distinction as per original design)
            aria-label="الدخول باستخدام الوجه"
            onClick={handleFaceIdLogin}
          >
            <Smile className="h-8 w-8 text-white" /> {/* White icon */}
          </button>
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#A5F6A0] shadow" // Light Green background (kept)
            aria-label="الدخول باستخدام البصمة"
             onClick={handleFingerprintLogin}
          >
            <Fingerprint className="h-8 w-8 text-white" /> {/* White icon */}
          </button>
        </div>

        {/* Secondary Buttons */}
         {/* Buttons: h-48px, ~half width each, bg-primary, text primary-foreground, rounded 8px, 16px gap, mt-16px */}
        <div className="mt-4 grid grid-cols-2 gap-4"> {/* gap-4 for 16px */}
          <Link href="/register" passHref>
             <Button variant="default" className="h-12 w-full rounded-lg text-base font-normal">
               فتح حساب
             </Button>
          </Link>
          <Button variant="default" className="h-12 w-full rounded-lg text-base font-normal" onClick={handleForgotPassword}>
            استعادة كلمة السر
          </Button>
        </div>

        {/* Contact Info & Links */}
         <div className="mt-4 space-y-2 text-center"> {/* mt-16px, space-y-8px */}
           {/* Contact info removed */}
           {/* Link: 14sp/300, primary color (Teal), mt-8px */}
           <Link href="/privacy" passHref>
              <span className="cursor-pointer text-sm font-light text-primary underline hover:text-primary/80"> {/* Blue link color */}
                 تعليمات | سياسة الخصوصية
              </span>
           </Link>
         </div>
      </div>

      {/* Footer */}
       {/* Footer: 12sp/300, primary-foreground (white), bottom aligned */}
      <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-primary-foreground">
         برمجة وتصميم (يمن روبوت) 774541452
      </footer>
    </div>
  );
}
