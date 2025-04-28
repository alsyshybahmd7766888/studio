'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { ArrowRight, RefreshCw, Smartphone } from 'lucide-react'; // Import necessary icons
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card'; // Ensure ServiceCard is imported
import { useToast } from "@/hooks/use-toast";

// Updated services data including "كبيبة السداد" and ensuring all have an icon or text
const servicesData = [
  { icon: Smartphone, buttonText: 'كبيبة السداد', href: '/recharge' }, // Use icon component
  { iconText: 'تحويل', buttonText: 'تحويل لحساب عميل', href: '#' }, // Use iconText as fallback
  { iconText: 'MTN', buttonText: 'باقات MTN', href: '#' },
  { iconText: 'سبافون', buttonText: 'باقات سبافون', href: '#' },
  { iconText: 'مزاجك', buttonText: 'خطك.. بمزاجك', href: '#' },
  { iconText: 'دعم', buttonText: 'الدعم الفني', href: '#' },
  { iconText: 'إضافية', buttonText: 'الخدمات الإضافية', href: '#' },
  { iconText: 'عدن', buttonText: 'عدن نت', href: '#' },
  { iconText: 'YOU', buttonText: 'شرائح شبكة YOU', href: '#' },
];

export default function ServicesPage() {
    const { toast } = useToast();
    const router = useRouter(); // Initialize router

    const handleRefresh = () => {
        console.log('Refreshing services...');
        toast({
            title: "تحديث",
            description: "تم تحديث قائمة الخدمات.",
            variant: 'default',
        });
        // Add actual refresh logic here if needed
    };

    const handleServiceClick = (service: typeof servicesData[0]) => {
      console.log(`Handling click for ${service.buttonText}...`);

      if (service.href) {
         toast({
            title: "تم التحديد",
            description: `جارٍ الانتقال إلى خدمة ${service.buttonText}...`,
            variant: 'default',
         });
        router.push(service.href); // Navigate if href is provided
      } else {
        // Handle other services without a specific page yet (optional)
         toast({
            title: "غير متوفر",
            description: `خدمة ${service.buttonText} غير متاحة حالياً.`,
            variant: 'destructive', // Indicate it's not ready
         });
        console.log(`No specific page defined for ${service.buttonText}`);
      }
    };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header - Updated Style */}
       <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        <Link href="/" passHref>
            {/* Adjusted hover color to match primary/80 or a defined hover state */}
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <ArrowRight className="h-5 w-5" />
                <span className="sr-only">رجوع</span>
            </Button>
        </Link>
        <h1 className="text-lg font-semibold">الخدمات</h1>
         {/* Adjusted hover color and ensure accent color is correctly applied */}
        <Button variant="ghost" size="icon" className="text-accent hover:bg-primary/80" onClick={handleRefresh}>
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">تحديث</span>
        </Button>
      </header>

      {/* Main Content Area - Services Grid - Updated Style */}
      <main className="flex-1 p-4 pt-6 md:p-6 md:pt-8"> {/* Added responsive padding */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"> {/* Responsive columns and updated gap */}
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon} // Pass icon component if available
              iconText={service.iconText} // Pass text fallback
              buttonText={service.buttonText}
              onClick={() => handleServiceClick(service)} // Pass the handler
            />
          ))}
        </div>
      </main>

      {/* No bottom navigation on this page */}
    </div>
  );
}
