'use client';

import * as React from 'react';
import Link from 'next/link'; // Import Link
import {
  Menu,
  Wallet,
  Plus,
  Smartphone,
  Users,
  DollarSign,
  CreditCard, // Keep original CreditCard for potential future use if needed elsewhere
  ShoppingCart,
  Gamepad2,
  Home as HomeIcon,
  CircleEllipsis,
  FileText,
  Smile,
  List,
  Cog, // Replaced Users with Cog for "إدارة العملاء"
  Layers, // Replaced SimCard with Layers for "الشرائح"
  ArrowRight, // Added for the logo
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePathname } from 'next/navigation'; // Import usePathname
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Updated home service icons and added the recharge link
const homeServiceIcons = [
  { label: 'كبيبة السداد', icon: Smartphone, href: '/recharge' }, // Link to recharge page
  { label: 'إدارة العملاء', icon: Cog, href: '#' }, // Updated icon
  { label: 'التحويل لحساب', icon: DollarSign, href: '#' },
  { label: 'الشرائح', icon: Layers, href: '#' }, // Updated icon to Layers
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
        {/* Menu Button */}
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-6 w-6" />
          <span className="sr-only">القائمة</span>
        </Button>

        {/* Balance Info */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <Wallet className="h-5 w-5" />
            <span className="text-lg font-semibold">رصيدي: 0</span> {/* Balance set to 0 */}
          </div>
        </div>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
             {/* Updated User Name */}
            <div className="text-sm font-semibold">اسم حساب المستخدم</div>
             {/* Removed Account Number */}
          </div>
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src="https://picsum.photos/40/40?grayscale" alt="اسم حساب المستخدم" />
            <AvatarFallback>أح</AvatarFallback> {/* Placeholder initials */}
          </Avatar>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center pb-20 pt-8"> {/* Added padding-bottom for nav bar */}
        {/* Logo Section - Updated Style */}
        <div className="mb-8 flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md mb-2">
                <span className="text-2xl font-bold">
                    <span className="text-green-700">٤</span>
                    <span className="text-accent">Now</span>
                </span>
            </div>
            <p className="text-center text-lg font-bold text-primary">
                4Now فورناو
            </p>
            <p className="mt-1 text-center text-sm font-medium text-muted-foreground">
                فورناو… لا وقت للانتظار!
            </p>
        </div>

        {/* Favorite Services Section - Updated Style */}
        <section className="w-full rounded-t-[2rem] bg-white p-6 shadow-inner">
          <h2 className="mb-4 text-center text-lg font-semibold text-foreground"> {/* Text color changed */}
            الخدمات والأقسام المفضلة
          </h2>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 border-green-500 bg-white text-green-500 hover:bg-green-50" /* Green border/icon */
                  aria-label="اختر خدمة مفضلة"
                >
                  <Plus className="h-6 w-6" />
                </Button>
                <span className="text-xs text-foreground">اختر</span> {/* Text color changed */}
              </div>
            ))}
          </div>
        </section>

        {/* Main Icons Grid - Updated Card Style */}
        <section className="mt-6 w-full px-6">
          <div className="grid grid-cols-2 gap-4">
            {homeServiceIcons.map((item) => (
              <Link key={item.label} href={item.href} passHref>
                 <Card className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-transform duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 active:shadow-inner active:translate-y-0"> {/* White BG, updated interactive styles */}
                    <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <item.icon className="mb-2 h-8 w-8 text-primary" /> {/* Icon color primary */}
                    <span className="text-sm font-medium text-foreground">{item.label}</span> {/* Text color foreground */}
                    </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation - Updated Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-2xl border-t bg-card shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
         {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "flex h-full flex-col items-center justify-center p-1 text-xs", // Consistent text size
                  isActive ? 'text-accent' : 'text-muted-foreground' // Use accent color for active item
                )}
              >
                <item.icon className="mb-0.5 h-5 w-5" /> {/* Adjusted margin */}
                <span className="">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
