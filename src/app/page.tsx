'use client';

import * as React from 'react';
import Link from 'next/link'; // Import Link
import {
  Menu,
  Wallet,
  Plus,
  Smartphone,
  Cog, // Using Cog for "إدارة العملاء"
  DollarSign,
  Layers, // Using Layers for "الشرائح"
  ShoppingCart,
  Gamepad2,
  Home as HomeIcon,
  CircleEllipsis,
  FileText,
  Smile,
  List,
  ArrowRight, // Kept for logo, can be replaced if logo becomes pure text/image
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePathname } from 'next/navigation'; // Import usePathname
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Updated home service icons and links based on previous context
const homeServiceIcons = [
  { label: 'كبيبة السداد', icon: Smartphone, href: '/recharge' },
  { label: 'إدارة العملاء', icon: Cog, href: '#' }, // Updated icon
  { label: 'التحويل لحساب', icon: DollarSign, href: '#' },
  { label: 'الشرائح', icon: Layers, href: '#' }, // Updated icon
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
      {/* Header - Refined Style */}
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-lg"> {/* Increased shadow */}
        {/* Menu Button */}
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
          <Menu className="h-6 w-6" />
          <span className="sr-only">القائمة</span>
        </Button>

        {/* Balance Info */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5"> {/* Slightly increased gap */}
            <Wallet className="h-5 w-5 opacity-90" /> {/* Slightly muted icon */}
            <span className="text-lg font-semibold">رصيدي: 0</span> {/* Balance reset to 0 */}
          </div>
        </div>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold">اسم حساب المستخدم</div> {/* Updated User Name, removed number */}
             {/* Removed Account Number */}
          </div>
          <Avatar className="h-10 w-10 border-2 border-primary-foreground/80"> {/* Slightly transparent border */}
            <AvatarImage src="https://picsum.photos/40/40?grayscale" alt="اسم حساب المستخدم" />
            <AvatarFallback>أح</AvatarFallback> {/* Placeholder initials */}
          </Avatar>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center pb-20 pt-8"> {/* Added padding-bottom for nav bar */}
        {/* Logo Section - Enhanced Style */}
        <div className="mb-10 flex flex-col items-center text-center"> {/* Increased bottom margin */}
            <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-card via-background to-card shadow-xl"> {/* Larger, gradient BG, enhanced shadow */}
                <span className="text-3xl font-bold"> {/* Larger text */}
                    <span className="text-primary">٤</span> {/* Using primary color */}
                    <span className="text-accent">Now</span>
                </span>
            </div>
            <p className="text-xl font-bold text-primary"> {/* Larger text */}
                4Now فورناو
            </p>
            <p className="mt-1 text-sm font-medium text-muted-foreground italic"> {/* Italicized slogan */}
                فورناو… لا وقت للانتظار!
            </p>
        </div>

        {/* Favorite Services Section - Refined Style */}
        <section className="w-full rounded-t-[2.5rem] bg-card p-6 shadow-inner"> {/* Increased rounding, card background */}
          <h2 className="mb-5 text-center text-lg font-semibold text-foreground"> {/* Increased margin */}
            الخدمات والأقسام المفضلة
          </h2>
          <div className="grid grid-cols-6 gap-3"> {/* Slightly increased gap */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1.5"> {/* Increased spacing */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-16 w-16 rounded-full border-2 border-accent/50 bg-card text-accent hover:bg-accent/10" /* Accent border/icon, subtle hover */
                  aria-label="اختر خدمة مفضلة"
                >
                  <Plus className="h-7 w-7" /> {/* Larger icon */}
                </Button>
                <span className="text-xs text-muted-foreground">اختر</span> {/* Muted text */}
              </div>
            ))}
          </div>
        </section>

        {/* Main Icons Grid - Enhanced Card Style */}
        <section className="mt-8 w-full px-6"> {/* Increased margin top */}
          <div className="grid grid-cols-2 gap-4">
            {homeServiceIcons.map((item) => (
              <Link key={item.label} href={item.href} passHref>
                 <Card className="cursor-pointer overflow-hidden rounded-2xl bg-card shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5 active:shadow-md active:translate-y-0"> {/* Increased rounding, shadow, transition */}
                    <CardContent className="flex flex-col items-center justify-center p-5 text-center"> {/* Increased padding */}
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"> {/* Icon wrapper */}
                            <item.icon className="h-7 w-7" /> {/* Adjusted icon size */}
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation - Enhanced Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-2xl border-t border-border/50 bg-card shadow-[0_-6px_15px_-8px_rgba(0,0,0,0.1)]"> {/* Softer shadow */}
         {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "flex h-full flex-col items-center justify-center p-1 text-xs font-medium transition-colors duration-200", // Added font-medium and transition
                  isActive
                    ? 'text-accent' // Use accent color for active item
                    : 'text-muted-foreground hover:text-foreground' // Hover effect for inactive items
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
