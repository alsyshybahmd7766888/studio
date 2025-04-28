'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Wifi, CircleDollarSign, Package, Loader2 } from 'lucide-react'; // Use ArrowRight for RTL back
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Updated operator prefixes based on requirement
const operatorPrefixes: { [key: string]: string[] } = {
  'يمن موبايل': ['77', '78'],
  'سبأفون': ['71'],
  'YOU': ['73'],
  'واي': ['70'], // Explicitly name 'Y' as 'واي'
  'الهاتف الأرضي': ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
  'ADSL': ['01', '02', '03', '04', '05', '06', '07', '08', '09'], // ADSL shares prefixes
};

// Operator logos (ensure these paths exist or use placeholders)
// Assuming logos directory exists in public/logos/
const operatorLogos: { [key: string]: string } = {
  'يمن موبايل': '/logos/yemen-mobile.png',
  'سبأفون': '/logos/sabafon.png',
  'YOU': '/logos/you.png',
  'واي': '/logos/y.png', // Assuming y.png exists
  'الهاتف الأرضي': '/logos/landline.png', // Generic landline icon
  'ADSL': '/logos/adsl.png', // Generic ADSL/wifi icon
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
  const [activeButtonId, setActiveButtonId] = React.useState<string | null>(null); // Track active button
  const { toast } = useToast();

  const detectOperator = (number: string) => {
    let foundOperator: string | null = null;
    let logoPath: string | null = null;

    // Iterate through all operators including landline/ADSL
    for (const operator in operatorPrefixes) {
      for (const prefix of operatorPrefixes[operator]) {
        if (number.startsWith(prefix)) {
           // Basic differentiation between Landline and ADSL based on length or specific prefixes if needed
           // For now, if it matches a landline prefix, check length or keep it simple.
           if (operator === 'الهاتف الأرضي' || operator === 'ADSL') {
               // Simple heuristic: If number is longer (e.g., > 7 digits typical for ADSL accounts) assume ADSL
               // This needs refinement based on actual numbering schemes.
               foundOperator = number.length > 7 ? 'ADSL' : 'الهاتف الأرضي';
           } else {
               foundOperator = operator; // Assign mobile operator
           }
           logoPath = operatorLogos[foundOperator] || null; // Get logo for the determined operator
           break; // Prefix matched, stop checking for this operator
        }
      }
       if (foundOperator) break; // Operator found, stop searching
    }

    setDetectedOperator(foundOperator);
    setOperatorLogo(logoPath);

    if (foundOperator) {
        setShowPackages(true);
        setIsFetchingPackages(true);
        setTimeout(() => setIsFetchingPackages(false), 500); // Simulate loading
    } else {
        setShowPackages(false);
    }
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    setPhoneNumber(value);
    // Start detection based on prefix length (e.g., 2 for mobile, 1 or 2 for landline)
    if (value.length >= 2 || (value.startsWith('0') && value.length >= 2)) {
      detectOperator(value);
    } else {
      setDetectedOperator(null);
      setOperatorLogo(null);
      setShowPackages(false);
    }
  };

 const handleRechargeClick = (pkg: PackageInfo) => {
    setActiveButtonId(pkg.id); // Set active button
    setIsLoading(true);
    console.log(`Attempting to recharge package: ${pkg.name} for number: ${phoneNumber}`);
    toast({
      title: "بدء عملية الشحن",
      description: `جاري شحن ${pkg.name} للرقم ${phoneNumber}...`,
    });

    setTimeout(() => {
      setIsLoading(false);
      setActiveButtonId(null); // Reset active button after operation
      const isSuccess = Math.random() > 0.2; // 80% success rate
      if (isSuccess) {
         toast({
            title: "نجاح العملية",
            description: `تم شحن ${pkg.name} بنجاح للرقم ${phoneNumber}!`,
            variant: "default", // Use primary color style
        });
      } else {
         toast({
            title: "فشل العملية",
            description: `حدث خطأ أثناء شحن ${pkg.name}. يرجى المحاولة لاحقاً.`,
            variant: "destructive", // Use destructive style
        });
      }
    }, 1500); // Simulate 1.5 second delay
  };


  return (
    // Use bg-background (Light Gray)
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header - Teal background, White text/icons */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-primary px-4 py-2 text-primary-foreground shadow-md">
        <Link href="/services" passHref>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
            <ArrowRight className="h-5 w-5" /> {/* Use ArrowRight for RTL back */}
            <span className="sr-only">رجوع</span>
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">التعبئة</h1> {/* White text */}
        <div className="w-10"></div> {/* Placeholder */}
      </header>

      {/* Main Content Area - Padding and spacing */}
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-6 md:pt-8"> {/* Adjusted spacing */}
        {/* Phone Number Input */}
        <div className="relative flex items-center">
           {/* Input field: White background, rounded, shadow, larger text */}
           <Input
              type="tel"
              placeholder="أدخل رقم الهاتف أو الأرضي"
              value={phoneNumber}
              onChange={handleInputChange}
              // Rounded-lg (8px), shadow-sm, text-lg, specific padding for logo
              className={cn(
                "w-full rounded-lg border-border bg-card py-3 pl-4 pr-14 text-lg shadow-sm focus:border-primary focus:ring-1 focus:ring-ring" // pr-14 leaves space for logo
              )}
              maxLength={15}
              dir="ltr" // Ensure LTR for phone number input itself
            />
            {/* Operator Logo - Positioned inside input field (right side for RTL layout) */}
            {operatorLogo && (
                 <div className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 transform overflow-hidden rounded-md"> {/* 32x32px */}
                   <Image src={operatorLogo} alt={detectedOperator || 'Operator'} width={32} height={32} className="object-contain" />
                 </div>
            )}
        </div>

        {/* Operator/Error Message */}
        {phoneNumber.length >= 2 && !detectedOperator && (
          <p className="text-center text-sm text-destructive">المشغل غير مدعوم حالياً.</p>
        )}

        {/* Package List Section */}
        {showPackages && detectedOperator && (
          // Use Card component for structure, but styling is applied below
          <div className="mt-4">
             <h2 className="mb-3 text-center text-base font-semibold text-foreground">
                    <Package className="inline-block h-5 w-5 mr-2 align-middle text-primary"/>
                    باقات {detectedOperator} المتاحة
                </h2>
               <ScrollArea className="h-[calc(100vh-260px)]"> {/* Adjust height as needed */}
                 {isFetchingPackages ? (
                    <div className="flex justify-center items-center p-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                 ) : (packagesData[detectedOperator] || []).length > 0 ? (
                     <div className="space-y-2"> {/* space-y-2 for 8px margin */}
                        {packagesData[detectedOperator]?.map((pkg) => (
                           // Package Card: White bg, rounded-xl, shadow-md
                            <Card key={pkg.id} className="overflow-hidden rounded-xl bg-card p-3 shadow-md transition-transform duration-150 ease-in-out active:scale-[0.98] active:shadow-sm"> {/* p-3 for 12px padding */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-base font-semibold text-foreground">{pkg.name}</p>
                                        {pkg.description && <p className="text-xs text-muted-foreground">{pkg.description}</p>}
                                        <p className="text-sm font-medium text-primary flex items-center gap-1 pt-1">
                                            <CircleDollarSign className="h-4 w-4" />
                                            {/* Handle price display */}
                                            {typeof pkg.price === 'number' && pkg.price > 0
                                              ? `${pkg.price} ريال`
                                              : pkg.price /* Display string like "حسب المبلغ" */}
                                        </p>
                                    </div>
                                    {/* Recharge Button: Orange bg, White text, rounded-lg */}
                                    <Button
                                        size="sm"
                                        variant="default" // Use default and control color via bg-accent
                                        className="bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent/90 active:bg-accent/80 h-auto rounded-lg transition-all"
                                        onClick={() => handleRechargeClick(pkg)}
                                        disabled={isLoading && activeButtonId === pkg.id} // Disable only the clicked button
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
                    <p className="p-6 text-center text-muted-foreground">لا توجد باقات متاحة حالياً لهذا المشغل.</p>
                 )}
               </ScrollArea>
            </div>
        )}
      </main>
    </div>
  );
}
