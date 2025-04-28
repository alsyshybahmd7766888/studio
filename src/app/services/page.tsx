'use client';

import * as React from 'react';
import Link from 'next/link'; // Import Link for navigation
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card'; // Import the new component
import { useToast } from "@/hooks/use-toast"; // Import useToast

const servicesData = [
  { iconText: 'التحويل', buttonText: 'تحويل لحساب عميل' },
  { iconText: 'MTN', buttonText: 'باقات MTN' },
  { iconText: 'سبافون', buttonText: 'باقات سبافون' },
  { iconText: 'مزاجك', buttonText: 'خطك.. بمزاجك' },
  { iconText: 'الدعم', buttonText: 'الدعم الفني' },
  { iconText: 'إضافية', buttonText: 'الخدمات الإضافية' },
  { iconText: 'عدن نت', buttonText: 'عدن نت' },
  { iconText: 'YOU', buttonText: 'شرائح شبكة YOU' },
];

export default function ServicesPage() {
    const { toast } = useToast();

    const handleRefresh = () => {
        // Simulate refreshing data or performing an action
        console.log('Refreshing services...');
        toast({
            title: "تحديث",
            description: "تم تحديث قائمة الخدمات.",
        });
        // Add actual refresh logic here if needed
    };

    const handleServiceClick = (serviceName: string) => {
      // Placeholder action for clicking a service
      console.log(`Navigating to ${serviceName}...`);
      toast({
        title: "تم التحديد",
        description: `جارٍ الانتقال إلى خدمة ${serviceName}`,
      });
      // In a real app, you would navigate to the specific service page here
      // e.g., router.push(`/services/${serviceName.toLowerCase().replace(/\s+/g, '-')}`);
    };


  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        <Link href="/" passHref>
            <Button variant="ghost" size="icon" className="text-primary-foreground">
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
            </Button>
        </Link>
        <h1 className="text-lg font-semibold">الخدمات</h1>
        <Button variant="ghost" size="icon" className="text-accent" onClick={handleRefresh}>
          <RefreshCw className="h-5 w-5" />
          <span className="sr-only">تحديث</span>
        </Button>
      </header>

      {/* Main Content Area - Services Grid */}
      <main className="flex-1 p-4 pt-6">
        <div className="grid grid-cols-2 gap-3"> {/* Using gap-3 for ~12px spacing */}
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              iconText={service.iconText}
              buttonText={service.buttonText}
              onClick={() => handleServiceClick(service.buttonText)}
            />
          ))}
        </div>
      </main>

      {/* Bottom Navigation Placeholder (optional - keep consistent with home) */}
      {/* You might want a simplified or no nav bar on sub-pages */}
       {/* <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around rounded-t-2xl border-t bg-card shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]"> */}
        {/* Navigation items */}
       {/* </nav> */}
    </div>
  );
}
