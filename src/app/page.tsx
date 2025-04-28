'use client';

import * as React from 'react';
import Link from 'next/link'; // Import Link
import {
  Menu,
  Wallet,
  Plus,
  Smartphone,
  Users, // Using Users for 'إدارة العملاء'
  DollarSign,
  CreditCard, // Using CreditCard for الشرائح (SIMs)
  ShoppingCart,
  Gamepad2,
  Home as HomeIcon,
  CircleEllipsis,
  FileText,
  Smile,
  List,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePathname } from 'next/navigation'; // Import usePathname
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Simplified serviceIcons for the home page grid
const homeServiceIcons = [
  { label: 'كبيبة السداد', icon: Smartphone, href: '#' }, // Add hrefs later if needed
  { label: 'إدارة العملاء', icon: Users, href: '#' },
  { label: 'التحويل لحساب', icon: DollarSign, href: '#' },
  { label: 'الشرائح', icon: CreditCard, href: '#' },
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
  const pathname = usePathname(); // Get current path

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-6 w-6" />
          <span className="sr-only">القائمة</span>
        </Button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <Wallet className="h-5 w-5" />
            <span className="text-lg font-semibold">رصيدي: 0</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold">اسم حساب المستخدم</div>
            {/* Account number removed */}
          </div>
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src="https://picsum.photos/40/40?grayscale" alt="اسم حساب المستخدم" />
            <AvatarFallback>أح</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center pb-20 pt-8"> {/* Added padding-bottom for nav bar */}
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          {/* Logo removed as per visual design preference, keeping text */}
          <p className="text-center text-xl font-bold text-primary">
            4Now فورناو
          </p>
           <p className="mt-1 text-center text-sm font-medium text-muted-foreground">
            فورناو… لا وقت للانتظار!
          </p>
        </div>

        {/* Favorite Services Section */}
        <section className="w-full rounded-t-[2rem] bg-card p-6 shadow-inner">
          <h2 className="mb-4 text-center text-lg font-semibold text-card-foreground">
            الخدمات والأقسام المفضلة
          </h2>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 border-primary bg-card text-primary hover:bg-muted"
                  aria-label="اختر خدمة مفضلة"
                >
                  <Plus className="h-6 w-6" />
                </Button>
                <span className="text-xs text-foreground">اختر</span>
              </div>
            ))}
          </div>
        </section>

        {/* Main Icons Grid */}
        <section className="mt-6 w-full px-6">
          <div className="grid grid-cols-2 gap-4">
            {homeServiceIcons.map((item) => (
              <Link key={item.label} href={item.href} passHref>
                 <Card className="cursor-pointer overflow-hidden rounded-xl bg-card shadow-md transition-shadow hover:shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <item.icon className="mb-2 h-8 w-8 text-primary" />
                    <span className="text-sm font-medium text-card-foreground">{item.label}</span>
                    </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-2xl border-t bg-card shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
         {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "flex h-full flex-col items-center justify-center p-1",
                  isActive ? 'text-accent' : 'text-muted-foreground' // Use accent color for active item
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="mt-1 text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
