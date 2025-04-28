'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, RefreshCw, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

// Services data - ensure consistency with icons/text used elsewhere if needed
const servicesData = [
  { icon: Smartphone, buttonText: 'كبيبة السداد', href: '/recharge' },
  { iconText: 'تحويل', buttonText: 'تحويل لحساب عميل', href: '#' },
  { iconText: 'MTN', buttonText: 'باقات MTN', href: '#' }, // Placeholder, replace if specific icon needed
  { iconText: 'سبافون', buttonText: 'باقات سبافون', href: '#' },
  { iconText: 'مزاجك', buttonText: 'خطك.. بمزاجك', href: '#' },
  { iconText: 'دعم', buttonText: 'الدعم الفني', href: '#' },
  { iconText: 'إضافية', buttonText: 'الخدمات الإضافية', href: '#' },
  { iconText: 'عدن', buttonText: 'عدن نت', href: '#' },
  { iconText: 'YOU', buttonText: 'شرائح شبكة YOU', href: '#' },
];

export default function ServicesPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [activeService, setActiveService] = React.useState<string | null>(null); // Track active service for styling

    const handleRefresh = () => {
        console.log('Refreshing services...');
        toast({
            title: "تحديث",
            description: "تم تحديث قائمة الخدمات.",
            variant: 'default', // Uses primary color defined in globals
        });
        // Add actual refresh logic here if needed
    };

    const handleServiceClick = (service: typeof servicesData[0]) => {
      console.log(`Handling click for ${service.buttonText}...`);
      setActiveService(service.buttonText); // Set active state for visual feedback

      // Simulate interaction delay and navigation/toast
      setTimeout(() => {
          if (service.href === '/recharge') { // Specific handling for 'كبيبة السداد'
            toast({
                title: "تم التحديد",
                description: `جارٍ الانتقال إلى خدمة ${service.buttonText}...`,
                variant: 'default',
            });
            router.push(service.href);
          } else if (service.href && service.href !== '#') {
             toast({
                title: "تم التحديد",
                description: `جارٍ الانتقال إلى خدمة ${service.buttonText}...`,
                variant: 'default',
             });
            router.push(service.href); // Navigate if href is provided and not '#'
          } else {
            // Handle other services without a specific page yet
             toast({
                title: "قيد التطوير", // Changed title
                description: `خدمة ${service.buttonText} ستتوفر قريباً.`,
                variant: 'default', // Use default/info style instead of destructive
             });
            console.log(`No specific page defined or feature not ready for ${service.buttonText}`);
             setActiveService(null); // Reset active state if not navigating
          }
          // Reset active state slightly after interaction completes, unless navigating away
           if (!service.href || service.href === '#') {
                setTimeout(() => setActiveService(null), 300); // Short delay before resetting
           }
      }, 200); // 200ms delay to show active state
    };

  return (
    // Use bg-background which is now Light Gray (#F7F9FA)
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header - Teal background, White text, Orange refresh icon */}
       <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        <Link href="/" passHref>
            {/* White back arrow, primary hover */}
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <ArrowRight className="h-5 w-5" /> {/* Use ArrowRight for RTL back */}
                <span className="sr-only">رجوع</span>
            </Button>
        </Link>
        <h1 className="text-lg font-semibold">الخدمات</h1>
         {/* Orange refresh icon, primary hover */}
        <Button variant="ghost" size="icon" className="text-accent hover:bg-primary/80" onClick={handleRefresh}>
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">تحديث</span>
        </Button>
      </header>

      {/* Main Content Area - Services Grid */}
      {/* Use padding for spacing, background color is inherited */}
      <main className="flex-1 p-4 pt-6 md:p-6 md:pt-8">
        {/* Grid layout with 2 columns, gap defined */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"> {/* gap-3 for 12px */}
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              iconText={service.iconText}
              buttonText={service.buttonText}
              onClick={() => handleServiceClick(service)} // Pass the handler
              isActive={activeService === service.buttonText} // Pass active state
            />
          ))}
        </div>
      </main>

      {/* No bottom navigation on this page */}
    </div>
  );
}
