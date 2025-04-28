'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Update icons if needed, ensure they are relevant
import { ArrowRight, RefreshCw, Smartphone, Repeat, SmartphoneCharging, Headset, LayoutGrid, Wifi, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card'; // Ensure this component uses new theme colors
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

// Services data - Updated based on 4ME structure and new theme proposal
// Use relevant Lucide icons or keep text for icon circles
const servicesData = [
  { icon: SmartphoneCharging, buttonText: 'كبيبة السداد', href: '/services/recharge' }, // Renamed route
  { icon: Repeat, buttonText: 'تحويل لحساب عميل', href: '#' }, // Placeholder
  { iconText: 'MTN', buttonText: 'باقات MTN', href: '#' }, // Placeholder
  { iconText: 'سبافون', buttonText: 'باقات سبافون', href: '#' }, // Placeholder
  { iconText: 'Y', buttonText: 'باقات YOU', href: '#' }, // Placeholder for YOU
  { iconText: 'مزاجك', buttonText: 'خطك.. بمزاجك', href: '#' }, // Placeholder
  { icon: Headset, buttonText: 'الدعم الفني', href: '#' }, // Placeholder
  { icon: LayoutGrid, buttonText: 'الخدمات الإضافية', href: '#' }, // Placeholder
  { icon: Wifi, buttonText: 'عدن نت', href: '#' }, // Placeholder
  { icon: CreditCard, buttonText: 'شرائح شبكة YOU', href: '/services/simcards' }, // Renamed route
   { iconText: 'ألعاب', buttonText: 'معرض الألعاب', href: '/services/games' }, // Renamed route
   { iconText: 'برامج', buttonText: 'البرامج', href: '/services/programs' }, // Renamed route
];

export default function ServicesPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [activeService, setActiveService] = React.useState<string | null>(null);

    const handleRefresh = () => {
        console.log('Refreshing services...');
        toast({
            title: "تحديث",
            description: "تم تحديث قائمة الخدمات.",
            variant: 'default', // Uses primary (dark green) style
        });
    };

    const handleServiceClick = (service: typeof servicesData[0]) => {
      console.log(`Handling click for ${service.buttonText}...`);
      setActiveService(service.buttonText);

      setTimeout(() => {
          if (service.href && service.href !== '#') {
             toast({
                title: "تم التحديد",
                description: `جارٍ الانتقال إلى خدمة ${service.buttonText}...`,
                variant: 'default',
             });
            router.push(service.href);
          } else {
             toast({
                title: "قيد التطوير",
                description: `خدمة ${service.buttonText} ستتوفر قريباً.`,
                variant: 'default',
             });
            console.log(`No specific page defined or feature not ready for ${service.buttonText}`);
             setActiveService(null);
          }
           if (!service.href || service.href === '#') {
                setTimeout(() => setActiveService(null), 300);
           }
      }, 200);
    };

  return (
     // Use bg-background (emerald green)
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header - Primary (darker green) background, Primary Foreground (white) text */}
       <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        {/* Link back to dashboard */}
        <Link href="/dashboard" passHref>
             {/* White back arrow */}
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <ArrowRight className="h-5 w-5" /> {/* Use ArrowRight for RTL back */}
                <span className="sr-only">رجوع</span>
            </Button>
        </Link>
         {/* White title */}
        <h1 className="text-lg font-medium">الخدمات</h1> {/* Adjusted font weight */}
          {/* Refresh button - uses accent color (orange defined implicitly or explicitly) */}
        <Button variant="ghost" size="icon" className="text-orange-500 hover:bg-primary/80" onClick={handleRefresh}> {/* Directly use orange hex */}
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">تحديث</span>
        </Button>
      </header>

       {/* Main Content Area - Services Grid */}
       {/* Padding and background color inherited */}
      <main className="flex-1 p-4 pt-6 md:p-6 md:pt-8">
        {/* Grid layout with specified gap */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"> {/* gap-3 for 12px */}
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              iconText={service.iconText}
              buttonText={service.buttonText}
              onClick={() => handleServiceClick(service)}
              isActive={activeService === service.buttonText} // Pass active state
            />
          ))}
        </div>
      </main>
    </div>
  );
}
