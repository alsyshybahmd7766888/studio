'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Menu,
  Wallet,
  Plus,
  Smartphone,
  DollarSign,
  ShoppingCart,
  Gamepad2,
  Home as HomeIcon,
  CircleEllipsis,
  FileText,
  Smile,
  List,
  Cog, // Use Cog for "إدارة العملاء"
  ArrowRight,
  MessageSquare, // Icon for Chat App
  History,      // Icon for My Operations
  Shield,       // Icon for My Insurance/Security
  BookOpen,     // Icon for My Diary/Journal
  Settings,     // Icon for Settings
  User,         // Icon for Profile
  Bell,         // Icon for Notifications
  Wifi,         // Icon for WiFi Networks
  LogOut,       // Icon for Logout
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown components
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
  { label: 'كبيبة السداد', icon: Smartphone, href: '/services/recharge' },
  { label: 'إدارة العملاء', icon: Cog, href: '#' }, // Use Cog icon
  { label: 'التحويل لحساب', icon: DollarSign, href: '#' },
  { label: 'الشرائح', icon: SimCardIcon, href: '/services/simcards' },
  { label: 'البرامج', icon: ShoppingCart, href: '/services/programs' },
  { label: 'معرض الألعاب', icon: Gamepad2, href: '/services/games' },
];

// Navigation items
const navItems = [
    { label: 'الرئيسية', icon: HomeIcon, href: '/dashboard' },
    { label: 'خدمات', icon: CircleEllipsis, href: '/services' },
    { label: 'تقرير', icon: FileText, href: '#' },
    { label: 'حسابي', icon: Smile, href: '#' },
    { label: 'المزيد', icon: List, href: '#' },
];

// Dropdown Menu Items
const dropdownMenuItems = [
  { label: 'شات آب', icon: MessageSquare, href: '#' },
  { label: 'عملياتي', icon: History, href: '#' },
  { label: 'تأميناتي', icon: Shield, href: '#' },
  { label: 'يومياتي', icon: BookOpen, href: '#' },
  { label: 'الإعدادات', icon: Settings, href: '/settings' }, // Updated href
  { label: 'الملف الشخصي', icon: User, href: '#' },
  { label: 'الاشعارات', icon: Bell, href: '#' },
  { label: 'الشرائح', icon: SimCardIcon, href: '/services/simcards' },
  { label: 'wifi معرض شبكاتي', icon: Wifi, href: '#' },
];

export default function DashboardPage() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
       {/* Header */}
       <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-md">
        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
              <Menu className="h-6 w-6" />
              <span className="sr-only">القائمة</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-card text-card-foreground">
            {/* Logo in Dropdown */}
            <DropdownMenuLabel className="flex items-center justify-center py-3">
              <span className="text-3xl font-bold">
                <span className="text-primary">٤</span>
                <span className="text-accent">Now</span>
              </span>
              {/* <span className="ml-2 text-xl font-bold text-primary">فورناو</span> */}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50"/>

            {/* Menu Items */}
            {dropdownMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <DropdownMenuItem key={item.label} asChild>
                   {/* Use Link for navigation or Button for actions */}
                  <Link href={item.href} className="flex items-center gap-3 cursor-pointer">
                     {typeof IconComponent === 'function' ? <IconComponent className="h-4 w-4 text-muted-foreground" /> : <item.icon className="h-4 w-4 text-muted-foreground" />}
                     <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator className="bg-border/50"/>

             {/* Logout Item */}
            <DropdownMenuItem asChild>
              {/* Replace '#' with actual logout logic/link */}
               <button onClick={() => alert('Logout clicked!')} className="flex items-center gap-3 w-full cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                 <LogOut className="h-4 w-4" />
                 <span>خروج</span>
               </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


        {/* Balance */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5">
            <Wallet className="h-5 w-5 opacity-90" />
            <span className="text-lg font-semibold">رصيدي: 0</span>
          </div>
        </div>

        {/* User Info & Avatar */}
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
         {/* Logo Section */}
         <div className="mb-10 flex flex-col items-center text-center">
             <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-card shadow-lg">
                 {/* 4NOW Logo */}
                 <span className="text-3xl font-bold">
                     <span className="text-primary">٤</span>
                     <span className="text-accent">Now</span>
                 </span>
             </div>
             <p className="mt-1 text-sm font-medium text-muted-foreground italic">
                 فورناو… لا وقت للانتظار!
             </p>
         </div>

        {/* Favorite Services Section */}
        <section className="w-full max-w-md rounded-t-[var(--radius-lg)] bg-card p-6 shadow-inner">
           <h2 className="mb-5 text-center text-lg font-semibold text-card-foreground">
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
        <section className="mt-8 w-full max-w-md px-6">
           <div className="grid grid-cols-2 gap-4">
            {homeServiceIcons.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.label} href={item.href} passHref>
                   <Card className="cursor-pointer overflow-hidden rounded-[var(--radius)] bg-card shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:shadow-sm active:translate-y-0">
                     <CardContent className="flex flex-col items-center justify-center p-5 text-center">
                       <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                         {typeof IconComponent === 'function' ? <IconComponent className="h-7 w-7" /> : <item.icon className="h-7 w-7" />}
                       </div>
                       <span className="text-sm font-medium text-card-foreground">{item.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

       {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-[var(--radius-lg)] border-t border-border/50 bg-card shadow-[0_-4px_10px_-6px_rgba(0,0,0,0.1)]">
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
                    : 'text-muted-foreground hover:text-card-foreground'
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
