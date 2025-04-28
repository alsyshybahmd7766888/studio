'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Wifi, CircleDollarSign, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Keep Card for structure
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Updated operator prefixes based on 4ME structure
const operatorPrefixes: { [key: string]: string[] } = {
  'يمن موبايل': ['77', '78'],
  'سبأفون': ['71'],
  'YOU': ['73'],
  'واي': ['70'], // Explicitly name 'Y' as 'واي'
  'الهاتف الأرضي': ['01', '02', '03', '04', '05', '06', '07', '08', '09'], // Assuming single digits 0 to 9 for area codes
  'ADSL': ['01', '02', '03', '04', '05', '06', '07', '08', '09'], // ADSL shares prefixes
};


// Operator logos (ensure these paths exist or use placeholders)
// Assuming logos directory exists in public/logos/
const operatorLogos: { [key: string]: string } = {
  'يمن موبايل': '/logos/yemen-mobile.png', // Placeholder path
  'سبأفون': '/logos/sabafon.png',         // Placeholder path
  'YOU': '/logos/you.png',               // Placeholder path
  'واي': '/logos/y.png',                 // Placeholder path
  'الهاتف الأرضي': '/logos/landline.png',   // Placeholder path
  'ADSL': '/logos/adsl.png',             // Placeholder path
};

// Placeholder package data (replace with actual API call or data source)
interface PackageInfo {
    id: string;
    name: string;
    price: number | string; // Allow string for "حسب الفاتورة" etc.
    description?: string;
}

// Sample data using updated operator names
const packagesData: { [key: string]: PackageInfo[] } = {
  'يمن موبايل': [
    { id: 'ym1', name: 'باقة موبايلي الشهرية', price: 1500, description: '5GB بيانات + 150 دقيقة + 100 رسالة' },
    { id: 'ym2', name: 'باقة نت 2 جيجا', price: 700, description: '2GB بيانات صالحة لأسبوع' },
    { id: 'ym3', name: 'تعبئة رصيد مباشر', price: 'حسب المبلغ', description: 'أدخل مبلغ التعبئة' },
  ],
  'سبأفون': [
    { id: 'sb1', name: 'باقة سبافون الذهبية', price: 2000, description: '10GB + دقائق ورسائل غير محدودة داخل الشبكة' },
    { id: 'sb2', name: 'تعبئة رصيد سبافون', price: 'حسب المبلغ', description: 'أدخل مبلغ التعبئة' },
  ],
  'YOU': [
    { id: 'you1', name: 'باقة YOU نت الشهرية', price: 1800, description: '12GB انترنت سريع + سوشال ميديا' },
     { id: 'you3', name: 'تعبئة رصيد YOU', price: 'حسب المبلغ', description: 'أدخل مبلغ التعبئة' },
  ],
   'واي': [
    { id: 'y1', name: 'باقة واي شباب الأسبوعية', price: 600, description: '2GB بيانات ومكالمات داخل الشبكة' },
     { id: 'y3', name: 'تعبئة رصيد Y', price: 'حسب المبلغ', description: 'أدخل مبلغ التعبئة' },
  ],
  'الهاتف الأرضي': [
    { id: 'll1', name: 'تسديد فاتورة الهاتف الثابت', price: 'حسب الفاتورة', description: 'سيتم جلب مبلغ الفاتورة تلقائياً' },
  ],
  'ADSL': [
    { id: 'adsl1', name: 'تجديد اشتراك ADSL الشهري', price: 'حسب الفاتورة', description: 'سيتم جلب مبلغ التجديد تلقائياً' },
  ],
};


export default function RechargePage() {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [detectedOperator, setDetectedOperator] = React.useState<string | null>(null);
  const [operatorLogo, setOperatorLogo] = React.useState<string | null>(null);
  const [showPackages, setShowPackages] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetchingPackages, setIsFetchingPackages] = React.useState(false);
  const [activeButtonId, setActiveButtonId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const detectOperator = (number: string) => {
    let foundOperator: string | null = null;
    let logoPath: string | null = null;

     // Prioritize mobile prefixes
    for (const operator of ['يمن موبايل', 'سبأفون', 'YOU', 'واي']) {
      for (const prefix of operatorPrefixes[operator]) {
        if (number.startsWith(prefix)) {
          foundOperator = operator;
          logoPath = operatorLogos[foundOperator] || null;
          break;
        }
      }
      if (foundOperator) break;
    }

     // If no mobile operator found, check for landline/ADSL (based on '0' prefix)
     if (!foundOperator && number.startsWith('0') && number.length >= 2) {
         // Simple check for landline/ADSL based on prefix '0' + area code digit
         const areaCodePrefix = number.substring(0, 2); // e.g., '01', '02'
         if (operatorPrefixes['الهاتف الأرضي'].includes(areaCodePrefix)) {
             // Could add more logic here, e.g., length check, but for now assume '0'+area code is landline/ADSL
             foundOperator = 'الهاتف الأرضي'; // Default to Landline, could change based on length if needed
             // foundOperator = number.length > 7 ? 'ADSL' : 'الهاتف الأرضي'; // Example length check
             logoPath = operatorLogos[foundOperator] || operatorLogos['ADSL'] || null; // Use Landline or ADSL logo
         }
     }


    setDetectedOperator(foundOperator);
    setOperatorLogo(logoPath);

    if (foundOperator) {
        setShowPackages(true);
        setIsFetchingPackages(true);
        // Simulate loading packages
        setTimeout(() => setIsFetchingPackages(false), 500);
    } else {
        setShowPackages(false);
    }
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    setPhoneNumber(value);
    // Trigger detection after 2 digits generally, or 2 digits if starting with '0'
    if (value.length >= 2) {
      detectOperator(value);
    } else {
      setDetectedOperator(null);
      setOperatorLogo(null);
      setShowPackages(false);
    }
  };

 const handleRechargeClick = (pkg: PackageInfo) => {
    setActiveButtonId(pkg.id);
    setIsLoading(true);
    console.log(`Attempting to recharge package: ${pkg.name} for number: ${phoneNumber}`);
    toast({
      title: "بدء عملية الشحن",
      description: `جاري شحن ${pkg.name} للرقم ${phoneNumber}...`,
      variant: 'default',
    });

    setTimeout(() => {
      setIsLoading(false);
      setActiveButtonId(null);
      const isSuccess = Math.random() > 0.2;
      if (isSuccess) {
         toast({
            title: "نجاح العملية",
            description: `تم شحن ${pkg.name} بنجاح للرقم ${phoneNumber}!`,
            variant: "default", // Use primary color style for success
        });
      } else {
         toast({
            title: "فشل العملية",
            description: `حدث خطأ أثناء شحن ${pkg.name}. يرجى المحاولة لاحقاً.`,
            variant: "destructive", // Use destructive (red) style
        });
      }
    }, 1500);
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
         {/* Title - Primary Foreground Text */}
        <h1 className="text-lg font-medium">التعبئة</h1>
        <div className="w-10"></div> {/* Placeholder to balance */}
      </header>

      {/* Main Content Area */}
       <main className="flex-1 space-y-4 p-4 pt-6 md:p-6 md:pt-8"> {/* Padding: 16px */}
         {/* Phone Number Input Container */}
         <div className="relative flex items-center">
            {/* Input field: Card bg, rounded, shadow */}
            <Input
              type="tel"
              placeholder="أدخل رقم الهاتف أو الأرضي"
              value={phoneNumber}
              onChange={handleInputChange}
              // Apply specified styling: h-12, rounded-md (0.5rem), shadow-sm, text-lg
               className={cn(
                 "h-12 w-full rounded-[var(--radius)] border border-border bg-card py-3 pl-4 pr-12 text-lg shadow-sm placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring text-foreground", // pr-12 for logo space
                 "text-right" // Align text to the right for RTL numbers
              )}
              maxLength={15}
               dir="ltr" // Keep LTR for number input behavior
            />
            {/* Operator Logo - Positioned inside input field (right side) */}
            {operatorLogo && (
                  // Ensure logo is 32x32 and positioned correctly
                  <div className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 transform overflow-hidden rounded-md"> {/* 32x32px */}
                    <Image src={operatorLogo} alt={detectedOperator || 'Operator'} width={32} height={32} className="object-contain" />
                  </div>
            )}
        </div>

         {/* Operator/Error Message */}
         {/* Show error if number entered but no operator detected */}
         {phoneNumber.length >= 2 && !detectedOperator && (
          <p className="text-center text-sm text-destructive">المشغل غير مدعوم حالياً.</p> // Use destructive color for error
        )}

        {/* Package List Section */}
         {showPackages && detectedOperator && (
           <div className="mt-4">
              {/* Title for packages - Use foreground color */}
              <h2 className="mb-3 text-center text-base font-semibold text-foreground">
                 <Package className="inline-block h-5 w-5 mr-2 align-middle text-foreground"/>
                 باقات {detectedOperator} المتاحة
             </h2>
             {/* Scrollable area for packages */}
               <ScrollArea className="h-[calc(100vh-280px)]"> {/* Adjust height based on header/input */}
                 {isFetchingPackages ? (
                     <div className="flex justify-center items-center p-10">
                       <Loader2 className="h-8 w-8 animate-spin text-primary" /> {/* Use primary color for spinner */}
                     </div>
                 ) : (packagesData[detectedOperator] || []).length > 0 ? (
                     <div className="space-y-2"> {/* space-y-2 for 8px margin */}
                        {packagesData[detectedOperator]?.map((pkg) => (
                            // Package Card: Card bg, rounded-xl, shadow-md
                           <Card key={pkg.id} className="overflow-hidden rounded-xl bg-card p-3 shadow-md transition-transform duration-150 ease-in-out active:scale-[0.98] active:shadow-sm"> {/* rounded-xl, p-3 */}
                              <div className="flex items-center justify-between gap-3">
                                  {/* Package details */}
                                  <div className="flex-1 space-y-1 text-right"> {/* Text align right */}
                                       {/* Package Name: Card Foreground, Bold */}
                                       <p className="text-base font-semibold text-card-foreground">{pkg.name}</p>
                                       {/* Description: Muted Foreground */}
                                       {pkg.description && <p className="text-xs text-muted-foreground">{pkg.description}</p>}
                                      {/* Price: Primary Color */}
                                      <p className="text-sm font-medium text-primary flex items-center justify-end gap-1 pt-1"> {/* Justify end */}
                                          <CircleDollarSign className="h-4 w-4" />
                                           {typeof pkg.price === 'number' && pkg.price > 0
                                             ? `${pkg.price} ريال`
                                             : pkg.price}
                                      </p>
                                  </div>
                                   {/* Recharge Button: Accent bg, Accent foreground text, rounded */}
                                   <Button
                                     size="sm"
                                     variant="accent" // Use accent variant
                                     className="px-4 py-1.5 text-sm font-medium shadow-sm h-auto rounded-[var(--radius)] transition-all"
                                      onClick={() => handleRechargeClick(pkg)}
                                      disabled={isLoading && activeButtonId === pkg.id}
                                  >
                                     {(isLoading && activeButtonId === pkg.id) ? (
                                         <Loader2 className="h-4 w-4 animate-spin" />
                                     ) : (
                                         'اشحن الآن'
                                     )}
                                  </Button>
                              </div>
                           </Card>
                        ))}
                     </div>
                 ) : (
                     // No packages message: Muted Foreground
                     <p className="p-6 text-center text-muted-foreground">لا توجد باقات متاحة حالياً لهذا المشغل.</p>
                 )}
               </ScrollArea>
           </div>
        )}
      </main>
    </div>
  );
}
