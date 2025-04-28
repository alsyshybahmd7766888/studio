'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { ArrowRight, RefreshCw, Smartphone } from 'lucide-react'; // Add Smartphone icon
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card';
import { useToast } from "@/hooks/use-toast";

// Updated services data including "كبيبة السداد"
const servicesData = [
  { iconText: 'السداد', icon: Smartphone, buttonText: 'كبيبة السداد', href: '/recharge' }, // Added كبيبة السداد
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
    const router = useRouter(); // Initialize router

    const handleRefresh = () => {
        console.log('Refreshing services...');
        toast({
            title: "تحديث",
            description: "تم تحديث قائمة الخدمات.",
            variant: 'default', // Use default style
        });
        // Add actual refresh logic here if needed
    };

    const handleServiceClick = (service: typeof servicesData[0]) => {
      console.log(`Handling click for ${service.buttonText}...`);
      toast({
        title: "تم التحديد",
        description: `جارٍ الانتقال إلى خدمة ${service.buttonText}`,
        variant: 'default', // Use default style
      });

      if (service.href) {
        router.push(service.href); // Navigate if href is provided
      } else {
        // Handle other services without a specific page yet (optional)
        console.log(`No specific page defined for ${service.buttonText}`);
      }
    };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        <Link href="/" passHref>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80"> {/* Ensure hover matches theme */}
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
            </Button>
        </Link>
        <h1 className="text-lg font-semibold">الخدمات</h1>
        <Button variant="ghost" size="icon" className="text-accent hover:bg-primary/80" onClick={handleRefresh}> {/* Use accent color, adjust hover */}
          <RefreshCw className="h-5 w-5" />
          <span className="sr-only">تحديث</span>
        </Button>
      </header>

      {/* Main Content Area - Services Grid */}
      <main className="flex-1 p-4 pt-6">
        <div className="grid grid-cols-2 gap-3"> {/* gap-3 for ~12px */}
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon} // Pass icon component if available
              iconText={service.iconText}
              buttonText={service.buttonText}
              onClick={() => handleServiceClick(service)} // Pass the whole service object
            />
          ))}
        </div>
      </main>

      {/* No bottom navigation on this page as requested */}
    </div>
  );
}
