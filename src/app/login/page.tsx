'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fingerprint, Lock, Mail, User, Smile } from 'lucide-react'; // Use Mail or User icon

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-[32px] text-foreground">
      {/* Status Bar Area (Placeholder) - Assumed transparent bg */}
      <div className="h-[24px] w-full"></div>

      {/* Logo Header */}
      <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-card shadow-lg">
        {/* Replace with 4NOW logo */}
         <span className="text-3xl font-bold">
           <span className="text-green-700">٤</span>
           <span className="text-orange-500">Now</span>
         </span>
         {/* Alternatively, use an Image component if you have a logo file */}
         {/* <Image src="/logos/4now-logo.svg" alt="4NOW Logo" width={96} height={96} /> */}
      </div>

      {/* White Container */}
      <div className="w-full max-w-md rounded-[var(--radius-lg)] bg-card p-4 shadow-xl">
        {/* Input Fields */}
        <div className="space-y-3">
           {/* Username/Phone Input */}
           <div className="relative">
            <Input
              type="text"
              placeholder="اسم الدخول أو رقم الهاتف"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 rounded-[var(--radius)] border bg-input pr-10 text-base placeholder-muted-foreground" // Adjusted padding for icon
              dir="rtl" // Ensure placeholder is RTL
            />
            <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" /> {/* Icon */}
          </div>

           {/* Password Input */}
           <div className="relative">
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-[var(--radius)] border bg-input pr-10 text-base placeholder-muted-foreground" // Adjusted padding for icon
              dir="rtl" // Ensure placeholder is RTL
            />
            <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" /> {/* Icon */}
          </div>
        </div>

        {/* Login Button */}
        <Button
           className="mt-4 h-12 w-full rounded-[var(--radius)] bg-primary text-base font-medium text-primary-foreground"
           onClick={() => console.log('Login attempt')} // Replace with actual login logic
        >
          دخول
        </Button>

        {/* Biometric Icons */}
        <div className="mt-4 flex items-center justify-center space-x-6 rtl:space-x-reverse">
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFC107]" // Yellow background
            aria-label="الدخول باستخدام الوجه"
            onClick={() => console.log('Face ID login')}
          >
            <Smile className="h-8 w-8 text-white" />
          </button>
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#A5F6A0]" // Light green background
            aria-label="الدخول باستخدام البصمة"
             onClick={() => console.log('Fingerprint login')}
          >
            <Fingerprint className="h-8 w-8 text-white" />
          </button>
        </div>

        {/* Secondary Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Link href="/register" passHref>
             <Button variant="default" className="h-12 w-full rounded-[var(--radius)] bg-primary text-base font-normal text-primary-foreground">
               فتح حساب
             </Button>
          </Link>
          <Button variant="default" className="h-12 w-full rounded-[var(--radius)] bg-primary text-base font-normal text-primary-foreground" onClick={() => console.log('Forgot password')}>
            استعادة كلمة السر
          </Button>
        </div>

        {/* Contact Info & Links */}
         <div className="mt-4 space-y-2 text-center">
           {/* Contact info removed as requested */}
           <p className="text-sm font-light text-card-foreground/80">
              {/* Placeholder if needed, otherwise remove */}
           </p>
           <Link href="/privacy" passHref>
              <span className="cursor-pointer text-sm font-light text-blue-600 underline">
                 تعليمات | سياسة الخصوصية
              </span>
           </Link>
         </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-white">
         {/* Footer content removed as requested */}
         {/* برمجة وتصميم (يمن روبوت) 774541452 */}
      </footer>
    </div>
  );
}
