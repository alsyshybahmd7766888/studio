'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // For image upload placeholders
import {
  User,
  Store,
  Phone,
  MapPin, // Using MapPin for Address
  Lock,
  Eye,
  EyeOff,
  UploadCloud, // Using UploadCloud for image upload areas
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Import Tabs
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    // Use bg-background
    <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-[32px] text-foreground">
      {/* Status Bar Area (Placeholder) */}
      <div className="h-[24px] w-full"></div>

       {/* Logo Header */}
      <div className="mb-8 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-card shadow-lg">
         {/* 4NOW logo using theme colors */}
         <span className="text-3xl font-bold">
           <span className="text-primary">٤</span> {/* Primary color */}
           <span className="text-accent">Now</span> {/* Accent color */}
         </span>
         {/* <Image src="/logos/4now-logo.svg" alt="4NOW Logo" width={96} height={96} /> */}
      </div>

       {/* Card Container */}
      <div className="w-full max-w-md rounded-[var(--radius-lg)] bg-card p-4 shadow-xl">
        {/* Personal Information Section */}
        <div className="mb-4">
           <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
             <Separator className="flex-1 bg-border" /> {/* Use border color for separator */}
             <h2 className="whitespace-nowrap text-lg font-medium text-card-foreground">
               البيانات الشخصية
             </h2>
             <Separator className="flex-1 bg-border" />
           </div>

           <div className="mt-3 space-y-3">
            {/* Full Name */}
             <div className="relative">
              <Input
                type="text"
                placeholder="الاسم الرباعي مع اللقب"
                className="h-12 rounded-[var(--radius)] border bg-input pr-10 text-base placeholder-muted-foreground text-foreground"
                dir="rtl"
              />
              <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
            </div>
             {/* Business Activity */}
            <div className="relative">
              <Input
                type="text"
                placeholder="النشاط التجاري"
                 className="h-12 rounded-[var(--radius)] border bg-input pr-10 text-base placeholder-muted-foreground text-foreground"
                dir="rtl"
              />
              <Store className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
            </div>
             {/* Phone Number */}
            <div className="relative">
              <Input
                type="tel"
                placeholder="رقم الهاتف"
                 className="h-12 rounded-[var(--radius)] border bg-input pr-10 text-base placeholder-muted-foreground text-foreground"
                dir="rtl"
              />
              <Phone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
            </div>
             {/* Address */}
            <div className="relative">
              <Input
                type="text"
                placeholder="العنوان"
                 className="h-12 rounded-[var(--radius)] border bg-input pr-10 text-base placeholder-muted-foreground text-foreground"
                dir="rtl"
              />
              <MapPin className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
            </div>
          </div>
        </div>

        {/* Login Details Section */}
        <div className="mb-4">
           <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
             <Separator className="flex-1 bg-border" />
             <h2 className="whitespace-nowrap text-lg font-medium text-card-foreground">
               بيانات الدخول
             </h2>
             <Separator className="flex-1 bg-border" />
           </div>

           <div className="mt-3 space-y-3">
            {/* Username */}
            <div className="relative">
              <Input
                type="text"
                placeholder="اسم الدخول أو رقم الهاتف"
                 className="h-12 rounded-[var(--radius)] border bg-input pr-10 text-base placeholder-muted-foreground text-foreground"
                dir="rtl"
              />
               <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
            </div>
            {/* Password */}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="كلمة المرور"
                 className="h-12 rounded-[var(--radius)] border bg-input px-10 text-base placeholder-muted-foreground text-foreground" // Padding left and right for icons
                dir="rtl"
              />
              <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
              <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground/70 hover:text-card-foreground"
                 aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
             {/* Confirm Password */}
             <div className="relative">
              <Input
                 type={showConfirmPassword ? 'text' : 'password'}
                 placeholder="تأكيد كلمة المرور"
                  className="h-12 rounded-[var(--radius)] border bg-input px-10 text-base placeholder-muted-foreground text-foreground"
                 dir="rtl"
              />
              <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground/70" />
               <button
                 type="button"
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                 className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground/70 hover:text-card-foreground"
                 aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Document Type Tabs */}
        <Tabs defaultValue="personal-id" className="mt-4 w-full">
           <TabsList className="grid h-auto w-full grid-cols-4 gap-2 bg-transparent p-0">
            {/* Active Tab: Use accent color */}
             <TabsTrigger
              value="personal-id"
              className={cn(
                 "h-10 rounded-[var(--radius)] text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md",
                 // Inactive Tab: Use secondary colors or outline variant
                 "border border-accent bg-card text-accent data-[state=inactive]:hover:bg-accent/10"
              )}
            >
              بطاقة شخصية
            </TabsTrigger>
            <TabsTrigger
              value="passport"
              className={cn(
                "h-10 rounded-[var(--radius)] text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md",
                "border border-accent bg-card text-accent data-[state=inactive]:hover:bg-accent/10"
              )}
            >
              جواز
            </TabsTrigger>
             <TabsTrigger
              value="commercial-reg"
               className={cn(
                "h-10 rounded-[var(--radius)] text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md",
                 "border border-accent bg-card text-accent data-[state=inactive]:hover:bg-accent/10"
              )}
            >
              سجل تجاري
            </TabsTrigger>
            <TabsTrigger
              value="family-card"
               className={cn(
                "h-10 rounded-[var(--radius)] text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md",
                 "border border-accent bg-card text-accent data-[state=inactive]:hover:bg-accent/10"
              )}
            >
              بطاقة عائلية
            </TabsTrigger>
          </TabsList>
           {/* Content for each tab can be added here if needed, or handled by logic */}
           {/* <TabsContent value="personal-id">...</TabsContent> */}
        </Tabs>

        {/* Image Upload Placeholders */}
        <div className="mt-3 grid grid-cols-2 gap-3">
           {/* Use muted background and border */}
           <div className="aspect-square w-full cursor-pointer rounded-[var(--radius)] bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/50 hover:border-primary/50 hover:bg-muted">
            <UploadCloud className="h-10 w-10 text-muted-foreground/70" />
            {/* Add input type="file" hidden and trigger via onClick */}
           </div>
           <div className="aspect-square w-full cursor-pointer rounded-[var(--radius)] bg-muted/50 flex items-center justify-center border-2 border-dashed border-muted-foreground/50 hover:border-primary/50 hover:bg-muted">
             <UploadCloud className="h-10 w-10 text-muted-foreground/70" />
            {/* Add input type="file" hidden and trigger via onClick */}
          </div>
        </div>

         {/* Register Button - Use primary color */}
        <Button
           variant="default"
           className="mt-4 h-12 w-full rounded-[var(--radius)] text-base font-medium"
           onClick={() => console.log('Register attempt')} // Replace with actual register logic
        >
          تسجيل
        </Button>

        {/* Login Link */}
        <p className="mt-3 text-center text-sm font-light text-muted-foreground">
          هل لديك حساب؟{' '}
          <Link href="/login" passHref>
            <span className="cursor-pointer font-medium text-primary hover:underline">
              قم بالدخول
            </span>
          </Link>
        </p>

      </div>

       {/* Footer */}
      <footer className="mt-auto pb-4 pt-6 text-center text-xs font-light text-muted-foreground">
         {/* Footer content removed as requested */}
         برمجة وتصميم (يمن روبوت) 774541452
      </footer>
    </div>
  );
}
