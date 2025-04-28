
'use client';

import * as React from 'react';
import Link from 'next/link'; // Import Link
import {
  Menu,
  Wallet,
  Plus,
  Smartphone,
  Users, // Keep Users for now, map below uses Cog
  DollarSign,
  ShoppingCart,
  Gamepad2,
  Home as HomeIcon,
  CircleEllipsis,
  FileText,
  Smile,
  List,
  Cog, // Use Cog for "إدارة العملاء"
  ArrowRight, // Added for the logo area
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image'; // Import Image

// Custom SimCard Icon (Inline SVG) - Reusable component
const SimCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M8 6h4" />
    <path d="M8 10h4" />
    <path d="M8 14h4" />
    <path d="M6 18h12" />
    <path d="M12 18v-2" />
    <path d="M12 12v-2" />
    <path d="M12 6V4" />
  </svg>
);


// Service icons and links for the main grid
const homeServiceIcons = [
  { label: 'كبيبة السداد', icon: Smartphone, href: '/recharge' },
  { label: 'إدارة العملاء', icon: Cog, href: '#' }, // Use Cog icon
  { label: 'التحويل لحساب', icon: DollarSign, href: '#' },
  { label: 'الشرائح', icon: SimCardIcon, href: '/simcards' }, // Updated href to /simcards
  { label: 'البرامج', icon: ShoppingCart, href: '/programs' }, // Updated href to /programs
  { label: 'معرض الألعاب', icon: Gamepad2, href: '/games' }, // Updated href to /games
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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-md">
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
          <Menu className="h-6 w-6" />
          <span className="sr-only">القائمة</span>
        </Button>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5">
            <Wallet className="h-5 w-5 opacity-90" />
            <span className="text-lg font-semibold">رصيدي: 0</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
             {/* Updated user name */}
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
        {/* Logo Section */}
         <div className="mb-10 flex flex-col items-center text-center">
             <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-card shadow-lg">
                 <span className="text-3xl font-bold">
                     <span className="text-secondary">٤</span>
                     <span className="text-accent">Now</span>
                 </span>
             </div>
             <p className="mt-1 text-sm font-medium text-muted-foreground italic">
                 فورناو… لا وقت للانتظار!
             </p>
         </div>

        {/* Favorite Services Section */}
        <section className="w-full rounded-t-[2rem] bg-card p-6 shadow-inner">
          <h2 className="mb-5 text-center text-lg font-semibold text-foreground">
            الخدمات والأقسام المفضلة
          </h2>
          <div className="grid grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-16 w-16 rounded-full border-2 border-primary bg-card text-primary hover:bg-primary/10"
                  aria-label="اختر خدمة مفضلة"
                >
                  <Plus className="h-7 w-7" />
                </Button>
                <span className="text-xs text-muted-foreground">اختر</span>
              </div>
            ))}
          </div>
        </section>

        {/* Main Icons Grid */}
        <section className="mt-8 w-full px-6">
          <div className="grid grid-cols-2 gap-4">
            {homeServiceIcons.map((item) => {
              const IconComponent = item.icon; // Handle both Lucide and custom components
              return (
                <Link key={item.label} href={item.href} passHref>
                  <Card className="cursor-pointer overflow-hidden rounded-xl bg-card shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:shadow-sm active:translate-y-0">
                    <CardContent className="flex flex-col items-center justify-center p-5 text-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        {typeof IconComponent === 'function' ? <IconComponent className="h-7 w-7" /> : <item.icon className="h-7 w-7" />}
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-xl border-t border-border/50 bg-card shadow-[0_-4px_10px_-6px_rgba(0,0,0,0.1)]">
         {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "flex h-full flex-col items-center justify-center p-1 text-xs font-medium transition-colors duration-200",
                  isActive
                    ? 'text-accent'
                    : 'text-muted-foreground hover:text-foreground'
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

