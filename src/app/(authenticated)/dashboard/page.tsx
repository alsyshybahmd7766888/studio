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
// import { useBalance } from '@/hooks/use-balance'; // Import balance context hook if created

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
  // const { balance } = useBalance(); // Get balance from context

  // --- Simulate Balance State (Use this if not using context) ---
  const [currentBalance, setCurrentBalance] = React.useState(5000); // Match initial balance in recharge pages
  // In a real app, fetch balance from backend here using useEffect
  // ---------------------------------------------------------------

  // Determine which balance to display
  // const displayBalance = balance !== undefined ? balance : currentBalance; // Use context if available, else local state
    const displayBalance = currentBalance; // Using local state for now


  return (
    // Background: Light Grey (#F7F9FA), Text: Dark Grey (#333333)
    <div className="flex min-h-screen flex-col bg-[#F7F9FA] text-[#333333]">
       {/* Header - Teal background (#007B8A), White text */}
       <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-[#007B8A] px-4 py-3 text-white shadow-md">
        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             {/* White icon, hover darker teal */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#007B8A]/80">
              <Menu className="h-6 w-6" />
              <span className="sr-only">القائمة</span>
            </Button>
          </DropdownMenuTrigger>
          {/* Dropdown content: White bg, dark text */}
          <DropdownMenuContent align="start" className="w-56 bg-white text-[#333333]">
            {/* Logo in Dropdown */}
            <DropdownMenuLabel className="flex items-center justify-center py-3">
              <span className="text-3xl font-bold">
                <span className="text-[#007B8A]">٤</span> {/* Teal */}
                <span className="text-[#FF6F3C]">Now</span> {/* Orange */}
              </span>
              {/* <span className="ml-2 text-xl font-bold text-primary">فورناو</span> */}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E0E0E0]"/> {/* Light grey separator */}

            {/* Menu Items */}
            {dropdownMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <DropdownMenuItem key={item.label} asChild>
                   {/* Use Link for navigation or Button for actions */}
                   {/* Item text: Dark grey, hover: light grey bg */}
                  <Link href={item.href} className="flex items-center gap-3 cursor-pointer hover:bg-[#EEEEEE]">
                     {/* Icon: Medium grey */}
                     {typeof IconComponent === 'function' ? <IconComponent className="h-4 w-4 text-[#666666]" /> : <item.icon className="h-4 w-4 text-[#666666]" />}
                     <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator className="bg-[#E0E0E0]"/>

             {/* Logout Item */}
            <DropdownMenuItem asChild>
              {/* Replace '#' with actual logout logic/link */}
               {/* Destructive (Red) text, hover light red bg */}
               <button onClick={() => alert('Logout clicked!')} className="flex items-center gap-3 w-full cursor-pointer text-red-600 hover:bg-red-100 focus:bg-red-100 focus:text-red-700">
                 <LogOut className="h-4 w-4" />
                 <span>خروج</span>
               </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


        {/* Balance - White text */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5">
            <Wallet className="h-5 w-5 opacity-90" />
            {/* Display the balance dynamically */}
            <span className="text-lg font-semibold">رصيدي: {displayBalance.toLocaleString()}</span>
          </div>
        </div>

        {/* User Info & Avatar - White text */}
        <div className="flex items-center gap-3">
          <div className="text-right">
             {/* Updated username text */}
             <div className="text-sm font-medium">اسم حساب المستخدم</div>
             {/* Account number removed as requested */}
          </div>
           {/* Avatar: White border */}
          <Avatar className="h-10 w-10 border-2 border-white/80">
             <AvatarImage src="https://picsum.photos/40/40?grayscale" alt="اسم حساب المستخدم" />
             <AvatarFallback>أح</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center pb-20 pt-8">
         {/* Logo Section */}
         <div className="mb-10 flex flex-col items-center text-center">
             {/* White circle, Teal and Orange logo */}
             <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                 <span className="text-3xl font-bold">
                     <span className="text-[#007B8A]">٤</span> {/* Teal */}
                     <span className="text-[#FF6F3C]">Now</span> {/* Orange */}
                 </span>
             </div>
             {/* Slogan: Medium grey text */}
             <p className="mt-1 text-sm font-medium text-[#666666] italic">
                 فورناو… لا وقت للانتظار!
             </p>
         </div>

        {/* Favorite Services Section - White bg, dark text */}
        <section className="w-full max-w-md rounded-t-[12px] bg-white p-6 shadow-inner"> {/* Slightly smaller radius */}
           <h2 className="mb-5 text-center text-lg font-semibold text-[#333333]">
            الخدمات والأقسام المفضلة
          </h2>
           {/* 6 Circles: White bg, Teal border, Teal plus, Medium grey text */}
           <div className="grid grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1.5">
                 <Button
                  variant="outline"
                  size="icon"
                  className="h-16 w-16 rounded-full border-2 border-[#007B8A] bg-white text-[#007B8A] hover:bg-[#007B8A]/10" // Teal border/icon
                  aria-label="اختر خدمة مفضلة"
                >
                   <Plus className="h-7 w-7" />
                 </Button>
                 {/* Text: Medium grey */}
                 <span className="text-xs text-[#666666]">اختر</span>
              </div>
            ))}
          </div>
        </section>

        {/* Main Icons Grid */}
        <section className="mt-8 w-full max-w-md px-6">
           {/* 2x3 Grid */}
           <div className="grid grid-cols-2 gap-4">
            {homeServiceIcons.map((item) => {
              const IconComponent = item.icon;
              return (
                 // Card: White bg, rounded, shadow, hover effect
                <Link key={item.label} href={item.href} passHref>
                   <Card className="cursor-pointer overflow-hidden rounded-[12px] bg-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:shadow-sm active:translate-y-0">
                     {/* Card Content: Padding, center */}
                     <CardContent className="flex flex-col items-center justify-center p-5 text-center">
                       {/* Icon Circle: Secondary blue bg, white icon */}
                       <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#004E66] text-white">
                         {typeof IconComponent === 'function' ? <IconComponent className="h-7 w-7" /> : <item.icon className="h-7 w-7" />}
                       </div>
                       {/* Label: Dark grey text */}
                       <span className="text-sm font-medium text-[#333333]">{item.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

       {/* Bottom Navigation - White bg, shadow, rounded top */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-[12px] border-t border-[#E0E0E0]/50 bg-white shadow-[0_-4px_10px_-6px_rgba(0,0,0,0.1)]">
         {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant="ghost"
                 className={cn(
                  "flex h-full flex-col items-center justify-center p-1 text-xs font-medium transition-colors duration-200",
                  isActive
                     ? 'text-[#FF6F3C]' // Active: Orange text
                     : 'text-[#666666] hover:text-[#333333]' // Inactive: Medium grey, hover dark grey
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
