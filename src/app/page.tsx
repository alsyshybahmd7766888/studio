'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Menu,
  Wallet,
  Plus,
  Smartphone, // كبيبة السداد
  Users, // إدارة العملاء (using Users, will update if specific icon is available)
  DollarSign, // التحويل لحساب
  CreditCard, // الشرائح (Using CreditCard, replace if specific SimCard icon available)
  ShoppingCart, // البرامج
  Gamepad2, // معرض الألعاب
  Home as HomeIcon,
  CircleEllipsis,
  FileText,
  Smile,
  List,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Service icons and links for the main grid
const homeServiceIcons = [
  { label: 'كبيبة السداد', icon: Smartphone, href: '/recharge' },
  { label: 'إدارة العملاء', icon: Users, href: '#' }, // Using Users icon
  { label: 'التحويل لحساب', icon: DollarSign, href: '#' },
  { label: 'الشرائح', icon: CreditCard, href: '#' }, // Using CreditCard icon
  { label: 'البرامج', icon: ShoppingCart, href: '#' },
  { label: 'معرض الألعاب', icon: Gamepad2, href: '#' },
];

// Navigation items
const navItems = [
    { label: 'الرئيسية', icon: HomeIcon, href: '/' },
    { label: 'خدمات', icon: CircleEllipsis, href: '/services' },
    { label: 'تقرير', icon: FileText, href: '#' }, // Placeholder href
    { label: 'حسابي', icon: Smile, href: '#' }, // Placeholder href
    { label: 'المزيد', icon: List, href: '#' }, // Placeholder href
];

export default function Home() {
  const pathname = usePathname();

  return (
    // Changed background to light gray (defined in globals.css)
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header - Updated Style */}
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-md">
        {/* Menu Button */}
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
          <Menu className="h-6 w-6" />
          <span className="sr-only">القائمة</span>
        </Button>

        {/* Balance Info - Centered */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5">
            <Wallet className="h-5 w-5 opacity-90" />
            <span className="text-lg font-semibold">رصيدي: 0</span>
          </div>
        </div>

        {/* User Info & Avatar - Right Aligned */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium">اسم حساب المستخدم</div>
            {/* Account number removed */}
          </div>
          <Avatar className="h-10 w-10 border-2 border-primary-foreground/80">
            <AvatarImage src="https://picsum.photos/40/40?grayscale" alt="اسم حساب المستخدم" />
            <AvatarFallback>أح</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center pb-20 pt-8">
        {/* Logo Section - Updated Style */}
        <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-card shadow-lg"> {/* White background */}
                <span className="text-3xl font-bold">
                    <span className="text-secondary">٤</span> {/* Dark Blue for '4' */}
                    <span className="text-accent">Now</span> {/* Orange for 'Now' */}
                </span>
            </div>
            <p className="mt-1 text-sm font-medium text-muted-foreground italic"> {/* Slogan */}
                فورناو… لا وقت للانتظار!
            </p>
        </div>

        {/* Favorite Services Section - Updated Style */}
        <section className="w-full rounded-t-[2rem] bg-card p-6 shadow-inner"> {/* White background, rounded top */}
          <h2 className="mb-5 text-center text-lg font-semibold text-foreground"> {/* Black text */}
            الخدمات والأقسام المفضلة
          </h2>
          <div className="grid grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  // White circle with Primary border, Primary plus icon
                  className="h-16 w-16 rounded-full border-2 border-primary bg-card text-primary hover:bg-primary/10"
                  aria-label="اختر خدمة مفضلة"
                >
                  <Plus className="h-7 w-7" />
                </Button>
                <span className="text-xs text-muted-foreground">اختر</span> {/* Muted text */}
              </div>
            ))}
          </div>
        </section>

        {/* Main Icons Grid - 2x3 Layout */}
        <section className="mt-8 w-full px-6">
          <div className="grid grid-cols-2 gap-4">
            {homeServiceIcons.map((item) => (
              <Link key={item.label} href={item.href} passHref>
                 <Card className="cursor-pointer overflow-hidden rounded-xl bg-card shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:shadow-sm active:translate-y-0"> {/* White card, rounded corners */}
                    <CardContent className="flex flex-col items-center justify-center p-5 text-center">
                        {/* Icon Wrapper - Secondary background, White icon */}
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                            <item.icon className="h-7 w-7" />
                        </div>
                        {/* Label - Dark Gray text */}
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation - Updated Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-xl border-t border-border/50 bg-card shadow-[0_-4px_10px_-6px_rgba(0,0,0,0.1)]"> {/* White background */}
         {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "flex h-full flex-col items-center justify-center p-1 text-xs font-medium transition-colors duration-200",
                  isActive
                    ? 'text-accent' // Orange for active item
                    : 'text-muted-foreground hover:text-foreground' // Medium Gray inactive, Dark Gray hover
                )}
              >
                <item.icon className="mb-0.5 h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
