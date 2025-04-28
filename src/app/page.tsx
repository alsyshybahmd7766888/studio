'use client';

import * as React from 'react';
import {
  Menu,
  Wallet,
  Plus,
  Smartphone,
  Users,
  DollarSign,
  CreditCard, // Using CreditCard for الشرائح (Slides/SIMs)
  ShoppingCart,
  Gamepad2, // Keeping Gamepad2 for معرض الألعاب
  Home as HomeIcon,
  CircleEllipsis, // Using CircleEllipsis for Services (three dots)
  FileText,
  Smile,
  List,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const serviceIcons = [
  { label: 'كبيبة السداد', icon: Smartphone },
  { label: 'إدارة العملاء', icon: Users }, // Placeholder, requires combined icon or custom SVG
  { label: 'التحويل لحساب', icon: DollarSign },
  { label: 'الشرائح', icon: CreditCard },
  { label: 'البرامج', icon: ShoppingCart },
  { label: 'معرض الألعاب', icon: Gamepad2 },
];

export default function Home() {
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
            <span className="text-lg font-semibold">رصيدي: 11</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold">صهيب أحمد</div>
            <div className="text-xs opacity-80">12130</div>
          </div>
          <Avatar className="h-10 w-10 border-2 border-white">
            {/* Placeholder image - replace with actual user image */}
            <AvatarImage src="https://picsum.photos/40/40?grayscale" alt="صهيب أحمد" />
            <AvatarFallback>صأ</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col items-center pb-20 pt-8"> {/* Added padding-bottom for nav bar */}
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-2 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg">
            <span className="text-4xl font-bold">
              <span className="text-[hsl(var(--dark-green))]">4</span>
              <span className="text-secondary">Now</span>
            </span>
          </div>
          <p className="text-center text-lg font-medium text-primary-foreground">
            فورناو… لا وقت للانتظار!
          </p>
        </div>

        {/* Favorite Services Section */}
        <section className="w-full rounded-t-[3rem] bg-card p-6 shadow-inner">
          <h2 className="mb-4 text-center text-lg font-semibold text-card-foreground">
            الخدمات والأقسام المفضلة
          </h2>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 border-primary bg-white text-primary hover:bg-gray-100"
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
            {serviceIcons.map((item) => (
              <Card key={item.label} className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <item.icon className="mb-2 h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-2xl border-t bg-white shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
        <Button variant="ghost" className="flex h-full flex-col items-center justify-center p-1 text-secondary">
          <HomeIcon className="h-5 w-5" />
          <span className="mt-1 text-xs">الرئيسية</span>
        </Button>
        <Button variant="ghost" className="flex h-full flex-col items-center justify-center p-1 text-muted-foreground">
          <CircleEllipsis className="h-5 w-5" />
          <span className="mt-1 text-xs">خدمات</span>
        </Button>
        <Button variant="ghost" className="flex h-full flex-col items-center justify-center p-1 text-muted-foreground">
          <FileText className="h-5 w-5" />
          <span className="mt-1 text-xs">تقرير</span>
        </Button>
        <Button variant="ghost" className="flex h-full flex-col items-center justify-center p-1 text-muted-foreground">
          <Smile className="h-5 w-5" />
          <span className="mt-1 text-xs">حسابي</span>
        </Button>
        <Button variant="ghost" className="flex h-full flex-col items-center justify-center p-1 text-muted-foreground">
          <List className="h-5 w-5" />
          <span className="mt-1 text-xs">المزيد</span>
        </Button>
      </nav>
    </div>
  );
}
