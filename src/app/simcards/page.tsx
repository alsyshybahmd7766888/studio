
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, RefreshCw } from 'lucide-react'; // Use ArrowRight for RTL back
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card'; // Reuse ServiceCard for consistent styling
import { useToast } from "@/hooks/use-toast";

// SIM card services data based on the user's list
const simCardServicesData = [
  { name: 'رقم دفع مسبق شريحة/برمجة', link: '#' },
  { name: 'بدل فاقد', link: '#' },
  { name: 'تفعيل نت شرائح او برمجة', link: '#' },
  { name: 'استعلام عن صاحب الرقم', link: '#' },
  { name: 'شريحه جديد YOU', link: '#' },
  { name: 'رقم جديد برونزي', link: '#' },
  { name: 'تفعيل الرقم فولتي', link: '#' },
  // Add more services as needed
];


export default function SimCardsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [activeService, setActiveService] = React.useState<string | null>(null);

   const handleRefresh = () => {
        console.log('Refreshing SIM card services...');
        toast({
            title: "تحديث",
            description: "تم تحديث قائمة خدمات الشرائح.",
            variant: 'default',
        });
        // Add actual refresh logic here if needed
    };

   const handleServiceClick = (service: typeof simCardServicesData[0]) => {
      console.log(`Handling click for ${service.name}...`);
      setActiveService(service.name);

      setTimeout(() => {
          if (service.link && service.link !== '#') {
             toast({
                title: "تم التحديد",
                description: `جارٍ الانتقال إلى ${service.name}...`,
                variant: 'default',
             });
            router.push(service.link);
          } else {
             toast({
                title: "غير متاح حالياً",
                description: `خدمة ${service.name} غير متوفرة حالياً.`,
                variant: 'default', // Use default/info style
             });
             console.log(`No specific page defined or feature not ready for ${service.name}`);
             setActiveService(null); // Reset active state if not navigating
          }
          // Reset active state slightly after interaction completes, unless navigating away
           if (!service.link || service.link === '#') {
                setTimeout(() => setActiveService(null), 300);
           }
      }, 200);
    };


  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
            <ArrowRight className="h-5 w-5" /> {/* RTL back */}
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">الشرائح</h1>
         <Button variant="ghost" size="icon" className="text-accent hover:bg-primary/80" onClick={handleRefresh}>
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">تحديث</span>
        </Button>
      </header>

      {/* Main Content Area - SIM Services Grid */}
      <main className="flex-1 p-4 pt-6 md:p-6 md:pt-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {simCardServicesData.map((service, index) => (
            <ServiceCard
              key={index}
              // Use service name or parts of it for the icon circle text
              iconText={service.name.split(' ')[0]} // Take first word or abbreviation
              buttonText={service.name}
              onClick={() => handleServiceClick(service)}
              isActive={activeService === service.name}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
