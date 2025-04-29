'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, RefreshCw } from 'lucide-react'; // Use ArrowRight for RTL back
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card'; // Ensure this uses the new theme
import { useToast } from "@/hooks/use-toast";

// SIM card services data based on the user's list - Keep only active ones (none are active currently)
const simCardServicesData = [
  // Removed all items as their href was '#'
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
            variant: 'default', // Uses primary color style
        });
    };

   const handleServiceClick = (service: { name: string, link: string }) => {
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
             // Reset active state if not navigating
             setActiveService(null);
          }
      }, 200);
    };


  return (
     // Use bg-background
    <div className="flex min-h-screen flex-col bg-background text-foreground">
       {/* Header - Primary background, Primary Foreground text */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
         {/* Back button to /services */}
        <Link href="/services" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
        <h1 className="text-lg font-medium">الشرائح</h1> {/* Primary Foreground text */}
          {/* Refresh button - Accent icon */}
         <Button variant="ghost" size="icon" className="text-accent hover:bg-primary/80" onClick={handleRefresh}>
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">تحديث</span>
        </Button>
      </header>

       {/* Main Content Area - SIM Services Grid */}
       {/* Padding, background inherited */}
      <main className="flex-1 p-4 pt-6 md:p-6 md:pt-8">
         {simCardServicesData.length > 0 ? (
             <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"> {/* gap-3 for 12px */}
              {simCardServicesData.map((service, index) => (
                <ServiceCard
                  key={index}
                   // Use service name or parts of it for the icon circle text
                  iconText={service.name.split(' ')[0]} // Use first word
                  buttonText={service.name}
                  onClick={() => handleServiceClick(service)}
                  isActive={activeService === service.name}
                />
              ))}
            </div>
         ) : (
             <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">لا توجد خدمات شرائح متاحة حالياً.</p>
             </div>
         )}
      </main>
    </div>
  );
}

    