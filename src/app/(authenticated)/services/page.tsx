
'use client';

// Remove specific import if not used
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Update icons if needed, ensure they are relevant
import { ArrowRight, RefreshCw, SmartphoneCharging, Repeat, Headset, LayoutGrid, Wifi, CreditCard, Gamepad2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card'; // Ensure this component uses new theme colors
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

// Services data - Refreshed structure and icons
const servicesData = [
  { icon: SmartphoneCharging, buttonText: 'كبيبة السداد', href: '/services/recharge' },
  { icon: Repeat, buttonText: 'تحويل لحساب عميل', href: '#' }, // Placeholder
  { iconText: 'MTN', buttonText: 'باقات MTN', href: '#' }, // Placeholder
  { iconText: 'سبافون', buttonText: 'باقات سبافون', href: '#' }, // Placeholder
  { iconText: 'Y', buttonText: 'باقات YOU', href: '#' }, // Placeholder for YOU
  { iconText: 'مزاجك', buttonText: 'خطك.. بمزاجك', href: '#' }, // Placeholder
  { icon: Headset, buttonText: 'الدعم الفني', href: '/services/support' }, // Updated href
  { icon: LayoutGrid, buttonText: 'الخدمات الإضافية', href: '#' }, // Placeholder
  { icon: Wifi, buttonText: 'عدن نت', href: '#' }, // Placeholder
  { icon: CreditCard, buttonText: 'شرائح شبكة YOU', href: '/services/simcards' },
   { icon: Gamepad2, buttonText: 'معرض الألعاب', href: '/services/games' }, // Use Gamepad2
   { icon: ShoppingCart, buttonText: 'البرامج', href: '/services/programs' }, // Use ShoppingCart
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
            variant: 'default', // Uses primary style
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
                variant: 'default', // Consider a 'warning' or 'info' variant if added
             });
            console.log(`No specific page defined or feature not ready for ${service.buttonText}`);
             // Keep active state briefly for visual feedback even if not navigating
          }
           // Reset active state after a short delay only if not navigating
           if (!service.href || service.href === '#') {
                setTimeout(() => setActiveService(null), 300);
           }
      }, 200); // Short delay for visual feedback
    };

  return (
     // Use bg-background
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header - Primary background, Primary Foreground text */}
       <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        {/* Link back to dashboard */}
        <Link href="/dashboard" passHref>
             {/* Primary Foreground back arrow */}
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <ArrowRight className="h-5 w-5" /> {/* Use ArrowRight for RTL back */}
                <span className="sr-only">رجوع</span>
            </Button>
        </Link>
         {/* Primary Foreground title */}
        <h1 className="text-lg font-medium">الخدمات</h1>
          {/* Refresh button - uses accent color */}
        <Button variant="ghost" size="icon" className="text-accent hover:bg-primary/80" onClick={handleRefresh}>
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
